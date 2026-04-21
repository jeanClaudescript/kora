import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Row = {
  id: string
  guest: string
  service: string
  time: string
  status: 'pending' | 'confirmed' | 'in-salon' | 'done'
}

const seed: Row[] = [
  { id: '1', guest: 'Marie U.', service: 'Wash & blow-dry', time: '09:30', status: 'confirmed' },
  { id: '2', guest: 'Walk-in', service: 'Fade + beard', time: '10:15', status: 'in-salon' },
  { id: '3', guest: 'Jean P.', service: 'Braids', time: '11:00', status: 'pending' },
  { id: '4', guest: 'Claire N.', service: 'Kids cut', time: '14:00', status: 'done' },
]

const badge: Record<Row['status'], string> = {
  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  confirmed: 'bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200',
  'in-salon': 'bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200',
  done: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

export function BusinessBookingsPage() {
  const { t } = useTranslation()
  const [rows, setRows] = useState(seed)

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
            {t('business.bookingsTitle')}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t('business.bookingsHint')}
          </p>
        </div>
        <Link
          to="/business/messages"
          className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900/50"
        >
          {t('business.chatFromRow')}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">{t('business.colGuest')}</th>
                <th className="px-4 py-3">{t('business.colService')}</th>
                <th className="px-4 py-3">{t('business.colTime')}</th>
                <th className="px-4 py-3">{t('business.colStatus')}</th>
                <th className="px-4 py-3 text-right">{t('business.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{r.guest}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{r.service}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{r.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {r.status === 'pending' ? (
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white"
                          onClick={() =>
                            setRows((xs) =>
                              xs.map((x) =>
                                x.id === r.id ? { ...x, status: 'confirmed' } : x,
                              ),
                            )
                          }
                        >
                          {t('business.confirm')}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-bold text-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
                        onClick={() =>
                          setRows((xs) =>
                            xs.map((x) => (x.id === r.id ? { ...x, status: 'done' } : x)),
                          )
                        }
                      >
                        {t('business.complete')}
                      </button>
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
