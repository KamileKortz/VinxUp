import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BarraNavegacao from '../componentes/BarraNavegacao';
import CabecalhoLontra from '../componentes/CabecalhoLontra';
import { registrarAcesso } from '../services/AcessoService';
import { listarProgressosPorCrianca } from '../services/ProgressoService';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { listarAtividades } from '../services/TrilhaService';
import { Progresso } from '../types/Progresso';
import { Usuario } from '../types/Usuario';
import { mostrarAlerta } from '../utils/alerta';
import { cores } from '../utils/tema';

// Posição (em % da largura) e altura de cada nó, desenhando um caminho em S.
const POSICOES = [
  { top: 10, left: '6%' },
  { top: 100, left: '36%' },
  { top: 190, left: '64%' },
  { top: 280, left: '30%' },
  { top: 370, left: '54%' },
  { top: 460, left: '72%' },
] as const;

type StatusNo = 'concluida' | 'disponivel' | 'bloqueada';

export default function TelaTrilha() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [progressos, setProgressos] = useState<Progresso[]>([]);
  const atividades = listarAtividades();

  useFocusEffect(
    useCallback(() => {
      const logado = getUsuarioLogado();
      if (!logado) {
        router.replace('/login');
        return;
      }
      if (logado.tipo !== 'crianca') {
        router.replace(rotaInicial(logado));
        return;
      }
      setUsuario(logado);
      const idCrianca = logado.id;

      async function carregar() {
        try {
          setProgressos(await listarProgressosPorCrianca(idCrianca));
          // O responsável vê "último acesso" a partir deste registro.
          await registrarAcesso(idCrianca);
        } catch (erro) {
          mostrarAlerta('Erro', 'Não foi possível carregar sua trilha. Tente novamente.');
        }
      }

      carregar();
    }, [])
  );

  function statusDoNo(indice: number): StatusNo {
    const atividade = atividades[indice];
    const concluida = (id: string) =>
      progressos.some((p) => p.atividadeId === id && p.status === 'concluida');

    if (concluida(atividade.id)) return 'concluida';
    if (indice === 0 || concluida(atividades[indice - 1].id)) return 'disponivel';
    return 'bloqueada';
  }

  function aoPressionarNo(indice: number) {
    const status = statusDoNo(indice);
    if (status === 'concluida') {
      mostrarAlerta('Atividade concluída', 'Você já completou essa atividade! 🎉');
    } else if (status === 'bloqueada') {
      mostrarAlerta('Ainda bloqueada', 'Complete a atividade anterior para abrir esta.');
    } else {
      router.push('/atividade/' + atividades[indice].id);
    }
  }

  const primeiroNome = usuario ? usuario.nome.split(' ')[0] : '';

  return (
    <View style={estilos.wrapper}>
      <ScrollView contentContainerStyle={estilos.container}>
        <CabecalhoLontra texto={`Olá, ${primeiroNome}!`} />

        <Text style={estilos.tituloTrilha}>Trilha: Na escola</Text>

        <View style={estilos.trilhaArea}>
          {atividades.slice(0, POSICOES.length).map((atividade, indice) => {
            const status = statusDoNo(indice);
            return (
              <View key={atividade.id} style={[estilos.noContainer, POSICOES[indice]]}>
                <TouchableOpacity
                  style={[
                    estilos.no,
                    status === 'concluida' && estilos.noConcluido,
                    status === 'bloqueada' && estilos.noBloqueado,
                  ]}
                  onPress={() => aoPressionarNo(indice)}
                >
                  <Text style={estilos.iconeNo}>
                    {status === 'concluida' ? '✓' : status === 'bloqueada' ? '🔒' : '▶'}
                  </Text>
                </TouchableOpacity>
                <Text style={estilos.legendaNo}>Módulo {atividade.ordem}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BarraNavegacao abaAtiva="trilha" />
    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: cores.fundoTrilha,
  },
  container: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  tituloTrilha: {
    fontSize: 26,
    fontWeight: '900',
    color: cores.texto,
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  trilhaArea: {
    height: 570,
    width: '90%',
    maxWidth: 420,
    alignSelf: 'center',
    position: 'relative',
  },
  noContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  no: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: cores.amarelo,
    borderWidth: 3,
    borderColor: cores.azul,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  noConcluido: {
    backgroundColor: '#A0CFEC',
  },
  noBloqueado: {
    backgroundColor: '#E6E6E6',
    opacity: 0.8,
  },
  iconeNo: {
    fontSize: 28,
    fontWeight: '900',
    color: cores.azul,
  },
  legendaNo: {
    fontSize: 12,
    fontWeight: '700',
    color: cores.textoSuave,
    marginTop: 4,
  },
});
