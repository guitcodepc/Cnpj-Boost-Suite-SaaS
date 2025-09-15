import { StatsCards } from './StatsCards';
import { CNPJForm } from './CNPJForm';
import { CNPJTable } from './CNPJTable';
import { useCNPJData } from '@/hooks/useCNPJData';
import { Button } from '@/components/ui/button';
import { Database, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const { cnpjs, stats, isLoading, enrichCNPJ, deleteCNPJ } = useCNPJData();
  const { toast } = useToast();

  const handleEnrich = async (cnpj: string) => {
    await enrichCNPJ(cnpj);
  };

  const handleExport = () => {
    toast({
      title: 'Exportação Iniciada',
      description: 'Os dados serão exportados em breve.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Database className="h-8 w-8" />
                CNPJ Enricher
              </h1>
              <p className="text-white/80 mt-2">
                Plataforma SaaS para enriquecimento de dados empresariais
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button 
                variant="outline"
                onClick={handleExport}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Relatório
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Form and Table Grid */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* CNPJ Form */}
            <div className="lg:col-span-4">
              <CNPJForm onEnrich={handleEnrich} isLoading={isLoading} />
            </div>

            {/* CNPJ Table */}
            <div className="lg:col-span-8">
              <CNPJTable cnpjs={cnpjs} onDelete={deleteCNPJ} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};