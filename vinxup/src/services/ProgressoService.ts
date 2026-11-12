import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { NivelAnsiedade } from '../types/Ansiedade';
import { Progresso } from '../types/Progresso';

const COLECAO = 'progressos';

export function idProgresso(criancaId: string, atividadeId: string): string {
  return `${criancaId}_${atividadeId}`;
}

// Usado pela criança (a própria) e pelo responsável vinculado.
export async function listarProgressosPorCrianca(criancaId: string): Promise<Progresso[]> {
  const q = query(collection(db, COLECAO), where('criancaId', '==', criancaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Progresso));
}

export async function iniciarAtividade(criancaId: string, atividadeId: string): Promise<void> {
  const ref = doc(db, COLECAO, idProgresso(criancaId, atividadeId));
  await setDoc(ref, {
    criancaId,
    atividadeId,
    status: 'em_andamento',
    iniciadaEm: Date.now(),
  });
}

type Resultado = {
  pontuacao: number;
  pontuacaoMaxima: number;
  nivel: NivelAnsiedade;
  alerta: boolean;
};

// merge: true preserva o iniciadaEm gravado em iniciarAtividade.
export async function concluirAtividade(
  criancaId: string,
  atividadeId: string,
  resultado: Resultado
): Promise<void> {
  const ref = doc(db, COLECAO, idProgresso(criancaId, atividadeId));
  await setDoc(
    ref,
    {
      criancaId,
      atividadeId,
      status: 'concluida',
      concluidaEm: Date.now(),
      ...resultado,
    },
    { merge: true }
  );
}
