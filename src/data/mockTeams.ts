export interface MockTeam {
  id: string;
  name: string;
  tag: string;
  region: string;
  elo: number;
  wins: number;
  losses: number;
  is_recruiting: boolean;
  members: {
    user_id: string;
    role: string;
    user: {
      nickname: string;
      avatar_url?: string;
    };
  }[];
}

export const mockTeams: MockTeam[] = [
  {
    id: '1',
    name: 'Águias do Norte',
    tag: 'ADN',
    region: 'Norte',
    elo: 2150,
    wins: 24,
    losses: 8,
    is_recruiting: true,
    members: [
      {
        user_id: '1',
        role: 'IGL',
        user: {
          nickname: 'CommanderNorth',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CommanderNorth'
        }
      },
      {
        user_id: '2',
        role: 'AWPer',
        user: {
          nickname: 'SniperAmazon',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SniperAmazon'
        }
      },
      {
        user_id: '3',
        role: 'Entry',
        user: {
          nickname: 'RushManaus',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RushManaus'
        }
      },
      {
        user_id: '4',
        role: 'Support',
        user: {
          nickname: 'FlashMaster',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FlashMaster'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Jaguares Amazônicos',
    tag: 'JAG',
    region: 'Amazonas',
    elo: 1980,
    wins: 18,
    losses: 12,
    is_recruiting: false,
    members: [
      {
        user_id: '5',
        role: 'IGL',
        user: {
          nickname: 'JungleLeader',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JungleLeader'
        }
      },
      {
        user_id: '6',
        role: 'AWPer',
        user: {
          nickname: 'AmazonSniper',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmazonSniper'
        }
      },
      {
        user_id: '7',
        role: 'Entry',
        user: {
          nickname: 'FastJaguar',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FastJaguar'
        }
      },
      {
        user_id: '8',
        role: 'Support',
        user: {
          nickname: 'SmokeKing',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SmokeKing'
        }
      },
      {
        user_id: '9',
        role: 'Lurker',
        user: {
          nickname: 'SilentHunter',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SilentHunter'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Piratas do Rio',
    tag: 'PDR',
    region: 'Pará',
    elo: 2050,
    wins: 21,
    losses: 9,
    is_recruiting: true,
    members: [
      {
        user_id: '10',
        role: 'IGL',
        user: {
          nickname: 'CaptainRiver',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaptainRiver'
        }
      },
      {
        user_id: '11',
        role: 'AWPer',
        user: {
          nickname: 'RiverShot',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RiverShot'
        }
      },
      {
        user_id: '12',
        role: 'Entry',
        user: {
          nickname: 'PirateRush',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PirateRush'
        }
      }
    ]
  },
  {
    id: '4',
    name: 'Guardiões da Floresta',
    tag: 'GDF',
    region: 'Rondônia',
    elo: 1850,
    wins: 15,
    losses: 15,
    is_recruiting: true,
    members: [
      {
        user_id: '13',
        role: 'IGL',
        user: {
          nickname: 'ForestGuard',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ForestGuard'
        }
      },
      {
        user_id: '14',
        role: 'Support',
        user: {
          nickname: 'TreeDefender',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TreeDefender'
        }
      }
    ]
  },
  {
    id: '5',
    name: 'Trovões do Acre',
    tag: 'TDA',
    region: 'Acre',
    elo: 1750,
    wins: 12,
    losses: 18,
    is_recruiting: true,
    members: [
      {
        user_id: '15',
        role: 'IGL',
        user: {
          nickname: 'ThunderAcre',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThunderAcre'
        }
      },
      {
        user_id: '16',
        role: 'Entry',
        user: {
          nickname: 'LightningFast',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LightningFast'
        }
      },
      {
        user_id: '17',
        role: 'Support',
        user: {
          nickname: 'StormSupport',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StormSupport'
        }
      }
    ]
  },
  {
    id: '6',
    name: 'Falcões de Roraima',
    tag: 'FDR',
    region: 'Roraima',
    elo: 2200,
    wins: 28,
    losses: 5,
    is_recruiting: false,
    members: [
      {
        user_id: '18',
        role: 'IGL',
        user: {
          nickname: 'FalconLeader',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FalconLeader'
        }
      },
      {
        user_id: '19',
        role: 'AWPer',
        user: {
          nickname: 'EagleEye',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EagleEye'
        }
      },
      {
        user_id: '20',
        role: 'Entry',
        user: {
          nickname: 'SwiftStrike',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SwiftStrike'
        }
      },
      {
        user_id: '21',
        role: 'Support',
        user: {
          nickname: 'WingSupport',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WingSupport'
        }
      },
      {
        user_id: '22',
        role: 'Lurker',
        user: {
          nickname: 'ShadowFalcon',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowFalcon'
        }
      }
    ]
  },
  {
    id: '7',
    name: 'Cobras do Amapá',
    tag: 'CDA',
    region: 'Amapá',
    elo: 1920,
    wins: 19,
    losses: 11,
    is_recruiting: true,
    members: [
      {
        user_id: '23',
        role: 'IGL',
        user: {
          nickname: 'ViperCommand',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ViperCommand'
        }
      },
      {
        user_id: '24',
        role: 'AWPer',
        user: {
          nickname: 'CobraStrike',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CobraStrike'
        }
      },
      {
        user_id: '25',
        role: 'Entry',
        user: {
          nickname: 'VenomRush',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VenomRush'
        }
      },
      {
        user_id: '26',
        role: 'Support',
        user: {
          nickname: 'PoisonSmoke',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PoisonSmoke'
        }
      }
    ]
  },
  {
    id: '8',
    name: 'Onças de Tocantins',
    tag: 'ODT',
    region: 'Tocantins',
    elo: 1680,
    wins: 10,
    losses: 20,
    is_recruiting: true,
    members: [
      {
        user_id: '27',
        role: 'IGL',
        user: {
          nickname: 'JaguarBoss',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaguarBoss'
        }
      },
      {
        user_id: '28',
        role: 'Support',
        user: {
          nickname: 'SpotHelper',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpotHelper'
        }
      }
    ]
  }
];