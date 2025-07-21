import { useState } from 'react';
import { User, MapPin, Trophy, Target, Calendar, Edit, Settings, TrendingUp, Award, Clock, Users } from 'lucide-react';
import EditProfile from '@/components/EditProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GameCard from '@/components/GameCard';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    name: 'AmazonKing',
    avatar: '',
    elo: 'Global Elite',
    eloPoints: 2847,
    city: 'Manaus, AM',
    rank: 15,
    joinDate: '2024-01-15',
    team: 'Amazônia Legends',
    teamTag: 'AML',
    stats: {
      totalMatches: 324,
      wins: 198,
      losses: 126,
      winRate: 61.1,
      kd: 1.34,
      avgScore: 18.7,
      headshots: 42.3,
      mvps: 89
    }
  };

  const recentMatches = [
    {
      id: 1,
      map: 'Dust2',
      result: 'win',
      score: '16-12',
      opponent: 'Norte Supremacy',
      date: '2024-07-19',
      kd: '24/18',
      mvp: true
    },
    {
      id: 2,
      map: 'Mirage',
      result: 'loss',
      score: '13-16',
      opponent: 'Roraima Raiders',
      date: '2024-07-18',
      kd: '19/21',
      mvp: false
    },
    {
      id: 3,
      map: 'Inferno',
      result: 'win',
      score: '16-9',
      opponent: 'Acre Wolves',
      date: '2024-07-17',
      kd: '26/15',
      mvp: true
    }
  ];

  const achievements = [
    { name: 'Primeira Vitória', description: 'Ganhe sua primeira partida', date: '2024-01-16', icon: Trophy },
    { name: 'Atirador Elite', description: 'Alcance 50% de headshots em uma partida', date: '2024-02-20', icon: Target },
    { name: 'Veterano', description: 'Jogue 100 partidas', date: '2024-04-15', icon: Award },
    { name: 'Líder de Time', description: 'Seja MVP 50 vezes', date: '2024-06-30', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-card/50 border-border mb-8 overflow-hidden">
          <div className="bg-gradient-primary h-32"></div>
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl font-bold">{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {user.elo} - {user.eloPoints} pts
                      </Badge>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.city}</span>
                      </div>
                    </div>
                  </div>
                   <EditProfile 
                    user={user}
                    onSave={(data) => console.log('Salvando perfil:', data)}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">#{user.rank}</div>
                    <div className="text-sm text-muted-foreground">Ranking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.totalMatches}</div>
                    <div className="text-sm text-muted-foreground">Partidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{user.stats.winRate}%</div>
                    <div className="text-sm text-muted-foreground">Taxa de Vitória</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.kd}</div>
                    <div className="text-sm text-muted-foreground">K/D</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20">
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="matches">Partidas</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Vitórias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{user.stats.wins}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.stats.losses} derrotas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    K/D Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{user.stats.kd}</div>
                  <p className="text-xs text-muted-foreground">
                    Média de {user.stats.avgScore} kills/partida
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    MVPs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{user.stats.mvps}</div>
                  <p className="text-xs text-muted-foreground">
                    {((user.stats.mvps / user.stats.totalMatches) * 100).toFixed(1)}% das partidas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Headshots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{user.stats.headshots}%</div>
                  <p className="text-xs text-muted-foreground">
                    Taxa de headshot
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Team Info */}
            {user.team && (
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Time Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{user.teamTag}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{user.team}</h3>
                        <p className="text-sm text-muted-foreground">Membro desde {new Date(user.joinDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <Button variant="outline">Ver Time</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <Card key={match.id} className="bg-card/50 border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          match.result === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{match.map}</h3>
                          <p className="text-sm text-muted-foreground">vs {match.opponent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          match.result === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.score}
                        </div>
                        <div className="text-sm text-muted-foreground">{match.kd}</div>
                        {match.mvp && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">MVP</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline">Carregar Mais Partidas</Button>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card key={index} className="bg-card/50 border-border">
                    <CardContent className="flex items-center space-x-4 p-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Conquistado em {new Date(achievement.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;