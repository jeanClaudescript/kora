import { NavLink, Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'

function sideLink({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/10'
      : 'text-emerald-100/80 hover:bg-white/5 hover:text-white'
  }`
}

export function BusinessPortalLayout() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-dvh bg-[var(--kora-canvas)] text-[var(--kora-text)]">
      <aside className="relative hidden w-64 shrink-0 flex-col border-r border-emerald-800/40 bg-gradient-to-b from-emerald-950 via-zinc-950 to-zinc-950 lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <Link to="/business" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-black text-white shadow-lg">
              K
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/90">
                {t('business.badge')}
              </p>
              <p className="text-sm font-bold text-white">Kora Pro</p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <NavLink to="/business" end className={sideLink}>
            <span className="text-lg" aria-hidden>
              ◎
            </span>
            {t('business.navOverview')}
          </NavLink>
          <NavLink to="/business/insights" className={sideLink}>
            <span className="text-lg" aria-hidden>
              ◆
            </span>
            {t('business.navInsights')}
          </NavLink>
          <NavLink to="/business/bookings" className={sideLink}>
            <span className="text-lg" aria-hidden>
              ▤
            </span>
            {t('business.navBookings')}
          </NavLink>
          <NavLink to="/business/messages" className={sideLink}>
            <span className="text-lg" aria-hidden>
              💬
            </span>
            {t('business.navMessages')}
          </NavLink>
          <NavLink to="/business/growth" className={sideLink}>
            <span className="text-lg" aria-hidden>
              📈
            </span>
            {t('business.navGrowth')}
          </NavLink>
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-emerald-200/70">{user?.email}</p>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-2 w-full rounded-lg border border-white/10 py-2 text-xs font-bold text-white/90 hover:bg-white/5"
          >
            {t('auth.signOut')}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--kora-line)] bg-[var(--kora-elevated)]/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex gap-1 overflow-x-auto pb-1 lg:hidden">
                <NavLink
                  to="/business"
                  className="shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white"
                >
                  {t('business.navOverview')}
                </NavLink>
                <NavLink
                  to="/business/insights"
                  className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold dark:border-zinc-700"
                >
                  {t('business.navInsights')}
                </NavLink>
                <NavLink
                  to="/business/bookings"
                  className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold dark:border-zinc-700"
                >
                  {t('business.navBookings')}
                </NavLink>
                <NavLink
                  to="/business/messages"
                  className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold dark:border-zinc-700"
                >
                  {t('business.navMessages')}
                </NavLink>
              </div>
              <p className="hidden text-sm font-semibold text-zinc-500 dark:text-zinc-400 lg:block">
                {t('business.welcome', { name: user?.name ?? '' })}
              </p>
            </div>
            <Link
              to="/"
              className="shrink-0 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-800 shadow-sm hover:border-emerald-300 hover:text-emerald-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-emerald-500"
            >
              {t('business.viewMarketplace')}
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
