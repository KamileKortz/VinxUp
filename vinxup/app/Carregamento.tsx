import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function TelaCarregamento() {
  useEffect(() => {
    // Simula o tempo de carregamento inicial do aplicativo
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={estilos.container}>
      {/* Moldura / Card Principal */}
      <View style={estilos.cardLogo}>
        <Text style={estilos.titulo}>VinxUp</Text>
        <View style={estilos.pontosContainer}>
          <View style={estilos.ponto} />
          <View style={estilos.ponto} />
          <View style={estilos.ponto} />
          <View style={estilos.ponto} />
        </View>

        {/* Mascotinha Lontra no Canto Inferior Direito */}
        <Image
          source={require('../../assets/VinxUp.png')}
          style={estilos.lontra}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E8F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogo: {
    width: '80%',
    backgroundColor: '#3B729F',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  titulo: {
    fontSize: 52,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#FFF8DC',
    letterSpacing: 1,
    marginBottom: 8,
  },
  pontosContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  ponto: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  lontra: {
    width: 85,
    height: 85,
    position: 'absolute',
    bottom: -18,
    right: -15,
  },
});