import { useMemo, useState } from 'react'
import { NavLink, Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'

function sideLink({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/10'
      : 'text-emerald-100/80 hover:bg-white/5 hover:text-white'
  }`
}

type BusinessAccessSession = {
  mode: 'admin' | 'worker'
  workerId?: string
  workerName?: string
}

export type BusinessAccessContextValue = {
  session: BusinessAccessSession
  workerCount: number
  canManage: boolean
}

export function BusinessPortalLayout() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const workerCount = Math.min(user?.businessWorkerCount ?? 1, 100)
  const needsSubLogin = workerCount > 1
  const credentialSeed = user?.id ?? 'biz'
  const workerCredentials = useMemo(
    () =>
      Array.from({ length: workerCount }).map((_, idx) => ({
        workerId: `w-${idx + 1}`,
        workerName: `Worker ${String(idx + 1).padStart(2, '0')}`,
        key: `${credentialSeed}-W${String(idx + 1).padStart(3, '0')}`,
      })),
    [credentialSeed, workerCount],
  )

  const [session, setSession] = useState<BusinessAccessSession | null>(
    needsSubLogin ? null : { mode: 'admin' },
  )
  const [adminKeyInput, setAdminKeyInput] = useState('')
  const [workerKeyInput, setWorkerKeyInput] = useState('')
  const [loginError, setLoginError] = useState('')

  const adminKey = `${credentialSeed}-ADMIN`

  function loginAsAdmin() {
    if (adminKeyInput.trim() !== adminKey) {
      setLoginError('Invalid admin key')
      return
    }
    setSession({ mode: 'admin' })
    setLoginError('')
  }

  function loginAsWorker() {
    const match = workerCredentials.find((w) => w.key === workerKeyInput.trim())
    if (!match) {
      setLoginError('Invalid worker key')
      return
    }
    setSession({ mode: 'worker', workerId: match.workerId, workerName: match.workerName })
    setLoginError('')
  }

  const activeSession = session ?? { mode: 'admin' as const }
  const canManage = activeSession.mode === 'admin'
  const contextValue: BusinessAccessContextValue = {
    session: activeSession,
    workerCount,
    canManage,
  }

  if (session?.mode === 'worker' && pathname !== '/business/workspaces') {
    return <Navigate to="/business/workspaces" replace />
  }

  if (needsSubLogin && !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--kora-canvas)] px-4">
        <div className="kora-card w-full max-w-xl rounded-3xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Business access
          </p>
          <h1 className="mt-1 text-2xl font-black text-[var(--kora-text)]">Workspace Key Login</h1>
          <p className="mt-2 text-sm text-[var(--kora-text-secondary)]">
            Each room has its own key. Admin enters admin key; workers enter worker keys.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--kora-line)] p-4">
              <p className="text-sm font-bold text-[var(--kora-text)]">Admin room</p>
              <input
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="kora-input mt-3"
                placeholder="Admin key"
              />
              <button
                type="button"
                onClick={loginAsAdmin}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-500"
              >
                Enter admin workspace
              </button>
            </div>
            <div className="rounded-2xl border border-[var(--kora-line)] p-4">
              <p className="text-sm font-bold text-[var(--kora-text)]">Worker room</p>
              <input
                value={workerKeyInput}
                onChange={(e) => setWorkerKeyInput(e.target.value)}
                className="kora-input mt-3"
                placeholder="Worker key"
              />
              <button
                type="button"
                onClick={loginAsWorker}
                className="mt-3 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
              >
                Enter worker workspace
              </button>
            </div>
          </div>
          {loginError ? <p className="mt-3 text-xs font-semibold text-rose-600">{loginError}</p> : null}
          <p className="mt-3 text-xs text-[var(--kora-muted)]">
            Demo admin key: <span className="font-bold">{adminKey}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh gap-4 bg-[var(--kora-canvas)] px-3 py-3 font-[var(--rb-font)] text-[var(--kora-text)] sm:px-4">
      <aside className="relative hidden w-64 shrink-0 lg:block">
        <div className="sticky top-3 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-emerald-900/60 bg-gradient-to-b from-emerald-950 via-zinc-950 to-zinc-950 shadow-2xl">
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
            {canManage ? (
              <>
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
              </>
            ) : null}
            <NavLink to="/business/workspaces" className={sideLink}>
              <span className="text-lg" aria-hidden>
                🧩
              </span>
              {t('business.navWorkspaces')}
            </NavLink>
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="text-[10px] font-bold uppercase text-emerald-300/70">
              {canManage ? 'Admin workspace' : `Worker workspace · ${activeSession.workerName ?? ''}`}
            </p>
            <p className="truncate text-xs text-emerald-200/70">{user?.email}</p>
            <button
              type="button"
              onClick={() => logout()}
              className="mt-2 w-full rounded-lg border border-white/10 py-2 text-xs font-bold text-white/90 hover:bg-white/5"
            >
              {t('auth.signOut')}
            </button>
            {needsSubLogin ? (
              <button
                type="button"
                onClick={() => setSession(null)}
                className="mt-2 w-full rounded-lg border border-white/10 py-2 text-xs font-bold text-emerald-100 hover:bg-white/5"
              >
                Switch room
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]">
        <header className="sticky top-0 z-20 border-b border-[var(--kora-line)] bg-gradient-to-r from-[var(--kora-elevated)] via-[var(--kora-elevated-muted)] to-[var(--kora-elevated)]/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex gap-1 overflow-x-auto pb-1 lg:hidden">
                <NavLink
                  to={canManage ? '/business' : '/business/workspaces'}
                  className="shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white"
                >
                  {canManage ? t('business.navOverview') : t('business.navWorkspaces')}
                </NavLink>
                {canManage ? (
                  <>
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
                  </>
                ) : null}
                <NavLink
                  to="/business/workspaces"
                  className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold dark:border-zinc-700"
                >
                  {t('business.navWorkspaces')}
                </NavLink>
              </div>
              <p className="hidden text-sm font-semibold text-zinc-500 dark:text-zinc-400 lg:block">
                {canManage
                  ? t('business.welcome', { name: user?.name ?? '' })
                  : `Worker room · ${activeSession.workerName ?? ''}`}
              </p>
              <span className="hidden rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 lg:inline-flex">
                {canManage ? 'Admin access' : 'Worker access'}
              </span>
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
          <Outlet context={contextValue} />
        </main>
        <footer className="border-t border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-4 py-3">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 text-xs">
            <p className="font-semibold text-[var(--kora-text-secondary)]">
              Kora Business Workspace - elegant operations for all-day work
            </p>
            <p className="rounded-full border border-[var(--kora-line)] px-2.5 py-1 font-bold text-[var(--kora-muted)]">
              {canManage ? `Admin room · ${workerCount} workers` : activeSession.workerName}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
