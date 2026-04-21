import { useTranslation } from 'react-i18next'

const rows = [
  { name: 'Aline M.', email: 'aline@demo.kora', role: 'Customer' },
  { name: 'Ops Admin', email: 'admin@kora.app', role: 'Admin' },
  { name: 'Salon Owner', email: 'owner@amahoro.demo', role: 'Business' },
]

export function AdminUsersPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{t('admin.usersTitle')}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('admin.usersSub')}</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">{t('admin.tName')}</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">{t('admin.tRole')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((r) => (
              <tr key={r.email} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{r.name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{r.email}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
