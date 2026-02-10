'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { UserCircleIcon, EnvelopeIcon, CalendarIcon, HeartIcon, FilmIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, isGuest, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    favorites: 0,
    reviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isGuest) {
      router.push('/auth/login')
      return
    }
    if (user) {
      fetchUserStats()
    }
  }, [user, isGuest, router])

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch favorites count
      const favResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (favResponse.ok) {
        const favorites = await favResponse.json()
        setStats(prev => ({ ...prev, favorites: favorites.length }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}&background=ef4444&color=fff&size=128`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-red-500"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-400 mb-4">@{user.username}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center text-gray-300">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1">Favorite Movies</p>
                <p className="text-3xl font-bold text-white">{stats.favorites}</p>
              </div>
              <div className="bg-red-600 p-4 rounded-full">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1">Movies Watched</p>
                <p className="text-3xl font-bold text-white">{stats.reviews}</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-full">
                <FilmIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-semibold mb-1">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive updates about new movies</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-semibold mb-1">Auto-play Trailers</h3>
                <p className="text-gray-400 text-sm">Automatically play movie trailers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="pt-6">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
