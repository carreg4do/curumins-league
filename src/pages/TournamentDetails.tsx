import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, MapPin, DollarSign, Clock, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  // Mock data - em produção viria do Supabase
  const tournament = {
    id: 1,
    name: 'Liga Norte Champions',
    status: 'open',
    prize: 'R$ 5.000',
    participants: 32,
    maxParticipants: 64,
    startDate: '2024-08-15',
    registrationEnd: '2024-08-10',
    mode: '5v5',
    maps: ['Dust2', 'Mirage', 'Inferno'],
    description: 'O maior torneio da região Norte do Brasil. Venha mostrar suas habilidades e competir pelo prêmio de R$ 5.000!',
    rules: [
      'Times de 5 jogadores + 1 reserva',
      'Formato eliminação simples',
      'Mapas: Dust2, Mirage, Inferno',
      'Proibido uso de cheats ou exploits',
      'Comunicação via Discord obrigatória'
    ],
    schedule: [
      { phase: 'Inscrições', date: 'Até 10/08/2024' },
      { phase: 'Primeira Fase', date: '15/08/2024 - 18h' },
      { phase: 'Quartas de Final', date: '16/08/2024 - 19h' },
      { phase: 'Semifinais', date: '17/08/2024 - 20h' },
      { phase: 'Final', date: '18/08/2024 - 21h' }
    ]
  };

  const handleRegisterTeam = async () => {
    // Verificar se está logado
    if (!isAuthenticated || !user) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar logado para inscrever seu time.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Verificar se tem um time
    if (!user.team_id) {
      toast({
        title: "Time Necessário",
        description: "Você precisa estar em um time para se inscrever no torneio.",
        variant: "destructive",
      });
      navigate('/criar-time');
      return;
    }

    setIsRegistering(true);
    
    try {
      // Simular inscrição no torneio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Inscrição Realizada!",
        description: "Seu time foi inscrito no torneio com sucesso.",
      });
      
      // Redirecionar para página de times ou torneios
      navigate('/times');
    } catch (error) {
      toast({
        title: "Erro na Inscrição",
        description: "Não foi possível inscrever seu time. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/torneios')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">
              {tournament.name}
            </h1>
            <Badge className={`${getStatusColor(tournament.status)} border`}>
              {getStatusText(tournament.status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Sobre o Torneio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {tournament.description}
                </p>
              </CardContent>
            </Card>

            {/* Regras */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Regras do Torneio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tournament.rules.map((rule, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Cronograma */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Cronograma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tournament.schedule.map((phase, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                      <span className="text-white font-medium">{phase.phase}</span>
                      <span className="text-gray-400">{phase.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Torneio */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-gray-400">Prêmio</span>
                  </div>
                  <span className="text-white font-bold">{tournament.prize}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">Participantes</span>
                  </div>
                  <span className="text-white">{tournament.participants}/{tournament.maxParticipants}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-400">Início</span>
                  </div>
                  <span className="text-white">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-400">Inscrições até</span>
                  </div>
                  <span className="text-white">{new Date(tournament.registrationEnd).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-red-400" />
                    <span className="text-gray-400">Mapas</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tournament.maps.map((map, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {map}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botão de Inscrição */}
            {tournament.status === 'open' && (
              <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleRegisterTeam}
                    disabled={isRegistering}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                  >
                    {isRegistering ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Inscrevendo...
                      </>
                    ) : (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Inscrever Time
                      </>
                    )}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-center text-gray-400 text-sm mt-2">
                      Você precisa estar logado para se inscrever
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;