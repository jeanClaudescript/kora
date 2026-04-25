import { useMemo, useState } from 'react'
import { NavLink, Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'

function sideLink({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-white/18 text-white shadow-inner ring-1 ring-white/15'
      : 'text-white/70 hover:bg-white/8 hover:text-white'
  }`
}

function mobileTabLink({ isActive }: { isActive: boolean }) {
  return `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold transition ${
    isActive ? 'text-white' : 'text-white/65 hover:text-white'
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
    <div className="relative flex min-h-dvh gap-4 overflow-hidden bg-[var(--kora-canvas)] px-3 py-3 font-[var(--rb-font)] text-[var(--kora-text)] sm:px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(236,72,153,0.14),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.10),transparent_50%)]"
      />
      <aside className="relative hidden w-64 shrink-0 lg:block">
        <div className="sticky top-3 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1020] via-[#0f172a] to-[#020617] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-5 py-6">
            <Link to="/business" className="flex items-center gap-2">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-sky-500 p-[2px] shadow-lg shadow-fuchsia-500/25">
                <span className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-[#0b1020] text-lg font-black text-white">
                  K
                </span>
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

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#070b18]/95 shadow-[0_24px_70px_rgba(2,6,23,0.55)] backdrop-blur-xl">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080f23]/90 px-4 py-3 backdrop-blur-2xl">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link
                  to={canManage ? '/business' : '/business/workspaces'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-base font-black text-white"
                  aria-label={canManage ? t('business.navOverview') : t('business.navWorkspaces')}
                >
                  {canManage ? '◎' : '🧩'}
                </Link>
                <Link to="/business" className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-2.5 py-1.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-600 to-sky-500 text-xs font-black text-white">
                    K
                  </span>
                  <span className="hidden leading-tight sm:block">
                    <span className="block text-xs font-black text-white">Kora Business</span>
                    <span className="block text-[10px] font-semibold text-slate-300">Modern operations</span>
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-white"
                  aria-label={t('business.viewMarketplace')}
                  title={t('business.viewMarketplace')}
                >
                  ⌂
                </Link>
                {canManage ? (
                  <Link
                    to="/business/workspaces"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white"
                    aria-label="Hire + team"
                    title="Hire + team"
                  >
                    +
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {canManage ? (
                <>
                  <NavLink to="/business" end className={sideLink}>
                    {t('business.navOverview')}
                  </NavLink>
                  <NavLink to="/business/insights" className={sideLink}>
                    {t('business.navInsights')}
                  </NavLink>
                  <NavLink to="/business/bookings" className={sideLink}>
                    {t('business.navBookings')}
                  </NavLink>
                  <NavLink to="/business/messages" className={sideLink}>
                    {t('business.navMessages')}
                  </NavLink>
                </>
              ) : null}
              <NavLink to="/business/workspaces" className={sideLink}>
                {t('business.navWorkspaces')}
              </NavLink>
            </div>
            <div className="mt-2 hidden items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 md:flex">
              <p>{canManage ? t('business.welcome', { name: user?.name ?? '' }) : `Worker room · ${activeSession.workerName ?? ''}`}</p>
              <p>{canManage ? `Admin room · ${workerCount} workers` : 'Worker access'}</p>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:pb-8">
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

      <nav className="fixed bottom-3 left-3 right-3 z-40 lg:hidden">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[1.6rem] border border-white/12 bg-[#0b1020]/80 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="flex items-stretch gap-2">
              {canManage ? (
                <>
                  <NavLink to="/business" end className={mobileTabLink}>
                    <span className="text-base" aria-hidden>
                      ◎
                    </span>
                    <span className="leading-none">{t('business.navOverview')}</span>
                  </NavLink>
                  <NavLink to="/business/bookings" className={mobileTabLink}>
                    <span className="text-base" aria-hidden>
                      ▤
                    </span>
                    <span className="leading-none">{t('business.navBookings')}</span>
                  </NavLink>
                  <NavLink to="/business/messages" className={mobileTabLink}>
                    <span className="text-base" aria-hidden>
                      💬
                    </span>
                    <span className="leading-none">{t('business.navMessages')}</span>
                  </NavLink>
                  <NavLink to="/business/insights" className={mobileTabLink}>
                    <span className="text-base" aria-hidden>
                      ◆
                    </span>
                    <span className="leading-none">{t('business.navInsights')}</span>
                  </NavLink>
                </>
              ) : null}
              <NavLink to="/business/workspaces" className={mobileTabLink}>
                <span className="text-base" aria-hidden>
                  🧩
                </span>
                <span className="leading-none">{t('business.navWorkspaces')}</span>
              </NavLink>
              <button
                type="button"
                onClick={() => logout()}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-white/65 transition hover:text-white"
              >
                <span className="text-base" aria-hidden>
                  ⎋
                </span>
                <span className="leading-none">{t('auth.signOut')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
