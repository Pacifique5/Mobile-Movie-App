'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  FilmIcon, 
  PlayIcon, 
  StarIcon, 
  UserGroupIcon,
  SparklesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const { user, isGuest } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isGuest) {
      router.push('/home')
    }
  }, [user, isGuest, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FilmIcon className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-white">CinemaMax</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-white hover:text-red-400 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Unlimited Movies, TV Shows & More
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Watch anywhere. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
              Start Free Trial
            </Link>
            <button 
              onClick={() => router.push('/home')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose CinemaMax?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-900 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <PlayIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlimited Streaming</h3>
              <p className="text-gray-400">
                Watch as much as you want, whenever you want
              </p>
            </div>

            <div className="text-center p-8 bg-gray-900 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Content</h3>
              <p className="text-gray-400">
                Access to thousands of movies and TV shows
              </p>
            </div>

            <div className="text-center p-8 bg-gray-900 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <DevicePhoneMobileIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Watch Anywhere</h3>
              <p className="text-gray-400">
                Stream on your phone, tablet, laptop, and TV
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-red-100">Movies & Shows</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">1M+</div>
              <div className="text-red-100">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">4.8★</div>
              <div className="text-red-100">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to watch? Create your account now.
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join millions of users enjoying unlimited entertainment
          </p>
          <Link href="/auth/signup" className="btn-primary text-lg px-12 py-4 inline-block">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FilmIcon className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold text-white">CinemaMax</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 CinemaMax. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
