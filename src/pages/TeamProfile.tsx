import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Calendar, MapPin, Star, Crown, Target, Loader2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  getTeamById, 
  requestToJoinTeam, 
  getTeamRequests, 
  respondToTeamRequest,
  updateTeamMemberRole,
  removeTeamMember,
  transferTeamLeadership
} from '@/integrations/teams/teamsService';

const TeamProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasRequestedInvite, setHasRequestedInvite] = useState(false);
  const [isRequestingInvite, setIsRequestingInvite] = useState(false);
  const [teamRequests, setTeamRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [transferringLeadership, setTransferringLeadership] = useState(false);

  // Verificar se o usuário é capitão do time
  const isTeamCaptain = team?.members?.some(
    (member: any) => member.user_id === user?.id && member.role === 'IGL'
  );

  // Verificar se o usuário já é membro do time
  const isTeamMember = team?.members?.some(
    (member: any) => member.user_id === user?.id
  );

  // Verificar se o usuário já solicitou entrada no time
  const checkIfUserRequested = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('team_requests')
        .select('status')
        .eq('team_id', id)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();
      
      setHasRequestedInvite(!!data);
    } catch (error) {
      console.error('Erro ao verificar solicitação:', error);
    }
  };

  // Carregar dados do time
  useEffect(() => {
    const loadTeam = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const teamData = await getTeamById(id);
        
        if (!teamData) {
          toast({
            title: "Time não encontrado",
            description: "O time solicitado não foi encontrado.",
            variant: "destructive"
          });
          navigate('/teams');
          return;
        }
        
        setTeam(teamData);
        
        // Verificar se o usuário já solicitou entrada
        if (user) {
          await checkIfUserRequested();
        }
      } catch (error) {
        console.error('Erro ao carregar time:', error);
        toast({
          title: "Erro ao carregar time",
          description: "Ocorreu um erro ao carregar os dados do time.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTeam();
  }, [id, navigate, toast, user]);

  // Carregar solicitações pendentes (apenas para o capitão)
  useEffect(() => {
    const loadRequests = async () => {
      if (!id || !user || !isTeamCaptain) return;
      
      try {
        setLoadingRequests(true);
        const requests = await getTeamRequests({
          teamId: id,
          captainId: user.id,
          status: 'pending'
        });
        
        setTeamRequests(requests);
      } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
      } finally {
        setLoadingRequests(false);
      }
    };
    
    if (isTeamCaptain) {
      loadRequests();
    }
  }, [id, user, isTeamCaptain]);

  // Solicitar entrada no time
  const handleRequestInvite = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para solicitar entrada em um time.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!id) return;
    
    try {
      setIsRequestingInvite(true);
      
      const { success, error } = await requestToJoinTeam({
        teamId: id,
        userId: user.id
      });
      
      if (success) {
        setHasRequestedInvite(true);
        toast({
          title: "Solicitação enviada!",
          description: "Solicitação enviada com sucesso para o capitão do time. Aguarde a resposta.",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro ao solicitar entrada",
          description: error || "Ocorreu um erro ao solicitar entrada no time.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar entrada:', error);
      toast({
        title: "Erro ao solicitar entrada",
        description: "Ocorreu um erro ao solicitar entrada no time.",
        variant: "destructive"
      });
    } finally {
      setIsRequestingInvite(false);
    }
  };

  // Responder a uma solicitação (aprovar/recusar)
  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    if (!user || !id || !isTeamCaptain) return;
    
    try {
      setProcessingRequestId(requestId);
      
      const { success, error } = await respondToTeamRequest({
        requestId,
        teamId: id,
        userId: user.id,
        accept
      });
      
      if (success) {
        toast({
          title: accept ? "Solicitação aprovada" : "Solicitação recusada",
          description: accept 
            ? "O jogador foi adicionado ao time." 
            : "A solicitação foi recusada.",
          variant: "default"
        });
        
        // Atualizar a lista de solicitações
        setTeamRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Se aceitou, recarregar os dados do time para mostrar o novo membro
        if (accept) {
          const updatedTeam = await getTeamById(id);
          if (updatedTeam) setTeam(updatedTeam);
        }
      } else {
        toast({
          title: "Erro ao processar solicitação",
          description: error || "Ocorreu um erro ao processar a solicitação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      toast({
        title: "Erro ao processar solicitação",
        description: "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive"
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Atualizar papel de um membro
  const handleUpdateRole = async (memberId: string, newRole: string) => {
    if (!user || !id || !isTeamCaptain) return;
    
    try {
      setChangingRoleUserId(memberId);
      
      const { success, error } = await updateTeamMemberRole({
        teamId: id,
        captainId: user.id,
        memberId,
        newRole
      });
      
      if (success) {
        toast({
          title: "Papel atualizado",
          description: "O papel do membro foi atualizado com sucesso.",
          variant: "default"
        });
        
        // Atualizar os dados do time
        const updatedTeam = await getTeamById(id);
        if (updatedTeam) setTeam(updatedTeam);
      } else {
        toast({
          title: "Erro ao atualizar papel",
          description: error || "Ocorreu um erro ao atualizar o papel do membro.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar papel:', error);
      toast({
        title: "Erro ao atualizar papel",
        description: "Ocorreu um erro ao atualizar o papel do membro.",
        variant: "destructive"
      });
    } finally {
      setChangingRoleUserId(null);
    }
  };

  // Remover um membro do time
  const handleRemoveMember = async (memberId: string) => {
    if (!user || !id || !isTeamCaptain) return;
    
    try {
      setRemovingMemberId(memberId);
      
      const { success, error } = await removeTeamMember({
        teamId: id,
        captainId: user.id,
        memberId
      });
      
      if (success) {
        toast({
          title: "Membro removido",
          description: "O membro foi removido do time com sucesso.",
          variant: "default"
        });
        
        // Atualizar os dados do time
        const updatedTeam = await getTeamById(id);
        if (updatedTeam) setTeam(updatedTeam);
      } else {
        toast({
          title: "Erro ao remover membro",
          description: error || "Ocorreu um erro ao remover o membro do time.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: "Erro ao remover membro",
        description: "Ocorreu um erro ao remover o membro do time.",
        variant: "destructive"
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  // Transferir liderança para outro membro
  const handleTransferLeadership = async (newCaptainId: string) => {
    if (!user || !id || !isTeamCaptain) return;
    
    try {
      setTransferringLeadership(true);
      
      const { success, error } = await transferTeamLeadership({
        teamId: id,
        currentCaptainId: user.id,
        newCaptainId
      });
      
      if (success) {
        toast({
          title: "Liderança transferida",
          description: "A liderança do time foi transferida com sucesso.",
          variant: "default"
        });
        
        // Atualizar os dados do time
        const updatedTeam = await getTeamById(id);
        if (updatedTeam) setTeam(updatedTeam);
      } else {
        toast({
          title: "Erro ao transferir liderança",
          description: error || "Ocorreu um erro ao transferir a liderança do time.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao transferir liderança:', error);
      toast({
        title: "Erro ao transferir liderança",
        description: "Ocorreu um erro ao transferir a liderança do time.",
        variant: "destructive"
      });
    } finally {
      setTransferringLeadership(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'IGL': return <Crown className="h-4 w-4" />;
      case 'AWPer': return <Target className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  // Se estiver carregando, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando informações do time...</p>
        </div>
      </div>
    );
  }

  // Se o time não foi encontrado
  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Time não encontrado</h2>
          <p className="text-muted-foreground mb-4">O time solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/teams')} className="btn-gaming">
            Voltar para Times
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Team Header */}
        <Card className="bg-card/50 border-border mb-8 overflow-hidden">
          <div className="bg-gradient-primary h-40"></div>
          <CardContent className="relative -mt-20 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-32 h-32 bg-gradient-primary rounded-lg flex items-center justify-center border-4 border-background shadow-xl">
                <span className="text-white font-bold text-3xl">{team.tag}</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">{team.name}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {team.elo > 2500 ? 'Global Elite' : 
                         team.elo > 2000 ? 'Supreme' : 
                         team.elo > 1500 ? 'Legendary Eagle' : 'Gold Nova'}
                      </Badge>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{team.region || 'Região não especificada'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Fundado em {new Date(team.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  {!isTeamMember && (
                    <Button 
                      onClick={handleRequestInvite}
                      disabled={hasRequestedInvite || isRequestingInvite || !team.is_recruiting}
                      className={hasRequestedInvite || !team.is_recruiting ? "bg-muted text-muted-foreground" : "btn-gaming"}
                    >
                      {isRequestingInvite ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Users className="h-4 w-4 mr-2" />
                      )}
                      {hasRequestedInvite ? 'Solicitação Enviada' : 
                       !team.is_recruiting ? 'Time Completo' : 
                       'Solicitar Convite'}
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{team.wins || 0}</div>
                    <div className="text-sm text-muted-foreground">Vitórias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{team.losses || 0}</div>
                    <div className="text-sm text-muted-foreground">Derrotas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {team.wins || team.losses ? 
                        ((team.wins / (team.wins + team.losses)) * 100).toFixed(1) : 
                        '0.0'}%
                    </div>
                    <div className="text-sm text-muted-foreground">Taxa de Vitória</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Team Members */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Membros da Equipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.members?.length > 0 ? (
                  team.members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user?.avatar_url} />
                          <AvatarFallback>{member.user?.nickname?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">{member.user?.nickname}</span>
                            {member.role === 'IGL' && <Crown className="h-4 w-4 text-yellow-400" />}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {getRoleIcon(member.role)}
                            <span>{member.role}</span>
                            {member.role === 'IGL' && <span>• Capitão</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isTeamCaptain && member.user_id !== user?.id && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateRole(member.user_id, member.role === 'AWPer' ? 'Entry' : 'AWPer')}
                              disabled={!!changingRoleUserId}
                              className="text-xs"
                            >
                              {changingRoleUserId === member.user_id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  {getRoleIcon(member.role === 'AWPer' ? 'Entry' : 'AWPer')}
                                  <span className="ml-1">{member.role === 'AWPer' ? 'Entry' : 'AWPer'}</span>
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveMember(member.user_id)}
                              disabled={!!removingMemberId}
                              className="text-xs"
                            >
                              {removingMemberId === member.user_id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-3 w-3" />
                                  <span className="ml-1">Remover</span>
                                </>
                              )}
                            </Button>
                            {member.role !== 'IGL' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleTransferLeadership(member.user_id)}
                                disabled={transferringLeadership}
                                className="text-xs"
                              >
                                {transferringLeadership ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Crown className="h-3 w-3" />
                                    <span className="ml-1">Capitão</span>
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum membro encontrado.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Solicitações Pendentes (apenas para o capitão) */}
            {isTeamCaptain && (
              <Card className="bg-card/50 border-border mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Solicitações Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingRequests ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : teamRequests.length > 0 ? (
                    <div className="space-y-4">
                      {teamRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request.user?.avatar_url} />
                              <AvatarFallback>{request.user?.nickname?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{request.user?.nickname}</div>
                              <div className="text-xs text-muted-foreground">
                                Solicitado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleRespondToRequest(request.id, true)}
                              disabled={!!processingRequestId}
                            >
                              {processingRequestId === request.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRespondToRequest(request.id, false)}
                              disabled={!!processingRequestId}
                            >
                              {processingRequestId === request.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Nenhuma solicitação pendente.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Placeholder para Partidas Recentes */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Partidas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Histórico de partidas em breve.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Stats */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ELO</span>
                  <span className="font-semibold text-primary">{team.elo || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membros</span>
                  <span className="font-semibold text-primary">{team.members?.length || 0}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partidas Jogadas</span>
                  <span className="font-semibold text-foreground">{(team.wins || 0) + (team.losses || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-green-400">
                    {team.is_recruiting ? 'Recrutando' : 'Completo'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Capitão</span>
                  <p className="font-semibold text-foreground">
                    {team.members?.find((m: any) => m.role === 'IGL')?.user?.nickname || 'Não definido'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Região</span>
                  <p className="font-semibold text-foreground">{team.region || 'Não especificada'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fundado em</span>
                  <p className="font-semibold text-foreground">{new Date(team.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                {team.description && (
                  <div>
                    <span className="text-sm text-muted-foreground">Descrição</span>
                    <p className="font-semibold text-foreground">{team.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;