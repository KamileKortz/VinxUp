import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AlertaAnsiedade from '../componentes/AlertaAnsiedade';
import Cabecalho from '../componentes/Cabecalho';
import EtiquetaNivel from '../componentes/EtiquetaNivel';
import { buscarAcesso } from '../services/AcessoService';
import { listarProgressosPorCrianca } from '../services/ProgressoService';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { listarAtividades } from '../services/TrilhaService';
import { listarVinculosDoResponsavel } from '../services/VinculoService';
import { Acesso } from '../types/Acesso';
import { Progresso } from '../types/Progresso';
import { Vinculo } from '../types/Vinculo';
import { mostrarAlerta } from '../utils/alerta';
import { temAlertaRecente } from '../utils/ansiedade';
import { descreverTempo, formatarData } from '../utils/datas';
import { cores, coresNivel } from '../utils/tema';

// Visão do responsável sobre UMA criança. Mostra só o que o responsável pode
// ver: andamento, datas e níveis de ansiedade. NUNCA mostra respostas
// específicas, anotações ou o perfil do Amigo (isso é privado da criança e é
// bloqueado também no banco, por firestore.rules).
export default function TelaAcompanhamento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vinculo, setVinculo] = useState<Vinculo | undefined>(undefined);
  const [progressos, setProgressos] = useState<Progresso[]>([]);
  const [acesso, setAcesso] = useState<Acesso | undefined>(undefined);
  const atividades = listarAtividades();

  useFocusEffect(
    useCallback(() => {
      const usuario = getUsuarioLogado();
      if (!usuario) {
        router.replace('/login');
        return;
      }
      if (usuario.tipo !== 'responsavel') {
        router.replace(rotaInicial(usuario));
        return;
      }
      if (!id) return;
      const idResponsavel = usuario.id;

      async function carregar() {
        try {
          const vinculos = await listarVinculosDoResponsavel(idResponsavel);
          const encontrado = vinculos.find((v) => v.criancaId === id);
          if (!encontrado) {
            mostrarAlerta('Criança não encontrada', 'Você não está vinculado a esta criança.');
            router.replace('/painel');
            return;
          }
          setVinculo(encontrado);
          setProgressos(await listarProgressosPorCrianca(id));
          setAcesso(await buscarAcesso(id));
        } catch (erro) {
          mostrarAlerta('Erro', 'Não foi possível carregar o acompanhamento.');
        }
      }

      carregar();
    }, [id])
  );

  const concluidas = progressos.filter((p) => p.status === 'concluida');
  const alerta = temAlertaRecente(progressos);

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho titulo={vinculo?.criancaNome ?? 'Acompanhamento'} subtitulo="Progresso na trilha" />

      <View style={estilos.conteudo}>
        {alerta && (
          <AlertaAnsiedade
            titulo="Atenção: ansiedade elevada"
            mensagem={
              'Atividades recentes tiveram pontuação elevada. O app não faz diagnóstico: ' +
              'converse com a criança e procure orientação de um profissional de saúde ' +
              '(psicólogo(a) ou psiquiatra infantil).'
            }
          />
        )}

        <View style={estilos.cartao}>
          <Text style={estilos.detalhe}>
            ✅ {concluidas.length} de {atividades.length} atividades concluídas
          </Text>
          <Text style={estilos.detalhe}>
            📱 Último acesso ao app: {acesso ? descreverTempo(acesso.ultimoAcessoEm) : 'ainda não acessou'}
          </Text>
        </View>

        <Text style={estilos.secao}>Evolução da ansiedade</Text>
        {concluidas.length === 0 ? (
          <Text style={estilos.vazio}>Ainda não há atividades concluídas.</Text>
        ) : (
          <View style={estilos.grafico}>
            {atividades.map((atividade) => {
              const progresso = concluidas.find((p) => p.atividadeId === atividade.id);
              if (!progresso || !progresso.nivel) return null;
              const proporcao = (progresso.pontuacao ?? 0) / (progresso.pontuacaoMaxima || 1);
              return (
                <View key={atividade.id} style={estilos.colunaGrafico}>
                  <View
                    style={[
                      estilos.barra,
                      { height: 12 + proporcao * 88, backgroundColor: coresNivel[progresso.nivel] },
                    ]}
                  />
                  <Text style={estilos.rotuloBarra}>{atividade.ordem}</Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={estilos.secao}>Atividades</Text>
        {atividades.map((atividade) => {
          const progresso = progressos.find((p) => p.atividadeId === atividade.id);
          return (
            <View key={atividade.id} style={estilos.cartao}>
              <Text style={estilos.tituloAtividade}>
                {atividade.ordem}. {atividade.titulo}
              </Text>
              {!progresso ? (
                <Text style={estilos.detalhe}>Ainda não iniciada</Text>
              ) : progresso.status === 'em_andamento' ? (
                <Text style={estilos.detalhe}>Em andamento desde {formatarData(progresso.iniciadaEm)}</Text>
              ) : (
                <View>
                  <Text style={estilos.detalhe}>
                    Concluída em {progresso.concluidaEm ? formatarData(progresso.concluidaEm) : '-'} ·{' '}
                    {progresso.pontuacao}/{progresso.pontuacaoMaxima} pontos
                  </Text>
                  {progresso.nivel && (
                    <View style={estilos.linhaNivel}>
                      <Text style={estilos.detalhe}>Nível de ansiedade: </Text>
                      <EtiquetaNivel nivel={progresso.nivel} />
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={estilos.privacidade}>
          <Text style={estilos.textoPrivacidade}>
            🔒 Por privacidade, as respostas, anotações e o personagem criados pela criança não
            aparecem aqui.
          </Text>
        </View>

        {vinculo && (
          <Text style={estilos.codigo}>
            Código para vincular outro responsável a {vinculo.criancaNome}: {vinculo.codigo}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: cores.fundo,
    paddingBottom: 40,
  },
  conteudo: {
    marginHorizontal: 20,
  },
  secao: {
    fontSize: 18,
    fontWeight: '800',
    color: cores.texto,
    marginTop: 16,
    marginBottom: 8,
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.azulSuave,
  },
  tituloAtividade: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 4,
  },
  detalhe: {
    fontSize: 14,
    color: cores.textoSuave,
    marginTop: 2,
  },
  linhaNivel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  vazio: {
    fontSize: 14,
    color: cores.textoSuave,
    fontStyle: 'italic',
  },
  grafico: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 130,
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: cores.azulSuave,
  },
  colunaGrafico: {
    alignItems: 'center',
  },
  barra: {
    width: 28,
    borderRadius: 8,
  },
  rotuloBarra: {
    fontSize: 12,
    color: cores.textoSuave,
    marginTop: 4,
  },
  privacidade: {
    backgroundColor: cores.azulSuave,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  textoPrivacidade: {
    fontSize: 13,
    color: cores.texto,
  },
  codigo: {
    marginTop: 16,
    fontSize: 13,
    color: cores.textoSuave,
    textAlign: 'center',
  },
});
