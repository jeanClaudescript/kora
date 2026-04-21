import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function AdminHomePage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          {t('admin.homeTitle')}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('admin.homeSubtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { v: '128', l: t('admin.statBiz') },
          { v: '14.2k', l: t('admin.statBook') },
          { v: '96%', l: t('admin.statSat') },
          { v: '12', l: t('admin.statFlag') },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{s.v}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {s.l}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t('admin.quick')}</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/admin/businesses"
              className="rounded-xl bg-violet-600 py-3 text-center text-sm font-bold text-white hover:bg-violet-500"
            >
              {t('admin.reviewBiz')}
            </Link>
            <Link
              to="/admin/users"
              className="rounded-xl border border-zinc-200 py-3 text-center text-sm font-bold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('admin.reviewUsers')}
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-6 dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{t('admin.opsTitle')}</p>
          <p className="mt-2 text-sm text-amber-900/85 dark:text-amber-200/80">{t('admin.opsBody')}</p>
        </div>
      </div>
    </div>
  )
}
