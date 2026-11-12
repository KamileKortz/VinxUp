export type PassoNarrativa = {
  tipo: 'narrativa';
  texto: string;
};

export type PassoPergunta = {
  tipo: 'pergunta';
  id: string;
  texto: string;
};

export type Passo = PassoNarrativa | PassoPergunta;

export type Atividade = {
  id: string;
  ordem: number;
  titulo: string;
  passos: Passo[];
};

export type Trilha = {
  id: string;
  titulo: string;
  atividades: Atividade[];
};
