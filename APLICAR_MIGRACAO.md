# 🔧 Instruções para Aplicar a Migração Manualmente

## Problema Identificado
O sistema não está inserindo automaticamente usuários na tabela `public.users` após o registro no `auth.users`. Isso causa falhas no login e carregamento de dados.

## Solução
Criamos uma migração que adiciona:
1. **Trigger automático** para inserir na tabela `users` quando um usuário se registra
2. **Função RPC** para buscar dados completos do usuário
3. **Políticas de segurança** adequadas

## Como Aplicar a Migração

### Opção 1: Via Supabase Dashboard (Recomendado)
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para seu projeto
3. Navegue até **SQL Editor**
4. Cole o código abaixo e execute:

```sql
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
```

### Opção 2: Via CLI do Supabase
```bash
cd "c:\Users\Usuario\Documents\projetos site\liga norte gaming\north-strike-nexus-main"
supabase db push
```

## Verificação
Após aplicar a migração:

1. **Teste o registro**: Crie uma nova conta
2. **Verifique no dashboard**: Vá para **Table Editor > users** e confirme que o usuário foi inserido
3. **Teste o login**: Faça login com a conta criada
4. **Use o Debug**: O componente AuthDebug no canto inferior direito mostrará logs detalhados

## Correção para Usuários Existentes
Se você já tem usuários no `auth.users` que não estão na tabela `users`, execute:

```sql
-- Inserir usuários existentes do auth na tabela users
INSERT INTO public.users (auth_id, nickname, avatar_url, city, elo, elo_points, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'nickname', 'Player_' || substring(au.id::text, 1, 8)),
  au.raw_user_meta_data->>'avatar_url',
  au.raw_user_meta_data->>'city',
  1000,
  0,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.auth_id = au.id
WHERE pu.id IS NULL;
```

## Logs e Debug

### Onde Ver os Logs
1. **Console do Navegador**: Pressione F12 > Console
2. **Componente AuthDebug**: Canto inferior direito da tela
3. **Supabase Dashboard**: Logs > Auth/API

### Mensagens de Erro Comuns
- `"Usuário não encontrado na tabela users"` → Aplicar migração
- `"Erro ao inserir usuário na tabela users"` → Verificar políticas RLS
- `"Função RPC não encontrada"` → Aplicar migração

## Melhorias Implementadas

✅ **Trigger automático** para inserção na tabela users  
✅ **Função RPC** para buscar dados completos  
✅ **AuthContext melhorado** com fallbacks e logs  
✅ **Componente de debug** para troubleshooting  
✅ **Tratamento de erros** robusto  
✅ **Políticas de segurança** adequadas  

## Próximos Passos
1. Aplicar a migração
2. Testar registro e login
3. Verificar funcionamento do dashboard
4. Remover componente AuthDebug em produção