import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AlertaAnsiedade from '../componentes/AlertaAnsiedade';
import Cabecalho from '../componentes/Cabecalho';
import { buscarAcesso } from '../services/AcessoService';
import { listarProgressosPorCrianca } from '../services/ProgressoService';
import { deslogar, getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { listarAtividades } from '../services/TrilhaService';
import { listarVinculosDoResponsavel } from '../services/VinculoService';
import { Usuario } from '../types/Usuario';
import { Vinculo } from '../types/Vinculo';
import { mostrarAlerta } from '../utils/alerta';
import { temAlertaRecente } from '../utils/ansiedade';
import { descreverTempo } from '../utils/datas';
import { cores } from '../utils/tema';

type ResumoCrianca = {
  vinculo: Vinculo;
  concluidas: number;
  ultimoAcessoEm?: number;
  alerta: boolean;
};

export default function TelaPainel() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [resumos, setResumos] = useState<ResumoCrianca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const totalAtividades = listarAtividades().length;

  async function sair() {
    await deslogar();
    router.replace('/login');
  }

  useFocusEffect(
    useCallback(() => {
      const logado = getUsuarioLogado();
      if (!logado) {
        router.replace('/login');
        return;
      }
      if (logado.tipo !== 'responsavel') {
        router.replace(rotaInicial(logado));
        return;
      }
      setUsuario(logado);
      const idResponsavel = logado.id;

      async function carregarResumos() {
        try {
          const vinculos = await listarVinculosDoResponsavel(idResponsavel);
          const lista = await Promise.all(
            vinculos.map(async (vinculo): Promise<ResumoCrianca> => {
              const [progressos, acesso] = await Promise.all([
                listarProgressosPorCrianca(vinculo.criancaId),
                buscarAcesso(vinculo.criancaId),
              ]);
              return {
                vinculo,
                concluidas: progressos.filter((p) => p.status === 'concluida').length,
                ultimoAcessoEm: acesso?.ultimoAcessoEm,
                alerta: temAlertaRecente(progressos),
              };
            })
          );
          setResumos(lista);
        } catch (erro) {
          mostrarAlerta('Erro', 'Não foi possível carregar as crianças. Tente novamente.');
        }
        setCarregando(false);
      }

      carregarResumos();
    }, [])
  );

  const comAlerta = resumos.filter((r) => r.alerta);

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho titulo="Painel" subtitulo={usuario ? `Olá, ${usuario.nome}!` : undefined} />

      <View style={estilos.navContainer}>
        <TouchableOpacity style={estilos.botao} onPress={() => router.push('/cadastro-crianca')}>
          <Text style={estilos.botaoTexto}>+ Cadastrar criança</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botao} onPress={() => router.push('/vincular-crianca')}>
          <Text style={estilos.botaoTexto}>Vincular com código</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[estilos.botao, estilos.botaoSecundario]} onPress={sair}>
          <Text style={estilos.botaoTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.conteudo}>
        {comAlerta.length > 0 && (
          <AlertaAnsiedade
            titulo="Atenção: ansiedade elevada"
            mensagem={
              `${comAlerta.map((r) => r.vinculo.criancaNome).join(', ')} ` +
              'apresentou pontuação elevada em atividades recentes. O app não faz diagnóstico: ' +
              'converse com a criança e procure orientação de um profissional de saúde ' +
              '(psicólogo(a) ou psiquiatra infantil).'
            }
          />
        )}

        {carregando ? (
          <Text style={estilos.vazio}>Carregando...</Text>
        ) : resumos.length === 0 ? (
          <Text style={estilos.vazio}>
            Nenhuma criança vinculada ainda. Cadastre uma criança ou vincule usando o código.
          </Text>
        ) : (
          resumos.map((resumo) => (
            <TouchableOpacity
              key={resumo.vinculo.id}
              style={estilos.cartao}
              onPress={() => router.push('/acompanhamento/' + resumo.vinculo.criancaId)}
            >
              <Text style={estilos.nomeCrianca}>{resumo.vinculo.criancaNome}</Text>
              <Text style={estilos.detalhe}>
                {resumo.concluidas} de {totalAtividades} atividades concluídas
              </Text>
              <Text style={estilos.detalhe}>
                Último acesso: {resumo.ultimoAcessoEm ? descreverTempo(resumo.ultimoAcessoEm) : 'ainda não acessou'}
              </Text>
              {resumo.alerta && <Text style={estilos.selo}>⚠️ Ansiedade elevada</Text>}
            </TouchableOpacity>
          ))
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
  navContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  botaoSecundario: {
    backgroundColor: cores.textoSuave,
  },
  botaoTexto: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: 'bold',
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.azulSuave,
  },
  nomeCrianca: {
    fontSize: 18,
    fontWeight: '800',
    color: cores.texto,
    marginBottom: 6,
  },
  detalhe: {
    fontSize: 14,
    color: cores.textoSuave,
    marginTop: 2,
  },
  selo: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: cores.alertaTexto,
  },
});
