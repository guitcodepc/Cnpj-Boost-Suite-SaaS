import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';

interface CNPJFormProps {
  onEnrich: (cnpj: string) => Promise<void>;
  isLoading: boolean;
}

export const CNPJForm = ({ onEnrich, isLoading }: CNPJFormProps) => {
  const [cnpj, setCnpj] = useState('');
  const { toast } = useToast();

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCNPJ(cnpj)) {
      toast({
        title: 'CNPJ Inválido',
        description: 'Por favor, insira um CNPJ válido com 14 dígitos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onEnrich(cnpj);
      setCnpj('');
      toast({
        title: 'CNPJ Enriquecido!',
        description: 'Os dados da empresa foram coletados com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enriquecer CNPJ',
        description: 'Não foi possível coletar os dados da empresa. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCNPJ(value);
    if (formatted.length <= 18) {
      setCnpj(formatted);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-soft border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Enriquecer CNPJ
        </CardTitle>
        <CardDescription>
          Digite um CNPJ para coletar dados completos da empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={handleCNPJChange}
              className="font-mono"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!validateCNPJ(cnpj) || isLoading}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enriquecendo...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Enriquecer CNPJ
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};