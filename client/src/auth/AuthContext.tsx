import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'customer' | 'business' | 'admin'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

const STORAGE_KEY = 'kora.user'

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const u = JSON.parse(raw) as AuthUser
    if (!u?.email || !u?.role) return null
    return u
  } catch {
    return null
  }
}

type AuthCtx = {
  user: AuthUser | null
  login: (u: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUser())

  const login = useCallback((u: AuthUser) => {
    setUser(u)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    } catch {
      /* ignore */
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Context hook co-located with provider (fast-refresh convention). */
// eslint-disable-next-line react-refresh/only-export-components -- useAuth + AuthProvider pair
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
