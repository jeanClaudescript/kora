import { useEffect, useState } from 'react'

import App from './App'
import { BrandLoader } from './components/ui/BrandLoader'

export function AppBoot() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ready) return <BrandLoader />
  return <App />
}
