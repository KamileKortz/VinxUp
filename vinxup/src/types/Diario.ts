import { NivelAnsiedade } from './Ansiedade';

export type RespostaPergunta = {
  perguntaId: string;
  nivel: NivelAnsiedade;
  pontos: number;
};

// Documento PRIVADO da criança: respostas específicas, sentimento e anotação.
// As regras do Firestore (firestore.rules) impedem o responsável de ler isto.
export type Diario = {
  id: string; // `${criancaId}_${atividadeId}`
  criancaId: string;
  atividadeId: string;
  respostas: RespostaPergunta[];
  sentimento: number; // índice do emoji escolhido
  anotacao: string;
  criadoEm: number;
};
