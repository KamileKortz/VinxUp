export type TipoUsuario = 'responsavel' | 'usuario';

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
};