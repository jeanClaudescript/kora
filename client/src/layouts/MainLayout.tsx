import { Outlet } from 'react-router-dom'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
