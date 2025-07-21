import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Upload, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditProfileProps {
  user: {
    name: string;
    avatar: string;
    city: string;
  };
  onSave: (data: any) => void;
}

const EditProfile = ({ user, onSave }: EditProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user.name,
    avatar: user.avatar,
    coverImage: '',
    city: user.city,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    setIsOpen(false);
    toast({
      title: "Sucesso",
      description: "Perfil atualizado com sucesso!"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-gaming-gradient">Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-lg">{formData.nickname[0]}</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Alterar Foto
            </Button>
          </div>

          {/* Cover Image */}
          <div>
            <Label htmlFor="coverImage">Foto de Capa</Label>
            <div className="mt-1">
              <Button type="button" variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Escolher Imagem de Capa
              </Button>
            </div>
          </div>

          {/* Nickname */}
          <div>
            <Label htmlFor="nickname">Nome de Usuário</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              className="bg-input border-border"
              required
            />
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="bg-input border-border"
              placeholder="Ex: Manaus, AM"
            />
          </div>

          {/* Password Change */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-muted-foreground">Alterar Senha</h4>
            
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-input border-border"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="bg-input border-border"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="bg-input border-border"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1 btn-gaming">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;