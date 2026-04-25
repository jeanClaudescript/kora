import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { BrandLoader } from '@/components/ui/brand-loader';
import { ThemeModeProvider, useThemeMode } from '@/providers/theme-mode-provider';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { scheme } = useThemeMode();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="listing/[slug]" options={{ title: 'Listing' }} />
        <Stack.Screen name="booking/[slug]" options={{ title: 'Booking' }} />
        <Stack.Screen name="booking/success" options={{ title: 'Success' }} />
        <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
        <Stack.Screen name="auth/signup" options={{ title: 'Signup' }} />
        <Stack.Screen name="account/messages" options={{ title: 'Messages' }} />
        <Stack.Screen name="account/trips" options={{ title: 'My bookings' }} />
        <Stack.Screen name="account/business" options={{ title: 'Business' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return <BrandLoader />;

  return (
    <ThemeModeProvider>
      <RootNavigator />
    </ThemeModeProvider>
  );
}
