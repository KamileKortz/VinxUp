import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

import SeletorPilula from '../componentes/SeletorPilula';
import { auth } from '../services/firebase';
import { carregarUsuarioLogado, deslogar, getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { TipoUsuario } from '../types/Usuario';
import { mostrarAlerta } from '../utils/alerta';
import { cores } from '../utils/tema';

export default function TelaLogin() {
  const [tipo, setTipo] = useState<TipoUsuario>('responsavel');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function aoEntrar() {
    if (!email.trim() || !senha.trim()) {
      mostrarAlerta('Atenção', 'Preencha email e senha.');
      return;
    }

    try {
      const credencial = await signInWithEmailAndPassword(auth, email.trim(), senha);
      await carregarUsuarioLogado(credencial.user.uid);
      const usuario = getUsuarioLogado();

      if (!usuario) {
        await deslogar();
        mostrarAlerta('Conta incompleta', 'Não encontramos o perfil desta conta.');
        return;
      }

      // Verificação do tipo de usuário: a conta precisa ser do tipo que foi
      // escolhido no seletor (responsável ou usuário/criança).
      if (usuario.tipo !== tipo) {
        await deslogar();
        mostrarAlerta(
          'Tipo de conta incorreto',
          usuario.tipo === 'responsavel'
            ? 'Esta conta é de responsável. Escolha "Sou responsável".'
            : 'Esta conta é de usuário (criança). Escolha "Sou usuário".'
        );
        return;
      }

      router.replace(rotaInicial(usuario));
    } catch (erro) {
      mostrarAlerta('Não foi possível entrar', 'Email ou senha incorretos.');
    }
  }

  async function aoEsquecerSenha() {
    if (!email.trim()) {
      mostrarAlerta('Atenção', 'Digite seu email para receber o link de redefinição.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      mostrarAlerta('Verifique seu email', 'Enviamos um link para você criar uma nova senha.');
    } catch (erro) {
      mostrarAlerta('Não foi possível enviar', 'Confira o email digitado e tente novamente.');
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.avatarCirculo}>
        <Image
          source={require('../../assets/VinxUp.png')}
          style={estilos.lontraAvatar}
          resizeMode="contain"
        />
      </View>

      <Text style={estilos.titulo}>Bem-vindo(a)!</Text>
      <Text style={estilos.subtitulo}>Entre para continuar sua trilha!</Text>

      <SeletorPilula
        opcoes={[
          { valor: 'responsavel', rotulo: 'Sou responsável' },
          { valor: 'crianca', rotulo: 'Sou usuário' },
        ]}
        valor={tipo}
        onChange={setTipo}
      />

      <View style={estilos.form}>
        <Text style={estilos.rotulo}>Email</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="email@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={estilos.rotulo}>Senha</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="******"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={estilos.botao} onPress={aoEntrar}>
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.link} onPress={aoEsquecerSenha}>
          <Text style={estilos.textoLink}>Esqueci minha senha</Text>
        </TouchableOpacity>

        {tipo === 'responsavel' ? (
          <TouchableOpacity style={estilos.link} onPress={() => router.push('/cadastro')}>
            <Text style={estilos.textoLink}>Não tem conta? Cadastre-se como responsável</Text>
          </TouchableOpacity>
        ) : (
          <Text style={estilos.dica}>
            A conta de usuário é criada pelo seu responsável. Peça a ele para cadastrar você.
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
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  avatarCirculo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: cores.amarelo,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lontraAvatar: {
    width: 110,
    height: 110,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: cores.texto,
  },
  subtitulo: {
    fontSize: 16,
    color: cores.azul,
    marginTop: 4,
    marginBottom: 24,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    marginTop: 24,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 6,
    marginTop: 10,
  },
  entrada: {
    backgroundColor: cores.branco,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: cores.azul,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
    marginTop: 16,
  },
  textoLink: {
    color: '#2A4D6C',
    fontSize: 14,
    fontWeight: '600',
  },
  dica: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: cores.textoSuave,
  },
});
