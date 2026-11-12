import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Cabecalho from '../componentes/Cabecalho';
import SeletorPilula from '../componentes/SeletorPilula';
import { AMIGO_PADRAO, buscarAmigo, salvarAmigo } from '../services/AmigoService';
import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { GeneroAmigo } from '../types/Amigo';
import { mostrarAlerta } from '../utils/alerta';
import { cores } from '../utils/tema';

const ESPECIES = [
  { valor: 'gato', emoji: '🐱' },
  { valor: 'cachorro', emoji: '🐶' },
  { valor: 'coelho', emoji: '🐰' },
  { valor: 'urso', emoji: '🐻' },
  { valor: 'raposa', emoji: '🦊' },
  { valor: 'panda', emoji: '🐼' },
];

const CORES_AMIGO = [
  { valor: 'azul', hex: '#98C5E9' },
  { valor: 'amarelo', hex: '#FBE492' },
  { valor: 'rosa', hex: '#F8C8DC' },
  { valor: 'verde', hex: '#BFE3C0' },
  { valor: 'lilas', hex: '#D9C8F0' },
];

// Personalização do personagem "Amigo": é nele que a criança projeta as
// situações das histórias (abordagem indireta da TCC infantil).
export default function TelaAmigo() {
  const [nome, setNome] = useState(AMIGO_PADRAO.nome);
  const [genero, setGenero] = useState<GeneroAmigo>(AMIGO_PADRAO.genero);
  const [especie, setEspecie] = useState(AMIGO_PADRAO.especie);
  const [cor, setCor] = useState(AMIGO_PADRAO.cor);

  useFocusEffect(
    useCallback(() => {
      const usuario = getUsuarioLogado();
      if (!usuario) {
        router.replace('/login');
        return;
      }
      if (usuario.tipo !== 'crianca') {
        router.replace(rotaInicial(usuario));
        return;
      }
      const idCrianca = usuario.id;

      async function carregar() {
        try {
          const amigo = await buscarAmigo(idCrianca);
          setNome(amigo.nome);
          setGenero(amigo.genero);
          setEspecie(amigo.especie);
          setCor(amigo.cor);
        } catch (erro) {
          mostrarAlerta('Erro', 'Não foi possível carregar o seu Amigo.');
        }
      }

      carregar();
    }, [])
  );

  async function aoSalvar() {
    const usuario = getUsuarioLogado();
    if (!usuario) {
      router.replace('/login');
      return;
    }
    if (!nome.trim()) {
      mostrarAlerta('Atenção', 'Dê um nome ao seu Amigo.');
      return;
    }
    try {
      await salvarAmigo(usuario.id, { nome: nome.trim(), genero, especie, cor });
      mostrarAlerta('Pronto!', `${nome.trim()} está do jeitinho que você quer.`);
      router.back();
    } catch (erro) {
      mostrarAlerta('Não foi possível salvar', 'Tente novamente.');
    }
  }

  const emojiAtual = ESPECIES.find((e) => e.valor === especie)?.emoji ?? '🐱';
  const corAtual = CORES_AMIGO.find((c) => c.valor === cor)?.hex ?? cores.azulClaro;

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Cabecalho titulo="Meu Amigo" subtitulo="Crie o personagem das histórias" />

      <View style={estilos.conteudo}>
        <View style={[estilos.previa, { backgroundColor: corAtual }]}>
          <Text style={estilos.previaEmoji}>{emojiAtual}</Text>
        </View>

        <Text style={estilos.rotulo}>Nome</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Nome do seu Amigo"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={estilos.rotulo}>Gênero</Text>
        <SeletorPilula
          opcoes={[
            { valor: 'menino', rotulo: 'Menino' },
            { valor: 'menina', rotulo: 'Menina' },
            { valor: 'neutro', rotulo: 'Neutro' },
          ]}
          valor={genero}
          onChange={setGenero}
        />

        <Text style={estilos.rotulo}>Espécie</Text>
        <View style={estilos.linha}>
          {ESPECIES.map((item) => (
            <TouchableOpacity
              key={item.valor}
              style={[estilos.ficha, especie === item.valor && estilos.fichaAtiva]}
              onPress={() => setEspecie(item.valor)}
            >
              <Text style={estilos.fichaEmoji}>{item.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={estilos.rotulo}>Cor</Text>
        <View style={estilos.linha}>
          {CORES_AMIGO.map((item) => (
            <TouchableOpacity
              key={item.valor}
              style={[
                estilos.bolinha,
                { backgroundColor: item.hex },
                cor === item.valor && estilos.bolinhaAtiva,
              ]}
              onPress={() => setCor(item.valor)}
            />
          ))}
        </View>

        <TouchableOpacity style={estilos.botao} onPress={aoSalvar}>
          <Text style={estilos.textoBotao}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: cores.fundo,
    paddingTop: 30,
    paddingBottom: 40,
  },
  conteudo: {
    marginHorizontal: 24,
  },
  previa: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  previaEmoji: {
    fontSize: 64,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.texto,
    marginTop: 16,
    marginBottom: 6,
  },
  entrada: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 14,
    padding: 12,
    fontSize: 16,
  },
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ficha: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.azulSuave,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fichaAtiva: {
    borderColor: cores.azul,
    backgroundColor: cores.amarelo,
  },
  fichaEmoji: {
    fontSize: 28,
  },
  bolinha: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: cores.branco,
  },
  bolinhaAtiva: {
    borderColor: cores.azul,
    borderWidth: 3,
  },
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
