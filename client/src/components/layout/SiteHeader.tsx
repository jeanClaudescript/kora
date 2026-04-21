import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { IconMenu, IconSearch, IconUser } from '../icons'
import { GuestAuthLinks, UserMenu } from './UserMenu'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NotificationDropdown } from './NotificationDropdown'
import { ThemeToggle } from './ThemeToggle'

function navClass({ isActive }: { isActive: boolean }) {
  return `text-sm font-medium hover:text-brand-600 dark:hover:text-brand-400 ${
    isActive
      ? 'text-brand-700 dark:text-brand-300'
      : 'text-ink-700 dark:text-slate-200'
  }`
}

export function SiteHeader() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    navigate(`/search?${params.toString()}`)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--kora-line)] bg-[var(--kora-elevated)]/95 shadow-header backdrop-blur dark:shadow-header-dark">
      <div className="hidden border-b border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/90 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1.5 text-xs text-ink-500 dark:text-slate-400">
          <Link
            to="/auth/signup?role=business"
            className="font-medium text-ink-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400"
          >
            {t('header.listBusiness')}
          </Link>
          <span className="hidden md:inline">{t('header.help')}</span>
          <LanguageSwitcher />
          <span className="font-semibold text-ink-700 dark:text-slate-200">
            {t('header.currency')}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-2 md:gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-ink-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label={t('header.openMenu')}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-black text-white shadow-md">
              K
            </span>
            <div className="hidden leading-tight sm:block">
              <span className="block text-base font-bold tracking-tight text-ink-900 dark:text-white">
                Kora
              </span>
              <span className="block text-[11px] font-medium text-ink-500 dark:text-slate-400">
                {t('header.tagline')}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            <NavLink to="/search" className={navClass}>
              {t('header.explore')}
            </NavLink>
            <NavLink to="/search?category=Salon" className={navClass}>
              {t('header.salon')}
            </NavLink>
            <NavLink to="/search?category=Barber" className={navClass}>
              {t('header.barber')}
            </NavLink>
            <NavLink to="/search?category=Spa" className={navClass}>
              {t('header.spa')}
            </NavLink>
            <NavLink to="/auth/signup?role=business" className={navClass}>
              {t('header.forBusiness')}
            </NavLink>
          </nav>

          <form
            onSubmit={onSearchSubmit}
            className="mx-auto hidden min-w-0 max-w-xl flex-1 md:flex"
          >
            <div className="kora-field-shell py-1.5 shadow-sm">
              <IconSearch className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                {t('header.search')}
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <Link
              to="/search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 md:hidden"
              aria-label={t('header.ariaSearch')}
            >
              <IconSearch className="h-5 w-5" />
            </Link>
            <NotificationDropdown />
            {user ? (
              <UserMenu />
            ) : (
              <>
                <div className="hidden sm:block">
                  <GuestAuthLinks />
                </div>
                <Link
                  to="/auth/login"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:hidden"
                  aria-label={t('header.ariaAccount')}
                >
                  <IconUser className="h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>

        <form onSubmit={onSearchSubmit} className="pb-3 md:hidden">
          <div className="kora-field-shell py-2 shadow-sm">
            <IconSearch className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('header.searchMobile')}
            />
          </div>
        </form>

        {mobileOpen ? (
          <div className="border-t border-slate-100 py-3 dark:border-slate-800 lg:hidden">
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/search"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen(false)}
              >
                {t('header.explore')}
              </NavLink>
              <NavLink
                to="/search?category=Salon"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen(false)}
              >
                {t('header.salon')}
              </NavLink>
              <NavLink
                to="/search?category=Barber"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen(false)}
              >
                {t('header.barber')}
              </NavLink>
              <NavLink
                to="/auth/signup?role=business"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen(false)}
              >
                {t('header.forBusiness')}
              </NavLink>
              {!user ? (
                <div className="flex flex-col gap-2 border-t border-slate-100 px-3 pt-3 dark:border-slate-800 sm:hidden">
                  <GuestAuthLinks />
                </div>
              ) : null}
              <div className="border-t border-slate-100 px-3 pt-2 dark:border-slate-800">
                <p className="mb-1 text-xs font-bold uppercase text-ink-500 dark:text-slate-400">
                  {t('lang.label')}
                </p>
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  )
}
