import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user && !error) {
        setCanReset(true);
      } else {
        setCanReset(false);
      }
      setChecking(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({ title: 'Erro ao redefinir senha', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Senha redefinida com sucesso!' });
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      toast({ title: 'Erro inesperado', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-hero px-4">
        <div className="max-w-md w-full card-gaming-highlight text-center">
          <h1 className="text-2xl font-bold text-gaming-gradient mb-2">Verificando sessão...</h1>
        </div>
      </div>
    );
  }

  if (!canReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-hero px-4">
        <div className="max-w-md w-full card-gaming-highlight text-center">
          <h1 className="text-2xl font-bold text-gaming-gradient mb-2">Link inválido ou expirado</h1>
          <p className="text-muted-foreground mb-4">Tente solicitar um novo link de redefinição de senha.</p>
          <Button onClick={() => navigate('/esqueci-senha')} className="btn-gaming">Solicitar novo link</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-hero px-4">
      <div className="max-w-md w-full">
        <div className="card-gaming-highlight">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gaming-gradient mb-2">Redefinir senha</h1>
            <p className="text-muted-foreground">Digite sua nova senha abaixo.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Nova senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-input border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-foreground">Confirmar senha</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="bg-input border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-gaming text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;