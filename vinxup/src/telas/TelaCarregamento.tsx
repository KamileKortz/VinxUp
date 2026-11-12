import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getUsuarioLogado, rotaInicial } from '../services/SessaoService';
import { cores } from '../utils/tema';

export default function TelaCarregamento() {
  useEffect(() => {
    // Quando esta tela monta, o portão de sessão (app/_layout.tsx) já resolveu
    // se existe alguém logado: se existir, vai direto para a tela do seu tipo.
    const temporizador = setTimeout(() => {
      const usuario = getUsuarioLogado();
      router.replace(usuario ? rotaInicial(usuario) : '/login');
    }, 2500);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <View style={estilos.container}>
      <View style={estilos.cartaoLogo}>
        <Text style={estilos.titulo}>VinxUp</Text>
        <View style={estilos.pontosContainer}>
          <View style={estilos.ponto} />
          <View style={estilos.ponto} />
          <View style={estilos.ponto} />
          <View style={estilos.ponto} />
        </View>

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
  cartaoLogo: {
    width: '80%',
    maxWidth: 420,
    backgroundColor: cores.azul,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 4,
  },
  titulo: {
    fontSize: 52,
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
    backgroundColor: cores.branco,
  },
  lontra: {
    width: 85,
    height: 85,
    position: 'absolute',
    bottom: -18,
    right: -15,
  },
});
