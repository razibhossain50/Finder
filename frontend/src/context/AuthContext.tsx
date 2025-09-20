"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/services/logger'
import { handleApiError } from '@/services/error-handler'
import { authService } from '@/services/api-services'
import { User, LoginResponse } from '@/types/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('admin_user_access_token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          
          // Validate that user has admin or superadmin role
          if (parsedUser.role === 'admin' || parsedUser.role === 'superadmin') {
            setUser(parsedUser)
            logger.debug('Admin user data loaded from localStorage', { 
              userId: parsedUser.id, 
              role: parsedUser.role 
            }, 'AuthContext')
          } else {
            // User doesn't have admin privileges, clear storage
            logger.warn('User without admin privileges attempted access', { 
              userId: parsedUser.id, 
              role: parsedUser.role 
            }, 'AuthContext')
            localStorage.removeItem('admin_user_access_token')
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        const appError = handleApiError(error, 'AuthContext')
        logger.error('Failed to parse user data', appError, 'AuthContext')
        // Clear potentially corrupted data
        localStorage.removeItem('admin_user_access_token')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim()
      
      logger.info('Admin login attempt', { email: normalizedEmail }, 'AuthContext')
      
      const data = await authService.adminLogin({ email: normalizedEmail, password })

      localStorage.setItem('admin_user_access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      
      logger.info('Admin login successful', { userId: data.user.id, role: data.user.role }, 'AuthContext')
    } catch (error) {
      const appError = handleApiError(error, 'AuthContext')
      logger.error('Admin login failed', appError, 'AuthContext')
      throw appError
    }
  }

  // const logout = () => {
  //   localStorage.removeItem('admin_user_access_token')
  //   localStorage.removeItem('user')
  //   setUser(null)
  //   router.push('/admin/login')
  // }
  const logout = async () => {
    try {
      logger.info('Admin logout initiated', { userId: user?.id }, 'AuthContext')
      await authService.logout()
      logger.info('Admin logout successful', undefined, 'AuthContext')
    } catch (error) {
      const appError = handleApiError(error, 'AuthContext')
      logger.error('Logout API call failed', appError, 'AuthContext')
    } finally {
      localStorage.removeItem('admin_user_access_token')
      localStorage.removeItem('user')
      // Clear cookie as well
      document.cookie = 'admin_user_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      setUser(null)
      router.push('/auth/admin/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}