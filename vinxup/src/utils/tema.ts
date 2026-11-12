import { NivelAnsiedade } from '../types/Ansiedade';

// Paleta definida em documentacao/interface.md
export const cores = {
  fundo: '#EAF4FC',
  fundoTrilha: '#FFFCE6',
  azul: '#3B729F',
  azulClaro: '#98C5E9',
  azulSuave: '#D0E1F0',
  amarelo: '#FBE492',
  texto: '#1C2A3A',
  textoSuave: '#5A7A9A',
  branco: '#FFFFFF',
  borda: '#E0E0E0',
  alertaFundo: '#FFF0D6',
  alertaBorda: '#E8A33D',
  alertaTexto: '#7A4A00',
};

export const coresNivel: Record<NivelAnsiedade, string> = {
  nenhum: '#CDEBD5',
  leve: '#FFF3B8',
  moderado: '#FFD9A8',
  extremo: '#F7B4B4',
};
