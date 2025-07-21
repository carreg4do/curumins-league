import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createTeam } from '@/integrations/teams/teamsService';

// Esquema de validação do formulário
const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome do time deve ter pelo menos 3 caracteres.",
  }).max(50, {
    message: "O nome do time não pode ter mais de 50 caracteres.",
  }),
  tag: z.string().min(2, {
    message: "A tag deve ter pelo menos 2 caracteres.",
  }).max(5, {
    message: "A tag não pode ter mais de 5 caracteres.",
  }),
  description: z.string().max(500, {
    message: "A descrição não pode ter mais de 500 caracteres.",
  }).optional(),
  region: z.string().min(1, {
    message: "Selecione uma região.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTeam = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar logado para criar um time.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tag: "",
      description: "",
      region: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um time.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await createTeam({
        name: values.name,
        tag: values.tag,
        description: values.description,
        region: values.region,
        userId: user.id,
      });

      if (result.success && result.teamId) {
        toast({
          title: "Time criado com sucesso!",
          description: "Seu time foi criado e você foi definido como capitão.",
          variant: "default",
        });
        navigate(`/teams/${result.teamId}`);
      } else {
        toast({
          title: "Erro ao criar time",
          description: result.error || "Não foi possível criar o time. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao criar time:", error);
      toast({
        title: "Erro ao criar time",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const regions = [
    "Norte",
    "Nordeste",
    "Centro-Oeste",
    "Sudeste",
    "Sul",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Criar Time
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Informações do Time</CardTitle>
              <CardDescription>
                Preencha os dados para criar seu time. Você será automaticamente definido como capitão (IGL).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Time</FormLabel>
                          <FormControl>
                            <Input placeholder="North Strike Nexus" {...field} />
                          </FormControl>
                          <FormDescription>
                            Nome completo do seu time.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag</FormLabel>
                          <FormControl>
                            <Input placeholder="NSN" {...field} />
                          </FormControl>
                          <FormDescription>
                            Abreviação do nome do time (2-5 caracteres).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Região</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma região" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Região principal do seu time.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte um pouco sobre seu time, objetivos e estilo de jogo..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Uma breve descrição do seu time (opcional).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/teams')}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="btn-gaming"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        'Criar Time'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;