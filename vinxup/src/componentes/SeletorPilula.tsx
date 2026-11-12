import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cores } from '../utils/tema';

type Opcao<T extends string> = {
  valor: T;
  rotulo: string;
};

type SeletorPilulaProps<T extends string> = {
  opcoes: Opcao<T>[];
  valor: T;
  onChange: (valor: T) => void;
};

// Toggle em formato de pílula (ex.: "Sou responsável" / "Sou usuário").
export default function SeletorPilula<T extends string>({
  opcoes,
  valor,
  onChange,
}: SeletorPilulaProps<T>) {
  return (
    <View style={estilos.container}>
      {opcoes.map((opcao) => (
        <TouchableOpacity
          key={opcao.valor}
          style={[estilos.opcao, valor === opcao.valor && estilos.opcaoAtiva]}
          onPress={() => onChange(opcao.valor)}
        >
          <Text style={[estilos.texto, valor === opcao.valor && estilos.textoAtivo]}>
            {opcao.rotulo}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: cores.azulSuave,
    borderRadius: 25,
    padding: 4,
    width: '100%',
  },
  opcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  opcaoAtiva: {
    backgroundColor: cores.branco,
  },
  texto: {
    fontSize: 14,
    color: cores.textoSuave,
    fontWeight: '600',
  },
  textoAtivo: {
    color: cores.texto,
    fontWeight: '700',
  },
});
