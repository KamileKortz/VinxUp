import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import BarraNavegacao from '../componentes/BarraNavegacao';
import Cabecalho from '../componentes/Cabecalho';
import { listarDiariosPorCrianca } from '../services/DiarioService';
import { listarProgressosPorCrianca } from '../services/ProgressoService';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { buscarAtividadePorId } from '../services/TrilhaService';
import { Diario } from '../types/Diario';
import { Progresso } from '../types/Progresso';
import { mostrarAlerta } from '../utils/alerta';
import { EMOJIS_SENTIMENTO } from '../utils/ansiedade';
import { formatarData } from '../utils/datas';
import { cores } from '../utils/tema';

// Histórico PESSOAL da criança: as atividades que ela concluiu, com o
// sentimento e a anotação que ela mesma registrou.
export default function TelaHistorico() {
  const [progressos, setProgressos] = useState<Progresso[]>([]);
  const [diarios, setDiarios] = useState<Diario[]>([]);

  useFocusEffect(
    useCallback(() => {
      const usuario = getUsuarioLogado();
      if (!usuario) {
        router.replace('/login');
        return;
      }
      if (usuario.tipo !== 'crianca') {
        router.replace(rotaInicial(usuario));
        return;
      }
      const idCrianca = usuario.id;

      async function carregar() {
        try {
          const lista = await listarProgressosPorCrianca(idCrianca);
          setProgressos(
            lista
              .filter((p) => p.status === 'concluida')
              .sort((a, b) => (b.concluidaEm ?? 0) - (a.concluidaEm ?? 0))
          );
          setDiarios(await listarDiariosPorCrianca(idCrianca));
        } catch (erro) {
          mostrarAlerta('Erro', 'Não foi possível carregar seu histórico.');
        }
      }

      carregar();
    }, [])
  );

  return (
    <View style={estilos.wrapper}>
      <ScrollView contentContainerStyle={estilos.container}>
        <Cabecalho titulo="Meu histórico" subtitulo="Atividades que você já concluiu" />

        <View style={estilos.conteudo}>
          {progressos.length === 0 ? (
            <Text style={estilos.vazio}>Você ainda não concluiu nenhuma atividade.</Text>
          ) : (
            progressos.map((progresso) => {
              const atividade = buscarAtividadePorId(progresso.atividadeId);
              const diario = diarios.find((d) => d.atividadeId === progresso.atividadeId);
              return (
                <View key={progresso.id} style={estilos.cartao}>
                  <Text style={estilos.titulo}>
                    {diario ? EMOJIS_SENTIMENTO[diario.sentimento] : '✓'} {atividade?.titulo ?? progresso.atividadeId}
                  </Text>
                  <Text style={estilos.data}>
                    Concluída em {progresso.concluidaEm ? formatarData(progresso.concluidaEm) : '-'}
                  </Text>
                  {diario?.anotacao ? (
                    <Text style={estilos.anotacao} numberOfLines={3}>
                      “{diario.anotacao}”
                    </Text>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <BarraNavegacao abaAtiva="historico" />
    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  container: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  conteudo: {
    marginHorizontal: 20,
  },
  vazio: {
    fontSize: 14,
    color: cores.textoSuave,
    fontStyle: 'italic',
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.azulSuave,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: cores.texto,
  },
  data: {
    fontSize: 13,
    color: cores.textoSuave,
    marginTop: 2,
  },
  anotacao: {
    fontSize: 14,
    color: cores.texto,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
