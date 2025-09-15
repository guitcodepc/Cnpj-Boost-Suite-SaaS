import { useState, useCallback, useMemo } from 'react';
import { CNPJData, CNPJStats } from '@/types/cnpj';

// Mock data for demonstration
const mockCNPJData: CNPJData[] = [
  {
    id: '1',
    cnpj: '11.222.333/0001-81',
    razaoSocial: 'TECH SOLUTIONS LTDA',
    nomeFantasia: 'TechSol',
    situacao: 'ATIVA',
    dataAbertura: '2020-03-15',
    naturezaJuridica: 'Sociedade Empresária Limitada',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: 'Sala 101',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100'
    },
    telefone: '(11) 99999-9999',
    email: 'contato@techsol.com.br',
    capitalSocial: 100000,
    porte: 'PEQUENO',
    atividadePrincipal: 'Desenvolvimento de programas de computador',
    socios: [
      { nome: 'João Silva', participacao: 60 },
      { nome: 'Maria Santos', participacao: 40 }
    ],
    enrichedAt: '2024-01-15T10:30:00Z',
    status: 'ENRICHED'
  },
  {
    id: '2',
    cnpj: '22.333.444/0001-92',
    razaoSocial: 'COMERCIO DE ALIMENTOS LTDA',
    nomeFantasia: 'Mercado Bom',
    situacao: 'ATIVA',
    dataAbertura: '2018-07-22',
    naturezaJuridica: 'Sociedade Empresária Limitada',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '500',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      cep: '20000-000'
    },
    capitalSocial: 50000,
    porte: 'MICRO',
    atividadePrincipal: 'Comércio varejista de mercadorias em geral',
    enrichedAt: '2024-01-14T15:20:00Z',
    status: 'ENRICHED'
  },
  {
    id: '3',
    cnpj: '33.444.555/0001-03',
    razaoSocial: 'CONSULTORIA EMPRESARIAL S.A.',
    situacao: 'ATIVA',
    dataAbertura: '2015-11-10',
    naturezaJuridica: 'Sociedade Anônima',
    endereco: {
      logradouro: 'Av. Brigadeiro Faria Lima',
      numero: '2000',
      complemento: '15º andar',
      bairro: 'Itaim Bibi',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01451-000'
    },
    capitalSocial: 1000000,
    porte: 'MEDIO',
    atividadePrincipal: 'Atividades de consultoria em gestão empresarial',
    enrichedAt: '2024-01-16T09:45:00Z',
    status: 'ENRICHED'
  }
];

export const useCNPJData = () => {
  const [cnpjs, setCNPJs] = useState<CNPJData[]>(mockCNPJData);
  const [isLoading, setIsLoading] = useState(false);

  const stats: CNPJStats = useMemo(() => {
    const total = cnpjs.length;
    const enriched = cnpjs.filter(c => c.status === 'ENRICHED').length;
    const pending = cnpjs.filter(c => c.status === 'PENDING').length;
    const errors = cnpjs.filter(c => c.status === 'ERROR').length;

    const byStatus = cnpjs.reduce((acc, cnpj) => {
      acc[cnpj.situacao] = (acc[cnpj.situacao] || 0) + 1;
      return acc;
    }, {} as Record<CNPJData['situacao'], number>);

    const byPorte = cnpjs.reduce((acc, cnpj) => {
      acc[cnpj.porte] = (acc[cnpj.porte] || 0) + 1;
      return acc;
    }, {} as Record<CNPJData['porte'], number>);

    return { total, enriched, pending, errors, byStatus, byPorte };
  }, [cnpjs]);

  const enrichCNPJ = useCallback(async (cnpj: string): Promise<CNPJData> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock enriched data
    const enrichedData: CNPJData = {
      id: Date.now().toString(),
      cnpj,
      razaoSocial: `EMPRESA ${cnpj.replace(/\D/g, '').slice(2, 8)} LTDA`,
      situacao: 'ATIVA',
      dataAbertura: '2019-06-01',
      naturezaJuridica: 'Sociedade Empresária Limitada',
      endereco: {
        logradouro: 'Rua Exemplo',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01000-000'
      },
      capitalSocial: 10000,
      porte: 'MICRO',
      atividadePrincipal: 'Atividades de serviços de tecnologia da informação',
      enrichedAt: new Date().toISOString(),
      status: 'ENRICHED'
    };

    setCNPJs(prev => [...prev, enrichedData]);
    setIsLoading(false);
    
    return enrichedData;
  }, []);

  const deleteCNPJ = useCallback((id: string) => {
    setCNPJs(prev => prev.filter(cnpj => cnpj.id !== id));
  }, []);

  const updateCNPJ = useCallback((id: string, updates: Partial<CNPJData>) => {
    setCNPJs(prev => prev.map(cnpj => 
      cnpj.id === id ? { ...cnpj, ...updates } : cnpj
    ));
  }, []);

  return {
    cnpjs,
    stats,
    isLoading,
    enrichCNPJ,
    deleteCNPJ,
    updateCNPJ
  };
};