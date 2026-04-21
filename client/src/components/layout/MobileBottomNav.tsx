import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { IconSearch, IconUser } from '../icons'

function Item({
  to,
  label,
  children,
}: {
  to: string
  label: string
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
          isActive
            ? 'text-brand-700 dark:text-brand-400'
            : 'text-ink-500 dark:text-slate-400'
        }`
      }
    >
      {children}
      <span>{label}</span>
    </NavLink>
  )
}

export function MobileBottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/20 lg:hidden"
      aria-label={t('nav.primary')}
    >
      <Item to="/" label={t('nav.home')}>
        <span className="text-lg" aria-hidden>
          ⌂
        </span>
      </Item>
      <Item to="/search" label={t('nav.explore')}>
        <IconSearch className="h-5 w-5" />
      </Item>
      <Item to="/account/trips" label={t('nav.bookings')}>
        <span className="text-lg" aria-hidden>
          ◫
        </span>
      </Item>
      <Item to="/account" label={t('nav.account')}>
        <IconUser className="h-5 w-5" />
      </Item>
    </nav>
  )
}
