"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const AdminGuard = ({ children, fallback }: AdminGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth to finish loading
      if (isLoading) return

      // Check if user is authenticated and has admin role
      const hasAdminAccess = isAuthenticated && 
                            user && 
                            (user.role === 'admin' || user.role === 'superadmin')

      if (!hasAdminAccess) {
        // Clear any potentially invalid tokens
        localStorage.removeItem('admin_user_access_token')
        localStorage.removeItem('user')
        document.cookie = 'admin_user_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        
        // Redirect to login
        router.replace('/auth/admin/login')
        return
      }

      setIsChecking(false)
    }

    checkAdminAccess()
  }, [isAuthenticated, user, isLoading, router])

  // Show loading while checking
  if (isLoading || isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we authenticate your session</p>
        </div>
      </div>
    )
  }

  // Only render children if all checks pass
  const hasAdminAccess = isAuthenticated && 
                        user && 
                        (user.role === 'admin' || user.role === 'superadmin')

  if (!hasAdminAccess) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}