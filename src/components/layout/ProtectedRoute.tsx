import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/auth.store'
import type { Role } from '@/types'

interface Props {
  children: ReactNode
  role?: Role
}

export function ProtectedRoute({ children, role }: Props) {
  const { user, token } = useAuthStore()
  const location = useLocation()

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (role && user.role !== role) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
