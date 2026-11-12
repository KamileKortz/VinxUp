import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../utils/tema';

type AlertaAnsiedadeProps = {
  titulo: string;
  mensagem: string;
};

// Aviso exibido quando a pontuação de ansiedade passa do limite considerado
// seguro: orienta a procurar ajuda profissional (não é um diagnóstico).
export default function AlertaAnsiedade({ titulo, mensagem }: AlertaAnsiedadeProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>⚠️ {titulo}</Text>
      <Text style={estilos.mensagem}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: cores.alertaFundo,
    borderColor: cores.alertaBorda,
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: cores.alertaTexto,
    marginBottom: 6,
  },
  mensagem: {
    fontSize: 14,
    lineHeight: 20,
    color: cores.alertaTexto,
  },
});
