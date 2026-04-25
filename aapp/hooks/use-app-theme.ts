import { useThemeMode } from '@/providers/theme-mode-provider';

export function useAppTheme() {
  return useThemeMode().theme;
}

