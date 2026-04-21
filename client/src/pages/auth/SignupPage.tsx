import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { UserRole } from '../../auth/AuthContext'
import { useAuth } from '../../auth/AuthContext'
import { categories } from '../../data/catalog'

export function SignupPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(() =>
    searchParams.get('role') === 'business' ? 'business' : 'customer',
  )
  const [businessCategory, setBusinessCategory] = useState('Salon')
  const [workerCount, setWorkerCount] = useState(10)
  const [preferredCity, setPreferredCity] = useState('Kigali')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login({
      id: 'new',
      name: name.trim() || 'New user',
      email: email.trim() || 'user@kora.app',
      role,
      preferredCity: preferredCity.trim() || 'Kigali',
      businessCategory: role === 'business' ? businessCategory : undefined,
      businessWorkerCount: role === 'business' ? workerCount : undefined,
      interestCategories: role === 'business' ? [businessCategory] : ['Salon', 'Barber', 'Spa'],
    })
    if (role === 'business') navigate('/business', { replace: true })
    else navigate('/', { replace: true })
  }

  return (
    <div className="kora-card w-full max-w-[520px] rounded-3xl p-5 sm:p-6">
      <h1 className="text-center text-2xl font-black tracking-tight text-[var(--kora-text)]">
        {t('auth.signupTitle')}
      </h1>
      <p className="mt-2 text-center text-sm text-[var(--kora-text-secondary)]">{t('auth.signupSubtitle')}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
        <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
            {t('auth.fullName')}
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="kora-input mt-1.5"
            placeholder={t('auth.fullNamePh')}
            autoComplete="name"
          />
        </label>
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
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
            Preferred city
          </span>
          <input
            value={preferredCity}
            onChange={(e) => setPreferredCity(e.target.value)}
            className="kora-input mt-1.5"
            placeholder="Kigali"
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
            autoComplete="new-password"
          />
        </label>
        </div>

        <fieldset className="kora-card-muted rounded-2xl p-4">
          <legend className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
            {t('auth.iAm')}
          </legend>
          <div className="mt-2 flex flex-col gap-2">
            {(
              [
                ['customer', t('auth.roleCustomer')],
                ['business', t('auth.roleBusiness')],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-2 transition hover:border-[var(--kora-line-strong)]"
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={role === value}
                  onChange={() => setRole(value)}
                  className="h-4 w-4 border-[var(--kora-line-strong)] text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-[var(--kora-text)]">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {role === 'business' ? (
          <fieldset className="kora-card-muted rounded-2xl p-3.5">
            <legend className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
              Business workspace setup
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-[1.5fr_1fr] sm:items-end">
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                  Business category
                </span>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="kora-input mt-1.5"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                  Team size (up to 100)
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={workerCount}
                  onChange={(e) => setWorkerCount(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <p className="mt-1 text-xs font-semibold text-[var(--kora-text-secondary)]">
                  {workerCount} workers
                </p>
              </label>
            </div>
          </fieldset>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
        >
          {t('auth.createCta')}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--kora-text-secondary)]">
        {t('auth.haveAccount')}{' '}
        <Link to="/auth/login" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  )
}
