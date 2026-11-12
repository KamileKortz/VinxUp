import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, getFirebaseSecundario } from './firebase';
import { Usuario } from '../types/Usuario';

const COLECAO = 'usuarios';
const COLECAO_CODIGOS = 'codigosVinculo';

// O id não é gerado pelo Firestore: é o uid que o Firebase Auth já gerou
// para esse usuário. setDoc grava no documento com esse id específico,
// diferente de addDoc, que geraria um id novo, sem relação com o uid.
export async function cadastrarUsuario(id: string, dados: Omit<Usuario, 'id'>): Promise<Usuario> {
  const ref = doc(collection(db, COLECAO), id);
  await setDoc(ref, dados);
  return { id, ...dados };
}

export async function buscarUsuarioPorId(id: string): Promise<Usuario | undefined> {
  const ref = doc(db, COLECAO, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return undefined;
  return { id: snapshot.id, ...snapshot.data() } as Usuario;
}

// Código curto que a criança (ou o responsável que a cadastrou) passa a outro
// responsável para vincular a mesma criança. Sem letras/números parecidos.
function gerarCodigoVinculo(): string {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));
  }
  return codigo;
}

type DadosCrianca = {
  nome: string;
  email: string;
  dataNascimento: string;
  senha: string;
};

// O responsável cadastra a criança. Passos:
// 1. cria a conta da criança no Firebase Auth (app secundário)
// 2. grava o perfil usuarios/{uid} e o código de vínculo (já como a criança)
// 3. encerra a sessão do app secundário
// O vínculo com o responsável é criado depois, por VinculoService.criarVinculo.
export async function cadastrarCriancaVinculada(
  responsavel: Usuario,
  dados: DadosCrianca
): Promise<Usuario> {
  const { auth: authSecundario, db: dbSecundario } = getFirebaseSecundario();

  const credencial = await createUserWithEmailAndPassword(authSecundario, dados.email, dados.senha);
  const id = credencial.user.uid;
  const codigoVinculo = gerarCodigoVinculo();

  const perfil: Omit<Usuario, 'id'> = {
    nome: dados.nome,
    email: dados.email,
    dataNascimento: dados.dataNascimento,
    tipo: 'crianca',
    codigoVinculo,
    criadoPor: responsavel.id,
  };

  try {
    await setDoc(doc(dbSecundario, COLECAO, id), perfil);
    await setDoc(doc(dbSecundario, COLECAO_CODIGOS, codigoVinculo), {
      criancaId: id,
      criancaNome: dados.nome,
    });
  } finally {
    await signOut(authSecundario);
  }

  return { id, ...perfil };
}
