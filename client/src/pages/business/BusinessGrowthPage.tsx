import { useTranslation } from 'react-i18next'

export function BusinessGrowthPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{t('business.growthTitle')}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('business.growthSubtitle')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          t('business.growthCard1'),
          t('business.growthCard2'),
          t('business.growthCard3'),
          t('business.growthCard4'),
        ].map((text) => (
          <div
            key={text}
            className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
