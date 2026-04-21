import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { AuthUser, UserRole } from '../../auth/AuthContext'
import { useAuth } from '../../auth/AuthContext'

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation() as { state?: { from?: string } }
  const from = loc.state?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function goAfterLogin(role: UserRole) {
    if (from && from !== '/auth/login') {
      navigate(from, { replace: true })
      return
    }
    if (role === 'business') navigate('/business', { replace: true })
    else if (role === 'admin') navigate('/admin', { replace: true })
    else navigate('/', { replace: true })
  }

  function signIn(e: FormEvent) {
    e.preventDefault()
    const u: AuthUser = {
      id: 'u1',
      name: email.split('@')[0] || 'Guest',
      email: email || 'you@kora.app',
      role: 'customer',
    }
    login(u)
    goAfterLogin('customer')
  }

  function demo(role: UserRole) {
    const profiles: Record<UserRole, AuthUser> = {
      customer: {
        id: 'c-demo',
        name: 'Aline',
        email: 'aline@demo.kora',
        role: 'customer',
        preferredCity: 'Kigali',
        interestCategories: ['Salon', 'Spa', 'Barber'],
      },
      business: {
        id: 'b-demo',
        name: 'Amahoro Glow',
        email: 'owner@amahoro.demo',
        role: 'business',
        businessCategory: 'Salon',
        businessWorkerCount: 48,
        preferredCity: 'Kigali',
        interestCategories: ['Salon'],
      },
      admin: {
        id: 'a-demo',
        name: 'Ops Admin',
        email: 'admin@kora.app',
        role: 'admin',
      },
    }
    login(profiles[role])
    goAfterLogin(role)
  }

  return (
    <div className="kora-card w-full max-w-[440px] rounded-3xl p-6 sm:p-8">
      <h1 className="text-center text-2xl font-black tracking-tight text-[var(--kora-text)]">
        {t('auth.loginTitle')}
      </h1>
      <p className="mt-2 text-center text-sm text-[var(--kora-text-secondary)]">
        {t('auth.loginSubtitle')}
      </p>

      <form onSubmit={signIn} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
            {t('auth.email')}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="kora-input mt-1.5"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
            {t('auth.password')}
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="kora-input mt-1.5"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-sky-500 to-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
        >
          {t('auth.signIn')}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-[var(--kora-line)]" />
        </div>
        <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider text-[var(--kora-muted)]">
          {t('auth.tryDemo')}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => demo('customer')}
          className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] py-2.5 text-xs font-bold text-[var(--kora-text)] transition hover:bg-[var(--kora-line)]/30"
        >
          {t('auth.demoGuest')}
        </button>
        <button
          type="button"
          onClick={() => {
            login({
              id: 'c-client',
              name: 'Client Demo',
              email: 'client@demo.kora',
              role: 'customer',
              preferredCity: 'Kigali',
              interestCategories: ['Massage', 'Restaurant', 'Courier'],
            })
            goAfterLogin('customer')
          }}
          className="rounded-xl border border-sky-500/40 bg-sky-500/10 py-2.5 text-xs font-bold text-sky-900 transition hover:bg-sky-500/15 dark:text-sky-200"
        >
          {t('auth.demoClient')}
        </button>
        <button
          type="button"
          onClick={() => demo('business')}
          className="rounded-xl border border-emerald-600/40 bg-emerald-600/10 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-600/15 dark:text-emerald-200"
        >
          {t('auth.demoBusiness')}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--kora-text-secondary)]">
        {t('auth.noAccount')}{' '}
        <Link to="/auth/signup" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
          {t('auth.createAccount')}
        </Link>
      </p>
    </div>
  )
}
