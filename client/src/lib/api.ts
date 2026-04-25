const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4001'

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const data = (await res.json()) as { error?: string }
    if (data?.error) return data.error
  } catch {
    // ignore
  }
  return fallback
}

export type AuthApiUser = {
  id: string
  name: string
  email: string
  role: 'customer' | 'business' | 'admin'
  businessCategory?: string
  businessWorkerCount?: number
  preferredCity?: string
  interestCategories?: string[]
}

export async function loginApi(payload: { email: string; password?: string; role?: string }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to login')
  return (await res.json()) as { user: AuthApiUser }
}

export async function signupApi(payload: {
  name: string
  email: string
  password?: string
  role: 'customer' | 'business'
  preferredCity?: string
  businessCategory?: string
  businessWorkerCount?: number
}) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to signup')
  return (await res.json()) as { user: AuthApiUser }
}

export async function demoAuthApi(role: 'customer' | 'business' | 'admin') {
  const res = await fetch(`${API_BASE}/api/auth/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  })
  if (!res.ok) throw new Error('Failed to load demo user')
  return (await res.json()) as { user: AuthApiUser }
}

export type CustomerDashboardOpts = {
  city?: string
  preferredCity?: string
  lat?: number
  lng?: number
  interests?: string[]
  visitStyle?: 'quick' | 'relax' | 'balanced'
}

export async function getCustomerDashboard(userId = 'guest', opts?: CustomerDashboardOpts) {
  const q = new URLSearchParams()
  q.set('userId', userId)
  if (opts?.city) q.set('city', opts.city)
  if (opts?.preferredCity) q.set('preferredCity', opts.preferredCity)
  if (opts?.lat != null) q.set('lat', String(opts.lat))
  if (opts?.lng != null) q.set('lng', String(opts.lng))
  if (opts?.interests?.length) q.set('interests', opts.interests.join(','))
  if (opts?.visitStyle) q.set('visitStyle', opts.visitStyle)
  const suffix = q.toString() ? `?${q.toString()}` : ''
  const res = await fetch(`${API_BASE}/api/dashboard/customer${suffix}`)
  if (!res.ok) throw new Error('Failed to load customer dashboard')
  return res.json()
}

export async function getBusinessDashboard() {
  const res = await fetch(`${API_BASE}/api/dashboard/business`)
  if (!res.ok) throw new Error('Failed to load business dashboard')
  return res.json()
}

export async function getBusinessDashboardWithContext(params?: {
  lat?: number
  lng?: number
  radiusKm?: number
  vertical?: string
  workerCount?: number
}) {
  const q = new URLSearchParams()
  if (params?.lat != null) q.set('lat', String(params.lat))
  if (params?.lng != null) q.set('lng', String(params.lng))
  if (params?.radiusKm != null) q.set('radiusKm', String(params.radiusKm))
  if (params?.vertical) q.set('vertical', params.vertical)
  if (params?.workerCount != null) q.set('workerCount', String(params.workerCount))
  const suffix = q.toString() ? `?${q.toString()}` : ''
  const res = await fetch(`${API_BASE}/api/dashboard/business${suffix}`)
  if (!res.ok) throw new Error('Failed to load business dashboard')
  return res.json()
}

export async function getThreads() {
  const res = await fetch(`${API_BASE}/api/threads`)
  if (!res.ok) throw new Error('Failed to load threads')
  const data = await res.json()
  return data.items ?? []
}

export type BusinessBookingRow = {
  bookingId?: string
  _id?: string
  guestName: string
  serviceName: string
  slotLabel: string
  status: string
  listingSlug?: string
  channel?: string
}

export async function getBusinessBookings(): Promise<BusinessBookingRow[]> {
  const res = await fetch(`${API_BASE}/api/bookings/business`)
  if (!res.ok) throw new Error('Failed to load business bookings')
  const data = await res.json()
  return data.items ?? []
}

export async function updateBusinessBookingStatus(
  bookingId: string,
  status: 'requested' | 'pending' | 'confirmed' | 'in-salon' | 'done' | 'no-show' | 'cancelled',
) {
  const res = await fetch(`${API_BASE}/api/bookings/business/${encodeURIComponent(bookingId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to update booking status'))
  return res.json()
}

export async function createBookingApi(payload: {
  listingSlug: string
  serviceName: string
  slotLabel: string
  guestName: string
  phone: string
  userId?: string
  channel?: string
  notes?: string
}) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to create booking'))
  return res.json() as Promise<{
    _id?: string
    listingSlug: string
    serviceName: string
    slotLabel: string
    guestName: string
    phone: string
    status: string
  }>
}

export async function getListings() {
  const res = await fetch(`${API_BASE}/api/listings`)
  if (!res.ok) throw new Error('Failed to load listings')
  const data = await res.json()
  return data.items ?? []
}

export async function searchListingsApi(params: { q?: string; category?: string; city?: string }) {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.category) query.set('category', params.category)
  if (params.city) query.set('city', params.city)
  const res = await fetch(`${API_BASE}/api/listings/search?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to search listings')
  const data = await res.json()
  return data.items ?? []
}
