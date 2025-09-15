import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CNPJData } from '@/types/cnpj';
import { Eye, Trash2, Search, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CNPJTableProps {
  cnpjs: CNPJData[];
  onDelete: (id: string) => void;
}

const StatusBadge = ({ status }: { status: CNPJData['situacao'] }) => {
  const variants = {
    ATIVA: 'bg-success/10 text-success border-success/20',
    SUSPENSA: 'bg-warning/10 text-warning border-warning/20',
    INAPTA: 'bg-destructive/10 text-destructive border-destructive/20',
    BAIXADA: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status}
    </Badge>
  );
};

const PorteBadge = ({ porte }: { porte: CNPJData['porte'] }) => {
  const variants = {
    MEI: 'bg-blue-50 text-blue-700 border-blue-200',
    MICRO: 'bg-green-50 text-green-700 border-green-200',
    PEQUENO: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    MEDIO: 'bg-purple-50 text-purple-700 border-purple-200',
    GRANDE: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <Badge variant="outline" className={variants[porte]}>
      {porte}
    </Badge>
  );
};

const CNPJDetails = ({ cnpj }: { cnpj: CNPJData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-foreground mb-2">Informações Básicas</h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">CNPJ:</span> {cnpj.cnpj}</p>
          <p><span className="font-medium">Razão Social:</span> {cnpj.razaoSocial}</p>
          {cnpj.nomeFantasia && (
            <p><span className="font-medium">Nome Fantasia:</span> {cnpj.nomeFantasia}</p>
          )}
          <p><span className="font-medium">Situação:</span> <StatusBadge status={cnpj.situacao} /></p>
          <p><span className="font-medium">Data de Abertura:</span> {new Date(cnpj.dataAbertura).toLocaleDateString('pt-BR')}</p>
          <p><span className="font-medium">Porte:</span> <PorteBadge porte={cnpj.porte} /></p>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-foreground mb-2">Endereço</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{cnpj.endereco.logradouro}, {cnpj.endereco.numero}</p>
          {cnpj.endereco.complemento && <p>{cnpj.endereco.complemento}</p>}
          <p>{cnpj.endereco.bairro}</p>
          <p>{cnpj.endereco.cidade} - {cnpj.endereco.uf}</p>
          <p>CEP: {cnpj.endereco.cep}</p>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">Detalhes Comerciais</h4>
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Atividade Principal:</span> {cnpj.atividadePrincipal}</p>
        <p><span className="font-medium">Natureza Jurídica:</span> {cnpj.naturezaJuridica}</p>
        <p><span className="font-medium">Capital Social:</span> {cnpj.capitalSocial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        {cnpj.telefone && <p><span className="font-medium">Telefone:</span> {cnpj.telefone}</p>}
        {cnpj.email && <p><span className="font-medium">E-mail:</span> {cnpj.email}</p>}
      </div>
    </div>

    {cnpj.socios && cnpj.socios.length > 0 && (
      <div>
        <h4 className="font-semibold text-foreground mb-2">Sócios</h4>
        <div className="space-y-2">
          {cnpj.socios.map((socio, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm">{socio.nome}</span>
              <Badge variant="outline">{socio.participacao}%</Badge>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export const CNPJTable = ({ cnpjs, onDelete }: CNPJTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCNPJs = cnpjs.filter(cnpj =>
    cnpj.cnpj.includes(searchTerm) ||
    cnpj.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cnpj.nomeFantasia && cnpj.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              CNPJs Enriquecidos
            </CardTitle>
            <CardDescription>
              {cnpjs.length} empresas cadastradas
            </CardDescription>
          </div>
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por CNPJ ou razão social..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCNPJs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {cnpjs.length === 0 ? 'Nenhum CNPJ enriquecido ainda.' : 'Nenhum resultado encontrado.'}
            </div>
          ) : (
            filteredCNPJs.map((cnpj) => (
              <div key={cnpj.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-elevated transition-all duration-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{cnpj.razaoSocial}</p>
                      <p className="text-sm text-muted-foreground font-mono">{cnpj.cnpj}</p>
                    </div>
                    <StatusBadge status={cnpj.situacao} />
                    <PorteBadge porte={cnpj.porte} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cnpj.endereco.cidade} - {cnpj.endereco.uf} • {cnpj.atividadePrincipal}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{cnpj.razaoSocial}</DialogTitle>
                        <DialogDescription>
                          Detalhes completos da empresa
                        </DialogDescription>
                      </DialogHeader>
                      <CNPJDetails cnpj={cnpj} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(cnpj.id)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};