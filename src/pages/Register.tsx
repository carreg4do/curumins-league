import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { loginWithSteam } from '@/integrations/steam/steamAuth';
import { mockRegister, mockSteamLogin } from '@/utils/mockAuth';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    city: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.nickname.trim()) {
      toast({
        title: "Erro",
        description: "Nome de usuário é obrigatório",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Tentar registro mock primeiro (mais confiável para desenvolvimento)
      const mockResult = await mockRegister({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        city: formData.city
      });
      
      if (mockResult.success && mockResult.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: `Bem-vindo à Liga Norte, ${mockResult.user.nickname}!`
        });

        // Atualizar contexto de autenticação
        await refreshUser();
        
        // Redirecionar para dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        return;
      } else {
        // Se o mock falhar, tentar Supabase
        try {
          const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                nickname: formData.nickname,
                city: formData.city
              }
            }
          });

          if (!error && data.user) {
            // Verificar se o usuário precisa confirmar email
            if (!data.session) {
              toast({
                title: "Conta criada com sucesso!",
                description: "Verifique seu email para confirmar a conta e depois faça login."
              });
              
              // Aguardar um pouco antes de redirecionar
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            } else {
              // Usuário já está logado (confirmação automática)
              toast({
                title: "Conta criada com sucesso!",
                description: "Bem-vindo à Liga Norte!"
              });
              
              // Atualizar contexto de autenticação
              await refreshUser();
              
              // Redirecionar para dashboard
              setTimeout(() => {
                navigate('/dashboard');
              }, 1000);
            }
            return;
          }
          
          if (error) {
            throw error;
          }
        } catch (supabaseError: any) {
          console.log('Erro no Supabase:', supabaseError);
          throw new Error(mockResult.error || 'Erro ao criar conta');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSteamLogin = async () => {
    try {
      // Tentar login Steam real primeiro
      try {
        loginWithSteam();
      } catch (steamError: any) {
        console.log('Erro no Steam real, usando Steam mock:', steamError);
        
        // Fallback para Steam mock
        setIsLoading(true);
        const mockResult = await mockSteamLogin();
        
        if (mockResult.success && mockResult.user) {
          toast({
            title: "Login Steam realizado com sucesso!",
            description: `Bem-vindo, ${mockResult.user.nickname}!`
          });

          // Atualizar contexto de autenticação
          await refreshUser();
          
          // Aguardar um pouco para o contexto ser atualizado
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        } else {
          throw new Error(mockResult.error || 'Erro no login Steam');
        }
        
        setIsLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar login Steam",
        description: error.message || "Não foi possível iniciar o login via Steam",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-hero px-4">
      <div className="max-w-md w-full">
        <div className="card-gaming-highlight">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gaming-gradient mb-2">
              Criar Conta
            </h1>
            <p className="text-muted-foreground">
              Junte-se à Liga Norte e comece a dominar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-foreground">Nome de Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nickname"
                  type="text"
                  placeholder="SeuNickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">Cidade (Opcional)</Label>
              <Input
                id="city"
                type="text"
                placeholder="Ex: Manaus, AM"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="bg-input border-border focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 pr-10 bg-input border-border focus:border-primary focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-gaming text-lg py-3"
              disabled={isLoading}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
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
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-glow font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;