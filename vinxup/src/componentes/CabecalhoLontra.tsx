import { Image, StyleSheet, Text, View } from 'react-native';

import { cores } from '../utils/tema';

type CabecalhoLontraProps = {
  texto: string;
};

export default function CabecalhoLontra({ texto }: CabecalhoLontraProps) {
  return (
    <View style={estilos.container}>
      <Image
        source={require('../../assets/VinxUp.png')}
        style={estilos.lontra}
        resizeMode="contain"
      />
      <View style={estilos.balao}>
        <Text style={estilos.textoBalao}>{texto}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  lontra: {
    width: 65,
    height: 65,
    marginRight: -10,
    zIndex: 2,
  },
  balao: {
    backgroundColor: cores.amarelo,
    borderColor: cores.azul,
    borderWidth: 2.5,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
    justifyContent: 'center',
    flexShrink: 1,
  },
  textoBalao: {
    fontSize: 20,
    fontWeight: '800',
    color: cores.texto,
  },
});
