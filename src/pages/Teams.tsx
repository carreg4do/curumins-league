import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Target, Plus, Search, Crown, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FadeIn } from '@/components/ui/fade-in';
import { TeamCard } from '@/components/ui/team-card';
import { useAuth } from '@/contexts/AuthContext';
import { getTeams, requestToJoinTeam, type TeamWithMembers } from '@/integrations/teams/teamsService';

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
      console.log('Carregando times...', { searchTerm, statusFilter });
      
      const supabaseTeams = await getTeams({
        searchTerm,
        status: statusFilter,
        limit: 50,
        offset: 0
      });
      
      console.log('Times carregados:', supabaseTeams.length);
      setTeams(supabaseTeams);
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
      setRequestingTeamId(teamId);
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
    } finally {
      setRequestingTeamId(null);
    }
  };

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
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Carregando times...</p>
            </div>
          </FadeIn>
        )}

        {/* Teams Grid */}
        {!loading && (
          <FadeIn delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeams.map((team, index) => (
                <FadeIn key={team.id} delay={100 + (index * 50)}>
                  <TeamCard
                    team={{
                      ...team,
                      team_members: team.members || team.team_members || []
                    }}
                    onJoinTeam={handleJoinTeam}
                    onViewTeam={(teamId) => navigate(`/teams/${teamId}`)}
                    isRequesting={requestingTeamId === team.id}
                  />
              </FadeIn>
            ))}
            </div>
          </FadeIn>
        )}

        {!loading && filteredTeams.length === 0 && (
          <FadeIn>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                Nenhum time encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou criar um novo time.
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default Teams;