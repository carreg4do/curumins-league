import { Crown, MapPin, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface PlayerCardProps {
  rank: number;
  name: string;
  elo: number;
  wins: number;
  losses: number;
  city: string;
  change?: number; // posições subidas/descidas
  avatar?: string;
  isCurrentUser?: boolean;
}

const PlayerCard = ({ 
  rank, 
  name, 
  elo, 
  wins, 
  losses, 
  city, 
  change,
  avatar,
  isCurrentUser = false
}: PlayerCardProps) => {
  const winRate = Math.round((wins / (wins + losses)) * 100);
  const isTop3 = rank <= 3;
  
  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getEloColor = () => {
    if (elo >= 2000) return 'text-primary';
    if (elo >= 1500) return 'text-secondary';
    if (elo >= 1000) return 'text-accent';
    return 'text-muted-foreground';
  };

  return (
    <div className={`${isCurrentUser ? 'card-gaming-highlight' : 'card-gaming'} ${isTop3 ? 'ring-2 ring-primary/30' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="flex items-center">
            <span className={`text-2xl font-bold ${getRankColor()}`}>
              #{rank}
            </span>
            {rank <= 3 && <Crown className={`h-5 w-5 ml-1 ${getRankColor()}`} />}
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isCurrentUser && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-background"></div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <h3 className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
              {name}
              {isCurrentUser && <span className="text-xs text-primary ml-2">(Você)</span>}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{city}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right space-y-1">
          <div className={`text-xl font-bold ${getEloColor()}`}>
            {elo} ELO
          </div>
          <div className="text-sm text-muted-foreground">
            {wins}V / {losses}D ({winRate}%)
          </div>
          {change !== undefined && (
            <div className="flex items-center justify-end text-xs">
              {change > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                  <span className="text-success">+{change}</span>
                </>
              ) : change < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                  <span className="text-destructive">{change}</span>
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;