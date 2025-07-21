import { useState } from 'react';
import PlayerCard from '@/components/PlayerCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Ranking = () => {
  const [filter, setFilter] = useState('global');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - será substituído por dados do Supabase
  const players = [
    {
      rank: 1,
      name: 'DragãoAM',
      elo: 2450,
      wins: 156,
      losses: 34,
      city: 'Manaus, AM',
      change: 2,
      isCurrentUser: false
    },
    {
      rank: 2,
      name: 'AçaíWarrior',
      elo: 2389,
      wins: 143,
      losses: 41,
      city: 'Belém, PA',
      change: -1,
      isCurrentUser: false
    },
    {
      rank: 3,
      name: 'TucumãSniper',
      elo: 2298,
      wins: 128,
      losses: 38,
      city: 'Boa Vista, RR',
      change: 1,
      isCurrentUser: false
    },
    {
      rank: 4,
      name: 'PororocaAWP',
      elo: 2156,
      wins: 119,
      losses: 45,
      city: 'Macapá, AP',
      change: 0,
      isCurrentUser: false
    },
    {
      rank: 5,
      name: 'VoceAgora',
      elo: 2089,
      wins: 98,
      losses: 37,
      city: 'Manaus, AM',
      change: 3,
      isCurrentUser: true
    },
    {
      rank: 6,
      name: 'CastanhaKing',
      elo: 2034,
      wins: 102,
      losses: 51,
      city: 'Rio Branco, AC',
      change: -2,
      isCurrentUser: false
    },
    {
      rank: 7,
      name: 'GuaranáGamer',
      elo: 1987,
      wins: 89,
      losses: 43,
      city: 'Porto Velho, RO',
      change: 1,
      isCurrentUser: false
    },
    {
      rank: 8,
      name: 'AmazonFrag',
      elo: 1923,
      wins: 94,
      losses: 56,
      city: 'Palmas, TO',
      change: -1,
      isCurrentUser: false
    }
  ];

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gaming-hero py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-gaming-gradient">
              Ranking Liga do Norte
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Os melhores jogadores de Counter-Strike da região Norte
          </p>
        </div>

        {/* Filters */}
        <div className="card-gaming mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione o filtro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="semanal">Esta Semana</SelectItem>
                  <SelectItem value="mensal">Este Mês</SelectItem>
                  <SelectItem value="manaus">Manaus</SelectItem>
                  <SelectItem value="belem">Belém</SelectItem>
                  <SelectItem value="outros">Outras Cidades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar jogador ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Ranking List */}
        <div className="space-y-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.rank}
              rank={player.rank}
              name={player.name}
              elo={player.elo}
              wins={player.wins}
              losses={player.losses}
              city={player.city}
              change={player.change}
              isCurrentUser={player.isCurrentUser}
            />
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhum jogador encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termo de busca.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="card-gaming-highlight max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Não está no ranking ainda?
            </h2>
            <p className="text-muted-foreground mb-6">
              Comece a jogar partidas ranqueadas e apareça nesta lista!
            </p>
            <Button className="btn-gaming">
              Procurar Partida
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;