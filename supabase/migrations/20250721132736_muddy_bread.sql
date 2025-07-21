/*
  # Correção da tabela users e sistema de autenticação

  1. Correções na tabela users
    - Adiciona colunas faltantes se não existirem
    - Corrige constraints e índices
    - Configura triggers para criação automática de usuários

  2. Segurança
    - Configura RLS adequadamente
    - Adiciona políticas de segurança
    - Cria função RPC para buscar dados do usuário

  3. Times fictícios
    - Insere times com nomes da região Norte
    - Configura dados realistas para demonstração
*/

-- Verificar e corrigir estrutura da tabela users
DO $$
BEGIN
    -- Adicionar colunas faltantes se não existirem
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='auth_id') THEN
        ALTER TABLE public.users ADD COLUMN auth_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='partidas_jogadas') THEN
        ALTER TABLE public.users ADD COLUMN partidas_jogadas INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='vitorias') THEN
        ALTER TABLE public.users ADD COLUMN vitorias INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='derrotas') THEN
        ALTER TABLE public.users ADD COLUMN derrotas INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='status') THEN
        ALTER TABLE public.users ADD COLUMN status TEXT DEFAULT 'ativo';
    END IF;
END $$;

-- Criar constraint única para auth_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name='users' AND constraint_name='users_auth_id_unique') THEN
        -- Remover duplicatas antes de criar constraint
        DELETE FROM public.users a USING public.users b 
        WHERE a.id > b.id AND a.auth_id = b.auth_id AND a.auth_id IS NOT NULL;
        
        ALTER TABLE public.users ADD CONSTRAINT users_auth_id_unique UNIQUE (auth_id);
    END IF;
END $$;

-- Criar foreign key para auth_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name='users' AND constraint_name='users_auth_id_fkey') THEN
        ALTER TABLE public.users ADD CONSTRAINT users_auth_id_fkey 
        FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Função para criar automaticamente usuário na tabela public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    auth_id,
    nickname,
    avatar_url,
    city,
    elo,
    elo_points,
    partidas_jogadas,
    vitorias,
    derrotas,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'Player_' || substring(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'city',
    1000,
    0,
    0,
    0,
    0,
    'ativo',
    NOW(),
    NOW()
  )
  ON CONFLICT (auth_id) DO UPDATE SET
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao inserir usuário: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover e recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função RPC para obter dados completos do usuário
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS TABLE (
  id UUID,
  auth_id UUID,
  steam_id TEXT,
  nickname TEXT,
  avatar_url TEXT,
  profile_cover_url TEXT,
  city TEXT,
  elo INTEGER,
  elo_points INTEGER,
  rank INTEGER,
  team_id UUID,
  partidas_jogadas INTEGER,
  vitorias INTEGER,
  derrotas INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.auth_id,
    u.steam_id,
    u.nickname,
    u.avatar_url,
    u.profile_cover_url,
    u.city,
    u.elo,
    u.elo_points,
    u.rank,
    u.team_id,
    u.partidas_jogadas,
    u.vitorias,
    u.derrotas,
    u.status,
    u.created_at,
    u.updated_at
  FROM public.users u
  WHERE u.auth_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de segurança
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON public.users;
CREATE POLICY "Usuários podem inserir seus próprios dados" ON public.users
  FOR INSERT WITH CHECK (auth_id = auth.uid());

DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON public.users;
CREATE POLICY "Usuários podem ver todos os perfis" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem editar apenas seu próprio perfil" ON public.users;
CREATE POLICY "Usuários podem editar apenas seu próprio perfil" ON public.users
  FOR UPDATE USING (auth_id = auth.uid());

-- Garantir permissões
GRANT EXECUTE ON FUNCTION public.get_current_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user() TO anon;

-- Inserir times fictícios da região Norte
INSERT INTO public.teams (name, tag, description, region, elo, wins, losses, is_recruiting, logo_url) VALUES
('Mapinguari eSports', 'MAP', 'Lendários guerreiros da floresta amazônica, especializados em táticas de emboscada e controle territorial.', 'Amazonas', 2150, 28, 12, true, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center'),
('Cobra D''água Gaming', 'CDG', 'Equipe ágil e venenosa, conhecida por strikes rápidos e precisos como uma serpente amazônica.', 'Pará', 2089, 24, 16, true, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center'),
('Boto Cor-de-Rosa Team', 'BCR', 'Time místico das águas amazônicas, mestres em rotações fluidas e jogadas inesperadas.', 'Amazonas', 1987, 22, 18, false, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center'),
('Açaí Warriors', 'ACW', 'Guerreiros energizados pela força do açaí, especialistas em rushes coordenados e resistência.', 'Pará', 1856, 19, 21, true, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center'),
('Tucumã Snipers', 'TCS', 'Atiradores de elite inspirados na precisão necessária para colher o tucumã das palmeiras.', 'Roraima', 1923, 21, 19, true, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center'),
('Pirarucu Force', 'PRF', 'Força imponente como o maior peixe da Amazônia, dominando as águas do competitivo.', 'Amazonas', 1745, 17, 23, true, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center'),
('Guaraná Power', 'GPW', 'Energia pura do guaraná amazônico, time explosivo com jogadas energéticas e criativas.', 'Amazonas', 1678, 15, 25, false, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center'),
('Vitória-Régia Squad', 'VRS', 'Elegantes e resistentes como a flor símbolo da Amazônia, especialistas em defesas sólidas.', 'Amazonas', 1834, 18, 22, true, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center'),
('Curupira Legends', 'CRL', 'Protetores da floresta digital, conhecidos por confundir inimigos com táticas não convencionais.', 'Rondônia', 1567, 14, 26, true, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center'),
('Iara Mystic', 'IRM', 'Time encantador das águas amazônicas, especialistas em atrair inimigos para armadilhas mortais.', 'Pará', 1789, 16, 24, false, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center')
ON CONFLICT (name) DO NOTHING;

-- Inserir usuários existentes do auth na tabela users (método seguro)
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT au.id, au.raw_user_meta_data, au.created_at, au.updated_at
        FROM auth.users au
        LEFT JOIN public.users pu ON pu.auth_id = au.id
        WHERE pu.id IS NULL
    LOOP
        BEGIN
            INSERT INTO public.users (auth_id, nickname, avatar_url, city, elo, elo_points, partidas_jogadas, vitorias, derrotas, status, created_at, updated_at)
            VALUES (
                user_record.id,
                COALESCE(user_record.raw_user_meta_data->>'nickname', 'Player_' || substring(user_record.id::text, 1, 8)),
                user_record.raw_user_meta_data->>'avatar_url',
                user_record.raw_user_meta_data->>'city',
                1000,
                0,
                0,
                0,
                0,
                'ativo',
                user_record.created_at,
                COALESCE(user_record.updated_at, user_record.created_at)
            );
        EXCEPTION
            WHEN unique_violation THEN
                CONTINUE;
            WHEN OTHERS THEN
                RAISE WARNING 'Erro ao inserir usuário %: %', user_record.id, SQLERRM;
                CONTINUE;
        END;
    END LOOP;
END $$;