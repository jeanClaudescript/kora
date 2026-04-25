import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, listings } from '../data/catalog'
import { ListingCard } from '../components/marketplace/ListingCard'
import { IconSearch } from '../components/icons'
import { searchListingsApi } from '../lib/api'

export function SearchPage() {
  const [params] = useSearchParams()
  return <SearchPageInner key={params.toString()} />
}

function SearchPageInner() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const city = params.get('city') ?? ''

  const [localQ, setLocalQ] = useState(q)
  const [localCity, setLocalCity] = useState(city)
  const [results, setResults] = useState(listings)

  useEffect(() => {
    searchListingsApi({ q, category: category === 'all' ? '' : category, city })
      .then((items) => setResults(items))
      .catch(() => setResults([]))
  }, [q, category, city])

  function applyFilters(e: FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (localQ.trim()) p.set('q', localQ.trim())
    if (category && category !== 'all') p.set('category', category)
    if (localCity.trim()) p.set('city', localCity.trim())
    setParams(p)
  }

  function setCategory(cat: string) {
    const p = new URLSearchParams(params)
    if (cat === 'all') p.delete('category')
    else p.set('category', cat)
    setParams(p)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-2">
        <nav className="text-xs font-medium text-ink-500">
          <Link to="/" className="hover:text-brand-700">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span className="text-ink-900">Search</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Find your next appointment
        </h1>
        <p className="text-sm text-ink-500">
          {results.length} places match your filters — refine like Booking.com,
          browse like a marketplace.
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="kora-card mb-8 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-end"
      >
        <label className="min-w-0 flex-1">
          <span className="mb-1 block text-xs font-bold uppercase text-[var(--kora-muted)]">
            Keyword
          </span>
          <div className="kora-field-shell py-2.5">
            <IconSearch className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
            <input
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              placeholder="Salon, spa, nails…"
            />
          </div>
        </label>
        <label className="w-full sm:w-48">
          <span className="mb-1 block text-xs font-bold uppercase text-[var(--kora-muted)]">
            City
          </span>
          <input
            value={localCity}
            onChange={(e) => setLocalCity(e.target.value)}
            className="kora-input py-2.5"
            placeholder="Kigali"
          />
        </label>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white hover:bg-brand-700"
        >
          Update results
        </button>
      </form>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-60">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">
            Category
          </p>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {categories.map((c) => {
              const active =
                (c.id === 'all' && (category === 'all' || !category)) ||
                c.id === category
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id === 'all' ? 'all' : c.id)}
                  className={`rounded-full px-3 py-1.5 text-left text-sm font-semibold lg:w-full lg:rounded-xl ${
                    active
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'border border-[var(--kora-line)] bg-[var(--kora-elevated)] text-[var(--kora-text)] hover:border-brand-400'
                  }`}
                >
                  <span className="mr-1">{c.icon}</span>
                  {c.label}
                </button>
              )
            })}
          </div>
          <div className="kora-card-muted mt-8 hidden p-4 text-sm text-[var(--kora-text-secondary)] lg:block">
            <p className="font-bold text-[var(--kora-text)]">Filters you’ll wire tomorrow</p>
            <p className="mt-2">
              Price range, distance, instant confirm, open now — expose as query
              params from your API.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink-700">
              {q ? `“${q}” · ` : ''}
              {category !== 'all' && category ? `${category} · ` : ''}
              {city || 'All cities'}
            </p>
            <select
              className="kora-input rounded-lg py-2 text-sm font-medium"
              defaultValue="rating"
              aria-label="Sort"
            >
              <option value="rating">Sort: Guest rating</option>
              <option value="price">Sort: Price (low)</option>
              <option value="reviews">Sort: Most reviewed</option>
            </select>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {results.map((l, i) => (
              <ListingCard key={l.slug} listing={l} toneIndex={i % 4} />
            ))}
          </div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--kora-line-strong)] bg-[var(--kora-elevated)] p-12 text-center">
              <p className="text-lg font-bold text-ink-900">No exact matches</p>
              <p className="mt-2 text-sm text-ink-500">
                Try a broader keyword or switch category — backend search will make
                this instant.
              </p>
              <Link
                to="/search"
                className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white"
              >
                Reset filters
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
