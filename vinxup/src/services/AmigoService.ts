import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Amigo } from '../types/Amigo';

const COLECAO = 'amigos';

export const AMIGO_PADRAO: Omit<Amigo, 'id'> = {
  nome: 'Amigo',
  genero: 'neutro',
  especie: 'gato',
  cor: 'azul',
};

export async function buscarAmigo(criancaId: string): Promise<Amigo> {
  const snapshot = await getDoc(doc(db, COLECAO, criancaId));
  if (!snapshot.exists()) return { id: criancaId, ...AMIGO_PADRAO };
  return { id: snapshot.id, ...snapshot.data() } as Amigo;
}

export async function salvarAmigo(criancaId: string, dados: Omit<Amigo, 'id'>): Promise<void> {
  await setDoc(doc(db, COLECAO, criancaId), dados);
}
