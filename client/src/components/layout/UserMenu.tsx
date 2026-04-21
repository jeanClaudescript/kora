import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IconChevronDown } from '../icons'
import { useAuth } from '../../auth/AuthContext'

export function UserMenu() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-[10rem] items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 text-left shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 sm:pr-3"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-black text-white">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden min-w-0 flex-1 truncate text-sm font-bold text-ink-900 dark:text-white sm:block">
          {user.name}
        </span>
        <IconChevronDown className="hidden h-4 w-4 shrink-0 text-ink-500 sm:block" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-lift dark:border-slate-600 dark:bg-slate-900">
          <p className="truncate px-4 pb-2 text-xs text-ink-500 dark:text-slate-400">{user.email}</p>
          <Link
            to="/account/messages"
            className="block px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            {t('userMenu.messages')}
          </Link>
          <Link
            to="/account/trips"
            className="block px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            {t('userMenu.bookings')}
          </Link>
          {user.role === 'business' ? (
            <Link
              to="/business"
              className="block px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              onClick={() => setOpen(false)}
            >
              {t('userMenu.businessPortal')}
            </Link>
          ) : null}
          {user.role === 'admin' ? (
            <Link
              to="/admin"
              className="block px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/30"
              onClick={() => setOpen(false)}
            >
              {t('userMenu.admin')}
            </Link>
          ) : null}
          <Link
            to="/account"
            className="block px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            {t('userMenu.account')}
          </Link>
          <button
            type="button"
            className="mt-1 w-full border-t border-slate-100 px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/20"
            onClick={() => {
              setOpen(false)
              logout()
            }}
          >
            {t('auth.signOut')}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function GuestAuthLinks() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/auth/login"
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:px-4 sm:text-sm"
      >
        {t('auth.signIn')}
      </Link>
      <Link
        to="/auth/signup"
        className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:brightness-105 sm:px-4 sm:text-sm"
      >
        {t('auth.signUp')}
      </Link>
    </div>
  )
}
