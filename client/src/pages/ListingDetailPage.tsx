import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getListing } from '../data/catalog'
import { formatDuration, formatRwf } from '../lib/format'
import { IconMapPin, IconStar } from '../components/icons'

export function ListingDetailPage() {
  const { slug } = useParams()
  const listing = slug ? getListing(slug) : undefined
  const [img, setImg] = useState(0)

  if (!listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Link to="/search" className="mt-4 inline-block text-brand-700 font-semibold">
          Back to search
        </Link>
      </div>
    )
  }

  const images = [listing.image, ...listing.gallery]

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 text-xs font-medium text-ink-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link to="/search" className="hover:text-brand-700">
          Search
        </Link>
        <span className="mx-1">/</span>
        <span className="text-ink-900 dark:text-white">{listing.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
            <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
              <img
                src={images[img]}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {listing.instantConfirm ? (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
                    Instant request
                  </span>
                ) : null}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow ${
                    listing.busyNow ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                >
                  {listing.busyNow ? 'Busy now' : 'Accepting bookings'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setImg(i)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === img ? 'border-brand-600' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
            {['Overview', 'Services', 'Reviews', 'Location'].map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-ink-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {t}
              </span>
            ))}
          </div>

          <section className="mt-6">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-zinc-300">
              {listing.tagline} Member since {listing.memberSince}. Languages:{' '}
              {listing.languages.join(', ')}.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {listing.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm font-medium text-ink-800 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100"
                >
                  <span className="text-emerald-600">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">Services &amp; prices</h2>
            <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
              {listing.services.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink-900 dark:text-white">{s.name}</p>
                    {s.description ? (
                      <p className="mt-1 text-sm text-ink-500 dark:text-zinc-400">{s.description}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-ink-500 dark:text-zinc-400">
                      Duration: {formatDuration(s.durationMin)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="text-lg font-bold text-ink-900 dark:text-white">
                      {formatRwf(s.priceRwf)}
                    </p>
                    <Link
                      to={`/listing/${listing.slug}/book?service=${encodeURIComponent(s.id)}`}
                      className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
                    >
                      Select
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-900/40 dark:bg-amber-950/25">
            <h2 className="text-sm font-bold uppercase tracking-wide text-amber-900 dark:text-amber-300">
              Walk-ins &amp; real life
            </h2>
            <p className="mt-2 text-sm text-amber-950/90 dark:text-amber-100/85">
              Popular shops serve walk-in guests. Your time may move slightly — we
              surface that clearly and push the final handshake to WhatsApp.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <h1 className="text-2xl font-black tracking-tight text-ink-900 dark:text-white">
              {listing.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-600 dark:text-zinc-300">
              <span className="inline-flex items-center gap-1 font-semibold text-ink-900 dark:text-white">
                <IconStar className="h-4 w-4 text-amber-400" />
                {listing.rating.toFixed(1)}
              </span>
              <span>({listing.reviews.toLocaleString()} reviews)</span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-ink-600 dark:text-zinc-300">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <span>
                {listing.area}, {listing.city} · Open until {listing.openUntil}
              </span>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="text-xs font-bold uppercase text-ink-500 dark:text-zinc-400">From</p>
              <p className="text-2xl font-black text-ink-900 dark:text-white">
                {formatRwf(listing.priceFromRwf)}
                <span className="text-sm font-semibold text-ink-500 dark:text-zinc-400"> / visit</span>
              </p>
            </div>
            <Link
              to={`/listing/${listing.slug}/book`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-center text-base font-bold text-white shadow-md hover:bg-brand-700"
            >
              Check availability
            </Link>
            <p className="mt-3 text-center text-xs text-ink-500 dark:text-zinc-400">
              You’ll pick service &amp; time next — max three screens.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-ink-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-zinc-300">
            <p className="font-bold text-ink-900 dark:text-white">Guests love clarity</p>
            <p className="mt-2">
              “Feels like Booking.com but for my barber. I see the price and length
              before I commit.”
            </p>
            <p className="mt-2 text-xs font-semibold text-ink-500 dark:text-zinc-400">— Pilot guest</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
