import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { loginWithSteam } from '@/integrations/steam/steamAuth';
import { mockLogin, mockSteamLogin } from '@/utils/mockAuth';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tentar login com Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta à Liga Norte."
          });

          // Aguardar atualização do contexto
          await refreshUser();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          navigate('/dashboard');
          return;
        }
        
        if (error) {
          throw error;
        }
      } catch (supabaseError: any) {
        // Fallback para sistema mock
        const mockResult = await mockLogin(email, password);
        
        if (mockResult.success && mockResult.user) {
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo de volta, ${mockResult.user.nickname}!`
          });

          await refreshUser();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          navigate('/dashboard');
          return;
        } else {
          throw new Error(mockResult.error || 'Credenciais inválidas');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSteamLogin = async () => {
    setIsLoading(true);
    
    try {
      try {
        loginWithSteam();
      } catch (steamError: any) {
        const mockResult = await mockSteamLogin();
        
        if (mockResult.success && mockResult.user) {
          toast({
            title: "Login Steam realizado com sucesso!",
            description: `Bem-vindo, ${mockResult.user.nickname}!`
          });

          await refreshUser();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          navigate('/dashboard');
        } else {
          throw new Error(mockResult.error || 'Erro no login Steam');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar login Steam",
        description: error.message || "Não foi possível iniciar o login via Steam",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-hero px-4">
      <div className="max-w-md w-full">
        <div className="card-gaming-highlight">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gaming-gradient mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Entre na sua conta e continue dominando
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <Label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                  Lembrar de mim
                </Label>
              </div>
              <Link to="/esqueci-senha" className="text-sm text-primary hover:text-primary-glow">
                Esqueci a senha
              </Link>
            </div>

            <Button type="submit" className="w-full btn-gaming text-lg py-3" disabled={isLoading}>
              <LogIn className="h-5 w-5 mr-2" />
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                type="button"
                variant="outline" 
                className="w-full hover:border-primary/50"
                onClick={handleSteamLogin}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142s0-.009 0-.009V8.252c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4h-.028l-4.132 2.885c0 .031.002.061.002.092 0 1.872-1.521 3.393-3.393 3.393-1.624 0-2.973-1.14-3.306-2.67L1.498 14.002C3.024 19.23 7.043 23.248 11.979 24c6.627 0 12.021-5.373 12.021-12S18.606.021 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.004-1.949s-.771-1.122-1.401-1.385c-.629-.263-1.319-.264-1.949-.004s-1.122.771-1.385 1.401c-.263.63-.264 1.319-.004 1.949s.771 1.122 1.401 1.385c.63.263 1.319.264 1.949.004zM18.407 8.252c0-1.458-1.182-2.64-2.64-2.64s-2.64 1.182-2.64 2.64 1.182 2.64 2.64 2.64 2.64-1.182 2.64-2.64zm-4.013 0c0-.756.617-1.373 1.373-1.373s1.373.617 1.373 1.373-.617 1.373-1.373 1.373-1.373-.617-1.373-1.373z"/>
                </svg>
                Steam
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
               <Link to="/register" className="text-primary hover:text-primary-glow font-medium">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;