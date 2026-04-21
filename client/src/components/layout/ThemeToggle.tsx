import { useTranslation } from 'react-i18next'
import { IconMoon, IconSun } from '../icons'
import { useTheme } from '../../theme/ThemeProvider'

type Props = { appearance?: 'default' | 'onDark' }

export function ThemeToggle({ appearance = 'default' }: Props) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const shell =
    appearance === 'onDark'
      ? 'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-amber-200 shadow-sm transition hover:bg-white/15'
      : 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-amber-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={shell}
      aria-pressed={isDark}
      aria-label={isDark ? t('theme.light') : t('theme.dark')}
      title={isDark ? t('theme.light') : t('theme.dark')}
    >
      {isDark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
    </button>
  )
}
