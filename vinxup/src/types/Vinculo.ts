// Liga um responsável a uma criança. Um responsável pode ter várias crianças
// e uma criança pode ter vários responsáveis: cada par é um documento.
export type Vinculo = {
  id: string; // `${responsavelId}_${criancaId}`
  responsavelId: string;
  criancaId: string;
  responsavelNome: string;
  criancaNome: string;
  codigo: string; // código de vínculo da criança
  criadoEm: number;
};
