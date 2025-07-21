import { supabase } from '../supabase/client';
import { Database } from '../supabase/types';

export type MatchmakingQueueItem = Database['public']['Tables']['matchmaking_queue']['Row'];
export type Map = {
  id: string;
  name: string;
  image: string | null;
};

export type QueuePlayer = {
  id: string;
  name: string;
  avatar_url?: string | null;
  elo?: number | null;
  status: 'searching' | 'ready' | 'matched';
  queue_time?: number;
};

/**
 * Busca todos os mapas disponíveis para matchmaking
 */
export const getMaps = async (): Promise<Map[]> => {
  // No futuro, isso pode vir de uma tabela no Supabase
  // Por enquanto, retornamos os mapas estáticos
  return [
    { id: 'random', name: 'Aleatório', image: null },
    { id: 'dust2', name: 'Dust II', image: null },
    { id: 'mirage', name: 'Mirage', image: null },
    { id: 'inferno', name: 'Inferno', image: null },
    { id: 'cache', name: 'Cache', image: null },
    { id: 'overpass', name: 'Overpass', image: null }
  ];
};

/**
 * Entra na fila de matchmaking
 */
export const joinMatchmakingQueue = async (
  userId: string,
  gameMode: string,
  mapPreference: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verifica se o usuário já está na fila
    const { data: existingQueue } = await supabase
      .from('matchmaking_queue')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingQueue) {
      // Atualiza a preferência existente
      const { error } = await supabase
        .from('matchmaking_queue')
        .update({
          game_mode: gameMode,
          map_preference: mapPreference,
          status: 'searching',
          queue_start: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Cria uma nova entrada na fila
      const { error } = await supabase.from('matchmaking_queue').insert({
        user_id: userId,
        game_mode: gameMode,
        map_preference: mapPreference,
        status: 'searching',
        queue_start: new Date().toISOString()
      });

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao entrar na fila:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sai da fila de matchmaking
 */
export const leaveMatchmakingQueue = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('matchmaking_queue')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao sair da fila:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca o status atual do usuário na fila
 */
export const getUserQueueStatus = async (
  userId: string
): Promise<{ inQueue: boolean; queueData?: MatchmakingQueueItem }> => {
  try {
    const { data } = await supabase
      .from('matchmaking_queue')
      .select('*')
      .eq('user_id', userId)
      .single();

    return {
      inQueue: !!data,
      queueData: data || undefined
    };
  } catch (error) {
    console.error('Erro ao verificar status da fila:', error);
    return { inQueue: false };
  }
};

/**
 * Busca jogadores na fila para o mesmo modo de jogo
 */
export const getPlayersInQueue = async (
  gameMode: string
): Promise<QueuePlayer[]> => {
  try {
    const { data: queueData } = await supabase
      .from('matchmaking_queue')
      .select(`
        id,
        user_id,
        status,
        queue_start,
        users!inner (nickname, avatar_url, elo)
      `)
      .eq('game_mode', gameMode)
      .eq('status', 'searching')
      .order('queue_start', { ascending: true });

    if (!queueData) return [];

    return queueData.map(item => {
      const user = item.users as any;
      const queueTime = item.queue_start
        ? Math.floor((Date.now() - new Date(item.queue_start).getTime()) / 1000)
        : 0;

      return {
        id: item.user_id,
        name: user.nickname,
        avatar_url: user.avatar_url,
        elo: user.elo,
        status: item.status,
        queue_time: queueTime
      };
    });
  } catch (error) {
    console.error('Erro ao buscar jogadores na fila:', error);
    return [];
  }
};

/**
 * Configura um listener em tempo real para a fila de matchmaking
 */
export const subscribeToMatchmakingQueue = (
  gameMode: string,
  callback: (players: QueuePlayer[]) => void
) => {
  // Busca inicial
  getPlayersInQueue(gameMode).then(callback);

  // Configura o listener em tempo real
  const subscription = supabase
    .channel('matchmaking_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matchmaking_queue',
        filter: `game_mode=eq.${gameMode}`
      },
      () => {
        // Quando houver mudanças, busca a lista atualizada
        getPlayersInQueue(gameMode).then(callback);
      }
    )
    .subscribe();

  // Retorna função para cancelar a inscrição
  return () => {
    subscription.unsubscribe();
  };
};