import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import Cabecalho from '../componentes/Cabecalho';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { vincularPorCodigo } from '../services/VinculoService';
import { mostrarAlerta } from '../utils/alerta';
import { cores } from '../utils/tema';

// Um segundo responsável (ou mais) se vincula a uma criança que já existe,
// usando o código de vínculo dela.
export default function TelaVincularCrianca() {
  const [codigo, setCodigo] = useState('');

  useFocusEffect(
    useCallback(() => {
      const usuario = getUsuarioLogado();
      if (!usuario) {
        router.replace('/login');
        return;
      }
      if (usuario.tipo !== 'responsavel') {
        router.replace(rotaInicial(usuario));
      }
    }, [])
  );

  async function aoVincular() {
    const responsavel = getUsuarioLogado();
    if (!responsavel) {
      router.replace('/login');
      return;
    }
    if (!codigo.trim()) {
      mostrarAlerta('Atenção', 'Digite o código de vínculo da criança.');
      return;
    }

    try {
      const vinculo = await vincularPorCodigo(responsavel, codigo);
      if (!vinculo) {
        mostrarAlerta('Código não encontrado', 'Confira o código e tente novamente.');
        return;
      }
      mostrarAlerta('Criança vinculada!', `Agora você acompanha ${vinculo.criancaNome}.`);
      router.replace('/painel');
    } catch (erro) {
      mostrarAlerta(
        'Não foi possível vincular',
        'Verifique o código. Se você já está vinculado a esta criança, ela já aparece no seu painel.'
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho
        titulo="Vincular criança"
        subtitulo="Peça o código de vínculo ao responsável que cadastrou a criança, ou veja em “Perfil”, no app da criança"
      />

      <Text style={estilos.rotulo}>Código de vínculo</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ex.: K7M2QX"
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      <TouchableOpacity style={estilos.botao} onPress={aoVincular}>
        <Text style={estilos.textoBotao}>Vincular</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  rotulo: {
    fontSize: 14,
    color: cores.texto,
    marginTop: 16,
    marginBottom: 4,
  },
  entrada: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 14,
    padding: 12,
    fontSize: 18,
    letterSpacing: 2,
  },
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
