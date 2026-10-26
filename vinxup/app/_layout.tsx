import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="carregamento" />
      <Stack.Screen name="login" />
      <Stack.Screen name="trilha" />
      <Stack.Screen name="atividade" />
    </Stack>
  );
}