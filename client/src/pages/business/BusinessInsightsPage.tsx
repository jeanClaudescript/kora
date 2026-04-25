import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const WEEK = [
  { label: 'Mon', cur: 42, prev: 36 },
  { label: 'Tue', cur: 55, prev: 48 },
  { label: 'Wed', cur: 38, prev: 44 },
  { label: 'Thu', cur: 62, prev: 50 },
  { label: 'Fri', cur: 78, prev: 65 },
  { label: 'Sat', cur: 88, prev: 72 },
  { label: 'Sun', cur: 51, prev: 45 },
]

const FUNNEL = [
  { key: 'insViews', pct: 100 },
  { key: 'insRequests', pct: 34 },
  { key: 'insCompleted', pct: 28 },
] as const

const PEAK = [12, 18, 35, 55, 72, 88, 95, 100, 92, 78, 52, 28, 15]

const TOP_SVC = [
  { name: 'Silk press & trim', n: 42, rev: 'RWF 2.1M' },
  { name: 'Kids braids', n: 31, rev: 'RWF 1.4M' },
  { name: 'Beard & fade', n: 28, rev: 'RWF 890k' },
]

export function BusinessInsightsPage() {
  const { t } = useTranslation()
  const maxH = Math.max(...WEEK.map((d) => Math.max(d.cur, d.prev)))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--kora-text)] sm:text-3xl">
            {t('business.insightsTitle')}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--kora-text-secondary)]">
            {t('business.insightsSub')}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-4 py-2.5 text-sm font-bold text-[var(--kora-text)] shadow-sm hover:bg-[var(--kora-elevated-muted)]"
        >
          {t('business.insExport')}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: 'insViews', v: '1.24k', d: '+12%' },
          { k: 'insRequests', v: '86', d: '+4%' },
          { k: 'insCompleted', v: '71', d: '−2%' },
          { k: 'insNoShow', v: '3', d: t('business.insAlertGood') },
        ].map((x) => (
          <div key={x.k} className="kora-card rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
              {t(`business.${x.k}`)}
            </p>
            <p className="mt-1 text-2xl font-black text-[var(--kora-text)]">{x.v}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="kora-card rounded-3xl p-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.insWeek')}</h2>
            <span className="text-xs font-semibold text-[var(--kora-muted)]">Demo · RWF</span>
          </div>
          <div className="mt-6 flex h-44 items-end justify-between gap-1.5 sm:gap-2">
            {WEEK.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-36 w-full items-end justify-center gap-0.5 sm:gap-1">
                  <div
                    className="w-1/2 max-w-[14px] rounded-t-md bg-zinc-300 dark:bg-zinc-600"
                    style={{ height: `${(d.prev / maxH) * 100}%` }}
                    title="Last week"
                  />
                  <div
                    className="w-1/2 max-w-[14px] rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-500"
                    style={{ height: `${(d.cur / maxH) * 100}%` }}
                    title="This week"
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--kora-muted)] sm:text-xs">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--kora-text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-zinc-400" /> {t('business.insLegendPrev')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" /> {t('business.insLegendCur')}
            </span>
          </div>
        </div>

        <div className="kora-card rounded-3xl p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.insFunnel')}</h2>
          <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">{t('business.insFunnelHint')}</p>
          <div className="mt-6 space-y-4">
            {FUNNEL.map((row, i) => (
              <div key={row.key}>
                <div className="flex justify-between text-xs font-semibold text-[var(--kora-text)]">
                  <span>{t(`business.${row.key}`)}</span>
                  <span className="text-[var(--kora-muted)]">{row.pct}%</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--kora-elevated-muted)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-400"
                    style={{ width: `${row.pct}%`, opacity: 1 - i * 0.12 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="kora-card rounded-3xl p-5">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.insPeak')}</h2>
          <div className="mt-6 flex h-28 items-end gap-0.5">
            {PEAK.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-700/30 to-brand-500 dark:from-brand-400/20 dark:to-brand-400/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] font-medium text-[var(--kora-muted)]">
            08–20h · {t('business.insPeakFoot')}
          </p>
        </div>

        <div className="kora-card rounded-3xl p-5">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.insRepeat')}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="kora-card-muted rounded-2xl p-4">
              <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">{t('business.insNew')}</p>
              <p className="mt-1 text-3xl font-black text-[var(--kora-text)]">38%</p>
            </div>
            <div className="kora-card-muted rounded-2xl p-4">
              <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">
                {t('business.insReturning')}
              </p>
              <p className="mt-1 text-3xl font-black text-[var(--kora-text)]">62%</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--kora-text-secondary)]">{t('business.insRepeatHint')}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="kora-card rounded-3xl p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.insTopSvc')}</h2>
          <div className="mt-4 grid gap-3 md:hidden">
            {TOP_SVC.map((r) => (
              <div key={r.name} className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] p-4">
                <p className="text-base font-black text-[var(--kora-text)]">{r.name}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/60 p-3">
                    <p className="text-[10px] font-black uppercase tracking-wide text-[var(--kora-muted)]">
                      {t('business.insColCount')}
                    </p>
                    <p className="mt-1 text-lg font-black text-[var(--kora-text)]">{r.n}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/60 p-3">
                    <p className="text-[10px] font-black uppercase tracking-wide text-[var(--kora-muted)]">
                      {t('business.insColRev')}
                    </p>
                    <p className="mt-1 text-lg font-black text-[var(--kora-text)]">{r.rev}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 hidden overflow-hidden rounded-xl border border-[var(--kora-line)] md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--kora-elevated-muted)] text-xs font-bold uppercase text-[var(--kora-muted)]">
                <tr>
                  <th className="px-4 py-3">{t('business.insColSvc')}</th>
                  <th className="px-4 py-3">{t('business.insColCount')}</th>
                  <th className="px-4 py-3">{t('business.insColRev')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--kora-line)] text-[var(--kora-text)]">
                {TOP_SVC.map((r) => (
                  <tr key={r.name} className="bg-[var(--kora-elevated)]">
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3 text-[var(--kora-text-secondary)]">{r.n}</td>
                    <td className="px-4 py-3 font-bold">{r.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="kora-card rounded-3xl p-5">
          <h2 className="text-lg font-bold text-[var(--kora-text)]">{t('business.insAlerts')}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="kora-card-muted flex items-start gap-2 rounded-xl p-3">
              <span className="mt-0.5 text-amber-500">!</span>
              <span className="text-[var(--kora-text-secondary)]">
                <span className="font-bold text-[var(--kora-text)]">{t('business.insSlow')}</span>
                {' · '}
                {t('business.insSlowBody')}
              </span>
            </li>
            <li className="kora-card-muted flex items-start gap-2 rounded-xl p-3">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span className="text-[var(--kora-text-secondary)]">
                <span className="font-bold text-[var(--kora-text)]">{t('business.insStock')}</span>
                {' · '}
                {t('business.insStockBody')}
              </span>
            </li>
            <li className="kora-card-muted flex items-start gap-2 rounded-xl p-3">
              <span className="mt-0.5 text-sky-500">i</span>
              <span className="text-[var(--kora-text-secondary)]">
                <span className="font-bold text-[var(--kora-text)]">{t('business.insPromo')}</span>
                {' · '}
                {t('business.insPromoBody')}
              </span>
            </li>
          </ul>
          <Link
            to="/business/messages"
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t('business.openInbox')}
          </Link>
        </div>
      </div>
    </div>
  )
}
