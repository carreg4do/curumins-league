import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentMockUser } from '@/utils/mockAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AuthTest = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [mockUser, setMockUser] = useState<any>(null);

  const checkSupabaseSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSupabaseSession(data.session);
  };

  const checkMockUser = () => {
    const mock = getCurrentMockUser();
    setMockUser(mock);
  };

  return (
    <div className="min-h-screen bg-gaming-hero p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Teste de Autenticação</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Estado do AuthContext */}
          <div className="card-gaming">
            <h2 className="text-xl font-semibold mb-4 text-primary">AuthContext</h2>
            <div className="space-y-2 text-sm">
              <div><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</div>
              <div><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</div>
              <div><strong>user:</strong></div>
              <pre className="bg-muted/20 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          {/* Sessão do Supabase */}
          <div className="card-gaming">
            <h2 className="text-xl font-semibold mb-4 text-secondary">Supabase Session</h2>
            <Button onClick={checkSupabaseSession} className="mb-4 btn-gaming">
              Verificar Sessão
            </Button>
            <div className="text-sm">
              <pre className="bg-muted/20 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(supabaseSession, null, 2)}
              </pre>
            </div>
          </div>

          {/* Usuário Mock */}
          <div className="card-gaming">
            <h2 className="text-xl font-semibold mb-4 text-accent">Mock User</h2>
            <Button onClick={checkMockUser} className="mb-4 btn-gaming">
              Verificar Mock
            </Button>
            <div className="text-sm">
              <pre className="bg-muted/20 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(mockUser, null, 2)}
              </pre>
            </div>
          </div>

          {/* LocalStorage */}
          <div className="card-gaming">
            <h2 className="text-xl font-semibold mb-4 text-success">LocalStorage</h2>
            <div className="space-y-2 text-sm">
              <div><strong>current_user:</strong></div>
              <pre className="bg-muted/20 p-2 rounded text-xs overflow-auto">
                {localStorage.getItem('current_user') || 'null'}
              </pre>
              <div><strong>mock_users:</strong></div>
              <pre className="bg-muted/20 p-2 rounded text-xs overflow-auto">
                {localStorage.getItem('mock_users') || 'null'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;