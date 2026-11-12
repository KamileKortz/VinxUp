export type GeneroAmigo = 'menino' | 'menina' | 'neutro';

// Personagem "Amigo" da criança. Privado: o responsável não lê este documento.
export type Amigo = {
  id: string; // id da criança
  nome: string;
  genero: GeneroAmigo;
  especie: string;
  cor: string;
};
