'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { HeartIcon, StarIcon, TrashIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Movie {
  id: string
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  genres: string
  overview: string
}

export default function FavoritesPage() {
  const { user, isGuest } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isGuest) {
      toast.error('Please sign in to view favorites')
      router.push('/auth/login')
      return
    }
    fetchFavorites()
  }, [isGuest])

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Fetch full movie details for each favorite
        const moviePromises = data.map(async (fav: any) => {
          const movieResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${fav.movie_id}`)
          if (movieResponse.ok) {
            return await movieResponse.json()
          }
          return null
        })
        const movies = await Promise.all(moviePromises)
        setFavorites(movies.filter(m => m !== null))
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setFavorites(favorites.filter(movie => movie.id !== movieId))
        toast.success('Removed from favorites')
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Failed to remove favorite')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your favorites...</p>
          </div>
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
          <div className="flex items-center space-x-4 mb-4">
            <HeartIcon className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {favorites.length === 0 
              ? 'You haven\'t added any favorites yet' 
              : `${favorites.length} movie${favorites.length !== 1 ? 's' : ''} in your collection`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <HeartIcon className="h-32 w-32 text-gray-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No favorites yet</h3>
            <p className="text-gray-400 mb-8 text-lg">
              Start adding movies to your favorites to see them here
            </p>
            <Link
              href="/home"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <div key={movie.id} className="group relative">
                <Link href={`/movie/${movie.id}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                          {movie.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-white text-sm">
                              {movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          {movie.release_date && (
                            <span className="text-gray-300 text-xs">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    removeFavorite(movie.id)
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
                  title="Remove from favorites"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
