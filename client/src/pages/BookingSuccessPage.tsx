import { Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { BookingSuccessState } from '../types/booking'

function buildWaLink(whatsapp: string, text: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
}

export function BookingSuccessPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const state = location.state as BookingSuccessState | undefined

  if (!state?.whatsapp) {
    return <Navigate to="/search" replace />
  }

  const msg = `Hello ${state.listingName}, I booked on Kora:\n• ${state.serviceName}\n• ${state.slotLabel}\n• Name: ${state.customerName}\n• Phone: ${state.phone}\nPlease confirm. Thank you!`
  const href = buildWaLink(state.whatsapp, msg)

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white shadow-lg dark:shadow-emerald-900/40">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-black tracking-tight text-ink-900 dark:text-white">
        {t('success.title')}
      </h1>
      <p className="mt-2 text-sm text-ink-600 dark:text-zinc-400">{t('success.sub')}</p>

      <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/90 p-4 text-left text-sm text-brand-950 dark:border-brand-800/60 dark:bg-brand-950/40 dark:text-brand-100">
        <p className="font-bold">{t('success.bridgeTitle')}</p>
        <p className="mt-1 text-brand-900/90 dark:text-brand-200/90">{t('success.bridgeBody')}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-card dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-xs font-bold uppercase text-ink-500 dark:text-zinc-400">
          {t('success.summary')}
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">{t('success.service')}</dt>
            <dd className="font-semibold text-ink-900 dark:text-white">{state.serviceName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">{t('success.time')}</dt>
            <dd className="font-semibold text-ink-900 dark:text-white">{state.slotLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">{t('success.name')}</dt>
            <dd className="font-semibold text-ink-900 dark:text-white">{state.customerName}</dd>
          </div>
        </dl>
      </div>

      <Link
        to="/account/messages"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-base font-bold text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-400/30 transition hover:brightness-105"
      >
        {t('success.openMessages')}
      </Link>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border-2 border-[#25D366]/50 bg-white text-sm font-bold text-[#128C7E] hover:bg-[#25D366]/5 dark:border-[#25D366]/40 dark:bg-zinc-900 dark:text-[#25D366]"
      >
        {t('success.openWa')}
      </a>

      <Link
        to="/account/trips"
        className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400"
      >
        {t('success.viewTrips')}
      </Link>
      <Link
        to="/"
        className="mt-4 block text-sm text-ink-500 hover:text-brand-600 dark:text-zinc-500 dark:hover:text-brand-400"
      >
        {t('success.home')}
      </Link>
    </div>
  )
}
