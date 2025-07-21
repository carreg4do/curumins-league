-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  steam_id TEXT UNIQUE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  profile_cover_url TEXT,
  city TEXT,
  elo INTEGER DEFAULT 1000,
  elo_points INTEGER DEFAULT 0,
  rank INTEGER,
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criação da tabela de times
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  description TEXT,
  elo INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  region TEXT,
  is_recruiting BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adiciona a referência de time_id na tabela users
ALTER TABLE public.users ADD CONSTRAINT fk_team
  FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- Criação da tabela de membros do time
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('captain', 'player', 'coach', 'manager')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Criação da tabela de solicitações de time
CREATE TABLE IF NOT EXISTS public.team_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Criação da tabela de torneios
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  prize TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'finished')),
  max_teams INTEGER,
  registration_start TIMESTAMP WITH TIME ZONE,
  registration_end TIMESTAMP WITH TIME ZONE,
  tournament_start TIMESTAMP WITH TIME ZONE,
  tournament_end TIMESTAMP WITH TIME ZONE,
  game_mode TEXT,
  maps TEXT[],
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criação da tabela de inscrições em torneios
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('registered', 'confirmed', 'disqualified')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tournament_id, team_id)
);

-- Criação da tabela de partidas
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  team_a_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_b_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_a_score INTEGER DEFAULT 0,
  team_b_score INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  match_type TEXT NOT NULL CHECK (match_type IN ('tournament', 'matchmaking')),
  map TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criação da tabela de estatísticas de jogador por partida
CREATE TABLE IF NOT EXISTS public.player_match_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  headshots INTEGER DEFAULT 0,
  mvps INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(match_id, user_id)
);

-- Criação da tabela de fila de matchmaking
CREATE TABLE IF NOT EXISTS public.matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  game_mode TEXT NOT NULL,
  map_preference TEXT,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'matched', 'cancelled')),
  queue_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criação da tabela de conquistas
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criação da tabela de conquistas do usuário
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Políticas RLS para segurança

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver todos os perfis" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem editar apenas seu próprio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Políticas para times
CREATE POLICY "Qualquer um pode ver times" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Apenas capitães podem editar times" ON public.teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.teams.id
      AND user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
      AND role = 'captain'
    )
  );

CREATE POLICY "Usuários autenticados podem criar times" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para membros de time
CREATE POLICY "Qualquer um pode ver membros de time" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Apenas capitães podem gerenciar membros" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.team_members.team_id
      AND user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
      AND role = 'captain'
    )
  );

-- Políticas para solicitações de time
CREATE POLICY "Usuários podem ver suas próprias solicitações" ON public.team_requests
  FOR SELECT USING (
    user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.team_requests.team_id
      AND user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
      AND role = 'captain'
    )
  );

CREATE POLICY "Usuários podem criar solicitações" ON public.team_requests
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Capitães podem atualizar solicitações" ON public.team_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.team_requests.team_id
      AND user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
      AND role = 'captain'
    )
  );

-- Políticas para torneios
CREATE POLICY "Qualquer um pode ver torneios" ON public.tournaments
  FOR SELECT USING (true);

-- Políticas para inscrições em torneios
CREATE POLICY "Qualquer um pode ver inscrições em torneios" ON public.tournament_registrations
  FOR SELECT USING (true);

CREATE POLICY "Capitães podem inscrever times em torneios" ON public.tournament_registrations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.tournament_registrations.team_id
      AND user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
      AND role = 'captain'
    )
  );

-- Políticas para partidas
CREATE POLICY "Qualquer um pode ver partidas" ON public.matches
  FOR SELECT USING (true);

-- Políticas para estatísticas de jogador
CREATE POLICY "Qualquer um pode ver estatísticas de jogador" ON public.player_match_stats
  FOR SELECT USING (true);

-- Políticas para fila de matchmaking
CREATE POLICY "Usuários podem ver sua própria fila" ON public.matchmaking_queue
  FOR SELECT USING (
    user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Usuários podem entrar na fila" ON public.matchmaking_queue
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Usuários podem atualizar sua própria fila" ON public.matchmaking_queue
  FOR UPDATE USING (
    user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
  );

-- Políticas para conquistas
CREATE POLICY "Qualquer um pode ver conquistas" ON public.achievements
  FOR SELECT USING (true);

-- Políticas para conquistas de usuário
CREATE POLICY "Qualquer um pode ver conquistas de usuário" ON public.user_achievements
  FOR SELECT USING (true);

-- Funções e gatilhos

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gatilhos para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_requests_updated_at
  BEFORE UPDATE ON public.team_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matchmaking_queue_updated_at
  BEFORE UPDATE ON public.matchmaking_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Função para atualizar o rank do usuário com base no elo
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza o rank do usuário com base no elo
  UPDATE public.users
  SET rank = subquery.rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY elo DESC) as rank
    FROM public.users
  ) as subquery
  WHERE public.users.id = subquery.id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Gatilho para atualizar o rank quando o elo é alterado
CREATE TRIGGER update_user_rank_on_elo_change
  AFTER UPDATE OF elo ON public.users
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_user_rank();

-- Gatilho para atualizar o rank quando um novo usuário é inserido
CREATE TRIGGER update_user_rank_on_insert
  AFTER INSERT ON public.users
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_user_rank();