import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { categories, listings } from '../data/catalog'
import { ListingCard } from '../components/marketplace/ListingCard'
import { IconSearch } from '../components/icons'

function categoryLabel(id: string, t: (key: string) => string) {
  const key = `home.cat_${id}`
  const v = t(key)
  return v === key ? id : v
}

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('Kigali')

  function onHeroSubmit(e: FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (city.trim()) p.set('city', city.trim())
    navigate(`/search?${p.toString()}`)
  }

  const featured = [...listings].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <div className="bg-[var(--kora-canvas)]">
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
            <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end">
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
              <button
                type="submit"
                className="h-11 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-md hover:bg-brand-700 sm:h-[46px]"
              >
                {t('home.searchBtn')}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.slice(1, 6).map((c) => (
                <Link
                  key={c.id}
                  to={`/search?category=${encodeURIComponent(c.id)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-ink-700 hover:border-brand-300 hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:bg-brand-950/40"
                >
                  <span>{c.icon}</span>
                  {categoryLabel(c.id, t)}
                </Link>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-2xl">
              {t('home.categoriesTitle')}
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
              {t('home.categoriesHint')}
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400"
          >
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(1).map((c) => (
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
