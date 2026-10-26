import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type CabecalhoLontraProps = {
  nomeUsuario: string;
};

export default function CabecalhoLontra({ nomeUsuario }: CabecalhoLontraProps) {
  return (
    <View style={estilos.container}>
      <Image
        source={require('../../assets/VinxUp.png')}
        style={estilos.lontra}
        resizeMode="contain"
      />
      <View style={estilos.balao}>
        <Text style={estilos.textoBalao}>Olá, {nomeUsuario}!</Text>
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
    backgroundColor: '#FBE492',
    borderColor: '#3B729F',
    borderWidth: 2.5,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  textoBalao: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C2A3A',
  },
});