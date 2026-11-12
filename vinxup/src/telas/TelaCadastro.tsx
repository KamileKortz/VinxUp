import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import Cabecalho from '../componentes/Cabecalho';
import { auth } from '../services/firebase';
import { carregarUsuarioLogado } from '../services/SessaoService';
import { cadastrarUsuario } from '../services/UsuarioService';
import { mostrarAlerta } from '../utils/alerta';
import { cores } from '../utils/tema';

// Cadastro do RESPONSÁVEL (RF-01). A criança é cadastrada depois, pelo
// responsável já logado (TelaCadastroCrianca, RF-02).
export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');

  async function aoCriarConta() {
    if (!nome.trim() || !email.trim() || !dataNascimento.trim() || !senha.trim()) {
      mostrarAlerta('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await cadastrarUsuario(credencial.user.uid, {
        nome: nome.trim(),
        email: email.trim(),
        dataNascimento: dataNascimento.trim(),
        tipo: 'responsavel',
      });
      // createUserWithEmailAndPassword já loga automaticamente quem acabou de
      // se cadastrar, então atualizamos a sessão local e vamos direto para o
      // painel, sem pedir para o usuário logar de novo.
      await carregarUsuarioLogado(credencial.user.uid);
      router.replace('/painel');
    } catch (erro) {
      mostrarAlerta(
        'Não foi possível criar a conta',
        'Verifique o email e use uma senha com pelo menos 6 caracteres.'
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho titulo="Criar conta" subtitulo="Cadastro de responsável" />

      <Text style={estilos.rotulo}>Nome</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Seu nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={estilos.rotulo}>Email</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={estilos.rotulo}>Data de nascimento</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ex.: 24/04/1985"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <Text style={estilos.rotulo}>Senha</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Crie uma senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={estilos.botao} onPress={aoCriarConta}>
        <Text style={estilos.textoBotao}>Criar conta</Text>
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
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
