'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: number
  genres: string
}

export default function SearchPage() {
  const { isGuest } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/search?query=${encodeURIComponent(searchQuery)}`
      )
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
      } else {
        toast.error('Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (movieId: string) => {
    if (isGuest) {
      toast.error('Please sign in to add favorites')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movie_id: movieId })
      })

      if (response.ok) {
        toast.success('Added to favorites!')
      } else {
        toast.error('Failed to add to favorites')
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error('Failed to add to favorites')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Search Movies</h1>
          <p className="text-gray-400">Find your favorite movies and TV shows</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {movies.length > 0 ? `Found ${movies.length} results` : 'No results found'}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <Link 
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                          {movie.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-white text-sm">{movie.vote_average.toFixed(1)}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              addToFavorites(movie.id)
                            }}
                            className="text-white hover:text-red-500 transition-colors"
                          >
                            <HeartIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !searched && (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="h-24 w-24 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Start searching for movies
            </h3>
            <p className="text-gray-500">
              Enter a movie title in the search box above
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
