import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { mostrarAlerta } from '../utils/alerta';

export default function TelaLogin() {
  const [tipoUsuario, setTipoUsuario] = useState<'responsavel' | 'usuario'>('responsavel');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function aoEntrar() {
    if (!email.trim() || !senha.trim()) {
      mostrarAlerta('Atenção', 'Por favor, informe seu e-mail e senha.');
      return;
    }
    router.replace('/trilha');
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      {/* Avatar do Topo */}
      <View style={estilos.avatarCirculo}>
        <Image
          source={require('../../assets/VinxUp.png')}
          style={estilos.lontraAvatar}
          resizeMode="contain"
        />
      </View>

      <Text style={estilos.titulo}>Bem vindo(a)!</Text>
      <Text style={estilos.subtitulo}>Entre para continuar sua trilha!</Text>

      {/* Seletor Tipo de Usuário */}
      <View style={estilos.seletorContainer}>
        <TouchableOpacity
          style={[
            estilos.opcaoSeletor,
            tipoUsuario === 'responsavel' && estilos.opcaoAtiva,
          ]}
          onPress={() => setTipoUsuario('responsavel')}
        >
          <Text
            style={[
              estilos.textoOpcao,
              tipoUsuario === 'responsavel' && estilos.textoOpcaoAtiva,
            ]}
          >
            Sou responsável
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            estilos.opcaoSeletor,
            tipoUsuario === 'usuario' && estilos.opcaoAtiva,
          ]}
          onPress={() => setTipoUsuario('usuario')}
        >
          <Text
            style={[
              estilos.textoOpcao,
              tipoUsuario === 'usuario' && estilos.textoOpcaoAtiva,
            ]}
          >
            Sou usuário
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <View style={estilos.form}>
        <Text style={estilos.rotulo}>E-mail</Text>
        <TextInput
          style={estilos.input}
          placeholder="email@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={estilos.rotulo}>Senha</Text>
        <TextInput
          style={estilos.input}
          placeholder="******"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={estilos.botaoEntrar} onPress={aoEntrar}>
          <Text style={estilos.textoBotaoEntrar}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.linkEsqueci}>
          <Text style={estilos.textoEsqueci}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EAF4FC',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  avatarCirculo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FBE492',
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
    color: '#1C2A3A',
  },
  subtitulo: {
    fontSize: 16,
    color: '#3B729F',
    marginTop: 4,
    marginBottom: 24,
  },
  seletorContainer: {
    flexDirection: 'row',
    backgroundColor: '#D0E1F0',
    borderRadius: 25,
    padding: 4,
    width: '100%',
    marginBottom: 24,
  },
  opcaoSeletor: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  opcaoAtiva: {
    backgroundColor: '#FFFFFF',
  },
  textoOpcao: {
    fontSize: 14,
    color: '#5A7A9A',
    fontWeight: '600',
  },
  textoOpcaoAtiva: {
    color: '#1C2A3A',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  rotulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C2A3A',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#3B729F',
    marginBottom: 10,
  },
  botaoEntrar: {
    backgroundColor: '#3B729F',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  textoBotaoEntrar: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkEsqueci: {
    alignItems: 'center',
    marginTop: 16,
  },
  textoEsqueci: {
    color: '#2A4D6C',
    fontSize: 14,
    fontWeight: '600',
  },
});