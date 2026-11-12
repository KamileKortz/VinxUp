import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cores } from '../utils/tema';

type Aba = 'trilha' | 'historico' | 'perfil';

type BarraNavegacaoProps = {
  abaAtiva: Aba;
};

const ABAS: { aba: Aba; emoji: string; rota: string }[] = [
  { aba: 'trilha', emoji: '🏠', rota: '/trilha' },
  { aba: 'historico', emoji: '🕒', rota: '/historico' },
  { aba: 'perfil', emoji: '👤', rota: '/perfil' },
];

export default function BarraNavegacao({ abaAtiva }: BarraNavegacaoProps) {
  return (
    <View style={estilos.container}>
      {ABAS.map((item) => (
        <TouchableOpacity
          key={item.aba}
          style={estilos.botaoIcone}
          onPress={() => {
            if (item.aba !== abaAtiva) router.replace(item.rota);
          }}
        >
          <View style={[estilos.circuloIcone, item.aba === abaAtiva && estilos.circuloAtivo]}>
            <Text style={estilos.emoji}>{item.emoji}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: cores.azulClaro,
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
    backgroundColor: cores.azul,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: cores.amarelo,
  },
  circuloAtivo: {
    backgroundColor: cores.amarelo,
    borderColor: cores.azul,
  },
  emoji: {
    fontSize: 24,
  },
});
