import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getThreads } from '../../lib/api'

type ThreadRow = {
  id: string
  guestName?: string
  business?: string
  lastMessage: string
  time: string
  unread: number
  channel?: string
}

function channelBadge(channel?: string) {
  const c = (channel || 'in_app').toLowerCase()
  if (c.includes('whatsapp'))
    return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
  return 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
}

export function BusinessMessagesPage() {
  const { t } = useTranslation()
  const [threads, setThreads] = useState<ThreadRow[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    getThreads()
      .then((items: ThreadRow[]) => {
        setThreads(items)
        setActive(items[0]?.id ?? null)
      })
      .catch(() => {
        setThreads([])
        setActive(null)
      })
  }, [])

  const th = threads.find((x) => x.id === active) ?? threads[0]
  const title = th?.guestName ?? th?.business ?? 'Inbox'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[var(--kora-text)]">{t('business.inboxTitle')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--kora-text-secondary)]">{t('business.inboxSubtitle')}</p>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[var(--kora-line)] bg-[var(--kora-elevated)]/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.55)] lg:grid lg:min-h-[480px] lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="border-b border-[var(--kora-line)] lg:border-b-0 lg:border-r">
          <ul className="max-h-[50vh] divide-y divide-[var(--kora-line)] overflow-y-auto lg:max-h-[620px]">
            {threads.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`flex w-full flex-col gap-0.5 px-4 py-3.5 text-left transition ${
                    active === c.id
                      ? 'bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-transparent'
                      : 'hover:bg-[var(--kora-elevated-muted)]/80'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[var(--kora-text)]">{c.guestName ?? c.business}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${channelBadge(c.channel)}`}>
                      {(c.channel || 'app').replace('_', ' ')}
                    </span>
                  </span>
                  <span className="line-clamp-1 text-xs text-[var(--kora-text-secondary)]">{c.lastMessage}</span>
                  <span className="flex items-center justify-between text-[10px] text-[var(--kora-muted)]">
                    <span>{c.time}</span>
                    {c.unread > 0 ? (
                      <span className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
                        {c.unread}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <div className="border-b border-[var(--kora-line)] px-4 py-3">
            <p className="font-black text-[var(--kora-text)]">{title}</p>
            <p className="text-xs text-[var(--kora-text-secondary)]">{t('business.threadDemo')}</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-[var(--kora-elevated-muted)]/50 to-[var(--kora-elevated)]/40 p-4">
            <div className="ml-auto max-w-[85%] rounded-3xl rounded-tr-md bg-gradient-to-br from-fuchsia-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
              {t('business.msgYou1')}
            </div>
            <div className="max-w-[85%] rounded-3xl rounded-tl-md border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-4 py-2.5 text-sm text-[var(--kora-text)] shadow-sm">
              {th?.lastMessage || t('business.msgGuest1')}
            </div>
            <div className="ml-auto max-w-[85%] rounded-3xl rounded-tr-md bg-gradient-to-br from-fuchsia-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
              {t('business.msgYou2')}
            </div>
          </div>
          <div className="border-t border-[var(--kora-line)] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('business.typeMessage')}
                className="kora-input min-w-0 flex-1 py-2.5 text-sm"
              />
              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-sm font-black text-white shadow-md"
              >
                {t('business.send')}
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-[var(--kora-muted)]">{t('business.whatsappNote')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
