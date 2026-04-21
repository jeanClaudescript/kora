import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'

export function BusinessHomePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const workerCount = Math.min(user?.businessWorkerCount ?? 1, 100)
  const credentialSeed = user?.id ?? 'biz'
  const adminKey = `${credentialSeed}-ADMIN`
  const workerKeys = Array.from({ length: workerCount }).map((_, idx) => ({
    name: `Worker ${String(idx + 1).padStart(2, '0')}`,
    key: `${credentialSeed}-W${String(idx + 1).padStart(3, '0')}`,
  }))

  return (
    <div className="space-y-8">
      <div className="kora-card rounded-3xl border-l-4 border-l-emerald-500 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--kora-text)] sm:text-3xl">
              {t('business.homeTitle')}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-[var(--kora-text-secondary)]">
              {t('business.homeSubtitle')}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              to="/business/workspaces"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] px-5 py-3 text-sm font-bold text-[var(--kora-text)] hover:bg-[var(--kora-line)]/25"
            >
              {t('business.navWorkspaces')}
            </Link>
            <Link
              to="/business/insights"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] px-5 py-3 text-sm font-bold text-[var(--kora-text)] hover:bg-[var(--kora-line)]/25"
            >
              {t('business.navInsights')}
            </Link>
            <Link
              to="/business/messages"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105"
            >
              {t('business.openInbox')}
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'kpi1', v: 'RWF 186k', sub: t('business.kpi1') },
            { k: 'kpi2', v: '78%', sub: t('business.kpi2') },
            { k: 'kpi3', v: '< 3 min', sub: t('business.kpi3') },
            { k: 'dashRepeat', v: '61%', sub: t('business.dashRepeat') },
          ].map((x) => (
            <div key={x.k} className="kora-card-muted rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                {x.sub}
              </p>
              <p className="mt-1 text-2xl font-black text-[var(--kora-text)]">{x.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="kora-card rounded-3xl p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.dashToday')}</h2>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('business.dashTodaySub')}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="kora-card-muted flex justify-between rounded-xl px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">{t('business.dashGoal1')}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">3/4</span>
            </li>
            <li className="kora-card-muted flex justify-between rounded-xl px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">{t('business.dashGoal2')}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">1</span>
            </li>
            <li className="kora-card-muted flex justify-between rounded-xl px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">{t('business.dashGoal3')}</span>
              <span className="text-[var(--kora-muted)]">—</span>
            </li>
          </ul>
        </div>
        <div className="kora-card rounded-3xl p-5">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.dashStaff')}</h2>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('business.dashStaffSub')}</p>
          <div className="mt-4 space-y-2">
            {['Aline · Senior', 'Jean · Barber', 'Claire · Nails'].map((s) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-xl border border-[var(--kora-line)] px-3 py-2 text-sm"
              >
                <span className="font-medium text-[var(--kora-text)]">{s}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {t('business.dashOn')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {workerCount > 1 ? (
        <div className="kora-card rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-emerald-900 dark:text-emerald-200">
              Worker keys (admin only)
            </h2>
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Private
            </span>
          </div>
          <p className="mt-1 text-sm text-emerald-800/85 dark:text-emerald-300/90">
            Each worker has independent credentials and workspace. Do not share keys publicly.
          </p>
          <div className="mt-3 rounded-xl border border-emerald-300/60 bg-white/80 p-3 dark:border-emerald-900/50 dark:bg-zinc-900/70">
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Admin key</p>
            <p className="mt-1 text-sm font-black text-emerald-900 dark:text-emerald-200">{adminKey}</p>
          </div>
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
            {workerKeys.map((wk) => (
              <div
                key={wk.key}
                className="flex items-center justify-between rounded-xl border border-emerald-200/70 bg-white/75 px-3 py-2 text-sm dark:border-emerald-900/40 dark:bg-zinc-900/70"
              >
                <span className="font-semibold text-emerald-900 dark:text-emerald-200">{wk.name}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{wk.key}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="kora-card rounded-3xl p-6">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.floorTitle')}</h2>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('business.floorHint')}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-16 rounded-2xl bg-orange-500 text-sm font-bold text-white shadow-md transition hover:brightness-95"
            >
              {t('business.busy')}
            </button>
            <button
              type="button"
              className="h-16 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-md transition hover:brightness-95"
            >
              {t('business.free')}
            </button>
            <button
              type="button"
              className="h-16 rounded-2xl border border-[var(--kora-line)] text-sm font-bold text-[var(--kora-text)] transition hover:bg-[var(--kora-elevated-muted)]"
            >
              {t('business.buffer')}
            </button>
            <button
              type="button"
              className="h-16 rounded-2xl border border-[var(--kora-line)] text-sm font-bold text-[var(--kora-text)] transition hover:bg-[var(--kora-elevated-muted)]"
            >
              {t('business.walkin')}
            </button>
          </div>
        </div>

        <div className="kora-card rounded-3xl p-6">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.queue')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="kora-card-muted flex justify-between rounded-xl px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">Marie · Braids</span>
              <span className="text-[var(--kora-muted)]">11:00</span>
            </li>
            <li className="kora-card-muted flex justify-between rounded-xl px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">Walk-in · Fade</span>
              <span className="text-[var(--kora-muted)]">11:40</span>
            </li>
          </ul>
          <Link
            to="/business/bookings"
            className="mt-5 flex w-full items-center justify-center rounded-2xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t('business.fullSchedule')}
          </Link>
        </div>
      </div>

      <div className="kora-card-muted rounded-3xl border border-sky-500/25 bg-sky-50/50 p-5 dark:border-sky-800/40 dark:bg-sky-950/25">
        <p className="text-sm font-bold text-sky-900 dark:text-sky-200">{t('business.bridgeTitle')}</p>
        <p className="mt-1 text-sm text-sky-900/85 dark:text-sky-300/90">{t('business.bridgeBody')}</p>
      </div>
    </div>
  )
}
