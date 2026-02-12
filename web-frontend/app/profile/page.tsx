'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  HeartIcon,
  FilmIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, isGuest, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState({
    favorites: 0,
    watchlist: 0,
    reviews: 0
  })
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: ''
  })

  useEffect(() => {
    if (isGuest) {
      toast.error('Please sign in to view profile')
      router.push('/auth/login')
      return
    }
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || ''
      })
      fetchStats()
    }
  }, [user, isGuest])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(prev => ({ ...prev, favorites: data.length }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || ''
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <UserCircleIcon className="h-24 w-24 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-red-100 text-lg mb-4">@{user.username}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white font-bold text-2xl">{stats.favorites}</span>
                  <span className="text-red-100 ml-2">Favorites</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white font-bold text-2xl">{stats.watchlist}</span>
                  <span className="text-red-100 ml-2">Watchlist</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white font-bold text-2xl">{stats.reviews}</span>
                  <span className="text-red-100 ml-2">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      <CheckIcon className="h-5 w-5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Member Since
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/favorites')}
                  className="w-full flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <HeartIcon className="h-5 w-5 text-red-500" />
                  <span>My Favorites</span>
                </button>
                <button
                  onClick={() => router.push('/search')}
                  className="w-full flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <FilmIcon className="h-5 w-5 text-blue-500" />
                  <span>Browse Movies</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full text-left text-gray-300 hover:text-white py-2 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left text-gray-300 hover:text-white py-2 transition-colors">
                  Notification Settings
                </button>
                <button className="w-full text-left text-gray-300 hover:text-white py-2 transition-colors">
                  Privacy Settings
                </button>
                <hr className="border-gray-700" />
                <button
                  onClick={logout}
                  className="w-full text-left text-red-500 hover:text-red-400 py-2 font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-red-100 text-sm mb-4">
                Get unlimited downloads, 4K streaming, and more!
              </p>
              <button className="w-full bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-4 rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
