import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IconBell } from '../icons'

export function NotificationDropdown() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () => [
      {
        id: '1',
        title: t('notifications.n1Title'),
        body: t('notifications.n1Body'),
        time: t('notifications.n1Time'),
        unread: true,
      },
      {
        id: '2',
        title: t('notifications.n2Title'),
        body: t('notifications.n2Body'),
        time: t('notifications.n2Time'),
        unread: true,
      },
      {
        id: '3',
        title: t('notifications.n3Title'),
        body: t('notifications.n3Body'),
        time: t('notifications.n3Time'),
        unread: false,
      },
    ],
    [t],
  )

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const unread = items.filter((i) => i.unread).length

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t('notifications.aria')}
      >
        <IconBell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift dark:border-slate-600 dark:bg-slate-900"
          role="menu"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
            <p className="text-sm font-semibold text-ink-900 dark:text-white">
              {t('notifications.title')}
            </p>
            <Link
              to="/account"
              className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
              onClick={() => setOpen(false)}
            >
              {t('notifications.settings')}
            </Link>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.map((n) => (
              <li
                key={n.id}
                className={`border-b border-slate-50 last:border-0 dark:border-slate-800 ${
                  n.unread ? 'bg-brand-50/50 dark:bg-brand-950/25' : ''
                }`}
              >
                <button
                  type="button"
                  className="flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-sm font-semibold text-ink-900 dark:text-slate-100">
                    {n.title}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-slate-400">{n.body}</span>
                  <span className="text-[11px] text-ink-500 dark:text-slate-500">
                    {n.time}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/80">
            <Link
              to="/account/trips"
              className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-400"
              onClick={() => setOpen(false)}
            >
              {t('notifications.viewAll')}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
