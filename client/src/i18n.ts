import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'
import rw from './locales/rw.json'

const STORAGE_KEY = 'kora.lang'

function readSavedLang(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('i18nextLng')
    if (v === 'fr' || v === 'rw' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    rw: { translation: rw },
  },
  lng: readSavedLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

function applyDomLang(lng: string) {
  document.documentElement.lang = lng === 'rw' ? 'rw' : lng === 'fr' ? 'fr' : 'en'
}

applyDomLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  applyDomLang(lng)
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore */
  }
})

export default i18n
