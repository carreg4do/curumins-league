import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users, Zap, Shield, Crown } from 'lucide-react';
import heroImage from '@/assets/hero-gaming.jpg';

const Home = () => {
  const features = [
    {
      icon: Target,
      title: 'Matchmaking Avançado',
      description: 'Sistema inteligente que conecta jogadores de skill similar para partidas equilibradas.'
    },
    {
      icon: Trophy,
      title: 'Ranking Competitivo',
      description: 'Suba no ranking regional e compete pelos primeiros lugares do Norte.'
    },
    {
      icon: Users,
      title: 'Times e Comunidade',
      description: 'Forme equipes, participe de torneios e conecte-se com jogadores da região.'
    },
    {
      icon: Shield,
      title: 'Anti-Cheat',
      description: 'Ambiente seguro com sistema de denúncias e moderação ativa.'
    }
  ];

  const stats = [
    { number: '1,247', label: 'Jogadores Ativos' },
    { number: '3,891', label: 'Partidas Jogadas' },
    { number: '42', label: 'Torneios Realizados' },
    { number: '15', label: 'Times Registrados' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gaming-hero overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Gaming Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                <Zap className="h-4 w-4 mr-2" />
                Liga Counter-Strike do Norte
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gaming-gradient">Entre para a</span>
              <br />
              <span className="text-foreground">Liga do Norte</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Compita, suba no ranking e represente o Norte no Counter-Strike. 
              Conecte-se com os melhores jogadores da região em um ambiente competitivo e justo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="btn-gaming text-lg px-8 py-4">
                  <Crown className="h-5 w-5 mr-2" />
                  Criar Conta Grátis
                </Button>
              </Link>
              <Link to="/ranking">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:border-primary/50">
                  <Trophy className="h-5 w-5 mr-2" />
                  Ver Rankings
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 hidden lg:block">
          <div className="w-4 h-4 bg-primary rounded-full animate-float"></div>
        </div>
        <div className="absolute bottom-40 right-32 hidden lg:block">
          <div className="w-6 h-6 bg-secondary rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="absolute top-1/2 right-10 hidden lg:block">
          <div className="w-3 h-3 bg-accent rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gaming-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gaming-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gaming-gradient">Por que escolher</span> a Liga do Norte?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma plataforma completa para jogadores competitivos de Counter-Strike na região Norte.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-gaming hover-float text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gaming-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para <span className="text-gaming-gradient">dominar</span> a região?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a centenas de jogadores e prove que você é o melhor do Norte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-gaming text-lg px-8 py-4">
                Começar Agora
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:border-primary/50">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;