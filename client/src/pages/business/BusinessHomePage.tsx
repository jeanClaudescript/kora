import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { getBusinessDashboardWithContext } from '../../lib/api'
import { LocationPickerModal } from '../../components/location/LocationPickerModal'

type BizFeedItem = { id: string; event: string; detail: string; channel: string; ago: string }
type BizHotspot = { area: string; venues: number; avgRating: number }
type BizGrowthCard = { id: string; title: string; body: string; cta: string }
type BizChecklistItem = { id: string; label: string; done: boolean; priority: string }

type BusinessDashboardPayload = {
  reputation?: {
    responseRate?: string
    repeatRate?: string
    confirmationSpeed?: string
    badge?: string
  }
  localDiscovery?: {
    city?: string
    radiusKm?: number
    geoEnabled?: boolean
    headline?: string
    hotspots?: BizHotspot[]
    actions?: { id: string; label: string; impact: string }[]
  }
  channels?: {
    whatsapp?: { medianReply?: string; templatesReady?: number; bridgeHealth?: string }
    inApp?: { unreadThreads?: number; autoReplies?: number }
    walkIns?: { suggestedBuffer?: string; promo?: string }
  }
  operations?: {
    checklist?: BizChecklistItem[]
    queueHealth?: string
  }
  growthStudio?: BizGrowthCard[]
  feed?: BizFeedItem[]
  automations?: { id: string; name: string; enabled: boolean }[]
  verticalProfile?: {
    id: string
    label: string
    headline: string
    accent: string
    guestNotificationPlaybook: string[]
  }
  floorReality?: {
    policies?: Record<string, unknown>
    alerts?: Array<{
      id: string
      severity: string
      title: string
      detail: string
      runbook?: string[]
    }>
    metricsTargets?: Record<string, number>
  }
  workforceReality?: {
    hiring?: {
      playbook?: string
      stages?: Array<{ id: string; label: string; value: number; targetDays: number }>
      scorecard?: string[]
    }
    staffing?: {
      workerCount?: number
      activeBookingsNow?: number
      todayLoadPct?: number
      noShowRatePct?: number
      shiftAdvice?: string
    }
  }
}

function StoryRingCard({
  title,
  subtitle,
  children,
  accent = 'from-fuchsia-500 via-orange-400 to-amber-300',
}: {
  title: string
  subtitle?: string
  children: ReactNode
  accent?: string
}) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br p-[1px] shadow-lg ${accent}`}>
      <div className="h-full rounded-[1.4rem] bg-[var(--kora-elevated)] p-5 dark:bg-[var(--kora-elevated)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[var(--kora-text)]">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

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

  const [dash, setDash] = useState<BusinessDashboardPayload | null>(null)
  const [geoLabel, setGeoLabel] = useState<'off' | 'on' | 'pending'>('off')
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locationOpen, setLocationOpen] = useState(false)

  useEffect(() => {
    try {
      const key = `rb_biz_location_v1_${user?.id ?? 'biz'}`
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as { lat: number; lng: number }
        if (Number.isFinite(parsed?.lat) && Number.isFinite(parsed?.lng)) {
          setGeoCoords({ lat: parsed.lat, lng: parsed.lng })
          setGeoLabel('on')
        }
      }
    } catch {
      // ignore
    }
  }, [user?.id])

  useEffect(() => {
    let cancelled = false
    const params: {
      lat?: number
      lng?: number
      radiusKm?: number
      vertical?: string
      workerCount?: number
    } = {}
    if (geoCoords) {
      params.lat = geoCoords.lat
      params.lng = geoCoords.lng
      params.radiusKm = 5
    }
    if (user?.businessCategory) params.vertical = user.businessCategory
    if (user?.businessWorkerCount) params.workerCount = user.businessWorkerCount

    void (async () => {
      try {
        const data = await getBusinessDashboardWithContext(
          Object.keys(params).length ? params : undefined,
        )
        if (!cancelled) setDash(data as BusinessDashboardPayload)
      } catch {
        if (!cancelled) setDash(null)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [geoCoords, user?.businessCategory, user?.businessWorkerCount])

  function enableNearMe() {
    setLocationOpen(true)
  }

  const rep = dash?.reputation
  const replyHint = dash?.channels?.whatsapp?.medianReply ?? rep?.confirmationSpeed ?? '< 3 min'
  const kpi = [
    { k: 'kpi1', v: 'RWF 186k', sub: t('business.kpi1') },
    { k: 'kpi2', v: '78%', sub: t('business.kpi2') },
    { k: 'kpi3', v: replyHint, sub: t('business.kpi3') },
    { k: 'dashRepeat', v: rep?.repeatRate ?? '61%', sub: t('business.dashRepeat') },
  ]

  return (
    <div className="space-y-8">
      <LocationPickerModal
        open={locationOpen}
        title="Pin your business location"
        initialValue={geoCoords ? { lat: geoCoords.lat, lng: geoCoords.lng, label: 'Pinned location' } : null}
        onClose={() => setLocationOpen(false)}
        onPick={(loc) => {
          setGeoCoords({ lat: loc.lat, lng: loc.lng })
          setGeoLabel('on')
          try {
            const key = `rb_biz_location_v1_${user?.id ?? 'biz'}`
            localStorage.setItem(key, JSON.stringify({ lat: loc.lat, lng: loc.lng, label: loc.label }))
          } catch {
            // ignore
          }
          setLocationOpen(false)
        }}
      />
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--kora-line)] bg-gradient-to-br from-[var(--kora-elevated)] via-[var(--kora-elevated-muted)]/60 to-[var(--kora-elevated)] p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-violet-500/15 to-transparent blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-400/20 via-emerald-400/10 to-transparent blur-2xl"
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--kora-muted)]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
                Live workspace
              </span>
              {dash?.verticalProfile?.label || user?.businessCategory ? (
                <span className="inline-flex items-center rounded-full border border-fuchsia-300/60 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-fuchsia-800 dark:border-fuchsia-500/30 dark:text-fuchsia-200">
                  {dash?.verticalProfile?.label ?? user?.businessCategory}
                </span>
              ) : null}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--kora-text)] sm:text-4xl">
              {t('business.homeTitle')}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--kora-text-secondary)]">
              {t('business.homeSubtitle')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={enableNearMe}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105"
              >
                {geoLabel === 'on' ? 'Location: set' : geoLabel === 'pending' ? 'Locating…' : 'Set location'}
              </button>
              <span className="inline-flex items-center rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/80 px-3 py-2 text-[11px] font-semibold text-[var(--kora-text-secondary)]">
                {dash?.localDiscovery?.headline ?? 'Location helps near-me discovery.'}
              </span>
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col">
            <Link
              to="/business/workspaces"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 px-5 py-3 text-sm font-bold text-[var(--kora-text)] shadow-sm transition hover:border-fuchsia-300"
            >
              {t('business.navWorkspaces')}
            </Link>
            <Link
              to="/business/insights"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 px-5 py-3 text-sm font-bold text-[var(--kora-text)] shadow-sm transition hover:border-violet-300"
            >
              {t('business.navInsights')}
            </Link>
            <Link
              to="/business/messages"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-105"
            >
              {t('business.openInbox')}
            </Link>
            <Link
              to="/business/workspaces"
              className="inline-flex items-center justify-center rounded-2xl border border-indigo-300/70 bg-indigo-500/10 px-5 py-3 text-sm font-bold text-indigo-800 shadow-sm transition hover:bg-indigo-500/15 dark:border-indigo-700 dark:text-indigo-200"
            >
              Hire + team ops
            </Link>
          </div>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpi.map((x) => (
            <div
              key={x.k}
              className="rounded-2xl border border-[var(--kora-line)]/80 bg-[var(--kora-elevated)]/85 p-4 shadow-sm backdrop-blur-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">{x.sub}</p>
              <p className="mt-1 text-2xl font-black text-[var(--kora-text)]">{x.v}</p>
            </div>
          ))}
        </div>

        {dash?.verticalProfile?.headline ? (
          <div
            className={`relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-r p-[1px] shadow-md ${dash.verticalProfile.accent || 'from-fuchsia-500 via-violet-600 to-sky-500'}`}
          >
            <div className="rounded-[0.95rem] bg-[var(--kora-elevated)]/95 p-4 dark:bg-[var(--kora-elevated)]/90">
              <p className="text-[11px] font-black uppercase tracking-wide text-[var(--kora-muted)]">
                Your category · dynamic layout
              </p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-[var(--kora-text)]">
                {dash.verticalProfile.headline}
              </p>
              {dash.verticalProfile.guestNotificationPlaybook?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {dash.verticalProfile.guestNotificationPlaybook.map((line) => (
                    <span
                      key={line}
                      className="rounded-full border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/80 px-3 py-1 text-[11px] font-semibold text-[var(--kora-text-secondary)]"
                    >
                      {line}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <StoryRingCard
          title="Neighborhood radar"
          subtitle={dash?.operations?.queueHealth}
          accent="from-fuchsia-500 via-violet-600 to-sky-500"
        >
          <div className="space-y-3">
            {(dash?.localDiscovery?.hotspots ?? []).slice(0, 3).map((h) => (
              <div
                key={h.area}
                className="flex items-center justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-bold text-[var(--kora-text)]">{h.area}</p>
                  <p className="text-xs text-[var(--kora-text-secondary)]">
                    {h.venues} venues · avg {h.avgRating}★
                  </p>
                </div>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase text-violet-700 dark:bg-zinc-900/70 dark:text-violet-300">
                  Hot
                </span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {(dash?.localDiscovery?.actions ?? []).map((a) => (
                <span
                  key={a.id}
                  className="rounded-full border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-1 text-[11px] font-bold text-[var(--kora-text)]"
                >
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </StoryRingCard>

        <StoryRingCard
          title="Omnichannel desk"
          subtitle="WhatsApp-speed + in-app polish"
          accent="from-emerald-400 via-teal-500 to-sky-500"
        >
          <ul className="space-y-3 text-sm">
            <li className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <p className="font-bold text-[var(--kora-text)]">WhatsApp bridge</p>
              <p className="text-xs text-[var(--kora-text-secondary)]">
                Median reply {dash?.channels?.whatsapp?.medianReply ?? '—'} ·{' '}
                {dash?.channels?.whatsapp?.bridgeHealth ?? '—'}
              </p>
            </li>
            <li className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <p className="font-bold text-[var(--kora-text)]">In-app inbox</p>
              <p className="text-xs text-[var(--kora-text-secondary)]">
                {dash?.channels?.inApp?.unreadThreads ?? 0} threads ·{' '}
                {dash?.channels?.inApp?.autoReplies ?? 0} auto-replies armed
              </p>
            </li>
            <li className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <p className="font-bold text-[var(--kora-text)]">Walk-ins</p>
              <p className="text-xs text-[var(--kora-text-secondary)]">
                Buffer {dash?.channels?.walkIns?.suggestedBuffer ?? '—'} · {dash?.channels?.walkIns?.promo ?? '—'}
              </p>
            </li>
          </ul>
        </StoryRingCard>

        <StoryRingCard title="Today’s runway" subtitle="Ops checklist that feels like stories" accent="from-amber-400 via-orange-500 to-pink-600">
          <ul className="space-y-2">
            {(dash?.operations?.checklist ?? []).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5 text-sm"
              >
                <span className="font-semibold text-[var(--kora-text)]">{c.label}</span>
                <span
                  className={`text-[11px] font-black uppercase ${
                    c.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {c.done ? 'done' : c.priority}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/business/growth"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Open growth studio
          </Link>
        </StoryRingCard>
      </div>

      <div className="kora-card rounded-3xl p-5 lg:col-span-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[var(--kora-text)]">Live pulse</h2>
            <p className="text-sm text-[var(--kora-text-secondary)]">Swipe-sized events your team can act on now.</p>
          </div>
          <Link to="/business/bookings" className="text-sm font-bold text-fuchsia-600 hover:underline dark:text-fuchsia-400">
            View schedule →
          </Link>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(dash?.feed ?? []).map((item, i) => (
            <div
              key={item.id}
              className="min-w-[220px] max-w-[240px] shrink-0 rounded-2xl border border-[var(--kora-line)] bg-gradient-to-br from-[var(--kora-elevated)] to-[var(--kora-elevated-muted)]/80 p-4 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-wide text-[var(--kora-muted)]">
                {item.channel} · {item.ago}
              </p>
              <p className="mt-2 text-sm font-black text-[var(--kora-text)]">{item.event}</p>
              <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">{item.detail}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--kora-line)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600"
                  style={{ width: `${88 - i * 12}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {dash?.workforceReality ? (
        <section className="rounded-[2rem] border border-[var(--kora-line)] bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/50 p-5 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-sky-950/20 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300">
                Workforce intelligence
              </p>
              <h2 className="text-xl font-black text-[var(--kora-text)] sm:text-2xl">Hire, schedule, and protect quality</h2>
              <p className="mt-1 max-w-3xl text-sm text-[var(--kora-text-secondary)]">
                {dash.workforceReality.hiring?.playbook}
              </p>
            </div>
            <Link to="/business/workspaces" className="text-sm font-bold text-indigo-700 hover:underline dark:text-indigo-300">
              Open worker dashboard →
            </Link>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {(dash.workforceReality.hiring?.stages ?? []).map((stage) => (
              <div key={stage.id} className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--kora-muted)]">{stage.label}</p>
                <p className="mt-1 text-2xl font-black text-[var(--kora-text)]">{stage.value}</p>
                <p className="text-xs text-[var(--kora-text-secondary)]">Target move time: {stage.targetDays} days</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 p-4">
              <p className="text-xs font-black uppercase text-[var(--kora-muted)]">Staffing now</p>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--kora-text-secondary)]">
                <li>
                  • Worker capacity: <span className="font-bold text-[var(--kora-text)]">{dash.workforceReality.staffing?.workerCount ?? 0}</span>
                </li>
                <li>
                  • Active booked/in-service: <span className="font-bold text-[var(--kora-text)]">{dash.workforceReality.staffing?.activeBookingsNow ?? 0}</span>
                </li>
                <li>
                  • Team load: <span className="font-bold text-[var(--kora-text)]">{dash.workforceReality.staffing?.todayLoadPct ?? 0}%</span>
                </li>
                <li>
                  • No-show ratio: <span className="font-bold text-[var(--kora-text)]">{dash.workforceReality.staffing?.noShowRatePct ?? 0}%</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-[var(--kora-text-secondary)]">{dash.workforceReality.staffing?.shiftAdvice}</p>
            </div>
            <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 p-4">
              <p className="text-xs font-black uppercase text-[var(--kora-muted)]">Interview scorecard</p>
              <ul className="mt-2 space-y-1.5 text-sm font-semibold text-[var(--kora-text)]">
                {(dash.workforceReality.hiring?.scorecard ?? []).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {dash?.floorReality?.alerts?.length ? (
        <div className="rounded-[2rem] border border-[var(--kora-line)] bg-gradient-to-br from-[var(--kora-elevated)] via-violet-50/40 to-fuchsia-50/30 p-5 dark:via-violet-950/20 dark:to-fuchsia-950/15 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">
                {t('business.realityKicker')}
              </p>
              <h2 className="text-xl font-black text-[var(--kora-text)] sm:text-2xl">{t('business.realityTitle')}</h2>
              <p className="mt-1 max-w-3xl text-sm text-[var(--kora-text-secondary)]">{t('business.realitySub')}</p>
            </div>
            <Link
              to="/business/bookings"
              className="shrink-0 text-sm font-bold text-fuchsia-600 hover:underline dark:text-fuchsia-400"
            >
              {t('business.realityCta')} →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {dash.floorReality.policies ? (
              <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 p-4 text-sm dark:bg-[var(--kora-elevated)]/80">
                <p className="text-xs font-black uppercase text-[var(--kora-muted)]">{t('business.realityPolicies')}</p>
                <ul className="mt-2 space-y-2 text-[var(--kora-text-secondary)]">
                  <li>
                    • {t('business.bufferAfter')}:{' '}
                    <span className="font-bold text-[var(--kora-text)]">
                      {(dash.floorReality.policies as { bufferAfterMinutesDefault?: number }).bufferAfterMinutesDefault ??
                        12}
                      m
                    </span>
                  </li>
                  <li>
                    • {t('business.bufferBefore')}:{' '}
                    <span className="font-bold text-[var(--kora-text)]">
                      {(dash.floorReality.policies as { bufferBeforeMinutesDefault?: number }).bufferBeforeMinutesDefault ??
                        5}
                      m
                    </span>
                  </li>
                  <li>
                    • {t('business.noShowGrace')}:{' '}
                    <span className="font-bold text-[var(--kora-text)]">
                      {(dash.floorReality.policies as { noShowGraceMinutes?: number }).noShowGraceMinutes ?? 15}m
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-[var(--kora-text-secondary)]">
                  {(dash.floorReality.policies as { walkInRule?: string }).walkInRule}
                </p>
              </div>
            ) : null}
            <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/90 p-4 dark:bg-[var(--kora-elevated)]/80">
              <p className="text-xs font-black uppercase text-[var(--kora-muted)]">{t('business.realityTargets')}</p>
              <ul className="mt-2 text-sm text-[var(--kora-text-secondary)]">
                <li>
                  • {t('business.targetNoShow')}:{' '}
                  <span className="font-bold text-[var(--kora-text)]">
                    {dash.floorReality.metricsTargets?.noShowRateTargetPct ?? 10}%
                  </span>
                </li>
                <li>
                  • {t('business.targetChair')}:{' '}
                  <span className="font-bold text-[var(--kora-text)]">
                    {dash.floorReality.metricsTargets?.chairUtilisationPeakPct ?? 80}%
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(dash.floorReality.alerts ?? []).map((a) => (
              <div
                key={a.id}
                className={`rounded-2xl border p-4 ${
                  a.severity === 'high'
                    ? 'border-rose-300/80 bg-rose-50/90 dark:border-rose-900/50 dark:bg-rose-950/30'
                    : a.severity === 'medium'
                      ? 'border-amber-300/80 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/25'
                      : 'border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70'
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-wide text-[var(--kora-muted)]">{a.severity}</p>
                <p className="mt-1 text-base font-black text-[var(--kora-text)]">{a.title}</p>
                <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{a.detail}</p>
                {a.runbook?.length ? (
                  <ul className="mt-3 space-y-1.5 text-xs font-semibold text-[var(--kora-text)]">
                    {a.runbook.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="kora-card rounded-3xl p-5 lg:col-span-2">
          <h2 className="text-lg font-black text-[var(--kora-text)]">{t('business.dashToday')}</h2>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('business.dashTodaySub')}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">{t('business.dashGoal1')}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">3/4</span>
            </li>
            <li className="flex justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">{t('business.dashGoal2')}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">1</span>
            </li>
            <li className="flex justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">{t('business.dashGoal3')}</span>
              <span className="text-[var(--kora-muted)]">—</span>
            </li>
          </ul>
        </div>
        <div className="kora-card rounded-3xl p-5">
          <h2 className="text-lg font-black text-[var(--kora-text)]">{t('business.dashStaff')}</h2>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('business.dashStaffSub')}</p>
          <div className="mt-4 space-y-2">
            {['Aline · Senior', 'Jean · Barber', 'Claire · Nails'].map((s) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-2xl border border-[var(--kora-line)] px-3 py-2 text-sm"
              >
                <span className="font-medium text-[var(--kora-text)]">{s}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t('business.dashOn')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(dash?.growthStudio ?? []).map((g) => (
          <div
            key={g.id}
            className="rounded-3xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] p-5 shadow-sm transition hover:border-fuchsia-300/80 hover:shadow-md dark:hover:border-fuchsia-500/50"
          >
            <p className="text-xs font-black uppercase tracking-wide text-fuchsia-600 dark:text-fuchsia-400">
              Growth
            </p>
            <h3 className="mt-2 text-base font-black text-[var(--kora-text)]">{g.title}</h3>
            <p className="mt-2 text-sm text-[var(--kora-text-secondary)]">{g.body}</p>
            <button
              type="button"
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-2.5 text-sm font-bold text-white shadow-md"
            >
              {g.cta}
            </button>
          </div>
        ))}
      </div>

      {workerCount > 1 ? (
        <div className="rounded-3xl border border-emerald-300/50 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/45 dark:from-emerald-950/35 dark:to-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-emerald-900 dark:text-emerald-200">Worker keys (admin only)</h2>
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Private
            </span>
          </div>
          <p className="mt-1 text-sm text-emerald-800/85 dark:text-emerald-300/90">
            Each worker has independent credentials and workspace. Do not share keys publicly.
          </p>
          <div className="mt-3 rounded-2xl border border-emerald-300/60 bg-white/85 p-3 dark:border-emerald-900/50 dark:bg-zinc-900/70">
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Admin key</p>
            <p className="mt-1 text-sm font-black text-emerald-900 dark:text-emerald-200">{adminKey}</p>
          </div>
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
            {workerKeys.map((wk) => (
              <div
                key={wk.key}
                className="flex items-center justify-between rounded-2xl border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm dark:border-emerald-900/40 dark:bg-zinc-900/70"
              >
                <span className="font-semibold text-emerald-900 dark:text-emerald-200">{wk.name}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{wk.key}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="kora-card rounded-3xl p-6">
          <h2 className="text-lg font-black text-[var(--kora-text)]">{t('business.floorTitle')}</h2>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">{t('business.floorHint')}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-bold text-white shadow-md transition hover:brightness-95"
            >
              {t('business.busy')}
            </button>
            <button
              type="button"
              className="h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-md transition hover:brightness-95"
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
          <h2 className="text-lg font-black text-[var(--kora-text)]">{t('business.queue')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
              <span className="font-semibold text-[var(--kora-text)]">Marie · Braids</span>
              <span className="text-[var(--kora-muted)]">11:00</span>
            </li>
            <li className="flex justify-between rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/70 px-3 py-2.5">
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

      <div className="rounded-3xl border border-sky-400/30 bg-gradient-to-br from-sky-50/90 to-white p-5 dark:border-sky-800/45 dark:from-sky-950/35 dark:to-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-sky-900 dark:text-sky-200">{t('business.bridgeTitle')}</p>
            <p className="mt-1 text-sm text-sky-900/85 dark:text-sky-300/90">{t('business.bridgeBody')}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href="/application-22fa0176-41e6-4353-91e8-112e185f942a.apk"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md"
            >
              Download staff app
            </a>
            <Link
              to="/business/messages"
              className="inline-flex items-center justify-center rounded-2xl border border-sky-300/70 bg-white/80 px-4 py-2.5 text-xs font-bold text-sky-900 hover:bg-white dark:border-sky-700 dark:bg-zinc-900/70 dark:text-sky-100"
            >
              Open unified inbox
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(dash?.automations ?? []).map((a) => (
            <div key={a.id} className="rounded-2xl border border-sky-200/70 bg-white/85 px-3 py-2 dark:border-sky-900/50 dark:bg-zinc-900/60">
              <p className="text-[11px] font-black uppercase text-sky-700 dark:text-sky-300">Auto</p>
              <p className="mt-1 text-xs font-bold text-sky-950 dark:text-sky-100">{a.name}</p>
              <p className="mt-1 text-[10px] font-semibold text-sky-700/80 dark:text-sky-300/90">
                {a.enabled ? 'Enabled' : 'Paused'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
