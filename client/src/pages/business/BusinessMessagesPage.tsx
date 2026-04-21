import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const threads = [
  { id: '1', name: 'Marie U.', last: 'Can we move to 11:15?', time: '10:02', unread: 2 },
  { id: '2', name: 'Jean P.', last: 'Thanks — see you Friday', time: 'Yesterday', unread: 0 },
  { id: '3', name: 'Claire N.', last: 'Do you take MoMo?', time: 'Mon', unread: 1 },
]

export function BusinessMessagesPage() {
  const { t } = useTranslation()
  const [active, setActive] = useState(threads[0].id)

  const th = threads.find((x) => x.id === active) ?? threads[0]

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{t('business.inboxTitle')}</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        {t('business.inboxSubtitle')}
      </p>

      <div className="mt-6 grid min-h-[420px] gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="border-b border-zinc-100 dark:border-zinc-800 lg:border-b-0 lg:border-r">
          <ul className="max-h-[50vh] divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800 lg:max-h-[520px]">
            {threads.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition ${
                    active === c.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">{c.name}</span>
                    {c.unread > 0 ? (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        {c.unread}
                      </span>
                    ) : null}
                  </span>
                  <span className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {c.last}
                  </span>
                  <span className="text-[10px] text-zinc-400">{c.time}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="font-bold text-zinc-900 dark:text-white">{th.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('business.threadDemo')}</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-zinc-50/80 p-4 dark:bg-zinc-950/50">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-600 px-4 py-2 text-sm text-white shadow">
              {t('business.msgYou1')}
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              {t('business.msgGuest1')}
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-600 px-4 py-2 text-sm text-white shadow">
              {t('business.msgYou2')}
            </div>
          </div>
          <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('business.typeMessage')}
                className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <button
                type="button"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
              >
                {t('business.send')}
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-500 dark:text-zinc-500">
              {t('business.whatsappNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
