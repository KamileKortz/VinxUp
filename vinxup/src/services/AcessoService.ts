import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Acesso } from '../types/Acesso';

const COLECAO = 'acessos';

export async function registrarAcesso(criancaId: string): Promise<void> {
  await setDoc(doc(db, COLECAO, criancaId), { criancaId, ultimoAcessoEm: Date.now() });
}

export async function buscarAcesso(criancaId: string): Promise<Acesso | undefined> {
  const snapshot = await getDoc(doc(db, COLECAO, criancaId));
  if (!snapshot.exists()) return undefined;
  return { id: snapshot.id, ...snapshot.data() } as Acesso;
}
