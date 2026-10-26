import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CabecalhoLontra from '../src/componentes/CabecalhoLontra';
import BarraNavegacao from '../src/componentes/BarraNavegacao';

export default function TelaTrilha() {
  return (
    <View style={estilos.wrapper}>
      <ScrollView contentContainerStyle={estilos.container}>
        {/* Topo com Lontra e Saudação */}
        <CabecalhoLontra nomeUsuario="Gabriel" />

        <Text style={estilos.tituloTrilha}>Trilha: Na escola</Text>

        {/* Mapa / Caminho da Trilha */}
        <View style={estilos.trilhaArea}>

          {/* Nó 1: Concluído */}
          <TouchableOpacity style={[estilos.noBase, estilos.noPos1, estilos.noConcluido]}>
            <Ionicons name="checkmark-sharp" size={36} color="#FBE492" />
          </TouchableOpacity>

          {/* Nó 2: Em andamento / Atual */}
          <TouchableOpacity
            style={[estilos.noBase, estilos.noPos2]}
            onPress={() => router.push('/atividade')}
          >
            <Ionicons name="play" size={32} color="#3B729F" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Nó 3 */}
          <TouchableOpacity style={[estilos.noBase, estilos.noPos3]}>
            <Ionicons name="play" size={32} color="#3B729F" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Nó 4 */}
          <TouchableOpacity style={[estilos.noBase, estilos.noPos4]}>
            <Ionicons name="play" size={32} color="#3B729F" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Nó 5 */}
          <TouchableOpacity style={[estilos.noBase, estilos.noPos5]}>
            <Ionicons name="play" size={32} color="#3B729F" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Nó 6 */}
          <TouchableOpacity style={[estilos.noBase, estilos.noPos6]}>
            <Ionicons name="play" size={32} color="#3B729F" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Barra Inferior */}
      <BarraNavegacao />
    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFCE6',
  },
  container: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  tituloTrilha: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1C2A3A',
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  trilhaArea: {
    height: 480,
    position: 'relative',
    marginHorizontal: 20,
  },
  noBase: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FBE492',
    borderWidth: 3,
    borderColor: '#3B729F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 3,
  },
  noConcluido: {
    backgroundColor: '#A0CFEC',
  },
  /* Posições em S ao longo da trilha */
  noPos1: { top: 10, left: 20 },
  noPos2: { top: 80, left: 120 },
  noPos3: { top: 160, left: 210 },
  noPos4: { top: 240, left: 100 },
  noPos5: { top: 310, left: 180 },
  noPos6: { top: 380, left: 260 },
});