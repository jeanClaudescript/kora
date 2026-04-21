import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RequireRole } from './components/auth/RequireRole'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { BusinessPortalLayout } from './layouts/BusinessPortalLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { BookingPage } from './pages/BookingPage'
import { BookingSuccessPage } from './pages/BookingSuccessPage'
import { AccountPage } from './pages/AccountPage'
import { AccountTripsPage } from './pages/AccountTripsPage'
import { AccountMessagesPage } from './pages/account/AccountMessagesPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { BusinessHomePage } from './pages/business/BusinessHomePage'
import { BusinessBookingsPage } from './pages/business/BusinessBookingsPage'
import { BusinessMessagesPage } from './pages/business/BusinessMessagesPage'
import { BusinessGrowthPage } from './pages/business/BusinessGrowthPage'
import { BusinessInsightsPage } from './pages/business/BusinessInsightsPage'
import { AdminHomePage } from './pages/admin/AdminHomePage'
import { AdminBusinessesPage } from './pages/admin/AdminBusinessesPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'

function SignupWithQueryKey() {
  const { search } = useLocation()
  return <SignupPage key={search} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="listing/:slug" element={<ListingDetailPage />} />
        <Route path="listing/:slug/book" element={<BookingPage />} />
        <Route path="booking/success" element={<BookingSuccessPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="account/trips" element={<AccountTripsPage />} />
        <Route path="account/messages" element={<AccountMessagesPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupWithQueryKey />} />
      </Route>

      <Route
        path="/business"
        element={
          <RequireRole roles={['business']}>
            <BusinessPortalLayout />
          </RequireRole>
        }
      >
        <Route index element={<BusinessHomePage />} />
        <Route path="insights" element={<BusinessInsightsPage />} />
        <Route path="bookings" element={<BusinessBookingsPage />} />
        <Route path="messages" element={<BusinessMessagesPage />} />
        <Route path="growth" element={<BusinessGrowthPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole roles={['admin']}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="businesses" element={<AdminBusinessesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>

      <Route path="/owner" element={<Navigate to="/business" replace />} />
      <Route path="/owner/today" element={<Navigate to="/business/bookings" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
