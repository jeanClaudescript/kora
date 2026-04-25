import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAppTheme, type AppThemeTokens, type ColorSchemeName } from '@/constants/app-theme';

export type ThemeMode = 'system' | ColorSchemeName;

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  scheme: ColorSchemeName;
  theme: AppThemeTokens;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const systemScheme = (useColorScheme() ?? 'light') as ColorSchemeName;
  const [mode, setMode] = useState<ThemeMode>('system');
  const scheme: ColorSchemeName = mode === 'system' ? systemScheme : mode;
  const theme = useMemo(() => getAppTheme(scheme), [scheme]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      scheme,
      theme,
    }),
    [mode, scheme, theme],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}

