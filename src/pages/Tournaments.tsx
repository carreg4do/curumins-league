import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, MapPin, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState('open');
  const navigate = useNavigate();

  const tournaments = [
    {
      id: 1,
      name: 'Liga Norte Champions',
      status: 'open',
      prize: 'R$ 5.000',
      participants: 32,
      maxParticipants: 64,
      startDate: '2024-08-15',
      registrationEnd: '2024-08-10',
      mode: '5v5',
      maps: ['Dust2', 'Mirage', 'Inferno']
    },
    {
      id: 2,
      name: 'Torneio Manaus Open',
      status: 'ongoing',
      prize: 'R$ 2.500',
      participants: 16,
      maxParticipants: 16,
      startDate: '2024-07-20',
      registrationEnd: '2024-07-15',
      mode: '5v5',
      maps: ['Cache', 'Overpass', 'Vertigo']
    },
    {
      id: 3,
      name: 'Copa Belém CS',
      status: 'finished',
      prize: 'R$ 1.000',
      participants: 8,
      maxParticipants: 8,
      startDate: '2024-06-01',
      registrationEnd: '2024-05-25',
      mode: '5v5',
      maps: ['Dust2', 'Mirage']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'finished': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Inscrições Abertas';
      case 'ongoing': return 'Em Andamento';
      case 'finished': return 'Finalizado';
      default: return status;
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (activeTab === 'all') return true;
    return tournament.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Torneios
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted/20 rounded-lg p-1 w-fit">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'open', label: 'Abertos' },
            { key: 'ongoing', label: 'Em Andamento' },
            { key: 'finished', label: 'Finalizados' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-card/50 border-border hover:bg-card/70 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-foreground">{tournament.name}</CardTitle>
                  <Badge className={`${getStatusColor(tournament.status)} border`}>
                    {getStatusText(tournament.status)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{tournament.prize}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Início:</span>
                  <span className="text-foreground">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Inscrições até:</span>
                  <span className="text-foreground">{new Date(tournament.registrationEnd).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mapas:</span>
                  <span className="text-foreground">{tournament.maps.join(', ')}</span>
                </div>

                <div className="pt-4">
                  {tournament.status === 'open' && (
                    <Button 
                      className="w-full btn-gaming"
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  )}
                  {tournament.status === 'ongoing' && (
                    <Button variant="outline" className="w-full">
                      Ver Chaveamento
                    </Button>
                  )}
                  {tournament.status === 'finished' && (
                    <Button variant="outline" className="w-full">
                      Ver Resultados
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhum torneio encontrado
            </h3>
            <p className="text-muted-foreground">
              Não há torneios {activeTab === 'all' ? '' : getStatusText(activeTab).toLowerCase()} no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;