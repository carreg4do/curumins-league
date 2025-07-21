-- Função para criar automaticamente um usuário na tabela public.users
-- quando um novo usuário é criado no auth.users
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
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'Player_' || substring(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'city',
    1000, -- ELO inicial
    0,    -- Pontos ELO iniciais
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando um novo usuário é criado
CREATE OR REPLACE TRIGGER on_auth_user_created
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
    u.created_at,
    u.updated_at
  FROM public.users u
  WHERE u.auth_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para permitir que usuários vejam seus próprios dados
CREATE POLICY "Usuários podem inserir seus próprios dados" ON public.users
  FOR INSERT WITH CHECK (auth_id = auth.uid());

-- Garantir que a função RPC seja acessível
GRANT EXECUTE ON FUNCTION public.get_current_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user() TO anon;