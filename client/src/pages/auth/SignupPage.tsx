import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { UserRole } from '../../auth/AuthContext'
import { useAuth } from '../../auth/AuthContext'

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

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login({
      id: 'new',
      name: name.trim() || 'New user',
      email: email.trim() || 'user@kora.app',
      role,
    })
    if (role === 'business') navigate('/business', { replace: true })
    else if (role === 'admin') navigate('/admin', { replace: true })
    else navigate('/', { replace: true })
  }

  return (
    <div className="kora-card w-full max-w-[440px] rounded-3xl p-6 sm:p-8">
      <h1 className="text-center text-2xl font-black tracking-tight text-[var(--kora-text)]">
        {t('auth.signupTitle')}
      </h1>
      <p className="mt-2 text-center text-sm text-[var(--kora-text-secondary)]">{t('auth.signupSubtitle')}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
