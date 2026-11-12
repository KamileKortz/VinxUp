import { StyleSheet, Text, View } from 'react-native';

import { NivelAnsiedade } from '../types/Ansiedade';
import { ROTULO_NIVEL } from '../utils/ansiedade';
import { cores, coresNivel } from '../utils/tema';

type EtiquetaNivelProps = {
  nivel: NivelAnsiedade;
};

export default function EtiquetaNivel({ nivel }: EtiquetaNivelProps) {
  return (
    <View style={[estilos.container, { backgroundColor: coresNivel[nivel] }]}>
      <Text style={estilos.texto}>{ROTULO_NIVEL[nivel]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 12,
    fontWeight: '700',
    color: cores.texto,
  },
});
