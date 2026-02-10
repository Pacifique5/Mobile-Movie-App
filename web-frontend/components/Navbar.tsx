'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  FilmIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Navbar() {
  const { user, isGuest, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

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
              <Link href="/auth/login" className="btn-primary py-2 px-4 text-sm">
                Sign In
              </Link>
            ) : user ? (
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}&background=ef4444&color=fff&size=32`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block">{user.first_name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserCircleIcon className="h-4 w-4 inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        logout()
                      }}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                    >
                      <ArrowLeftOnRectangleIcon className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary py-2 px-4 text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
