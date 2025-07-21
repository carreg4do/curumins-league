import { Clock, MapPin, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  title: string;
  mode: string;
  map?: string;
  players?: number;
  maxPlayers?: number;
  prize?: string;
  status: 'waiting' | 'live' | 'finished';
  date?: string;
  onAction?: () => void;
  actionText?: string;
}

const GameCard = ({ 
  title, 
  mode, 
  map, 
  players, 
  maxPlayers, 
  prize, 
  status, 
  date,
  onAction,
  actionText = "Participar"
}: GameCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'live': return 'text-success';
      case 'finished': return 'text-muted-foreground';
      default: return 'text-secondary';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'live': return 'AO VIVO';
      case 'finished': return 'FINALIZADO';
      default: return 'AGUARDANDO';
    }
  };

  return (
    <div className="card-gaming group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{mode}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusColor()} border-current`}>
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-3">
        {map && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{map}</span>
          </div>
        )}

        {players !== undefined && maxPlayers && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{players}/{maxPlayers} jogadores</span>
          </div>
        )}

        {prize && (
          <div className="flex items-center text-sm text-accent">
            <Trophy className="h-4 w-4 mr-2" />
            <span className="font-medium">{prize}</span>
          </div>
        )}

        {date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{date}</span>
          </div>
        )}
      </div>

      {onAction && status !== 'finished' && (
        <div className="mt-6">
          <Button 
            onClick={onAction}
            className="w-full btn-gaming"
            disabled={status === 'live'}
          >
            {status === 'live' ? 'Em Andamento' : actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameCard;