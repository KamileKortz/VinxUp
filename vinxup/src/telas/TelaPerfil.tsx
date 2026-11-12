import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BarraNavegacao from '../componentes/BarraNavegacao';
import Cabecalho from '../componentes/Cabecalho';
import { deslogar, getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { listarVinculosDaCrianca } from '../services/VinculoService';
import { Usuario } from '../types/Usuario';
import { Vinculo } from '../types/Vinculo';
import { cores } from '../utils/tema';

export default function TelaPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);

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
      if (logado.tipo !== 'crianca') {
        router.replace(rotaInicial(logado));
        return;
      }
      setUsuario(logado);
      const idCrianca = logado.id;

      async function carregar() {
        try {
          setVinculos(await listarVinculosDaCrianca(idCrianca));
        } catch (erro) {
          setVinculos([]);
        }
      }

      carregar();
    }, [])
  );

  return (
    <View style={estilos.wrapper}>
      <ScrollView contentContainerStyle={estilos.container}>
        <Cabecalho titulo="Meu perfil" subtitulo={usuario?.email} />

        <View style={estilos.conteudo}>
          <View style={estilos.cartao}>
            <Text style={estilos.nome}>{usuario?.nome}</Text>
            <Text style={estilos.detalhe}>Nascimento: {usuario?.dataNascimento}</Text>
          </View>

          <View style={estilos.cartao}>
            <Text style={estilos.secao}>Meus responsáveis</Text>
            {vinculos.length === 0 ? (
              <Text style={estilos.detalhe}>Nenhum responsável vinculado.</Text>
            ) : (
              vinculos.map((v) => (
                <Text key={v.id} style={estilos.detalhe}>
                  • {v.responsavelNome}
                </Text>
              ))
            )}
            <Text style={[estilos.detalhe, estilos.espaco]}>
              Código para vincular outro responsável:
            </Text>
            <Text style={estilos.codigo}>{usuario?.codigoVinculo ?? '-'}</Text>
          </View>

          <TouchableOpacity style={estilos.botao} onPress={() => router.push('/amigo')}>
            <Text style={estilos.textoBotao}>🦦 Meu Amigo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.botao, estilos.botaoSair]} onPress={sair}>
            <Text style={estilos.textoBotao}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BarraNavegacao abaAtiva="perfil" />
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
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.azulSuave,
  },
  nome: {
    fontSize: 20,
    fontWeight: '800',
    color: cores.texto,
  },
  secao: {
    fontSize: 16,
    fontWeight: '800',
    color: cores.texto,
    marginBottom: 6,
  },
  detalhe: {
    fontSize: 14,
    color: cores.textoSuave,
    marginTop: 2,
  },
  espaco: {
    marginTop: 10,
  },
  codigo: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
    color: cores.azul,
    marginTop: 4,
  },
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoSair: {
    backgroundColor: cores.textoSuave,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
