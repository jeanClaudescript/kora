import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getListing } from '../data/catalog'
import type { ServiceItem } from '../data/catalog'
import { formatDuration, formatRwf } from '../lib/format'
import type { BookingSuccessState } from '../types/booking'

const SLOTS = [
  { id: '1', label: '09:00' },
  { id: '2', label: '09:30', disabled: true },
  { id: '3', label: '10:00' },
  { id: '4', label: '10:30' },
  { id: '5', label: '11:00', disabled: true },
  { id: '6', label: '11:30' },
  { id: '7', label: '14:00' },
  { id: '8', label: '15:30' },
]

type Step = 1 | 2 | 3

export function BookingPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  return (
    <BookingPageInner
      key={`${slug ?? ''}-${searchParams.get('service') ?? ''}`}
    />
  )
}

function BookingPageInner() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const listing = slug ? getListing(slug) : undefined

  const preService = searchParams.get('service')

  const fromUrl = useMemo(() => {
    if (!listing || !preService) return null
    return listing.services.find((s) => s.id === preService) ?? null
  }, [listing, preService])

  const [step, setStep] = useState<Step>(1)
  const [pickedService, setPickedService] = useState<ServiceItem | null>(null)
  const service = pickedService ?? fromUrl
  const [slotId, setSlotId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const slotLabel = useMemo(
    () => SLOTS.find((s) => s.id === slotId)?.label ?? '',
    [slotId],
  )

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Listing not found</h1>
        <Link to="/search" className="mt-4 inline-block font-semibold text-brand-700">
          Search
        </Link>
      </div>
    )
  }

  const L = listing

  const can1 = service != null
  const slot = SLOTS.find((s) => s.id === slotId)
  const can2 = slot != null && !slot.disabled
  const can3 = name.trim().length >= 2 && phone.trim().length >= 8

  function submit() {
    if (!service || !can2) return
    const state: BookingSuccessState = {
      listingName: L.name,
      listingSlug: L.slug,
      serviceName: service.name,
      slotLabel,
      customerName: name.trim(),
      phone: phone.trim(),
      whatsapp: L.whatsapp,
    }
    navigate('/booking/success', { state })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-xs font-medium text-[var(--kora-muted)]">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link to={`/listing/${L.slug}`} className="hover:text-brand-600 dark:hover:text-brand-400">
          {L.name}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-[var(--kora-text)]">Book</span>
      </nav>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--kora-text)]">
            Complete your booking
          </h1>
          <p className="mt-1 text-sm text-[var(--kora-text-secondary)]">
            Step {step} of 3 · {L.name}
          </p>
        </div>
        <div className="hidden h-10 w-32 rounded-full bg-[var(--kora-elevated-muted)] sm:block">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="kora-card overflow-hidden rounded-2xl p-0">
        <div className="flex border-b border-[var(--kora-line)] text-center text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
          <div
            className={`flex-1 py-3 ${step === 1 ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-200' : ''}`}
          >
            1 · Service
          </div>
          <div
            className={`flex-1 py-3 ${step === 2 ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-200' : ''}`}
          >
            2 · Time
          </div>
          <div
            className={`flex-1 py-3 ${step === 3 ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-200' : ''}`}
          >
            3 · Details
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--kora-text-secondary)]">
                Choose one service — you can fine-tune on WhatsApp with the business.
              </p>
              <div className="space-y-2">
                {L.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPickedService(s)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-4 text-left transition ${
                      service?.id === s.id
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40'
                        : 'border-[var(--kora-line)] hover:border-[var(--kora-line-strong)]'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-[var(--kora-text)]">{s.name}</p>
                      <p className="text-xs text-[var(--kora-muted)]">
                        {formatDuration(s.durationMin)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[var(--kora-text)]">
                      {formatRwf(s.priceRwf)}
                    </p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!can1}
                onClick={() => setStep(2)}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white disabled:opacity-40"
              >
                Continue to time
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
                <span className="font-bold">Heads up:</span> walk-in customers can
                shift times slightly. Your WhatsApp message locks intent with the
                shop.
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kora-muted)]">
                Live grid (demo) · Updated just now
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {SLOTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={s.disabled}
                    onClick={() => setSlotId(s.id)}
                    className={`rounded-xl border-2 py-3 text-sm font-bold ${
                      slotId === s.id
                        ? 'border-brand-600 bg-brand-50 text-brand-900 dark:bg-brand-950/50 dark:text-brand-100'
                        : 'border-[var(--kora-line)] text-[var(--kora-text)] hover:border-[var(--kora-line-strong)]'
                    } ${s.disabled ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-12 flex-1 rounded-xl border border-[var(--kora-line)] text-sm font-bold text-[var(--kora-text)] hover:bg-[var(--kora-elevated-muted)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!can2}
                  onClick={() => setStep(3)}
                  className="h-12 flex-[2] rounded-xl bg-brand-600 text-sm font-bold text-white disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="kora-card-muted rounded-xl p-4 text-sm">
                <p className="font-bold text-[var(--kora-text)]">{service?.name}</p>
                <p className="text-[var(--kora-text-secondary)]">
                  {service ? formatRwf(service.priceRwf) : ''} · {slotLabel}
                </p>
              </div>
              <label className="block">
                <span className="text-xs font-bold uppercase text-[var(--kora-muted)]">
                  Full name
                </span>
                <input
                  className="kora-input mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase text-[var(--kora-muted)]">
                  Mobile number
                </span>
                <input
                  className="kora-input mt-1"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-12 flex-1 rounded-xl border border-[var(--kora-line)] text-sm font-bold text-[var(--kora-text)] hover:bg-[var(--kora-elevated-muted)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!can3}
                  onClick={submit}
                  className="h-12 flex-[2] rounded-xl bg-brand-600 text-sm font-bold text-white disabled:opacity-40"
                >
                  Confirm &amp; open WhatsApp
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
