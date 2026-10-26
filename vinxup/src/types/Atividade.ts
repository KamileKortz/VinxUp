export type StatusAtividade = 'concluida' | 'disponivel' | 'bloqueada';

export type Atividade = {
  id: string;
  ordem: number;
  titulo: string;
  status: StatusAtividade;
  sentimento?: string;
  anotacao?: string;
};