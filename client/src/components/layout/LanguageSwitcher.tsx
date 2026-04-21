import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronDown } from '../icons'

const LANGS = ['en', 'fr', 'rw'] as const

type Props = { appearance?: 'default' | 'onDark' }

export function LanguageSwitcher({ appearance = 'default' }: Props) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          appearance === 'onDark'
            ? 'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-white hover:bg-white/10'
            : 'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-ink-700 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-700/60'
        }
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('lang.label')}
      >
        {LANGS.includes(i18n.language as (typeof LANGS)[number])
          ? (i18n.language as string).toUpperCase()
          : 'EN'}
        <IconChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>
      {open ? (
        <ul
          className="absolute right-0 z-50 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lift dark:border-slate-600 dark:bg-slate-800"
          role="listbox"
        >
          {LANGS.map((code) => (
            <li key={code} role="option" aria-selected={i18n.language === code}>
              <button
                type="button"
                className={`flex w-full px-3 py-2 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/80 ${
                  i18n.language === code
                    ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-200'
                    : 'text-ink-800 dark:text-slate-100'
                }`}
                onClick={() => {
                  void i18n.changeLanguage(code)
                  setOpen(false)
                }}
              >
                {t(`lang.${code}`)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
