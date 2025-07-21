import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Crown, Target, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  user_id: string;
  role: string;
  user?: {
    nickname: string;
    avatar_url?: string | null;
  };
}

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    tag: string;
    region?: string;
    elo?: number;
    wins?: number;
    losses?: number;
    is_recruiting?: boolean;
    team_members?: TeamMember[];
  };
  onJoinTeam?: (teamId: string) => void;
  onViewTeam?: (teamId: string) => void;
  isRequesting?: boolean;
  className?: string;
}

const TeamCard = ({ 
  team, 
  onJoinTeam, 
  onViewTeam, 
  isRequesting = false,
  className 
}: TeamCardProps) => {
  const getStatusColor = (isRecruiting?: boolean) => {
    return isRecruiting 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (isRecruiting?: boolean) => {
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
    <Card className={cn(
      "bg-card/50 border-border hover:bg-card/70 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]",
      className
    )}>
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
            <span className="text-primary font-semibold">{team.elo || 0}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-green-400">{team.wins || 0}V</span>
            <span className="text-red-400">{team.losses || 0}D</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            Membros ({team.team_members?.length || 0}/5)
          </h4>
          <div className="space-y-2">
            {team.team_members?.map((member) => {
              const nickname = member.user?.nickname || 'Usuário';
              const isLeader = member.role === 'IGL';
              return (
                <div key={member.user_id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg transition-colors hover:bg-muted/30">
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
            
            {(team.team_members?.length || 0) < 5 && (
              <div className="p-2 border-2 border-dashed border-muted rounded-lg text-center transition-colors hover:border-primary/50">
                <span className="text-xs text-muted-foreground">Vaga disponível</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button 
            variant="outline" 
            className="w-full transition-all duration-300 hover:border-primary/50 hover:bg-primary/10" 
            onClick={() => onViewTeam?.(team.id)}
          >
            Ver Perfil do Time
          </Button>
          {team.is_recruiting && onJoinTeam && (
            <Button 
              className="w-full btn-gaming" 
              onClick={() => onJoinTeam(team.id)}
              disabled={isRequesting}
            >
              {isRequesting ? (
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
  );
};

export { TeamCard };