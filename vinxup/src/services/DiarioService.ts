import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { Diario } from '../types/Diario';

const COLECAO = 'diarios';

export async function salvarDiario(dados: Omit<Diario, 'id'>): Promise<Diario> {
  const id = `${dados.criancaId}_${dados.atividadeId}`;
  await setDoc(doc(db, COLECAO, id), dados);
  return { id, ...dados };
}

// Só a própria criança consegue ler (veja firestore.rules).
export async function listarDiariosPorCrianca(criancaId: string): Promise<Diario[]> {
  const q = query(collection(db, COLECAO), where('criancaId', '==', criancaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Diario));
}
