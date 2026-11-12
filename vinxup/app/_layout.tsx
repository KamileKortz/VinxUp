import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { observarSessao } from '../src/services/SessaoService';
import { cores } from '../src/utils/tema';

export default function Layout() {
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // Portão de carregamento: nenhuma tela é montada até o Firebase Auth
  // responder se existe uma sessão salva (assim nenhuma tela protegida
  // manda para o login um usuário que, na verdade, já estava logado).
  useEffect(() => {
    const cancelarObservador = observarSessao(() => setCarregandoSessao(false));
    return cancelarObservador;
  }, []);

  if (carregandoSessao) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.azul} />
      </View>
    );
  }

  // Telas da criança não têm cabeçalho (layout próprio, com a lontra).
  // Telas do responsável usam o cabeçalho padrão, que traz o botão de voltar.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: cores.azul,
        headerStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" options={{ headerShown: true, title: 'Cadastro' }} />
      <Stack.Screen name="trilha" />
      <Stack.Screen name="historico" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="amigo" options={{ headerShown: true, title: 'Meu Amigo' }} />
      <Stack.Screen name="painel" options={{ title: 'Painel do responsável' }} />
      <Stack.Screen name="cadastro-crianca" options={{ headerShown: true, title: 'Cadastrar criança' }} />
      <Stack.Screen name="vincular-crianca" options={{ headerShown: true, title: 'Vincular criança' }} />
      <Stack.Screen name="acompanhamento/[id]" options={{ headerShown: true, title: 'Acompanhamento' }} />
    </Stack>
  );
}
