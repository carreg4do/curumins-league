import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface AuthLog {
  timestamp: string;
  type: 'info' | 'error' | 'success' | 'warning';
  message: string;
  details?: any;
}

export const AuthDebug = () => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  const addLog = (type: AuthLog['type'], message: string, details?: any) => {
    const newLog: AuthLog = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Manter apenas os últimos 50 logs
  };

  const checkSession = async () => {
    try {
      addLog('info', 'Verificando sessão do Supabase...');
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error) {
        addLog('error', 'Erro ao obter sessão', error);
        return;
      }
      
      setSessionInfo(session);
      
      if (session.session) {
        addLog('success', 'Sessão ativa encontrada');
        
        // Verificar se usuário existe na tabela users
        const { data: userFromTable, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.session.user.id)
          .single();
        
        if (userFromTable) {
          addLog('success', 'Usuário encontrado na tabela users', userFromTable);
        } else {
          addLog('warning', 'Usuário não encontrado na tabela users', userError);
        }
      } else {
        addLog('warning', 'Nenhuma sessão ativa');
      }
    } catch (error) {
      addLog('error', 'Erro ao verificar sessão', error);
    }
  };

  const testRPC = async () => {
    try {
      addLog('info', 'Testando função RPC get_current_user...');
      const { data, error } = await supabase.rpc('get_current_user');
      
      if (error) {
        addLog('error', 'Erro na função RPC', error);
      } else {
        addLog('success', 'Função RPC executada com sucesso', data);
      }
    } catch (error) {
      addLog('error', 'Erro ao executar RPC', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Logs limpos');
  };

  useEffect(() => {
    addLog('info', 'Componente AuthDebug inicializado');
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      addLog('success', 'Usuário carregado no contexto', user);
    } else {
      addLog('warning', 'Nenhum usuário no contexto');
    }
  }, [user]);

  const getLogColor = (type: AuthLog['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-2">
            Debug Auth
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-96 max-h-96 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Status da Autenticação
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={refreshUser}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={checkSession}>
                    Verificar
                  </Button>
                  <Button size="sm" variant="outline" onClick={testRPC}>
                    RPC
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="flex gap-2 text-xs">
                <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                  {isAuthenticated ? 'Autenticado' : 'Não autenticado'}
                </Badge>
                <Badge variant={isLoading ? 'outline' : 'secondary'}>
                  {isLoading ? 'Carregando...' : 'Carregado'}
                </Badge>
              </div>
              
              {showDetails && (
                <div className="text-xs space-y-1">
                  <div><strong>Usuário:</strong> {user?.nickname || 'N/A'}</div>
                  <div><strong>ID:</strong> {user?.id || 'N/A'}</div>
                  <div><strong>Auth ID:</strong> {user?.auth_id || 'N/A'}</div>
                  <div><strong>Sessão:</strong> {sessionInfo?.session ? 'Ativa' : 'Inativa'}</div>
                </div>
              )}
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium">Logs ({logs.length})</span>
                  <Button size="sm" variant="ghost" onClick={clearLogs} className="h-6 px-2 text-xs">
                    Limpar
                  </Button>
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 ${getLogColor(log.type)}`} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-mono">{log.timestamp}</span>
                        </div>
                        <div>{log.message}</div>
                        {log.details && showDetails && (
                          <pre className="text-xs bg-muted p-1 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};