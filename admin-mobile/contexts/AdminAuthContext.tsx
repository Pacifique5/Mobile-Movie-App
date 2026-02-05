import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

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
  logout: () => Promise<void>
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

const API_BASE_URL = 'http://localhost:3000' // Update this for production

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

  useEffect(() => {
    loadStoredUser()
  }, [])

  const loadStoredUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('adminToken')
      if (token) {
        await verifyToken(token)
      }
    } catch (error) {
      console.error('Error loading stored admin user:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
        await AsyncStorage.setItem('adminUser', JSON.stringify(userSession))
      } else {
        // Token is invalid, remove it
        await SecureStore.deleteItemAsync('adminToken')
        await AsyncStorage.removeItem('adminUser')
      }
    } catch (error) {
      console.error('Token verification error:', error)
      await SecureStore.deleteItemAsync('adminToken')
      await AsyncStorage.removeItem('adminUser')
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
        await AsyncStorage.setItem('adminUser', JSON.stringify(userSession))
        await SecureStore.setItemAsync('adminToken', data.token)
        
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
      const token = await SecureStore.getItemAsync('adminToken')
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
      await AsyncStorage.removeItem('adminUser')
      await SecureStore.deleteItemAsync('adminToken')
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