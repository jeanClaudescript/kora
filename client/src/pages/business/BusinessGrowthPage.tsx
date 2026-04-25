import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CREATIVE = [
  { title: 'After-work glow', palette: 'from-fuchsia-500 via-pink-500 to-amber-400', metric: '+18% saves' },
  { title: 'Weekend flash', palette: 'from-violet-600 via-indigo-600 to-sky-500', metric: '+9% fills' },
  { title: 'VIP comeback', palette: 'from-emerald-500 via-teal-500 to-cyan-400', metric: '+24% repeats' },
]

export function BusinessGrowthPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--kora-line)] bg-[var(--kora-elevated)] p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-500/30 via-violet-500/20 to-transparent blur-3xl"
        />
        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kora-muted)]">Growth studio</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--kora-text)] sm:text-4xl">
            {t('business.growthTitle')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--kora-text-secondary)]">
            {t('business.growthSubtitle')}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/business/messages"
              className="inline-flex rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md"
            >
              Launch message campaign
            </Link>
            <Link
              to="/business/insights"
              className="inline-flex rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/80 px-4 py-2.5 text-xs font-bold text-[var(--kora-text)]"
            >
              See what’s converting
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CREATIVE.map((c) => (
          <div
            key={c.title}
            className={`rounded-3xl bg-gradient-to-br p-[1px] shadow-lg ${c.palette}`}
          >
            <div className="h-full rounded-[1.4rem] bg-[var(--kora-elevated)] p-5">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--kora-muted)]">Preset</p>
              <h3 className="mt-2 text-lg font-black text-[var(--kora-text)]">{c.title}</h3>
              <p className="mt-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">{c.metric}</p>
              <button
                type="button"
                className="mt-4 w-full rounded-2xl border border-[var(--kora-line)] py-2.5 text-sm font-bold text-[var(--kora-text)] transition hover:bg-[var(--kora-elevated-muted)]"
              >
                Use template
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          t('business.growthCard1'),
          t('business.growthCard2'),
          t('business.growthCard3'),
          t('business.growthCard4'),
        ].map((text) => (
          <div
            key={text}
            className="rounded-3xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/95 p-5 text-sm font-medium text-[var(--kora-text-secondary)] shadow-sm backdrop-blur-sm transition hover:border-fuchsia-300/70 hover:shadow-md dark:hover:border-fuchsia-500/40"
          >
            {text}
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/15 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-black">Instagram-style campaign studio</h2>
        <p className="mt-2 max-w-3xl text-sm text-white/90">
          Story-native promos, referral reels, and gentle reminders — composed like social, executed like ops.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {['New client boost', 'Repeat client reward', 'Idle slot flash promo'].map((x) => (
            <div
              key={x}
              className="rounded-2xl border border-white/25 bg-black/20 p-4 text-sm font-bold backdrop-blur-md"
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
