import { useTranslation } from 'react-i18next'

const rows = [
  { name: 'Amahoro Glow Salon', city: 'Kigali', status: 'Verified', rev: '4.9' },
  { name: 'Kigali Cuts', city: 'Kigali', status: 'Verified', rev: '4.85' },
  { name: 'Ikirezi Spa', city: 'Kigali', status: 'Pending', rev: '4.95' },
]

export function AdminBusinessesPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{t('admin.bizPageTitle')}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('admin.bizPageSub')}</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">{t('admin.tName')}</th>
              <th className="px-4 py-3">{t('admin.tCity')}</th>
              <th className="px-4 py-3">{t('admin.tStatus')}</th>
              <th className="px-4 py-3">{t('admin.tRating')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{r.name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{r.city}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800 dark:bg-violet-950/50 dark:text-violet-200">
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">{r.rev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
