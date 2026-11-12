import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import Cabecalho from '../componentes/Cabecalho';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { cadastrarCriancaVinculada } from '../services/UsuarioService';
import { criarVinculo } from '../services/VinculoService';
import { mostrarAlerta } from '../utils/alerta';
import { cores } from '../utils/tema';

// Cadastro da CRIANÇA (RF-02): feito por um responsável logado, que já fica
// vinculado a ela.
export default function TelaCadastroCrianca() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

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

  async function aoCadastrar() {
    const responsavel = getUsuarioLogado();
    if (!responsavel || responsavel.tipo !== 'responsavel') {
      router.replace('/login');
      return;
    }

    if (!nome.trim() || !email.trim() || !dataNascimento.trim() || !senha.trim()) {
      mostrarAlerta('Atenção', 'Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    try {
      const crianca = await cadastrarCriancaVinculada(responsavel, {
        nome: nome.trim(),
        email: email.trim(),
        dataNascimento: dataNascimento.trim(),
        senha,
      });
      const codigo = crianca.codigoVinculo ?? '';
      await criarVinculo(responsavel, { id: crianca.id, nome: crianca.nome }, codigo);

      mostrarAlerta(
        'Criança cadastrada!',
        `${crianca.nome} já pode entrar como "usuário" com o email e a senha cadastrados.\n\n` +
          `Para vincular outro responsável a ${crianca.nome}, use o código: ${codigo}`
      );
      router.replace('/painel');
    } catch (erro) {
      mostrarAlerta(
        'Não foi possível cadastrar',
        'Verifique o email (ele não pode já estar em uso) e use uma senha com pelo menos 6 caracteres.'
      );
    }
    setSalvando(false);
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho titulo="Cadastrar criança" subtitulo="A criança entra com este email e senha" />

      <Text style={estilos.rotulo}>Nome</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Nome da criança"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={estilos.rotulo}>Email da criança</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="crianca@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={estilos.rotulo}>Data de nascimento</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ex.: 12/08/2015"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <Text style={estilos.rotulo}>Senha</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Crie uma senha para a criança"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={[estilos.botao, salvando && estilos.botaoDesativado]}
        onPress={aoCadastrar}
        disabled={salvando}
      >
        <Text style={estilos.textoBotao}>{salvando ? 'Cadastrando...' : 'Cadastrar criança'}</Text>
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
    fontSize: 14,
  },
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
