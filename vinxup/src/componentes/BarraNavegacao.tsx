import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BarraNavegacaoProps = {
  abaAtiva?: string;
  onNavegar?: (aba: string) => void;
};

export default function BarraNavegacao({ abaAtiva = 'home', onNavegar }: BarraNavegacaoProps) {
  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoIcone} onPress={() => onNavegar?.('home')}>
        <View style={estilos.circuloIcone}>
          <Ionicons name="home-outline" size={28} color="#FBE492" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoIcone} onPress={() => onNavegar?.('livros')}>
        <View style={estilos.circuloIcone}>
          <Ionicons name="book-outline" size={28} color="#FBE492" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoIcone} onPress={() => onNavegar?.('historico')}>
        <View style={estilos.circuloIcone}>
          <Ionicons name="time-outline" size={28} color="#FBE492" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoIcone} onPress={() => onNavegar?.('perfil')}>
        <View style={estilos.circuloIcone}>
          <Ionicons name="person-outline" size={28} color="#FBE492" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#98C5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  botaoIcone: {
    padding: 4,
  },
  circuloIcone: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B729F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FBE492',
  },
});