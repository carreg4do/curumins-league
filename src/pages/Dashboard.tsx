import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Target, Clock, Play, Settings, User, Gamepad2, Zap, Shield, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);
  const navigate = useNavigate();

  // Simular dados de estatísticas
  const stats = {
    rank: 'Global Elite',
    rankIcon: '🏆',
    wins: 247,
    losses: 89,
    kd: 1.34,
    headshots: 67.2,
    level: 42,
    xp: 8750,
    xpToNext: 10000,
    recentMatches: [
      { id: 1, map: 'Dust2', result: 'Vitória', score: '16-12', date: '2024-01-15', mvp: true },
      { id: 2, map: 'Mirage', result: 'Derrota', score: '14-16', date: '2024-01-14', mvp: false },
      { id: 3, map: 'Inferno', result: 'Vitória', score: '16-8', date: '2024-01-13', mvp: true },
    ]
  };

  const handleFindMatch = () => {
    setIsSearchingMatch(true);
    navigate('/matchmaking');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-hero">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-hero">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gaming-gradient mb-4">Acesso negado</h1>
          <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-hero">
      {/* Header Principal */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow p-1">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.nickname} className="w-12 h-12 rounded-full" />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gaming-gradient">{user.nickname}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg">{stats.rankIcon}</span>
                  <span className="text-foreground font-medium">{stats.rank}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Nível {stats.level}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">XP</p>
                <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-300"
                    style={{ width: `${(stats.xp / stats.xpToNext) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stats.xp}/{stats.xpToNext}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-muted-foreground">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Painel Principal de Jogo */}
          <div className="lg:col-span-3 space-y-6">
            {/* Botão Principal de Matchmaking */}
            <Card className="card-gaming-highlight border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Gamepad2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gaming-gradient mb-2">Pronto para Dominar?</h2>
                  <p className="text-muted-foreground text-lg">Entre na fila e mostre suas habilidades</p>
                </div>
                <Button 
                  onClick={handleFindMatch}
                  className="btn-gaming text-xl py-4 px-8 h-auto"
                  disabled={isSearchingMatch}
                >
                  <Play className="h-6 w-6 mr-3" />
                  {isSearchingMatch ? 'Procurando Partida...' : 'ENCONTRAR PARTIDA'}
                </Button>
                <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>🌎 Região: Brasil</span>
                  <span>⚡ Ping: 32ms</span>
                  <span>🎯 Modo: Competitivo</span>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="card-gaming-highlight hover:border-green-500/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.wins}</p>
                  <p className="text-sm text-muted-foreground">Vitórias</p>
                  <div className="mt-2 text-xs text-green-500">+12 esta semana</div>
                </CardContent>
              </Card>
              
              <Card className="card-gaming-highlight hover:border-red-500/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.losses}</p>
                  <p className="text-sm text-muted-foreground">Derrotas</p>
                  <div className="mt-2 text-xs text-red-500">+3 esta semana</div>
                </CardContent>
              </Card>
              
              <Card className="card-gaming-highlight hover:border-blue-500/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.kd}</p>
                  <p className="text-sm text-muted-foreground">K/D Ratio</p>
                  <div className="mt-2 text-xs text-blue-500">↗ Melhorando</div>
                </CardContent>
              </Card>
              
              <Card className="card-gaming-highlight hover:border-yellow-500/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.headshots}%</p>
                  <p className="text-sm text-muted-foreground">Headshots</p>
                  <div className="mt-2 text-xs text-yellow-500">Elite</div>
                </CardContent>
              </Card>
            </div>

            {/* Partidas Recentes */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Histórico de Partidas
                </CardTitle>
                <CardDescription>Suas últimas partidas competitivas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          match.result === 'Vitória' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-foreground">{match.map}</p>
                            {match.mvp && <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{match.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg">{match.score}</p>
                        <p className={`text-sm font-medium ${
                          match.result === 'Vitória' ? 'text-green-500' : 'text-red-500'
                        }`}>{match.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Menu Rápido</CardTitle>
                <CardDescription>Acesso rápido às funcionalidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/teams')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Meus Times
                </Button>
                
                <Button 
                  onClick={() => navigate('/tournaments')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Torneios
                </Button>
                
                <Button 
                  onClick={() => navigate('/ranking')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Ranking
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Status do Servidor */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Status do Servidor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Região:</span>
                    <span className="text-foreground font-medium">🇧🇷 Brasil</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ping:</span>
                    <span className="text-green-500 font-medium">32ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Jogadores Online:</span>
                    <span className="text-primary font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Partidas Ativas:</span>
                    <span className="text-primary font-medium">89</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-500 text-sm font-medium">Todos os serviços operacionais</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conquistas Recentes */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-500/10">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Sequência de Vitórias</p>
                      <p className="text-xs text-muted-foreground">5 vitórias seguidas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-500/10">
                    <Target className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Atirador de Elite</p>
                      <p className="text-xs text-muted-foreground">70% headshots</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;