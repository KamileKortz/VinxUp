import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Cabecalho from '../componentes/Cabecalho';
import { deslogar, getUsuarioLogado } from '../services/SessaoService';
import { Usuario } from '../types/Usuario';

export default function TelaInicio() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Protege a tela: sem usuário logado, volta para o login.
  useFocusEffect(
    useCallback(() => {
      const usuarioLogado = getUsuarioLogado();
      if (!usuarioLogado) {
        router.replace('/');
        return;
      }
      setUsuario(usuarioLogado);
    }, [])
  );

  function aoSair() {
    deslogar();
    router.replace('/');
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho titulo="VinxUp" subtitulo={usuario ? `Olá, ${usuario.nome}!` : undefined} />

      <Text style={estilos.texto}>Tela inicial: comece a construir o VinxUp a partir daqui.</Text>

      <TouchableOpacity style={estilos.botao} onPress={aoSair}>
        <Text style={estilos.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  texto: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    marginHorizontal: 20,
  },
  botao: {
    backgroundColor: '#4A90D9',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 20,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
