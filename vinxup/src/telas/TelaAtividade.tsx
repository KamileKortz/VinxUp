import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AlertaAnsiedade from '../componentes/AlertaAnsiedade';
import BalaoLontra from '../componentes/BalaoLontra';
import { buscarAmigo } from '../services/AmigoService';
import { salvarDiario } from '../services/DiarioService';
import {
  concluirAtividade,
  iniciarAtividade,
  listarProgressosPorCrianca,
} from '../services/ProgressoService';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { buscarAtividadePorId, listarAtividades, personalizarTexto } from '../services/TrilhaService';
import { Atividade, PassoPergunta } from '../types/Atividade';
import { NivelAnsiedade } from '../types/Ansiedade';
import { RespostaPergunta } from '../types/Diario';
import { confirmarAlerta, mostrarAlerta } from '../utils/alerta';
import {
  EMOJIS_SENTIMENTO,
  OPCOES_RESPOSTA,
  calcularPontuacao,
  classificarNivel,
  pontosDoNivel,
  precisaAlerta,
} from '../utils/ansiedade';
import { cores } from '../utils/tema';

type Etapa = 'passos' | 'fechamento' | 'resultado';

export default function TelaAtividade() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const atividade = id ? buscarAtividadePorId(id) : undefined;

  const [pronto, setPronto] = useState(false);
  const [nomeAmigo, setNomeAmigo] = useState('Amigo');
  const [etapa, setEtapa] = useState<Etapa>('passos');
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, NivelAnsiedade>>({});
  const [sentimento, setSentimento] = useState<number | null>(null);
  const [anotacao, setAnotacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [houveAlerta, setHouveAlerta] = useState(false);

  useEffect(() => {
    const usuario = getUsuarioLogado();
    if (!usuario) {
      router.replace('/login');
      return;
    }
    if (usuario.tipo !== 'crianca') {
      router.replace(rotaInicial(usuario));
      return;
    }
    if (!atividade) {
      mostrarAlerta('Atividade não encontrada');
      router.replace('/trilha');
      return;
    }
    const idCrianca = usuario.id;
    const atividadeAtual = atividade;

    async function preparar() {
      try {
        const [progressos, amigo] = await Promise.all([
          listarProgressosPorCrianca(idCrianca),
          buscarAmigo(idCrianca),
        ]);
        setNomeAmigo(amigo.nome);

        const atual = progressos.find((p) => p.atividadeId === atividadeAtual.id);
        if (atual?.status === 'concluida') {
          mostrarAlerta('Atividade concluída', 'Você já completou essa atividade! 🎉');
          router.replace('/trilha');
          return;
        }

        const anterior = listarAtividades().find((a) => a.ordem === atividadeAtual.ordem - 1);
        const anteriorConcluida =
          !anterior ||
          progressos.some((p) => p.atividadeId === anterior.id && p.status === 'concluida');
        if (!anteriorConcluida) {
          mostrarAlerta('Ainda bloqueada', 'Complete a atividade anterior para abrir esta.');
          router.replace('/trilha');
          return;
        }

        if (!atual) await iniciarAtividade(idCrianca, atividadeAtual.id);
        setPronto(true);
      } catch (erro) {
        mostrarAlerta('Erro', 'Não foi possível abrir a atividade. Tente novamente.');
        router.replace('/trilha');
      }
    }

    preparar();
  }, [id]);

  if (!atividade || !pronto) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator size="large" color={cores.azul} />
      </View>
    );
  }

  const atv: Atividade = atividade;
  const passo = atv.passos[indice];
  const totalPassos = atv.passos.length;

  function aoSair() {
    confirmarAlerta('Sair da atividade?', 'Suas respostas desta atividade não serão salvas.', () =>
      router.replace('/trilha')
    );
  }

  function aoContinuar() {
    if (indice + 1 < totalPassos) {
      setIndice(indice + 1);
    } else {
      setEtapa('fechamento');
    }
  }

  function aoVoltar() {
    if (etapa === 'fechamento') {
      setEtapa('passos');
    } else if (indice > 0) {
      setIndice(indice - 1);
    }
  }

  async function aoConcluir() {
    if (sentimento === null) {
      mostrarAlerta('Atenção', 'Escolha como você se sentiu durante a atividade.');
      return;
    }
    const usuario = getUsuarioLogado();
    if (!usuario) {
      router.replace('/login');
      return;
    }

    const perguntas = atv.passos.filter((p): p is PassoPergunta => p.tipo === 'pergunta');
    const itens: RespostaPergunta[] = perguntas.map((p) => {
      const nivel = respostas[p.id];
      return { perguntaId: p.id, nivel, pontos: pontosDoNivel(nivel) };
    });
    const { pontuacao, maximo } = calcularPontuacao(itens.map((i) => i.nivel));
    const nivel = classificarNivel(pontuacao, maximo);
    const alerta = precisaAlerta(pontuacao, maximo);

    setSalvando(true);
    try {
      // 1) conteúdo privado da criança  2) números visíveis ao responsável.
      // Nesta ordem: o responsável nunca vê "concluída" sem o diário salvo.
      await salvarDiario({
        criancaId: usuario.id,
        atividadeId: atv.id,
        respostas: itens,
        sentimento,
        anotacao: anotacao.trim(),
        criadoEm: Date.now(),
      });
      await concluirAtividade(usuario.id, atv.id, {
        pontuacao,
        pontuacaoMaxima: maximo,
        nivel,
        alerta,
      });
      setHouveAlerta(alerta);
      setEtapa('resultado');
    } catch (erro) {
      mostrarAlerta('Não foi possível salvar', 'Verifique sua conexão e tente de novo.');
    }
    setSalvando(false);
  }

  // ---------------- Etapa: resultado ----------------
  if (etapa === 'resultado') {
    return (
      <ScrollView contentContainerStyle={estilos.container}>
        <BalaoLontra texto={`Parabéns! Você concluiu "${atv.titulo}"! 🎉`} />

        {houveAlerta && (
          <AlertaAnsiedade
            titulo="Vamos cuidar de você"
            mensagem={
              'Algumas partes dessa história pareceram muito difíceis, e isso é importante. ' +
              'Converse com o seu responsável e procure um profissional de saúde, como um(a) ' +
              'psicólogo(a), que pode ajudar você a se sentir melhor.'
            }
          />
        )}

        <TouchableOpacity style={estilos.botaoAmarelo} onPress={() => router.replace('/trilha')}>
          <Text style={estilos.textoBotao}>VOLTAR PARA A TRILHA</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ---------------- Etapa: fechamento (sentimento + anotação) ----------------
  if (etapa === 'fechamento') {
    return (
      <ScrollView contentContainerStyle={estilos.container}>
        <View style={estilos.blocoTopo}>
          <TouchableOpacity onPress={aoSair}>
            <Text style={estilos.sair}>✕ Sair</Text>
          </TouchableOpacity>
        </View>

        <BalaoLontra texto="Como você se sentiu durante a atividade?" />
        <View style={estilos.emojisContainer}>
          {EMOJIS_SENTIMENTO.map((emoji, posicao) => (
            <TouchableOpacity
              key={posicao}
              style={[estilos.emojiItem, sentimento === posicao && estilos.emojiSelecionado]}
              onPress={() => setSentimento(posicao)}
            >
              <Text style={estilos.emojiTexto}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={estilos.espaco} />
        <BalaoLontra texto="Quer escrever uma anotação sobre essa atividade? (só você vê)" />
        <View style={estilos.cadernoBox}>
          <TextInput
            style={estilos.inputCaderno}
            multiline
            value={anotacao}
            onChangeText={setAnotacao}
            placeholder="Digite aqui..."
            placeholderTextColor="#A0C0D8"
          />
        </View>

        <View style={estilos.rodapeBotoes}>
          <TouchableOpacity style={estilos.botaoAmarelo} onPress={aoVoltar}>
            <Text style={estilos.textoBotao}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[estilos.botaoAmarelo, salvando && estilos.botaoDesativado]}
            onPress={aoConcluir}
            disabled={salvando}
          >
            <Text style={estilos.textoBotao}>{salvando ? 'SALVANDO...' : 'CONCLUIR'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ---------------- Etapa: passos (narração e perguntas) ----------------
  const respondida = passo.tipo === 'pergunta' ? respostas[passo.id] !== undefined : true;

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.blocoTopo}>
        <TouchableOpacity onPress={aoSair}>
          <Text style={estilos.sair}>✕ Sair</Text>
        </TouchableOpacity>
        <Text style={estilos.progresso}>
          {atv.titulo} · {indice + 1}/{totalPassos}
        </Text>
      </View>

      <BalaoLontra texto={personalizarTexto(passo.texto, nomeAmigo)} />

      {passo.tipo === 'pergunta' && (
        <View style={estilos.opcoes}>
          {OPCOES_RESPOSTA.map((opcao) => {
            const selecionada = respostas[passo.id] === opcao.nivel;
            return (
              <TouchableOpacity
                key={opcao.nivel}
                style={[estilos.opcao, selecionada && estilos.opcaoSelecionada]}
                onPress={() => setRespostas({ ...respostas, [passo.id]: opcao.nivel })}
              >
                <Text style={estilos.opcaoEmoji}>{opcao.emoji}</Text>
                <Text style={[estilos.opcaoTexto, selecionada && estilos.opcaoTextoSelecionado]}>
                  {opcao.rotulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={estilos.rodapeBotoes}>
        <TouchableOpacity
          style={[estilos.botaoAmarelo, indice === 0 && estilos.botaoDesativado]}
          onPress={aoVoltar}
          disabled={indice === 0}
        >
          <Text style={estilos.textoBotao}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoAmarelo, !respondida && estilos.botaoDesativado]}
          onPress={aoContinuar}
          disabled={!respondida}
        >
          <Text style={estilos.textoBotao}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  carregando: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  blocoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sair: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.azul,
  },
  progresso: {
    fontSize: 13,
    color: cores.textoSuave,
    fontWeight: '600',
  },
  opcoes: {
    gap: 10,
    marginBottom: 20,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: cores.azulSuave,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  opcaoSelecionada: {
    backgroundColor: cores.azul,
    borderColor: cores.azul,
  },
  opcaoEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  opcaoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
    flexShrink: 1,
  },
  opcaoTextoSelecionado: {
    color: cores.branco,
  },
  emojisContainer: {
    backgroundColor: cores.azul,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emojiItem: {
    padding: 6,
    borderRadius: 20,
  },
  emojiSelecionado: {
    backgroundColor: cores.amarelo,
  },
  emojiTexto: {
    fontSize: 32,
  },
  espaco: {
    height: 24,
  },
  cadernoBox: {
    backgroundColor: cores.azul,
    borderRadius: 22,
    padding: 16,
    minHeight: 160,
  },
  inputCaderno: {
    color: cores.branco,
    fontSize: 15,
    lineHeight: 28,
    minHeight: 130,
    textAlignVertical: 'top',
  },
  rodapeBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  botaoAmarelo: {
    backgroundColor: cores.amarelo,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
    alignItems: 'center',
  },
  botaoDesativado: {
    opacity: 0.45,
  },
  textoBotao: {
    fontSize: 15,
    fontWeight: '900',
    color: cores.texto,
  },
});
