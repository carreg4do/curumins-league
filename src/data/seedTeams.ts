import { supabase } from '../integrations/supabase/client';

// Dados fictícios para popular a tabela teams
const seedTeams = [
  {
    name: 'Team Alpha',
    tag: 'ALPHA',
    description: 'Time competitivo focado em estratégias avançadas e comunicação eficiente.',
    region: 'Nordeste',
    elo: 1850,
    wins: 45,
    losses: 12,
    is_recruiting: true,
    logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center'
  },
  {
    name: 'Team Bravo',
    tag: 'BRAVO',
    description: 'Equipe experiente com foco em táticas defensivas e controle de mapa.',
    region: 'Nordeste',
    elo: 1720,
    wins: 38,
    losses: 18,
    is_recruiting: false,
    logo_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center'
  },
  {
    name: 'Northeast Legends',
    tag: 'NLEG',
    description: 'Lendas do nordeste brasileiro, conhecidos pela agressividade e precisão.',
    region: 'Nordeste',
    elo: 1950,
    wins: 52,
    losses: 8,
    is_recruiting: true,
    logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center'
  },
  {
    name: 'Cyber Warriors',
    tag: 'CYBER',
    description: 'Guerreiros digitais especializados em rushes coordenados.',
    region: 'Nordeste',
    elo: 1680,
    wins: 34,
    losses: 22,
    is_recruiting: true,
    logo_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center'
  },
  {
    name: 'Phoenix Rising',
    tag: 'PHNX',
    description: 'Time emergente com grande potencial e sede de vitória.',
    region: 'Nordeste',
    elo: 1420,
    wins: 28,
    losses: 15,
    is_recruiting: true,
    logo_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center'
  }
];

// Função para popular a tabela teams com dados fictícios
export const seedTeamsData = async (): Promise<boolean> => {
  try {
    // Verificar se já existem times na tabela
    const { data: existingTeams, error: checkError } = await supabase
      .from('teams')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar times existentes:', checkError);
      return false;
    }

    // Se já existem times, não fazer seed
    if (existingTeams && existingTeams.length > 0) {
      console.log('Times já existem na tabela, pulando seed.');
      return true;
    }

    // Inserir times fictícios
    const { error: insertError } = await supabase
      .from('teams')
      .insert(seedTeams);

    if (insertError) {
      console.error('Erro ao inserir times fictícios:', insertError);
      return false;
    }

    console.log('Times fictícios inseridos com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro no seed de times:', error);
    return false;
  }
};

export default seedTeams;