'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import {
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, isGuest, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })

  useEffect(() => {
    if (!loading && (isGuest || !user)) {
      router.push('/auth/login')
    }
  }, [loading, isGuest, user, router])

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or GIF image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsUploadingImage(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string

        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ profile_image: base64String })
        })

        if (response.ok) {
          await refreshUser()
          toast.success('Profile picture updated!')
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to update profile picture')
        }
        setIsUploadingImage(false)
      }
      reader.onerror = () => {
        toast.error('Failed to read image file')
        setIsUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image')
      setIsUploadingImage(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await refreshUser()
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-t-2xl p-8 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-red-100 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="bg-gray-900 rounded-b-2xl shadow-2xl p-8">
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-800">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 shadow-xl">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircleIcon className="w-20 h-20 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <label
                  htmlFor="profile-image-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploadingImage ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <CameraIcon className="w-10 h-10 text-white" />
                  )}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </div>
              <p className="text-gray-400 text-sm mt-4">Click on the image to upload a new profile picture</p>
              <p className="text-gray-500 text-xs mt-1">JPG, PNG or GIF • Max 5MB</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Account Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          first_name: user.first_name || '',
                          last_name: user.last_name || '',
                          email: user.email || ''
                        })
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-white">{user.first_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-white">{user.last_name}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
                      <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-white">{user.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Username
                  </label>
                  <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 opacity-60">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-white">@{user.username}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 opacity-60">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-white">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
