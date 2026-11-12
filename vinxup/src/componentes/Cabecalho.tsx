import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../utils/tema';

type CabecalhoProps = {
  titulo: string;
  subtitulo?: string;
};

export default function Cabecalho({ titulo, subtitulo }: CabecalhoProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: cores.texto,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSuave,
    marginTop: 4,
  },
});
