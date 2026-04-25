import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getBusinessBookings, updateBusinessBookingStatus, type BusinessBookingRow } from '../../lib/api'

const badge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  requested: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  confirmed: 'bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200',
  'in-salon': 'bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200',
  done: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  'no-show': 'bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200',
  cancelled: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

function rowKey(r: BusinessBookingRow, idx: number) {
  return String(r.bookingId ?? r._id ?? `${r.guestName}-${r.slotLabel}-${idx}`)
}

export function BusinessBookingsPage() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<BusinessBookingRow[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    getBusinessBookings()
      .then(setRows)
      .catch(() => setRows([]))
  }, [])

  const counts = rows.reduce(
    (acc, row) => {
      const status = row.status.toLowerCase()
      if (status in acc) acc[status as keyof typeof acc] += 1
      return acc
    },
    { pending: 0, confirmed: 0, 'in-salon': 0, done: 0, 'no-show': 0 },
  )

  async function applyStatus(row: BusinessBookingRow, idx: number, nextStatus: BusinessBookingRow['status']) {
    const id = rowKey(row, idx)
    setUpdatingId(id)
    try {
      await updateBusinessBookingStatus(id, nextStatus as 'confirmed' | 'in-salon' | 'done' | 'no-show')
      setRows((xs) => xs.map((x, i) => (rowKey(x, i) === id ? { ...x, status: nextStatus } : x)))
    } catch {
      // Keep local state unchanged when server update fails.
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--kora-line)] bg-gradient-to-br from-[var(--kora-elevated)] via-[var(--kora-elevated-muted)]/60 to-[var(--kora-elevated)] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[var(--kora-muted)]">Ops header</p>
            <h2 className="mt-1 text-xl font-black text-[var(--kora-text)]">Live schedule control</h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--kora-text-secondary)]">
              Manage booked, in-service, done, and no-show states in real time to protect buffers and keep staff load balanced.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">Pending</p>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{counts.pending}</p>
            </div>
            <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">Confirmed</p>
              <p className="text-lg font-black text-sky-600 dark:text-sky-400">{counts.confirmed}</p>
            </div>
            <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">In service</p>
              <p className="text-lg font-black text-orange-600 dark:text-orange-400">{counts['in-salon']}</p>
            </div>
            <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">No-show</p>
              <p className="text-lg font-black text-rose-600 dark:text-rose-400">{counts['no-show']}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--kora-text)]">{t('business.bookingsTitle')}</h1>
          <p className="mt-2 text-sm text-[var(--kora-text-secondary)]">{t('business.bookingsHint')}</p>
        </div>
        <Link
          to="/business/messages"
          className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/70 bg-emerald-500/10 px-4 py-2 text-sm font-black text-emerald-800 hover:bg-emerald-500/15 dark:border-emerald-700 dark:text-emerald-200"
        >
          {t('business.chatFromRow')}
        </Link>
      </div>

      {/* Mobile-first card list */}
      <div className="grid gap-3 md:hidden">
        {rows.map((r, idx) => {
          const id = rowKey(r, idx)
          const disabled = updatingId === id
          return (
            <div
              key={id}
              className="overflow-hidden rounded-3xl border border-[var(--kora-line)] bg-[var(--kora-elevated)]/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-[var(--kora-text)]">{r.guestName}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--kora-text-secondary)]">{r.serviceName}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--kora-muted)]">
                      {t('business.colTime')}
                    </p>
                    <p className="text-sm font-bold text-[var(--kora-text)]">{r.slotLabel}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${badge[r.status] ?? 'bg-zinc-100 text-zinc-800'}`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.status === 'pending' || r.status === 'requested' ? (
                    <button
                      type="button"
                      className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2.5 text-xs font-black text-white shadow-sm"
                      onClick={() => applyStatus(r, idx, 'confirmed')}
                      disabled={disabled}
                    >
                      {t('business.confirm')}
                    </button>
                  ) : null}
                  {r.status === 'confirmed' ? (
                    <button
                      type="button"
                      className="flex-1 rounded-2xl bg-orange-500 px-3 py-2.5 text-xs font-black text-white"
                      onClick={() => applyStatus(r, idx, 'in-salon')}
                      disabled={disabled}
                    >
                      Start
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="flex-1 rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] px-3 py-2.5 text-xs font-black text-[var(--kora-text)]"
                    onClick={() => applyStatus(r, idx, 'done')}
                    disabled={disabled}
                  >
                    {t('business.complete')}
                  </button>
                  {r.status !== 'done' && r.status !== 'no-show' ? (
                    <button
                      type="button"
                      className="flex-1 rounded-2xl border border-rose-300 bg-rose-50 px-3 py-2.5 text-xs font-black text-rose-700 dark:border-rose-800 dark:bg-rose-950/35 dark:text-rose-200"
                      onClick={() => applyStatus(r, idx, 'no-show')}
                      disabled={disabled}
                    >
                      No-show
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-[2rem] border border-[var(--kora-line)] bg-[var(--kora-elevated)]/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_18px_50px_rgba(0,0,0,0.55)] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--kora-elevated-muted)]/90 text-xs font-black uppercase tracking-wide text-[var(--kora-muted)]">
              <tr>
                <th className="px-4 py-3">{t('business.colGuest')}</th>
                <th className="px-4 py-3">{t('business.colService')}</th>
                <th className="px-4 py-3">{t('business.colTime')}</th>
                <th className="px-4 py-3">{t('business.colStatus')}</th>
                <th className="px-4 py-3 text-right">{t('business.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--kora-line)]">
              {rows.map((r, idx) => (
                <tr key={rowKey(r, idx)} className="bg-[var(--kora-elevated)]/80 hover:bg-[var(--kora-elevated-muted)]/60">
                  <td className="px-4 py-3 font-semibold text-[var(--kora-text)]">{r.guestName}</td>
                  <td className="px-4 py-3 text-[var(--kora-text-secondary)]">{r.serviceName}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--kora-text)]">{r.slotLabel}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase ${badge[r.status] ?? 'bg-zinc-100 text-zinc-800'}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {r.status === 'pending' || r.status === 'requested' ? (
                        <button
                          type="button"
                          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-black text-white shadow-sm"
                          onClick={() => applyStatus(r, idx, 'confirmed')}
                          disabled={updatingId === rowKey(r, idx)}
                        >
                          {t('business.confirm')}
                        </button>
                      ) : null}
                      {r.status === 'confirmed' ? (
                        <button
                          type="button"
                          className="rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-black text-white"
                          onClick={() => applyStatus(r, idx, 'in-salon')}
                          disabled={updatingId === rowKey(r, idx)}
                        >
                          Start
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] px-3 py-1.5 text-xs font-black text-[var(--kora-text)]"
                        onClick={() => applyStatus(r, idx, 'done')}
                        disabled={updatingId === rowKey(r, idx)}
                      >
                        {t('business.complete')}
                      </button>
                      {r.status !== 'done' && r.status !== 'no-show' ? (
                        <button
                          type="button"
                          className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 dark:border-rose-800 dark:bg-rose-950/35 dark:text-rose-200"
                          onClick={() => applyStatus(r, idx, 'no-show')}
                          disabled={updatingId === rowKey(r, idx)}
                        >
                          No-show
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
