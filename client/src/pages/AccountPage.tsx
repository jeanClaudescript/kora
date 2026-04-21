import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconUser } from '../components/icons'
import { useAuth } from '../auth/AuthContext'

export function AccountPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-black tracking-tight text-[var(--kora-text)]">
        {t('accountPage.title')}
      </h1>
      <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('accountPage.sub')}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="kora-card rounded-2xl p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--kora-elevated-muted)] text-[var(--kora-muted)]">
              <IconUser className="h-7 w-7" />
            </div>
            <div>
              <p className="font-bold text-[var(--kora-text)]">
                {user?.name ?? t('accountPage.guest')}
              </p>
              <p className="text-xs text-[var(--kora-text-secondary)]">
                {user ? user.email : t('accountPage.notSigned')}
              </p>
            </div>
          </div>
          <Link
            to="/auth/login"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            {user ? t('accountPage.switchAccount') : t('accountPage.signInCta')}
          </Link>
        </div>

        <div className="kora-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('accountPage.shortcuts')}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/account/messages"
              className="rounded-xl border border-[var(--kora-line)] p-4 transition hover:border-brand-500 hover:bg-[var(--kora-elevated-muted)]"
            >
              <p className="font-bold text-[var(--kora-text)]">{t('accountPage.inbox')}</p>
              <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('accountPage.inboxSub')}</p>
            </Link>
            <Link
              to="/account/trips"
              className="rounded-xl border border-[var(--kora-line)] p-4 transition hover:border-brand-500 hover:bg-[var(--kora-elevated-muted)]"
            >
              <p className="font-bold text-[var(--kora-text)]">{t('accountPage.trips')}</p>
              <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('accountPage.tripsSub')}</p>
            </Link>
            <Link
              to="/search"
              className="rounded-xl border border-[var(--kora-line)] p-4 transition hover:border-brand-500 hover:bg-[var(--kora-elevated-muted)]"
            >
              <p className="font-bold text-[var(--kora-text)]">{t('accountPage.search')}</p>
              <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('accountPage.searchSub')}</p>
            </Link>
            <Link
              to="/auth/signup?role=business"
              className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 transition hover:border-emerald-400 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:hover:border-emerald-600"
            >
              <p className="font-bold text-emerald-900 dark:text-emerald-200">
                {t('accountPage.biz')}
              </p>
              <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-300/80">
                {t('accountPage.bizSub')}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
