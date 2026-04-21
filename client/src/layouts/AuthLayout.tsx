import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher'

export function AuthLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-2 py-1 text-white/90 transition hover:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-brand-600 text-lg font-black text-white shadow-lg ring-2 ring-white/20">
              K
            </span>
            <span className="text-lg font-bold tracking-tight">Kora</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-1 py-0.5 backdrop-blur">
              <LanguageSwitcher appearance="onDark" />
            </div>
            <ThemeToggle appearance="onDark" />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:px-6 sm:pb-24">
          <Outlet />
        </main>

        <p className="pb-6 text-center text-xs text-white/40">
          Secure session (demo — wire your API next)
        </p>
      </div>
    </div>
  )
}
