import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../../auth/AuthContext'
import { useAuth } from '../../auth/AuthContext'

type Props = {
  roles: UserRole[]
  children: ReactNode
}

export function RequireRole({ roles, children }: Props) {
  const { user } = useAuth()
  const loc = useLocation()

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: loc.pathname }} />
  }

  if (!roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'business') return <Navigate to="/business" replace />
    if (user.role === 'customer') return <Navigate to="/" replace />
    return <Navigate to="/" replace />
  }

  return children
}
