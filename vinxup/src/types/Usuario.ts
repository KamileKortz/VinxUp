export type TipoUsuario = 'responsavel' | 'crianca';

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  dataNascimento: string;
  tipo: TipoUsuario;
  codigoVinculo?: string; // só crianças: código para vincular outro responsável
  criadoPor?: string; // só crianças: id do responsável que cadastrou
};
