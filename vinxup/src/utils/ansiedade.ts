import { NivelAnsiedade } from '../types/Ansiedade';
import { Progresso } from '../types/Progresso';

// ---------------------------------------------------------------------------
// Pontuação de ansiedade (inspirada no mini-SPIN, conforme o artigo).
//
// Cada pergunta reflexiva tem 4 respostas possíveis, uma por nível. Cada nível
// vale uma pontuação: quanto mais alta, maior a ansiedade identificada.
//
// ATENÇÃO: os valores abaixo (0 a 3 e o limite de 50%) são um PONTO DE PARTIDA.
// O limite de 50% espelha o ponto de corte do mini-SPIN (6 de 12), mas o app
// NÃO faz diagnóstico: confirme o ponto de corte final com a orientadora ou
// com um profissional de psicologia antes de usar com crianças reais.
// ---------------------------------------------------------------------------

export const PONTOS_POR_NIVEL: Record<NivelAnsiedade, number> = {
  nenhum: 0,
  leve: 1,
  moderado: 2,
  extremo: 3,
};

export const PONTOS_MAXIMOS_POR_PERGUNTA = 3;

// Proporção da pontuação máxima a partir da qual o aviso é disparado.
export const PROPORCAO_ALERTA = 0.5;

export type OpcaoResposta = {
  nivel: NivelAnsiedade;
  rotulo: string;
  emoji: string;
};

// Mesmas quatro respostas para toda pergunta (a criança responde pelo "Amigo").
export const OPCOES_RESPOSTA: OpcaoResposta[] = [
  { nivel: 'nenhum', rotulo: 'Sem nervosismo', emoji: '😊' },
  { nivel: 'leve', rotulo: 'Um pouquinho de nervoso', emoji: '🙂' },
  { nivel: 'moderado', rotulo: 'Bastante nervosismo', emoji: '😟' },
  { nivel: 'extremo', rotulo: 'Nervosismo enorme', emoji: '😰' },
];

export const ROTULO_NIVEL: Record<NivelAnsiedade, string> = {
  nenhum: 'Nenhum',
  leve: 'Leve',
  moderado: 'Moderado',
  extremo: 'Extremo',
};

export const EMOJIS_SENTIMENTO = ['😭', '🥺', '😐', '😃', '😆'];

export function pontosDoNivel(nivel: NivelAnsiedade): number {
  return PONTOS_POR_NIVEL[nivel];
}

export function calcularPontuacao(niveis: NivelAnsiedade[]): { pontuacao: number; maximo: number } {
  const pontuacao = niveis.reduce((soma, nivel) => soma + pontosDoNivel(nivel), 0);
  return { pontuacao, maximo: niveis.length * PONTOS_MAXIMOS_POR_PERGUNTA };
}

export function classificarNivel(pontuacao: number, maximo: number): NivelAnsiedade {
  if (maximo === 0) return 'nenhum';
  const proporcao = pontuacao / maximo;
  if (proporcao < 0.25) return 'nenhum';
  if (proporcao < 0.5) return 'leve';
  if (proporcao < 0.75) return 'moderado';
  return 'extremo';
}

export function precisaAlerta(pontuacao: number, maximo: number): boolean {
  if (maximo === 0) return false;
  return pontuacao / maximo >= PROPORCAO_ALERTA;
}

// Há aviso se alguma das últimas atividades concluídas passou do limite.
export function temAlertaRecente(progressos: Progresso[], quantas = 3): boolean {
  const concluidas = progressos
    .filter((p) => p.status === 'concluida')
    .sort((a, b) => (b.concluidaEm ?? 0) - (a.concluidaEm ?? 0))
    .slice(0, quantas);
  return concluidas.some((p) => p.alerta === true);
}
