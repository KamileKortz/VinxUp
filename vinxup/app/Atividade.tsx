import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';

const EMOJIS = ['😭', '🥺', '😐', '😃', '😆'];

export default function TelaAtividade() {
  const [emojiSelecionado, setEmojiSelecionado] = useState<number | null>(3);
  const [anotacao, setAnotacao] = useState('');

  function aoConcluir() {
    router.replace('/trilha');
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      {/* Mascote Lontra no Topo Superior */}
      <View style={estilos.topoLontra}>
        <Image
          source={require('../../assets/VinxUp.png')}
          style={estilos.lontraImg}
          resizeMode="contain"
        />
      </View>

      {/* Bloco 1: Pergunta do Sentimento */}
      <View style={estilos.cardBloco}>
        <View style={estilos.balaoAmarelo}>
          <Text style={estilos.textoBalao}>
            Como você se sentiu durante a atividade?
          </Text>
        </View>

        <View style={estilos.emojisContainer}>
          {EMOJIS.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={[
                estilos.emojiItem,
                emojiSelecionado === index && estilos.emojiSelecionado,
              ]}
              onPress={() => setEmojiSelecionado(index)}
            >
              <Text style={estilos.emojiTexto}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bloco 2: Anotações estilo Caderno Pautado */}
      <View style={estilos.cardBloco}>
        <View style={estilos.balaoAmarelo}>
          <Text style={estilos.textoBalao}>
            Gostaria de adicionar uma anotação sobre essa atividade?
          </Text>
        </View>

        <View style={estilos.cadernoBox}>
          <TextInput
            style={estilos.inputCaderno}
            multiline
            numberOfLines={6}
            value={anotacao}
            onChangeText={setAnotacao}
            placeholder="Digite aqui..."
            placeholderTextColor="#A0C0D8"
          />
          {/* Linhas Horizontais estilo caderno */}
          <View style={estilos.linha} />
          <View style={estilos.linha} />
          <View style={estilos.linha} />
          <View style={estilos.linha} />
        </View>
      </View>

      {/* Botões de Ação no Rodapé */}
      <View style={estilos.rodapeBotoes}>
        <TouchableOpacity
          style={estilos.botaoAmarelo}
          onPress={() => router.back()}
        >
          <Text style={estilos.textoBotao}>VOLTAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoAmarelo} onPress={aoConcluir}>
          <Text style={estilos.textoBotao}>CONCLUIR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EAF4FC',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  topoLontra: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FBE492',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  lontraImg: {
    width: 75,
    height: 75,
  },
  cardBloco: {
    marginBottom: 24,
  },
  balaoAmarelo: {
    backgroundColor: '#FBE492',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    zIndex: 2,
    marginBottom: -10,
    marginLeft: 15,
  },
  textoBalao: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C2A3A',
  },
  emojisContainer: {
    backgroundColor: '#3B729F',
    borderRadius: 22,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emojiItem: {
    padding: 6,
    borderRadius: 20,
  },
  emojiSelecionado: {
    backgroundColor: '#FBE492',
  },
  emojiTexto: {
    fontSize: 32,
  },
  cadernoBox: {
    backgroundColor: '#3B729F',
    borderRadius: 22,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'relative',
    height: 180,
  },
  inputCaderno: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 28,
    textAlignVertical: 'top',
    zIndex: 2,
  },
  linha: {
    borderBottomWidth: 1,
    borderBottomColor: '#6B98BE',
    marginTop: 22,
  },
  rodapeBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoAmarelo: {
    backgroundColor: '#FBE492',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 28,
    elevation: 2,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1C2A3A',
  },
});