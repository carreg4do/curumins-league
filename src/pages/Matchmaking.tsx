import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Target, 
  Clock, 
  Gamepad2, 
  Shield, 
  Zap, 
  MapPin, 
  Settings,
  X,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Matchmaking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(45);
  const [playersInQueue, setPlayersInQueue] = useState(1247);
  const [selectedMode, setSelectedMode] = useState('competitive');
  const [selectedMaps, setSelectedMaps] = useState(['dust2', 'mirage', 'inferno']);

  const gameModes = [
    {
      id: 'competitive',
      name: 'Competitivo',
      description: 'Partidas ranqueadas 5v5',
      icon: Target,
      players: '5v5',
      duration: '45-90 min'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Partidas descontraídas',
      icon: Users,
      players: '10v10',
      duration: '30-45 min'
    },
    {
      id: 'deathmatch',
      name: 'Deathmatch',
      description: 'Treino de mira',
      icon: Zap,
      players: 'FFA',
      duration: '10 min'
    }
  ];

  const maps = [
    { id: 'dust2', name: 'Dust II', image: '🏜️' },
    { id: 'mirage', name: 'Mirage', image: '🏙️' },
    { id: 'inferno', name: 'Inferno', image: '🔥' },
    { id: 'cache', name: 'Cache', image: '🏭' },
    { id: 'overpass', name: 'Overpass', image: '🌉' },
    { id: 'vertigo', name: 'Vertigo', image: '🏢' },
    { id: 'nuke', name: 'Nuke', image: '☢️' },
    { id: 'train', name: 'Train', image: '🚂' }
  ];

  const playerStats = {
    rank: 'Global Elite',
    rankIcon: '🏆',
    elo: 2450,
    wins: 247,
    ping: 32,
    region: 'Brasil'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSearch = () => {
    setIsSearching(true);
    setSearchTime(0);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchTime(0);
  };

  const toggleMapSelection = (mapId: string) => {
    setSelectedMaps(prev => 
      prev.includes(mapId) 
        ? prev.filter(id => id !== mapId)
        : [...prev, mapId]
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-hero">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gaming-gradient mb-4">Acesso negado</h1>
          <p className="text-muted-foreground">Você precisa estar logado para acessar o matchmaking.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gaming-hero">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Voltar ao Dashboard
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-2xl font-bold text-gaming-gradient">Matchmaking</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Jogadores Online</p>
                <p className="text-lg font-bold text-primary">{playersInQueue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status da Busca */}
            {isSearching ? (
              <Card className="card-gaming-highlight border-primary/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gamepad2 className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gaming-gradient mb-2">Procurando Partida</h2>
                    <p className="text-muted-foreground">Aguarde enquanto encontramos jogadores compatíveis</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tempo de busca:</span>
                      <span className="text-primary font-mono text-lg">{formatTime(searchTime)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tempo estimado:</span>
                      <span className="text-foreground">{estimatedTime}s</span>
                    </div>
                    <Progress value={(searchTime / estimatedTime) * 100} className="h-2" />
                  </div>
                  
                  <Button 
                    onClick={handleCancelSearch}
                    variant="destructive"
                    className="px-8"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar Busca
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-gaming-highlight">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <Gamepad2 className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gaming-gradient mb-2">Pronto para Jogar?</h2>
                    <p className="text-muted-foreground text-lg">Configure suas preferências e entre na fila</p>
                  </div>
                  
                  <Button 
                    onClick={handleStartSearch}
                    className="btn-gaming text-xl py-4 px-8 h-auto"
                    disabled={selectedMaps.length === 0}
                  >
                    <Play className="h-6 w-6 mr-3" />
                    INICIAR BUSCA
                  </Button>
                  
                  {selectedMaps.length === 0 && (
                    <p className="text-destructive text-sm mt-2">Selecione pelo menos um mapa</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Seleção de Modo de Jogo */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Modo de Jogo</CardTitle>
                <CardDescription>Escolha o tipo de partida que deseja jogar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gameModes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedMode === mode.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-center">
                          <Icon className={`h-8 w-8 mx-auto mb-2 ${
                            selectedMode === mode.id ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <h3 className="font-semibold text-foreground">{mode.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{mode.description}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{mode.players}</span>
                            <span>{mode.duration}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Mapas */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Mapas</CardTitle>
                <CardDescription>Selecione os mapas que deseja jogar ({selectedMaps.length} selecionados)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {maps.map((map) => (
                    <div
                      key={map.id}
                      onClick={() => toggleMapSelection(map.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        selectedMaps.includes(map.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{map.image}</div>
                      <p className={`text-sm font-medium ${
                        selectedMaps.includes(map.id) ? 'text-primary' : 'text-foreground'
                      }`}>{map.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Perfil do Jogador */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Seu Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.nickname} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-white font-bold">{user.nickname?.[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{user.nickname}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{playerStats.rankIcon}</span>
                      <span className="text-sm text-muted-foreground">{playerStats.rank}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ELO:</span>
                    <span className="text-primary font-bold">{playerStats.elo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vitórias:</span>
                    <span className="text-foreground">{playerStats.wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ping:</span>
                    <span className="text-green-500">{playerStats.ping}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Região:</span>
                    <span className="text-foreground">🇧🇷 {playerStats.region}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Matchmaking */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ping máximo:</span>
                  <Badge variant="outline">100ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Região:</span>
                  <Badge variant="outline">Brasil</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Crossplay:</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">Ativo</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações Avançadas
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas da Fila */}
            <Card className="card-gaming-highlight">
              <CardHeader>
                <CardTitle className="text-gaming-gradient">Status da Fila</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Jogadores na fila:</span>
                    <span className="text-primary font-bold">{playersInQueue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tempo médio:</span>
                    <span className="text-foreground">45s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Servidores ativos:</span>
                    <span className="text-green-500">89</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-500 text-sm">Todos os serviços online</span>
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

export default Matchmaking;