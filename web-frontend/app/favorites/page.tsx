'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { StarIcon, TrashIcon } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Favorite {
  id: string
  movie_id: string
  title: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: number
  genres: string
}

export default function FavoritesPage() {
  const { user, isGuest } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isGuest) {
      router.push('/auth/login')
      return
    }
    if (user) {
      fetchFavorites()
    }
  }, [user, isGuest, router])

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      } else {
        toast.error('Failed to load favorites')
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (movieId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.movie_id !== movieId))
        toast.success('Removed from favorites')
      } else {
        toast.error('Failed to remove from favorites')
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Failed to remove from favorites')
    }
  }

  if (loading) {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your collection
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="group relative">
                <Link href={`/movie/${favorite.movie_id}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${favorite.poster_path}`}
                      alt={favorite.title}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                          {favorite.title}
                        </h3>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-white text-sm">{favorite.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(favorite.movie_id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <HeartIcon className="h-24 w-24 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 mb-8">
              Start adding movies to your favorites list
            </p>
            <Link href="/home" className="btn-primary inline-block">
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
