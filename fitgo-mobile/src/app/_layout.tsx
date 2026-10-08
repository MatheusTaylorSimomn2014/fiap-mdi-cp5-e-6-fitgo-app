import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Layout raiz do FitGo: define a navegação — abas principais (Home, Treinos,
 * Progresso, Perfil) + tela de detalhe do treino. As cores da marca são
 * aplicadas via hook useTheme (constants/colors.ts) em cada tela.
 */
export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: 'Treino',
          headerStyle: { backgroundColor: colors.backgroundElement },
          headerTintColor: colors.text,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}
