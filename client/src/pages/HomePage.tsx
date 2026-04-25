import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { categories, listings } from '../data/catalog'
import { ListingCard } from '../components/marketplace/ListingCard'
import { IconSearch } from '../components/icons'
import { LocationPickerModal } from '../components/location/LocationPickerModal'
import { useAuth } from '../auth/AuthContext'
import { getCustomerDashboard, getListings } from '../lib/api'

type ContentCard = {
  id: string
  title: string
  subtitle: string
  accent: string
  slug?: string
}

type VisitRow = {
  id: string
  serviceName: string
  slotLabel: string
  venueName: string
  area?: string
  city?: string
  mapUrl?: string
  status?: string
}

type CustomerDash = {
  mindset?: {
    likelyIntent?: string
    needSummary?: string
    joyHook?: string
    affinitySummary?: string
  }
  contentCards?: ContentCard[]
  recentVisits?: VisitRow[]
  locationPulse?: {
    exploreLabel?: string
    mapExploreUrl?: string
    neighborhoods?: string[]
    geoEnabled?: boolean
  }
  discoveryHints?: string[]
  bookingPeace?: {
    policySummary?: string
    reminderCadence?: string[]
    tips?: Array<{ id: string; title: string; body: string; icon?: string }>
    noShowGraceMinutes?: number
  }
}

function categoryLabel(id: string, t: (key: string) => string) {
  const key = `home.cat_${id}`
  const v = t(key)
  return v === key ? id : v
}

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('Kigali')
  const [pickedCategory, setPickedCategory] = useState('all')
  const [liveListings, setLiveListings] = useState(listings)
  const [customerDash, setCustomerDash] = useState<CustomerDash | null>(null)
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null)
  const [locationOpen, setLocationOpen] = useState(false)
  const [savedLoc, setSavedLoc] = useState<{ lat: number; lng: number; label: string } | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rb_location_v1')
      if (raw) setSavedLoc(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    getListings()
      .then((items) => {
        if (items.length) setLiveListings(items)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!('geolocation' in navigator)) return undefined
    if (savedLoc) return undefined
    const tid = window.setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGeo(null),
        { enableHighAccuracy: false, maximumAge: 600_000, timeout: 12_000 },
      )
    }, 600)
    return () => clearTimeout(tid)
  }, [])

  useEffect(() => {
    let cancelled = false
    const uid = user?.id ?? 'guest'
    const cityParam = user?.preferredCity ?? city
    void (async () => {
      try {
        const data = (await getCustomerDashboard(uid, {
          city: cityParam,
          lat: savedLoc?.lat ?? geo?.lat,
          lng: savedLoc?.lng ?? geo?.lng,
          interests: user?.interestCategories,
          visitStyle: 'balanced',
        })) as CustomerDash
        if (!cancelled) setCustomerDash(data)
      } catch {
        if (!cancelled) setCustomerDash(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id, user?.preferredCity, user?.interestCategories, city, geo, savedLoc])

  const personalizedCategories = useMemo(() => {
    const source = categories.slice(1)
    const interests = new Set(user?.interestCategories ?? [])
    const preferredCity = (user?.preferredCity ?? city).toLowerCase()
    const demandByCategory = new Map<string, number>()
    for (const listing of liveListings) {
      const current = demandByCategory.get(listing.category) ?? 0
      demandByCategory.set(listing.category, current + (listing.city.toLowerCase() === preferredCity ? 2 : 1))
    }

    return [...source].sort((a, b) => {
      const ai = interests.has(a.id) ? 4 : 0
      const bi = interests.has(b.id) ? 4 : 0
      const ad = demandByCategory.get(a.id) ?? 0
      const bd = demandByCategory.get(b.id) ?? 0
      return bi + bd - (ai + ad)
    })
  }, [city, user, liveListings])

  function onHeroSubmit(e: FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (city.trim()) p.set('city', city.trim())
    if (pickedCategory !== 'all') p.set('category', pickedCategory)
    navigate(`/search?${p.toString()}`)
  }

  const featured = [...liveListings].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <div className="bg-[var(--kora-canvas)]">
      <LocationPickerModal
        open={locationOpen}
        title="Choose your area"
        initialValue={savedLoc}
        onClose={() => setLocationOpen(false)}
        onPick={(loc) => {
          setSavedLoc(loc)
          try {
            localStorage.setItem('rb_location_v1', JSON.stringify(loc))
          } catch {
            // ignore
          }
          setLocationOpen(false)
        }}
      />
      {/* Above the fold: picks first, minimal copy */}
      <section className="border-b border-[var(--kora-line)] bg-gradient-to-b from-[var(--kora-elevated)] via-[var(--kora-canvas)] to-[var(--kora-canvas)] px-4 pb-6 pt-5 sm:pt-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-400 sm:text-xs">
            {t('home.kicker')}
          </p>
          <h1 className="mx-auto mt-1.5 max-w-2xl text-center text-xl font-black leading-tight tracking-tight text-ink-900 dark:text-white sm:text-2xl md:text-3xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mx-auto mt-1.5 max-w-md text-center text-xs text-ink-600 dark:text-slate-400 sm:text-sm">
            {t('home.heroSubtitle')}
          </p>
          {customerDash?.mindset?.likelyIntent ? (
            <p className="mx-auto mt-3 max-w-xl text-center text-xs leading-relaxed text-ink-700 dark:text-slate-300 sm:text-sm">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-violet-600 to-sky-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-sky-400">
                {customerDash.mindset.likelyIntent}
              </span>
            </p>
          ) : null}
          {customerDash?.mindset?.joyHook && customerDash?.mindset?.needSummary ? (
            <p className="mx-auto mt-2 max-w-lg text-center text-[11px] text-ink-500 dark:text-slate-500 sm:text-xs">
              <span className="font-semibold text-ink-700 dark:text-slate-300">{customerDash.mindset.joyHook}</span>
              <span className="text-ink-400"> · </span>
              {customerDash.mindset.needSummary}
            </p>
          ) : null}

          <div className="mt-5 sm:mt-6">
            <div className="mb-2 flex items-end justify-between gap-2 px-0.5">
              <h2 className="text-sm font-bold text-ink-900 dark:text-white sm:text-base">
                {t('home.recommended')}
              </h2>
              <p className="hidden text-xs text-ink-500 dark:text-slate-500 sm:block">
                {t('home.recommendedHint')}
              </p>
            </div>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              {featured.map((l, i) => (
                <div
                  key={l.slug}
                  className="w-[min(88vw,300px)] shrink-0 snap-center sm:w-auto sm:snap-align-none"
                >
                  <ListingCard listing={l} toneIndex={i} variant="spotlight" />
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <a
                href="#discover"
                className="text-sm font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                {t('home.seeMore')}
              </a>
              <span className="hidden text-slate-300 dark:text-slate-600 sm:inline">·</span>
              <Link
                to="/search"
                className="text-sm font-medium text-ink-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              >
                {t('home.viewAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {customerDash ? (
        <section
          className="border-b border-[var(--kora-line)] bg-[var(--kora-canvas)] px-4 py-10"
          aria-label={t('home.dashTitle')}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-fuchsia-600 dark:text-fuchsia-400">
                  {t('home.dashForYou')}
                </p>
                <h2 className="text-2xl font-black tracking-tight text-ink-900 dark:text-white sm:text-3xl">
                  {t('home.dashTitle')}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-600 dark:text-slate-400">{t('home.dashSubtitle')}</p>
              </div>
              <button
                type="button"
                onClick={() => setLocationOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-105"
              >
                {savedLoc ? 'Change location' : 'Set location'}
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(customerDash.contentCards ?? []).map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl bg-gradient-to-br p-[1px] shadow-md ${card.accent}`}
                >
                  <div className="flex h-full flex-col rounded-[0.95rem] bg-[var(--kora-elevated)] p-4 dark:bg-[var(--kora-elevated)]">
                    <h3 className="text-sm font-black text-ink-900 dark:text-white">{card.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600 dark:text-slate-400">
                      {card.subtitle}
                    </p>
                    {card.slug ? (
                      <Link
                        to={`/listing/${card.slug}`}
                        className="mt-3 text-xs font-bold text-fuchsia-600 hover:underline dark:text-fuchsia-400"
                      >
                        {t('home.seeTop')} →
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-[var(--kora-line)] bg-gradient-to-br from-[var(--kora-elevated)] via-[var(--kora-elevated-muted)]/50 to-[var(--kora-elevated)] p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-black text-ink-900 dark:text-white">{t('home.dashVisits')}</h3>
                  <p className="text-sm text-ink-600 dark:text-slate-400">{t('home.dashVisitsHint')}</p>
                </div>
                {customerDash.locationPulse?.neighborhoods?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {customerDash.locationPulse.neighborhoods.slice(0, 5).map((n) => (
                      <span
                        key={n}
                        className="rounded-full border border-[var(--kora-line)] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-600 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {(customerDash.recentVisits ?? []).map((v) => (
                  <li
                    key={v.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--kora-line)] bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-slate-500">
                        {v.status === 'suggested' ? t('home.dashSuggested') : v.status ?? 'booking'}
                      </p>
                      <p className="truncate text-base font-black text-ink-900 dark:text-white">{v.venueName}</p>
                      <p className="text-sm font-semibold text-ink-700 dark:text-slate-200">{v.serviceName}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">
                        {v.area}, {v.city} · {v.slotLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocationOpen(true)}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2 text-xs font-bold text-fuchsia-900 hover:bg-fuchsia-100 dark:border-fuchsia-900/50 dark:bg-fuchsia-950/40 dark:text-fuchsia-100"
                    >
                      Map
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {customerDash.bookingPeace ? (
              <div className="mt-8 rounded-3xl border border-[var(--kora-line)] bg-gradient-to-br from-emerald-50/90 via-white to-sky-50/80 p-5 dark:from-emerald-950/25 dark:via-slate-900/80 dark:to-sky-950/20 sm:p-6">
                <h3 className="text-lg font-black text-ink-900 dark:text-white">{t('home.dashPeaceTitle')}</h3>
                <p className="mt-1 text-sm text-ink-600 dark:text-slate-400">{t('home.dashPeaceSub')}</p>
                {customerDash.bookingPeace.policySummary ? (
                  <p className="mt-3 text-xs leading-relaxed text-ink-600 dark:text-slate-400">
                    {customerDash.bookingPeace.policySummary}
                  </p>
                ) : null}
                {customerDash.bookingPeace.reminderCadence?.length ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      {t('home.dashPeaceCadence')}
                    </p>
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {customerDash.bookingPeace.reminderCadence.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-emerald-200/80 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-100"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(customerDash.bookingPeace.tips ?? []).map((tip) => (
                    <div
                      key={tip.id}
                      className="rounded-2xl border border-[var(--kora-line)] bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/85"
                    >
                      <p className="text-sm font-black text-ink-900 dark:text-white">{tip.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-600 dark:text-slate-400">{tip.body}</p>
                    </div>
                  ))}
                </div>
                {customerDash.bookingPeace.noShowGraceMinutes != null ? (
                  <p className="mt-4 text-center text-[11px] font-semibold text-ink-500 dark:text-slate-500">
                    {t('home.dashGraceNote', { minutes: customerDash.bookingPeace.noShowGraceMinutes })}
                  </p>
                ) : null}
              </div>
            ) : null}

            {customerDash.discoveryHints?.length ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--kora-line-strong)] bg-[var(--kora-elevated-muted)]/60 px-4 py-3 dark:border-slate-600 dark:bg-slate-900/40">
                <p className="text-[11px] font-black uppercase tracking-wide text-[var(--kora-muted)]">
                  {t('home.dashHints')}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {customerDash.discoveryHints.map((h) => (
                    <li
                      key={h}
                      className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink-700 dark:bg-slate-800/90 dark:text-slate-200"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Search + trust — scroll target */}
      <section
        id="discover"
        className="scroll-mt-24 border-b border-[var(--kora-line)] bg-[var(--kora-elevated)] px-4 py-8"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-lg font-bold text-ink-900 dark:text-white sm:text-xl">
            {t('home.findTitle')}
          </h2>
          <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">{t('home.findHint')}</p>
          <form
            onSubmit={onHeroSubmit}
            className="kora-card mt-5 rounded-2xl p-3 sm:p-4"
          >
            <div className="grid gap-3 sm:grid-cols-[1.15fr_0.95fr_0.95fr_auto] sm:items-end">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                  {t('home.serviceLabel')}
                </span>
                <div className="kora-field-shell py-2.5">
                  <IconSearch className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t('home.servicePlaceholder')}
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                  {t('home.cityLabel')}
                </span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="kora-input py-2.5"
                  placeholder="Kigali"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                  Category
                </span>
                <select
                  value={pickedCategory}
                  onChange={(e) => setPickedCategory(e.target.value)}
                  className="kora-input py-2.5"
                >
                  <option value="all">All services</option>
                  {personalizedCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {categoryLabel(c.id, t)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="h-11 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-md hover:bg-brand-700 sm:h-[46px]"
              >
                {t('home.searchBtn')}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {personalizedCategories.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setPickedCategory(c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    pickedCategory === c.id
                      ? 'border-brand-500 bg-brand-600 text-white'
                      : 'border-slate-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:bg-brand-950/40'
                  }`}
                >
                  <span>{c.icon}</span>
                  {categoryLabel(c.id, t)}
                </button>
              ))}
            </div>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink-600 dark:text-slate-400 sm:text-sm">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              ✓ {t('home.trust1')}
            </span>
            <span>✓ {t('home.trust2')}</span>
            <span>✓ {t('home.trust3')}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(280px,32%)_1fr]">
          <aside className="kora-card rounded-3xl p-3.5 lg:sticky lg:top-[5.5rem] lg:self-start">
            <h2 className="text-base font-bold tracking-tight text-ink-900 dark:text-white">
              {t('home.categoriesTitle')}
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">{t('home.categoriesHint')}</p>
            <div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {personalizedCategories.map((c) => (
                <Link
                  key={`aside-${c.id}`}
                  to={`/search?category=${encodeURIComponent(c.id)}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-2.5 transition hover:border-brand-400"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-[var(--kora-text)]">
                    <span>{c.icon}</span>
                    {categoryLabel(c.id, t)}
                  </span>
                  <span className="text-xs text-[var(--kora-muted)]">›</span>
                </Link>
              ))}
            </div>
          </aside>
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-2xl">
                  Popular categories for you
                </h2>
                <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
                  Ranked from your activity, location, and marketplace demand.
                </p>
              </div>
              <Link
                to="/search"
                className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400"
              >
                {t('home.viewAll')} →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {personalizedCategories.slice(0, 12).map((c) => (
                <Link
                  key={c.id}
                  to={`/search?category=${encodeURIComponent(c.id)}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-card transition hover:border-brand-300 hover:shadow-lift dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500 sm:p-5"
                >
                  <span className="text-2xl sm:text-3xl">{c.icon}</span>
                  <span className="text-sm font-bold text-ink-900 dark:text-white">
                    {categoryLabel(c.id, t)}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-slate-400">{t('home.seeTop')}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-6 shadow-card dark:border-amber-900/40 dark:from-amber-950/40 dark:to-slate-900 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              {t('home.bizTitle')}
            </p>
            <h3 className="mt-2 text-lg font-bold text-ink-900 dark:text-white sm:text-xl">
              {t('home.bizBody')}
            </h3>
            <Link
              to="/auth/signup?role=business"
              className="mt-4 inline-flex rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-ink-950 dark:bg-white dark:text-ink-900 dark:hover:bg-slate-200"
            >
              {t('home.bizCta')}
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-card dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-400">
              {t('home.guestTitle')}
            </p>
            <h3 className="mt-2 text-lg font-bold text-ink-900 dark:text-white">
              {t('home.guestHeadline')}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-600 dark:text-slate-300">
              <li>• {t('home.guest1')}</li>
              <li>• {t('home.guest2')}</li>
              <li>• {t('home.guest3')}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

