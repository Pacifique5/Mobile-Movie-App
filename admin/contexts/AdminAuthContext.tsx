import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'moderator'
  first_name: string
  last_name: string
  permissions: string[]
  avatar?: string
  lastLogin?: string
}

interface AdminAuthContextType {
  user: AdminUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Permission mapping based on role
const getPermissionsByRole = (role: string): string[] => {
  if (role === 'admin') {
    return [
      'users.read', 'users.write', 'users.delete', 
      'movies.read', 'movies.write', 'movies.delete', 
      'analytics.read', 'settings.write'
    ]
  } else if (role === 'moderator') {
    return [
      'users.read', 'users.write', 
      'movies.read', 'movies.write', 
      'analytics.read'
    ]
  }
  return []
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const userSession: AdminUser = {
          ...data.user,
          permissions: getPermissionsByRole(data.user.role),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.first_name + ' ' + data.user.last_name)}&background=FF6B6B&color=fff&size=150`,
          lastLogin: new Date().toISOString()
        }
        setUser(userSession)
        localStorage.setItem('adminUser', JSON.stringify(userSession))
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    } catch (error) {
      console.error('Token verification error:', error)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        const userSession: AdminUser = {
          ...data.user,
          permissions: getPermissionsByRole(data.user.role),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.first_name + ' ' + data.user.last_name)}&background=FF6B6B&color=fff&size=150`,
          lastLogin: new Date().toISOString()
        }

        setUser(userSession)
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(userSession))
        
        toast.success(`Welcome back, ${data.user.first_name}!`)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Invalid credentials' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please check your connection and try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) {
        // Call logout endpoint to invalidate session
        await fetch(`${API_BASE_URL}/api/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      toast.success('Logged out successfully')
      router.push('/login')
    }
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    return user.permissions.includes(permission) || user.role === 'admin'
  }

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}