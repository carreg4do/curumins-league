import { supabase } from '../supabase/client';
import { Database } from '../supabase/types';

export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type TeamRequest = Database['public']['Tables']['team_requests']['Row'];

export type TeamWithMembers = Team & {
  members: (TeamMember & { user: { nickname: string; avatar_url: string | null } })[];
};

/**
 * Busca todos os times com filtros opcionais
 */
export const getTeams = async ({
  searchTerm = '',
  status = 'all',
  limit = 50,
  offset = 0
}: {
  searchTerm?: string;
  status?: 'all' | 'recruiting' | 'full';
  limit?: number;
  offset?: number;
} = {}): Promise<TeamWithMembers[]> => {
  try {
    let query = supabase
      .from('teams')
      .select(`
        *,
        team_members(
          id,
          user_id,
          role,
          joined_at,
          users(nickname, avatar_url)
        )
      `)
      .order('elo', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === 'recruiting') {
      query = query.eq('is_recruiting', true);
    } else if (status === 'full') {
      query = query.eq('is_recruiting', false);
    }

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,tag.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transformar dados para o formato esperado
    const teams = (data || []).map(team => ({
      ...team,
      members: (team.team_members || []).map((member: any) => ({
        ...member,
        user: member.users
      }))
    }));

    return teams as TeamWithMembers[];
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    return [];
  }
};

/**
 * Busca um time específico pelo ID
 */
export const getTeamById = async (teamId: string): Promise<TeamWithMembers | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(*, user:users(nickname, avatar_url))
      `)
      .eq('id', teamId)
      .single();

    if (error) throw error;
    return data as TeamWithMembers;
  } catch (error) {
    console.error(`Erro ao buscar time ${teamId}:`, error);
    return null;
  }
};

/**
 * Cria um novo time
 */
export const createTeam = async ({
  name,
  tag,
  description,
  region,
  userId
}: {
  name: string;
  tag: string;
  description?: string;
  region?: string;
  userId: string;
}): Promise<{ success: boolean; teamId?: string; error?: string }> => {
  try {
    // Verificar se o usuário já está em um time
    const { data: userData } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single();

    if (userData?.team_id) {
      return {
        success: false,
        error: 'Você já é membro de um time. Saia do time atual antes de criar um novo.'
      };
    }

    // Criar o time
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        tag,
        description,
        region,
        elo: 1000, // ELO inicial
        wins: 0,
        losses: 0,
        is_recruiting: true
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Adicionar o criador como capitão do time
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: userId,
        role: 'IGL', // Capitão por padrão
        joined_at: new Date().toISOString()
      });

    if (memberError) throw memberError;

    // Atualizar o usuário com o ID do time
    const { error: userError } = await supabase
      .from('users')
      .update({ team_id: team.id })
      .eq('id', userId);

    if (userError) throw userError;

    return { success: true, teamId: team.id };
  } catch (error: any) {
    console.error('Erro ao criar time:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia uma solicitação para entrar em um time
 */
export const requestToJoinTeam = async ({
  teamId,
  userId,
  message
}: {
  teamId: string;
  userId: string;
  message?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se o time está recrutando
    const { data: team } = await supabase
      .from('teams')
      .select('is_recruiting')
      .eq('id', teamId)
      .single();

    if (!team?.is_recruiting) {
      return { success: false, error: 'Este time não está recrutando no momento.' };
    }

    // Verificar se o usuário já está em um time
    const { data: userData } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single();

    if (userData?.team_id) {
      return { success: false, error: 'Você já é membro de um time.' };
    }

    // Verificar se já existe uma solicitação pendente
    const { data: existingRequest } = await supabase
      .from('team_requests')
      .select('status')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingRequest) {
      return { success: false, error: 'Você já tem uma solicitação pendente para este time.' };
    }

    // Criar a solicitação
    const { error } = await supabase.from('team_requests').insert({
      team_id: teamId,
      user_id: userId,
      status: 'pending',
      message
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao solicitar entrada no time:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Responde a uma solicitação de entrada no time (aprovar/recusar)
 */
export const respondToTeamRequest = async ({
  requestId,
  teamId,
  userId,
  accept
}: {
  requestId: string;
  teamId: string;
  userId: string; // ID do capitão que está respondendo
  accept: boolean;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se o usuário é capitão do time
    const { data: captain } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (!captain || captain.role !== 'IGL') {
      return { success: false, error: 'Apenas o capitão pode responder às solicitações.' };
    }

    // Buscar a solicitação
    const { data: request } = await supabase
      .from('team_requests')
      .select('user_id, status')
      .eq('id', requestId)
      .eq('team_id', teamId)
      .single();

    if (!request) {
      return { success: false, error: 'Solicitação não encontrada.' };
    }

    if (request.status !== 'pending') {
      return { success: false, error: 'Esta solicitação já foi processada.' };
    }

    // Atualizar o status da solicitação
    const newStatus = accept ? 'accepted' : 'rejected';
    const { error: updateError } = await supabase
      .from('team_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Se aceito, adicionar o usuário ao time
    if (accept) {
      // Verificar se o time já está cheio (5 membros)
      const { count, error: countError } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId);

      if (countError) throw countError;

      if (count && count >= 5) {
        return { success: false, error: 'O time já está completo (5 membros).' };
      }

      // Adicionar o usuário como membro do time
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: request.user_id,
          role: 'Entry', // Papel padrão para novos membros
          joined_at: new Date().toISOString()
        });

      if (memberError) throw memberError;

      // Atualizar o usuário com o ID do time
      const { error: userError } = await supabase
        .from('users')
        .update({ team_id: teamId })
        .eq('id', request.user_id);

      if (userError) throw userError;

      // Verificar se o time está cheio após adicionar o membro
      const { count: newCount } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId);

      // Se o time estiver cheio, atualizar o status de recrutamento
      if (newCount && newCount >= 5) {
        const { error: teamError } = await supabase
          .from('teams')
          .update({ is_recruiting: false })
          .eq('id', teamId);

        if (teamError) throw teamError;
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao responder solicitação:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza as informações de um time
 */
export const updateTeam = async ({
  teamId,
  userId,
  data
}: {
  teamId: string;
  userId: string; // ID do capitão que está atualizando
  data: Partial<Pick<Team, 'name' | 'tag' | 'description' | 'region' | 'logo_url' | 'cover_url' | 'is_recruiting'>>;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se o usuário é capitão do time
    const { data: captain } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (!captain || captain.role !== 'IGL') {
      return { success: false, error: 'Apenas o capitão pode atualizar as informações do time.' };
    }

    // Atualizar o time
    const { error } = await supabase
      .from('teams')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', teamId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar time:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza o papel de um membro do time
 */
export const updateTeamMemberRole = async ({
  teamId,
  captainId,
  memberId,
  newRole
}: {
  teamId: string;
  captainId: string; // ID do capitão que está atualizando
  memberId: string; // ID do membro que terá o papel atualizado
  newRole: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se o usuário é capitão do time
    const { data: captain } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', captainId)
      .single();

    if (!captain || captain.role !== 'IGL') {
      return { success: false, error: 'Apenas o capitão pode atualizar os papéis dos membros.' };
    }

    // Atualizar o papel do membro
    const { error } = await supabase
      .from('team_members')
      .update({ role: newRole })
      .eq('team_id', teamId)
      .eq('user_id', memberId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar papel do membro:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove um membro do time
 */
export const removeTeamMember = async ({
  teamId,
  captainId,
  memberId
}: {
  teamId: string;
  captainId: string; // ID do capitão que está removendo
  memberId: string; // ID do membro a ser removido
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se o usuário é capitão do time
    const { data: captain } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', captainId)
      .single();

    if (!captain || captain.role !== 'IGL') {
      return { success: false, error: 'Apenas o capitão pode remover membros.' };
    }

    // Não permitir que o capitão remova a si mesmo
    if (captainId === memberId) {
      return { success: false, error: 'O capitão não pode remover a si mesmo. Transfira a liderança primeiro.' };
    }

    // Remover o membro do time
    const { error: memberError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', memberId);

    if (memberError) throw memberError;

    // Atualizar o usuário removendo a referência ao time
    const { error: userError } = await supabase
      .from('users')
      .update({ team_id: null })
      .eq('id', memberId);

    if (userError) throw userError;

    // Atualizar o status de recrutamento do time
    const { error: teamError } = await supabase
      .from('teams')
      .update({ is_recruiting: true })
      .eq('id', teamId);

    if (teamError) throw teamError;

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao remover membro do time:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Transfere a liderança do time para outro membro
 */
export const transferTeamLeadership = async ({
  teamId,
  currentCaptainId,
  newCaptainId
}: {
  teamId: string;
  currentCaptainId: string;
  newCaptainId: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se o usuário atual é capitão do time
    const { data: captain } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', currentCaptainId)
      .single();

    if (!captain || captain.role !== 'IGL') {
      return { success: false, error: 'Apenas o capitão pode transferir a liderança.' };
    }

    // Verificar se o novo capitão é membro do time
    const { data: newCaptain } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', newCaptainId)
      .single();

    if (!newCaptain) {
      return { success: false, error: 'O usuário selecionado não é membro deste time.' };
    }

    // Iniciar uma transação para atualizar ambos os membros
    const { error: currentCaptainError } = await supabase
      .from('team_members')
      .update({ role: 'Entry' }) // Papel padrão para o ex-capitão
      .eq('team_id', teamId)
      .eq('user_id', currentCaptainId);

    if (currentCaptainError) throw currentCaptainError;

    const { error: newCaptainError } = await supabase
      .from('team_members')
      .update({ role: 'IGL' })
      .eq('team_id', teamId)
      .eq('user_id', newCaptainId);

    if (newCaptainError) throw newCaptainError;

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao transferir liderança:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca as solicitações pendentes para um time
 */
export const getTeamRequests = async ({
  teamId,
  captainId,
  status = 'pending'
}: {
  teamId: string;
  captainId: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'all';
}): Promise<(TeamRequest & { user: { nickname: string; avatar_url: string | null } })[]> => {
  try {
    // Verificar se o usuário é capitão do time
    const { data: captain } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', captainId)
      .single();

    if (!captain || captain.role !== 'IGL') {
      console.error('Apenas o capitão pode ver as solicitações.');
      return [];
    }

    // Buscar as solicitações
    let query = supabase
      .from('team_requests')
      .select(`
        *,
        user:users(nickname, avatar_url)
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    // Filtrar por status
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as (TeamRequest & { user: { nickname: string; avatar_url: string | null } })[];
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    return [];
  }
};