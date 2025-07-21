import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isSteamAuthenticated } from '@/integrations/steam/steamAuth';
import { Database } from '@/integrations/supabase/types';
import { getCurrentMockUser, mockLogout, MockUser } from '@/utils/mockAuth';

type User = Database['public']['Tables']['users']['Row'] & {
  city?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // Tentar carregar do Supabase primeiro
      try {
        // Primeiro verificar se há uma sessão ativa no Supabase
        const { data: session } = await supabase.auth.getSession();
        
        if (session.session) {
          console.log('Sessão ativa encontrada, buscando dados do usuário...');
          
          // Tentar buscar dados da tabela users usando RPC
          const { data: userFromTable, error: rpcError } = await supabase
            .rpc('get_current_user');
          
          if (userFromTable && userFromTable.length > 0) {
            const userProfile = userFromTable[0];
            console.log('Usuário carregado da tabela users:', userProfile);
            setUser(userProfile);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
          
          console.log('Usuário não encontrado na tabela users, tentando criar...', rpcError);
          
          // Se não encontrou na tabela users, tentar buscar do auth e criar entrada
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            console.log('Tentando criar usuário na tabela users para:', userData.user.id);
            
            // Tentar inserir o usuário na tabela users
            const { data: insertedUser, error: insertError } = await supabase
              .from('users')
              .insert({
                auth_id: userData.user.id,
                nickname: userData.user.user_metadata?.nickname || userData.user.email?.split('@')[0] || 'Jogador',
                avatar_url: userData.user.user_metadata?.avatar_url || null,
                city: userData.user.user_metadata?.city || null,
                elo: 1000,
                elo_points: 0
              })
              .select()
              .single();
            
            if (insertedUser) {
              console.log('✅ Usuário criado na tabela users:', insertedUser);
              setUser(insertedUser);
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            } else {
              console.error('❌ ERRO CRÍTICO: Falha ao inserir usuário na tabela users:', insertError);
              console.error('❌ SOLUÇÃO: Aplicar migração no Supabase Dashboard usando o arquivo APLICAR_AGORA.sql');
              
              // Fallback: criar perfil básico com dados do auth
              const userProfile = {
                id: userData.user.id,
                auth_id: userData.user.id,
                steam_id: userData.user.user_metadata?.steam_id || userData.user.email?.split('@')[0] || userData.user.id,
                nickname: userData.user.user_metadata?.nickname || userData.user.email?.split('@')[0] || 'Jogador',
                avatar_url: userData.user.user_metadata?.avatar_url || null,
                city: userData.user.user_metadata?.city || null,
                elo: 1000,
                elo_points: 0,
                rank: 1,
                team_id: null,
                created_at: userData.user.created_at,
                updated_at: userData.user.updated_at || userData.user.created_at
              };
              
              console.log('Usando perfil básico do auth:', userProfile);
              setUser(userProfile);
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (supabaseError) {
        console.log('Erro ao carregar do Supabase, verificando autenticação mock:', supabaseError);
      }
      
      // Fallback para autenticação mock
      const mockUser = getCurrentMockUser();
      if (mockUser) {
        const userProfile = {
          id: mockUser.id,
          steam_id: mockUser.steamId,
          nickname: mockUser.nickname || 'Jogador',
          avatar_url: mockUser.avatar_url,
          city: mockUser.city,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('Usuário mock carregado:', userProfile);
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        console.log('Nenhum usuário encontrado');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    console.log('Atualizando dados do usuário...');
    await fetchUserData();
    console.log('Dados do usuário atualizados.');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Erro ao fazer logout do Supabase:', error);
    }
    
    // Fazer logout do sistema mock também
    mockLogout();
    setUser(null);
    setIsAuthenticated(false);
    // Redirecionar para a página inicial após logout
    window.location.href = '/';
  };

  useEffect(() => {
    // Buscar dados do usuário ao montar o componente
    fetchUserData();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      await fetchUserData();
    });

    return () => {
      // Limpar listener ao desmontar
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};