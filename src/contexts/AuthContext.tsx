import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    setIsLoading(true);
    
    try {
      // Verificar sessão do Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        // Buscar dados do usuário usando RPC
        const { data: userFromTable, error: rpcError } = await supabase
          .rpc('get_current_user');
        
        if (userFromTable && userFromTable.length > 0) {
          const userProfile = userFromTable[0];
          setUser(userProfile);
          setIsAuthenticated(true);
          return;
        }
        
        // Se não encontrou, o trigger deve criar automaticamente
        // Aguardar um pouco e tentar novamente
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: retryUser } = await supabase.rpc('get_current_user');
        
        if (retryUser && retryUser.length > 0) {
          setUser(retryUser[0]);
          setIsAuthenticated(true);
          return;
        }
      }
      
      // Fallback para sistema mock
      const mockUser = getCurrentMockUser();
      if (mockUser) {
        const userProfile = {
          id: mockUser.id,
          auth_id: mockUser.id,
          steam_id: mockUser.steamId,
          nickname: mockUser.nickname || 'Jogador',
          avatar_url: mockUser.avatar_url,
          city: mockUser.city,
          elo: 1000,
          elo_points: 0,
          partidas_jogadas: 0,
          vitorias: 0,
          derrotas: 0,
          status: 'ativo',
          rank: null,
          team_id: null,
          profile_cover_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(userProfile);
        setIsAuthenticated(true);
        return;
      }
      
      // Nenhum usuário encontrado
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      
      // Em caso de erro, tentar sistema mock
      const mockUser = getCurrentMockUser();
      if (mockUser) {
        const userProfile = {
          id: mockUser.id,
          auth_id: mockUser.id,
          steam_id: mockUser.steamId,
          nickname: mockUser.nickname || 'Jogador',
          avatar_url: mockUser.avatar_url,
          city: mockUser.city,
          elo: 1000,
          elo_points: 0,
          partidas_jogadas: 0,
          vitorias: 0,
          derrotas: 0,
          status: 'ativo',
          rank: null,
          team_id: null,
          profile_cover_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
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
  };

  useEffect(() => {
    fetchUserData();

    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchUserData();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
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