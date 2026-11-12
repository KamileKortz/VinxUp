import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { Usuario } from '../types/Usuario';
import { Vinculo } from '../types/Vinculo';

const COLECAO = 'vinculos';
const COLECAO_CODIGOS = 'codigosVinculo';

// O id do vínculo é determinístico (responsável + criança): o mesmo par nunca
// gera dois documentos, e as regras do Firestore conseguem checar o vínculo
// só pelo caminho do documento.
export function idVinculo(responsavelId: string, criancaId: string): string {
  return `${responsavelId}_${criancaId}`;
}

export async function criarVinculo(
  responsavel: Usuario,
  crianca: { id: string; nome: string },
  codigo: string
): Promise<Vinculo> {
  const id = idVinculo(responsavel.id, crianca.id);
  const dados: Omit<Vinculo, 'id'> = {
    responsavelId: responsavel.id,
    criancaId: crianca.id,
    responsavelNome: responsavel.nome,
    criancaNome: crianca.nome,
    codigo,
    criadoEm: Date.now(),
  };
  await setDoc(doc(db, COLECAO, id), dados);
  return { id, ...dados };
}

// Segundo (terceiro...) responsável vincula uma criança que já existe,
// informando o código de vínculo dela. Devolve undefined se o código não existe.
export async function vincularPorCodigo(
  responsavel: Usuario,
  codigoDigitado: string
): Promise<Vinculo | undefined> {
  const codigo = codigoDigitado.trim().toUpperCase();
  const snapshot = await getDoc(doc(db, COLECAO_CODIGOS, codigo));
  if (!snapshot.exists()) return undefined;

  const { criancaId, criancaNome } = snapshot.data() as { criancaId: string; criancaNome: string };
  return criarVinculo(responsavel, { id: criancaId, nome: criancaNome }, codigo);
}

export async function listarVinculosDoResponsavel(responsavelId: string): Promise<Vinculo[]> {
  const q = query(collection(db, COLECAO), where('responsavelId', '==', responsavelId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Vinculo));
}

export async function listarVinculosDaCrianca(criancaId: string): Promise<Vinculo[]> {
  const q = query(collection(db, COLECAO), where('criancaId', '==', criancaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Vinculo));
}

export async function removerVinculo(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO, id));
}
