'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  FilmIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  HeartIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isGuest, logout, refreshUser } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

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
          const data = await response.json()
          console.log('Profile updated:', data)
          await refreshUser()
          toast.success('Profile picture updated!')
          setShowDropdown(false)
        } else {
          const data = await response.json()
          console.error('Upload failed:', data)
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

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <FilmIcon className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-white">CinemaMax</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/home" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </Link>
            {!isGuest && (
              <Link href="/favorites" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                <HeartIcon className="h-5 w-5" />
                <span>Favorites</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            {isGuest ? (
              <Link href="/auth/login" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Sign In
              </Link>
            ) : user ? (
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 overflow-hidden">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-7 w-7 text-gray-400" />
                    )}
                  </div>
                  <span className="hidden md:block font-semibold">{user.first_name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-2xl py-2 border border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-semibold">{user.first_name} {user.last_name}</p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                    <label
                      htmlFor="navbar-profile-upload"
                      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <CameraIcon className="h-5 w-5 mr-3" />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </label>
                    <input
                      id="navbar-profile-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <hr className="border-gray-700 my-2" />
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        logout()
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
