import { NavLink, Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'

function navCls({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-violet-500/20 text-white ring-1 ring-violet-400/30'
      : 'text-violet-100/75 hover:bg-white/5 hover:text-white'
  }`
}

export function AdminLayout() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-dvh bg-zinc-100 dark:bg-zinc-950">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-violet-900/40 bg-gradient-to-b from-violet-950 via-zinc-950 to-zinc-950 lg:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500 text-sm font-black text-white">
              A
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                {t('admin.badge')}
              </p>
              <p className="text-sm font-bold text-white">Kora</p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
          <NavLink to="/admin" end className={navCls}>
            {t('admin.navHome')}
          </NavLink>
          <NavLink to="/admin/businesses" className={navCls}>
            {t('admin.navBusinesses')}
          </NavLink>
          <NavLink to="/admin/users" className={navCls}>
            {t('admin.navUsers')}
          </NavLink>
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="truncate text-[11px] text-violet-200/60">{user?.email}</p>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-2 w-full rounded-lg py-2 text-xs font-bold text-white/90 hover:bg-white/5"
          >
            {t('auth.signOut')}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white/95 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            <NavLink
              to="/admin"
              className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white"
            >
              {t('admin.navHome')}
            </NavLink>
            <NavLink
              to="/admin/businesses"
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold dark:border-zinc-700"
            >
              {t('admin.navBusinesses')}
            </NavLink>
            <NavLink
              to="/admin/users"
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold dark:border-zinc-700"
            >
              {t('admin.navUsers')}
            </NavLink>
          </div>
          <Link
            to="/"
            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {t('admin.viewSite')}
          </Link>
        </header>
        <main className="flex-1 overflow-auto bg-zinc-50 px-4 py-6 dark:bg-zinc-950 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
