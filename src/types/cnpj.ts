export interface CNPJData {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA';
  dataAbertura: string;
  naturezaJuridica: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  telefone?: string;
  email?: string;
  capitalSocial: number;
  porte: 'MEI' | 'MICRO' | 'PEQUENO' | 'MEDIO' | 'GRANDE';
  atividadePrincipal: string;
  socios?: Array<{
    nome: string;
    participacao: number;
  }>;
  enrichedAt: string;
  status: 'PENDING' | 'ENRICHED' | 'ERROR';
}

export interface CNPJStats {
  total: number;
  enriched: number;
  pending: number;
  errors: number;
  byStatus: Record<CNPJData['situacao'], number>;
  byPorte: Record<CNPJData['porte'], number>;
}