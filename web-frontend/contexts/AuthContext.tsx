'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  isGuest: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  continueAsGuest: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      const guestMode = localStorage.getItem('guestMode')

      if (guestMode === 'true') {
        setIsGuest(true)
        setLoading(false)
        return
      }

      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.removeItem('guestMode')
        setUser(data.user)
        setIsGuest(false)
        toast.success('Welcome back!')
        router.push('/home')
      } else {
        toast.error(data.error || 'Login failed')
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const signup = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    try {
      const name = `${firstName} ${lastName}`.trim()
      
      console.log('Sending signup request:', {
        username,
        email,
        name,
        passwordLength: password.length
      })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name
        })
      })

      console.log('Signup response status:', response.status)
      const data = await response.json()
      console.log('Signup response data:', data)

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.removeItem('guestMode')
        setUser(data.user)
        setIsGuest(false)
        toast.success('Account created successfully!')
        router.push('/home')
      } else {
        toast.error(data.error || 'Signup failed')
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error('Signup error details:', error)
      toast.error(error.message || 'Signup failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('guestMode')
    setUser(null)
    setIsGuest(false)
    toast.success('Logged out successfully')
    router.push('/')
  }

  const continueAsGuest = () => {
    localStorage.setItem('guestMode', 'true')
    setIsGuest(true)
    toast.success('Browsing as guest')
    router.push('/home')
  }



  return (
    <AuthContext.Provider value={{ user, isGuest, loading, login, signup, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
