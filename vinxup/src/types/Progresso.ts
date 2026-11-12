import { NivelAnsiedade } from './Ansiedade';

export type StatusProgresso = 'em_andamento' | 'concluida';

// Documento VISÍVEL ao responsável: só números e status, nunca o conteúdo
// que a criança escreveu (isso fica em Diario, que é privado).
export type Progresso = {
  id: string; // `${criancaId}_${atividadeId}`
  criancaId: string;
  atividadeId: string;
  status: StatusProgresso;
  iniciadaEm: number;
  concluidaEm?: number;
  pontuacao?: number;
  pontuacaoMaxima?: number;
  nivel?: NivelAnsiedade;
  alerta?: boolean;
};
