import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const threads = [
  { id: '1', biz: 'Amahoro Glow Salon', last: 'We moved you to 11:15 ✓', time: '10:12', unread: 1 },
  { id: '2', biz: 'Kigali Cuts', last: 'See you Friday!', time: 'Yesterday', unread: 0 },
]

export function AccountMessagesPage() {
  const { t } = useTranslation()
  const [active, setActive] = useState(threads[0].id)
  const th = threads.find((x) => x.id === active) ?? threads[0]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <Link to="/account" className="hover:text-brand-600 dark:hover:text-brand-400">
          {t('header.account')}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-zinc-900 dark:text-white">{t('messages.userTitle')}</span>
      </nav>

      <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{t('messages.userTitle')}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('messages.userSub')}</p>

      <div className="mt-6 grid min-h-[400px] gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[260px_1fr]">
        <ul className="divide-y divide-zinc-100 border-b border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800 lg:border-b-0 lg:border-r">
          {threads.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActive(c.id)}
                className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left ${
                  active === c.id
                    ? 'bg-brand-50 dark:bg-brand-950/30'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span className="font-bold text-zinc-900 dark:text-white">{c.biz}</span>
                <span className="line-clamp-1 text-xs text-zinc-500">{c.last}</span>
                <span className="text-[10px] text-zinc-400">{c.time}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col">
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="font-bold text-zinc-900 dark:text-white">{th.biz}</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 bg-zinc-50 p-4 dark:bg-zinc-950/40">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              {t('messages.demoBiz')}
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2 text-sm text-white">
              {t('messages.demoYou')}
            </div>
          </div>
          <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
            <input
              type="text"
              placeholder={t('messages.placeholder')}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">{t('messages.footer')}</p>
    </div>
  )
}
