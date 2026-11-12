import { Atividade, Passo, Trilha } from '../types/Atividade';

// ---------------------------------------------------------------------------
// Conteúdo da trilha. Fica aqui (e não no Firestore) por enquanto: o protótipo
// terá uma única trilha completa, com tema escolar. Como as telas só chamam as
// funções deste service, mover o conteúdo para o Firestore depois não exige
// mexer nas telas (mesma ideia de "fronteira" da aula 12).
//
// {amigo} é trocado pelo nome que a criança deu ao personagem Amigo.
// O texto abaixo é conteúdo de EXEMPLO: revise com a orientadora/psicóloga
// antes de usar com crianças.
// ---------------------------------------------------------------------------

function narrativa(texto: string): Passo {
  return { tipo: 'narrativa', texto };
}

function pergunta(id: string, texto: string): Passo {
  return { tipo: 'pergunta', id, texto };
}

export const TRILHA_ESCOLAR_ID = 'escola';

const TRILHAS: Trilha[] = [
  {
    id: TRILHA_ESCOLAR_ID,
    titulo: 'Na escola',
    atividades: [
      {
        id: 'escola-1',
        ordem: 1,
        titulo: 'Bom dia, turma!',
        passos: [
          narrativa('Oi! Eu sou o Lavi. Hoje vou contar uma aventura de {amigo}, que está chegando na escola. A sala está cheia de colegas conversando.'),
          narrativa('{amigo} quer dizer "bom dia" para a turma, mas sua cabeça começa a pensar: "E se ninguém responder?"'),
          pergunta('p1', '{amigo} pensou: "E se ninguém responder o meu bom dia?". O quanto esse pensamento deixou {amigo} nervoso?'),
          narrativa('Mesmo assim, {amigo} respirou fundo e disse "bom dia". Alguns colegas sorriram e responderam.'),
          pergunta('p2', 'Na hora de dizer "bom dia" para a turma, como {amigo} se sentiu?'),
        ],
      },
      {
        id: 'escola-2',
        ordem: 2,
        titulo: 'Uma dúvida na aula',
        passos: [
          narrativa('Na aula de matemática, {amigo} não entendeu a explicação da professora. A dúvida ficou apertando por dentro.'),
          pergunta('p1', '{amigo} pensou: "Se eu perguntar, vão achar que eu sou bobo". O quanto esse pensamento deixou {amigo} nervoso?'),
          narrativa('{amigo} levantou a mão bem devagar. A professora sorriu e explicou outra vez, com calma.'),
          pergunta('p2', 'Enquanto esperava a professora responder, como {amigo} se sentiu?'),
        ],
      },
      {
        id: 'escola-3',
        ordem: 3,
        titulo: 'A hora do recreio',
        passos: [
          narrativa('Chegou o recreio! {amigo} está com o lanche na mão e vê alguns colegas sentados juntos perto da quadra.'),
          pergunta('p1', '{amigo} pensou: "E se eles não quiserem que eu sente aqui?". O quanto esse pensamento deixou {amigo} nervoso?'),
          narrativa('{amigo} caminhou até a mesa e perguntou: "Posso sentar com vocês?". Um dos colegas abriu espaço no banco.'),
          pergunta('p2', 'Na hora de perguntar se podia sentar, como {amigo} se sentiu?'),
        ],
      },
      {
        id: 'escola-4',
        ordem: 4,
        titulo: 'Trabalho em grupo',
        passos: [
          narrativa('A professora pediu um trabalho em grupo, e {amigo} ficou com três colegas que conhece pouco.'),
          pergunta('p1', '{amigo} pensou: "E se eu der uma ideia e eles acharem ruim?". O quanto esse pensamento deixou {amigo} nervoso?'),
          narrativa('{amigo} contou sua ideia para o grupo. Um colega disse: "Legal! E se a gente juntar com a minha?".'),
          pergunta('p2', 'Quando o grupo escutou a ideia, como {amigo} se sentiu?'),
          pergunta('p3', 'Pensando em trabalhar junto com os colegas nos próximos dias, como {amigo} se sente?'),
        ],
      },
      {
        id: 'escola-5',
        ordem: 5,
        titulo: 'Respondendo em voz alta',
        passos: [
          narrativa('A professora fez uma pergunta para a turma toda e olhou na direção de {amigo}. A sala ficou em silêncio.'),
          pergunta('p1', '{amigo} pensou: "Todo mundo está olhando pra mim. E se eu errar?". O quanto esse pensamento deixou {amigo} nervoso?'),
          pergunta('p2', 'Com o coração batendo forte, como {amigo} se sentiu antes de responder?'),
          narrativa('{amigo} respondeu em voz baixinha. A professora disse: "Muito bem, obrigada por tentar!". Errar faz parte de aprender.'),
          pergunta('p3', 'Depois de responder, como {amigo} se sentiu?'),
        ],
      },
      {
        id: 'escola-6',
        ordem: 6,
        titulo: 'Apresentando para a turma',
        passos: [
          narrativa('Chegou o dia da apresentação! {amigo} vai mostrar um trabalho para a turma inteira, em pé na frente da sala.'),
          pergunta('p1', '{amigo} pensou: "E se eu esquecer o que ia falar e todo mundo rir?". O quanto esse pensamento deixou {amigo} nervoso?'),
          pergunta('p2', 'Esperando a vez de apresentar, como {amigo} se sentiu?'),
          narrativa('{amigo} respirou fundo, olhou para o cartaz e começou a falar. Os colegas ouviram com atenção e, no final, aplaudiram.'),
          pergunta('p3', 'No fim da apresentação, como {amigo} se sentiu?'),
        ],
      },
    ],
  },
];

export function listarTrilhas(): Trilha[] {
  return TRILHAS;
}

export function listarAtividades(trilhaId: string = TRILHA_ESCOLAR_ID): Atividade[] {
  const trilha = TRILHAS.find((t) => t.id === trilhaId);
  return trilha ? trilha.atividades : [];
}

export function buscarAtividadePorId(id: string): Atividade | undefined {
  for (const trilha of TRILHAS) {
    const encontrada = trilha.atividades.find((a) => a.id === id);
    if (encontrada) return encontrada;
  }
  return undefined;
}

// Troca {amigo} pelo nome do personagem.
export function personalizarTexto(texto: string, nomeAmigo: string): string {
  return texto.replace(/\{amigo\}/g, nomeAmigo);
}
