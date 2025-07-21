import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Trophy, Zap, Shield, Clock } from 'lucide-react';

const MatchmakingInfo = () => {
  return (
    <div className="min-h-screen bg-gaming-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gaming-gradient mb-4">
            Sistema de Matchmaking
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Encontre partidas equilibradas baseadas no seu nível de habilidade e patente. 
            Jogue com jogadores do seu nível e evolua no ranking da Liga Norte.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="card-gaming-highlight">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-gaming-gradient">Matchmaking por ELO</CardTitle>
              <CardDescription>
                Sistema inteligente que encontra adversários do seu nível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nosso algoritmo analisa seu ELO atual e histórico de partidas para encontrar 
                oponentes equilibrados, garantindo jogos justos e competitivos.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gaming-highlight">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-gaming-gradient">Sistema de Patentes</CardTitle>
              <CardDescription>
                Evolua através das patentes do CS2
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Prata</Badge>
                  <Badge variant="outline" className="text-xs">Ouro</Badge>
                  <Badge variant="outline" className="text-xs">AK</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Suba de patente vencendo partidas e demonstrando suas habilidades.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gaming-highlight">
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-gaming-gradient">Busca Rápida</CardTitle>
              <CardDescription>
                Encontre partidas em segundos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sistema otimizado para encontrar partidas rapidamente, com tempo médio 
                de espera de apenas 2-3 minutos.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gaming-highlight">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-gaming-gradient">Jogue em Time</CardTitle>
              <CardDescription>
                Forme equipes com seus amigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crie ou entre em times para jogar com seus amigos e participar 
                de torneios organizados.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gaming-highlight">
            <CardHeader>
              <Trophy className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-gaming-gradient">Ranking Global</CardTitle>
              <CardDescription>
                Compete pelo topo do ranking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Veja sua posição no ranking global da Liga Norte e compete 
                para chegar ao topo.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gaming-highlight">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-gaming-gradient">Anti-Cheat</CardTitle>
              <CardDescription>
                Ambiente seguro e justo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sistema anti-cheat integrado para garantir partidas limpas 
                e uma experiência justa para todos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gaming-gradient text-center mb-8">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Crie sua Conta</h3>
              <p className="text-muted-foreground">
                Registre-se na plataforma e conecte sua conta Steam para começar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Entre na Fila</h3>
              <p className="text-muted-foreground">
                Clique em "Buscar Partida" e aguarde o sistema encontrar adversários
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Jogue e Evolua</h3>
              <p className="text-muted-foreground">
                Participe da partida, ganhe ELO e suba no ranking
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="card-gaming-highlight max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-gaming-gradient mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-muted-foreground mb-6">
              Junte-se à Liga Norte e comece a jogar partidas equilibradas hoje mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-gaming">
                <Link to="/register">
                  Criar Conta Grátis
                </Link>
              </Button>
              <Button asChild variant="outline" className="hover:border-primary/50">
                <Link to="/login">
                  Já tenho conta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchmakingInfo;