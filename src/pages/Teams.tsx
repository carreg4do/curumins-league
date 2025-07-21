import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Target, Plus, Search, Crown, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getTeams, requestToJoinTeam, type TeamWithMembers } from '@/integrations/teams/teamsService';
import { seedTeamsData } from '@/data/seedTeams';
import { mockTeams, MockTeam } from '@/data/mockTeams';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'recruiting' | 'full'>('all');
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingTeamId, setRequestingTeamId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadTeams();
  }, [searchTerm, statusFilter]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      
      // Carregar times do Supabase
      const supabaseTeams = await getTeams({
        searchTerm,
        status: statusFilter,
        limit: 50,
        offset: 0
      });
      
      console.log('Times carregados do Supabase:', supabaseTeams);
      setTeams(supabaseTeams || []);
      
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      toast({
        title: 'Erro ao carregar times',
        description: 'Não foi possível carregar a lista de times. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para solicitar entrada em um time
  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para solicitar entrada em um time',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await requestToJoinTeam({
        teamId,
        userId: user.id,
        message: 'Gostaria de me juntar ao time!'
      });

      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Solicitação enviada com sucesso!'
        });
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Erro ao enviar solicitação',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar entrada no time:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar solicitação',
        variant: 'destructive'
      });
    }
  };

  // Os times já vêm filtrados do useEffect, então apenas usamos diretamente
  const filteredTeams = teams;

  const getStatusColor = (isRecruiting: boolean) => {
    return isRecruiting 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (isRecruiting: boolean) => {
    return isRecruiting ? 'Recrutando' : 'Time Completo';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'IGL': return <Crown className="h-3 w-3" />;
      case 'AWPer': return <Target className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Times
            </h1>
          </div>
          <Button 
            className="btn-gaming" 
            onClick={() => user ? navigate('/teams/create') : navigate('/login')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Time
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar times..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/20 border-border"
            />
          </div>
          
          <div className="flex space-x-1 bg-muted/20 rounded-lg p-1 w-fit">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'recruiting', label: 'Recrutando' },
              { key: 'full', label: 'Completos' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as 'all' | 'recruiting' | 'full')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  statusFilter === tab.key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando times...</p>
          </div>
        )}

        {/* Teams Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="bg-card/50 border-border hover:bg-card/70 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{team.tag}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{team.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{team.region || 'Região não especificada'}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(team.is_recruiting)} border`}>
                      {getStatusText(team.is_recruiting)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">Elo:</span>
                      <span className="text-primary font-semibold">{team.elo}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-400">{team.wins}V</span>
                      <span className="text-red-400">{team.losses}D</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      Membros ({team.members?.length || 0}/5)
                    </h4>
                    <div className="space-y-2">
                      {team.members?.map((member) => {
                        const nickname = member.user?.nickname || 'Usuário';
                        const isLeader = member.role === 'IGL';
                        return (
                          <div key={member.user_id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={member.user?.avatar_url || ''} />
                                <AvatarFallback className="text-xs">{nickname[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{nickname}</span>
                              {isLeader && <Crown className="h-3 w-3 text-yellow-400" />}
                            </div>
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(member.role)}
                              <span className="text-xs text-muted-foreground">{member.role}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {(team.members?.length || 0) < 5 && (
                        <div className="p-2 border-2 border-dashed border-muted rounded-lg text-center">
                          <span className="text-xs text-muted-foreground">Vaga disponível</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/teams/${team.id}`)}
                    >
                      Ver Perfil do Time
                    </Button>
                    {team.is_recruiting && (
                      <Button 
                        className="w-full btn-gaming" 
                        onClick={() => handleJoinTeam(team.id)}
                        disabled={requestingTeamId === team.id}
                      >
                        {requestingTeamId === team.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          'Solicitar Convite'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhum time encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar um novo time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;