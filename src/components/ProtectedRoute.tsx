"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, requiredRole = 'superadmin' }: { 
  children: React.ReactNode
  requiredRole?: string
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== requiredRole)) {
      router.push('/auth/admin/login')
    }
  }, [isAuthenticated, isLoading, user, router, requiredRole])

  if (isLoading || !isAuthenticated || user?.role !== requiredRole) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}