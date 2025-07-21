import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nova-senha`
      });
      if (error) {
        toast({
          title: 'Erro ao enviar e-mail',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'E-mail enviado!',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.'
        });
      }
    } catch (err: any) {
      toast({
        title: 'Erro inesperado',
        description: err.message,
        variant: 'destructive'
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
            <h1 className="text-3xl font-bold text-gaming-gradient mb-2">Recuperar senha</h1>
            <p className="text-muted-foreground">Informe seu e-mail para receber o link de redefinição.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-input border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-gaming text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;