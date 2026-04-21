import { Link } from 'react-router-dom'
import { listings } from '../data/catalog'
import { formatRwf } from '../lib/format'

const demoTrips = [
  {
    id: '1',
    listing: listings[0],
    service: 'Wash & blow-dry',
    when: 'Tomorrow · 10:30',
    status: 'Confirmed on WhatsApp',
  },
  {
    id: '2',
    listing: listings[1],
    service: 'Haircut + beard',
    when: 'Fri 18 Apr · 16:00',
    status: 'Awaiting reply',
  },
]

export function AccountTripsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-4 text-xs font-medium text-ink-500">
        <Link to="/account" className="hover:text-brand-700">
          Account
        </Link>
        <span className="mx-1">/</span>
        <span className="text-ink-900">My bookings</span>
      </nav>
      <h1 className="text-2xl font-black tracking-tight text-ink-900">My bookings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Calendar-style list — swap for API-driven cards when your DB is ready.
      </p>

      <ul className="mt-8 space-y-4">
        {demoTrips.map((t) => (
          <li
            key={t.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-4">
              <img
                src={t.listing.image}
                alt=""
                className="h-20 w-28 shrink-0 rounded-xl object-cover"
              />
              <div>
                <p className="font-bold text-ink-900">{t.listing.name}</p>
                <p className="text-sm text-ink-600">{t.service}</p>
                <p className="mt-1 text-sm font-semibold text-ink-800">{t.when}</p>
                <p className="mt-1 text-xs font-semibold text-emerald-700">
                  {t.status}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <p className="w-full text-right text-sm font-bold text-ink-900 sm:w-auto">
                From {formatRwf(t.listing.priceFromRwf)}
              </p>
              <Link
                to={`/listing/${t.listing.slug}`}
                className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-bold text-ink-800 hover:bg-slate-50"
              >
                View listing
              </Link>
              <button
                type="button"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
              >
                Message on WhatsApp
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
