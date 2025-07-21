import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Users, MapPin, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TournamentDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);

  // Mock data - será substituído por dados do Supabase
  const tournament = {
    id: 1,
    name: 'Liga Norte Champions',
    description: 'O maior torneio de Counter-Strike da região Norte. Competição entre os melhores times da Amazônia com premiação em dinheiro e troféus exclusivos.',
    status: 'open',
    prize: 'R$ 5.000',
    participants: 32,
    maxParticipants: 64,
    startDate: '2024-08-15',
    endDate: '2024-08-25',
    registrationEnd: '2024-08-10',
    mode: '5v5',
    format: 'Eliminação Dupla',
    platform: 'Online',
    location: 'Servidor Brasil',
    maps: ['Dust2', 'Mirage', 'Inferno', 'Cache', 'Overpass'],
    rules: [
      'Times de 5 jogadores + 1 reserva',
      'Mapas escolhidos por banimento',
      'Formato BO3 nas finais',
      'Proibido uso de cheats ou exploits',
      'Tolerância máxima de 15 minutos de atraso'
    ],
    registeredTeams: [
      { id: 1, name: 'Amazônia Legends', tag: 'AML', logo: '' },
      { id: 2, name: 'Norte Supremacy', tag: 'NSU', logo: '' },
      { id: 3, name: 'Roraima Raiders', tag: 'RRD', logo: '' },
      { id: 4, name: 'Acre Wolves', tag: 'ACW', logo: '' },
      { id: 5, name: 'Rondônia Force', tag: 'ROF', logo: '' },
      { id: 6, name: 'Tocantins Thunder', tag: 'TTH', logo: '' }
    ],
    schedule: [
      { phase: 'Fase de Grupos', date: '15/08 - 17/08', description: 'Grupos de 4 times' },
      { phase: 'Quartas de Final', date: '19/08', description: 'BO3' },
      { phase: 'Semifinais', date: '22/08', description: 'BO3' },
      { phase: 'Final', date: '25/08', description: 'BO5' }
    ]
  };

  const handleRegister = () => {
    setIsRegistered(true);
    toast({
      title: "Time inscrito!",
      description: "Seu time foi inscrito com sucesso no torneio.",
      variant: "default"
    });
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Tournament Header */}
        <Card className="bg-card/50 border-border mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-foreground">{tournament.name}</CardTitle>
                  <Badge className={`${getStatusColor(tournament.status)} border mt-2`}>
                    {getStatusText(tournament.status)}
                  </Badge>
                </div>
              </div>
              {tournament.status === 'open' && (
                <Button 
                  onClick={handleRegister}
                  disabled={isRegistered}
                  className={isRegistered ? "bg-muted text-muted-foreground" : "btn-gaming"}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isRegistered ? 'Inscrito' : 'Inscrever Time'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg leading-relaxed">{tournament.description}</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tournament Info */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Informações do Torneio</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Premiação</div>
                      <div className="text-muted-foreground">{tournament.prize}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Participantes</div>
                      <div className="text-muted-foreground">{tournament.participants}/{tournament.maxParticipants} times</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Período</div>
                      <div className="text-muted-foreground">
                        {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Inscrições até</div>
                      <div className="text-muted-foreground">{new Date(tournament.registrationEnd).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Plataforma</div>
                      <div className="text-muted-foreground">{tournament.platform} - {tournament.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Formato</div>
                      <div className="text-muted-foreground">{tournament.format} - {tournament.mode}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maps */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Mapas do Torneio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tournament.maps.map((map, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg text-center">
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">{map}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Regras do Torneio</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tournament.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Cronograma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournament.schedule.map((phase, index) => (
                  <div key={index} className="p-3 bg-muted/20 rounded-lg">
                    <div className="font-semibold text-foreground">{phase.phase}</div>
                    <div className="text-sm text-primary">{phase.date}</div>
                    <div className="text-xs text-muted-foreground">{phase.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Registered Teams */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Times Inscritos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tournament.registeredTeams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-3 p-2 bg-muted/20 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-primary rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{team.tag}</span>
                    </div>
                    <span className="font-medium text-foreground">{team.name}</span>
                  </div>
                ))}
                {tournament.registeredTeams.length < tournament.maxParticipants && (
                  <div className="text-center py-4">
                    <div className="text-sm text-muted-foreground">
                      {tournament.maxParticipants - tournament.registeredTeams.length} vagas restantes
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;