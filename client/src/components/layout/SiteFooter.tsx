import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Col = {
  titleKey: string
  links: { labelKey: string; to: string }[]
}

export function SiteFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const cols: Col[] = [
    {
      titleKey: 'footer.discover',
      links: [
        { labelKey: 'footer.l_exploreKg', to: '/search?city=Kigali' },
        { labelKey: 'footer.l_topRated', to: '/search' },
        { labelKey: 'footer.l_newPartners', to: '/search' },
        { labelKey: 'footer.l_deals', to: '/search' },
      ],
    },
    {
      titleKey: 'footer.business',
      links: [
        { labelKey: 'footer.l_owner', to: '/auth/signup?role=business' },
        { labelKey: 'footer.l_pricing', to: '/auth/signup?role=business' },
        { labelKey: 'footer.l_stories', to: '/auth/signup?role=business' },
        { labelKey: 'footer.l_partnerHelp', to: '/auth/signup?role=business' },
      ],
    },
    {
      titleKey: 'footer.support',
      links: [
        { labelKey: 'footer.l_help', to: '/account' },
        { labelKey: 'footer.l_safety', to: '/account' },
        { labelKey: 'footer.l_terms', to: '/account' },
        { labelKey: 'footer.l_privacy', to: '/account' },
      ],
    },
    {
      titleKey: 'footer.connect',
      links: [
        { labelKey: 'footer.l_careers', to: '/account' },
        { labelKey: 'footer.l_press', to: '/account' },
        { labelKey: 'footer.l_investors', to: '/account' },
        { labelKey: 'footer.l_contact', to: '/account' },
      ],
    },
  ]

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white via-fuchsia-50/30 to-white dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-lg font-black text-white">
                K
              </span>
              <span className="text-lg font-bold text-ink-900 dark:text-white">Kora</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500 dark:text-slate-400">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-700 dark:bg-slate-800 dark:text-slate-200">
                {t('footer.payMoMo')}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-700 dark:bg-slate-800 dark:text-slate-200">
                {t('footer.payCard')}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-700 dark:bg-slate-800 dark:text-slate-200">
                {t('footer.payWa')}
              </span>
            </div>
            <a
              href="application-22fa0176-41e6-4353-91e8-112e185f942a.apk"
              className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-4 py-2.5 text-sm font-black text-white shadow-lg hover:brightness-105"
            >
              Download App
            </a>
          </div>
          {cols.map((c) => (
            <div key={c.titleKey}>
              <p className="text-sm font-bold text-ink-900 dark:text-white">
                {t(c.titleKey)}
              </p>
              <ul className="mt-4 space-y-2">
                {c.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-500 hover:text-brand-600 hover:underline dark:text-slate-400 dark:hover:text-brand-400"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-8 text-sm text-ink-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center">
          <p>
            {t('footer.copyright', { year })}{' '}
            {t('footer.rights')}
          </p>
          <div className="flex flex-wrap gap-4">
            <span>{t('footer.regions')}</span>
            <span className="hidden sm:inline">·</span>
            <Link
              to="/"
              className="font-semibold text-brand-700 hover:underline dark:text-brand-400"
            >
              {t('footer.sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
