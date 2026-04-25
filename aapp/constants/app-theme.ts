export type ColorSchemeName = 'light' | 'dark';

const shared = {
  radius: {
    card: 18,
    input: 12,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 16,
    xl: 20,
  },
  typography: {
    h1: 30,
    h2: 24,
    title: 18,
    body: 14,
    caption: 12,
  },
} as const;

export const AppThemes = {
  light: {
    colors: {
      canvas: '#FAFAFA',
      elevated: '#FFFFFF',
      elevatedMuted: '#F5F5F5',
      elevatedSoft: '#F8FAFC',
      line: '#E5E5E5',
      lineStrong: '#D4D4D4',
      text: '#171717',
      textSecondary: '#525252',
      muted: '#737373',
      placeholder: '#A3A3A3',
      brand: '#2563EB',
      brandDark: '#1D4ED8',
      brandSoft: '#DBEAFE',
      success: '#10B981',
      warning: '#F97316',
      danger: '#EF4444',
      white: '#FFFFFF',
      inkOnDark: '#0a1328',
      headerSurface: 'rgba(255,255,255,0.92)',
      navSurface: 'rgba(255,255,255,0.88)',
      navBorder: 'rgba(23,23,23,0.08)',
    },
    ...shared,
  },
  dark: {
    colors: {
      canvas: '#070b18',
      elevated: '#0b1020',
      elevatedMuted: 'rgba(255,255,255,0.06)',
      elevatedSoft: 'rgba(255,255,255,0.04)',
      line: 'rgba(255,255,255,0.10)',
      lineStrong: 'rgba(255,255,255,0.16)',
      text: '#f8fafc',
      textSecondary: 'rgba(226,232,240,0.75)',
      muted: 'rgba(226,232,240,0.55)',
      placeholder: 'rgba(226,232,240,0.45)',
      brand: '#2563EB',
      brandDark: '#1D4ED8',
      brandSoft: 'rgba(37,99,235,0.20)',
      success: '#10B981',
      warning: '#F97316',
      danger: '#EF4444',
      white: '#FFFFFF',
      inkOnDark: '#0a1328',
      headerSurface: 'rgba(8,15,35,0.90)', // like web (#080f23/90)
      navSurface: 'rgba(11,16,32,0.80)',   // like business mobile nav (#0b1020/80)
      navBorder: 'rgba(255,255,255,0.12)',
    },
    ...shared,
  },
} as const;

export type AppThemeTokens = (typeof AppThemes)[keyof typeof AppThemes];

export function getAppTheme(scheme: ColorSchemeName): AppThemeTokens {
  return AppThemes[scheme];
}

// Backwards-compatible default (light). Prefer `useAppTheme()` going forward.
export const AppTheme = AppThemes.light;
