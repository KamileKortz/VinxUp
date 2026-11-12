// Visível ao responsável: quando a criança abriu o app pela última vez.
export type Acesso = {
  id: string; // id da criança
  criancaId: string;
  ultimoAcessoEm: number;
};
