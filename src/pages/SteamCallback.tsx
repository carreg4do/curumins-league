import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processSteamCallback, fetchSteamProfile, authenticateWithSteam } from '@/integrations/steam/steamAuth';
import { useToast } from '@/hooks/use-toast';

const SteamCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Extrai o SteamID da URL de callback
        const steamId = processSteamCallback(window.location.href);
        
        if (!steamId) {
          throw new Error('Não foi possível obter o SteamID');
        }

        // Busca informações do perfil Steam
        const steamProfile = await fetchSteamProfile(steamId);
        
        if (!steamProfile) {
          throw new Error('Não foi possível obter o perfil Steam');
        }

        // Autentica o usuário no Supabase
        const authData = await authenticateWithSteam(steamId, steamProfile);
        
        if (!authData) {
          throw new Error('Falha na autenticação com o Supabase');
        }

        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${steamProfile.personaname || 'jogador'}!`
        });

        // Redireciona para o dashboard
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Erro no processo de autenticação Steam:', err);
        setError(err.message || 'Ocorreu um erro durante a autenticação');
        toast({
          title: "Erro na autenticação",
          description: err.message || 'Ocorreu um erro durante a autenticação',
          variant: "destructive"
        });
        
        // Redireciona para a página de login após alguns segundos
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-hero px-4">
      <div className="max-w-md w-full">
        <div className="card-gaming-highlight text-center p-8">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gaming-gradient mb-2">Autenticando</h2>
              <p className="text-muted-foreground">Processando login via Steam...</p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-destructive mb-2">Erro na Autenticação</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <p className="text-sm text-muted-foreground">Redirecionando para a página de login...</p>
            </>
          ) : (
            <>
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gaming-gradient mb-2">Login Bem-sucedido</h2>
              <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SteamCallback;