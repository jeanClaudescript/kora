import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Listing } from '../../data/catalog'
import { formatRwf } from '../../lib/format'
import { IconMapPin, IconStar } from '../icons'

/** Solid surfaces + subtle accent stripe (readable in light & dark, no heavy glass) */
const ACCENT = [
  'border-l-brand-500',
  'border-l-sky-500',
  'border-l-violet-500',
  'border-l-emerald-500',
] as const

type Props = {
  listing: Listing
  /** Cycle 0–3 for alternating card personalities */
  toneIndex?: number
  variant?: 'default' | 'spotlight'
}

export function ListingCard({
  listing,
  toneIndex = 0,
  variant = 'default',
}: Props) {
  const { t } = useTranslation()
  const accent = ACCENT[toneIndex % ACCENT.length]
  const isSpotlight = variant === 'spotlight'
  const imgAspect = isSpotlight ? 'aspect-[5/3]' : 'aspect-[16/10]'

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--kora-line)] border-l-4 bg-[var(--kora-elevated)] text-[var(--kora-text)] shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift dark:shadow-card-dark dark:hover:shadow-lift-dark ${accent}`}
    >
      <Link
        to={`/listing/${listing.slug}`}
        className={`relative block overflow-hidden ${imgAspect}`}
      >
        <img
          src={listing.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-95"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent dark:from-black/70" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
          {listing.badges.includes('popular') ? (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-900 shadow-sm">
              {t('listing.popular')}
            </span>
          ) : null}
          {listing.badges.includes('topRated') ? (
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 shadow-sm dark:bg-emerald-100/90">
              {t('listing.topRated')}
            </span>
          ) : null}
          {listing.badges.includes('almostFull') ? (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              {t('listing.almostFull')}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 text-white sm:bottom-3 sm:left-3 sm:right-3">
          <div>
            <p className="text-[11px] font-semibold text-white/90 sm:text-xs">
              {listing.category}
            </p>
            <p className="line-clamp-2 text-base font-bold leading-snug sm:text-lg">
              {listing.name}
            </p>
          </div>
          <div
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold shadow sm:px-2.5 sm:py-1 sm:text-[11px] ${
              listing.busyNow
                ? 'bg-orange-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {listing.busyNow ? t('listing.busy') : t('listing.open')}
          </div>
        </div>
      </Link>

      <div className={`flex flex-1 flex-col gap-2 ${isSpotlight ? 'p-3 sm:p-3.5' : 'gap-3 p-4'}`}>
        <p
          className={`line-clamp-2 text-[var(--kora-text-secondary)] ${isSpotlight ? 'text-xs sm:text-sm' : 'text-sm'}`}
        >
          {listing.tagline}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-ink-700 dark:text-slate-200 sm:text-sm">
          <IconMapPin className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400 sm:h-4 sm:w-4" />
          <span className="truncate">
            {listing.area}, {listing.city}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <IconStar className="h-3.5 w-3.5 shrink-0 text-amber-400 sm:h-4 sm:w-4" />
            <span className="text-xs font-bold text-ink-900 dark:text-white sm:text-sm">
              {listing.rating.toFixed(1)}
            </span>
            <span className="truncate text-xs text-ink-500 dark:text-slate-400 sm:text-sm">
              ({listing.reviews.toLocaleString()} {t('listing.reviews')})
            </span>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium text-ink-500 dark:text-slate-400">
              {t('listing.from')}
            </p>
            <p className="text-xs font-bold text-ink-900 dark:text-white sm:text-sm">
              {formatRwf(listing.priceFromRwf)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-[var(--kora-line)] pt-2.5 sm:pt-3">
          {listing.instantConfirm ? (
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 sm:text-xs">
              {t('listing.instant')}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-ink-500 dark:text-slate-400 sm:text-xs">
              {t('listing.waConfirm')}
            </span>
          )}
          <Link
            to={`/listing/${listing.slug}/book`}
            className="shrink-0 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-brand-600/35 ring-2 ring-brand-400/40 transition hover:from-brand-500 hover:to-brand-600 hover:ring-brand-300/60 sm:px-4 sm:text-sm"
          >
            {isSpotlight ? t('listing.ctaShort') : t('listing.cta')}
          </Link>
        </div>
      </div>
    </article>
  )
}
