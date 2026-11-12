import { Image, StyleSheet, Text, View } from 'react-native';

import { cores } from '../utils/tema';

type BalaoLontraProps = {
  texto: string;
};

// O Lavi (lontra) "fala" por um balão amarelo: narração e perguntas.
export default function BalaoLontra({ texto }: BalaoLontraProps) {
  return (
    <View style={estilos.container}>
      <View style={estilos.avatar}>
        <Image
          source={require('../../assets/VinxUp.png')}
          style={estilos.lontra}
          resizeMode="contain"
        />
      </View>
      <View style={estilos.balao}>
        <Text style={estilos.texto}>{texto}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: cores.amarelo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  lontra: {
    width: 58,
    height: 58,
  },
  balao: {
    flex: 1,
    backgroundColor: cores.amarelo,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  texto: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
    color: cores.texto,
  },
});
