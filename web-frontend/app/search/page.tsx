'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { MagnifyingGlassIcon, StarIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
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

export default function SearchPage() {
  const { user, isGuest } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')

  const genres = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller']

  useEffect(() => {
    fetchMovies()
    if (!isGuest) {
      fetchFavorites()
    }
  }, [isGuest])

  useEffect(() => {
    filterAndSortMovies()
  }, [searchQuery, selectedGenre, sortBy, movies])

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?limit=100`)
      if (response.ok) {
        const data = await response.json()
        setMovies(data.movies || [])
        setFilteredMovies(data.movies || [])
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

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
        const favoriteIds = new Set(data.map((fav: any) => fav.movie_id))
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const filterAndSortMovies = () => {
    let filtered = movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           movie.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === 'all' || movie.genres?.includes(selectedGenre)
      return matchesSearch && matchesGenre
    })

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'rating':
          return Number(b.vote_average) - Number(a.vote_average)
        case 'year':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        default:
          return 0
      }
    })

    setFilteredMovies(filtered)
  }

  const toggleFavorite = async (movieId: string) => {
    if (isGuest) {
      toast.error('Please sign in to add favorites')
      return
    }

    const isFavorite = favorites.has(movieId)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites/${movieId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const newFavorites = new Set(favorites)
        if (isFavorite) {
          newFavorites.delete(movieId)
          toast.success('Removed from favorites')
        } else {
          newFavorites.add(movieId)
          toast.success('Added to favorites!')
        }
        setFavorites(newFavorites)
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast.error('Failed to update favorites')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">Search Movies</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <FunnelIcon className="inline h-4 w-4 mr-1" />
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="title">Title (A-Z)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="year">Release Year (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Searching movies...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400 text-lg">
                Found <span className="text-white font-bold">{filteredMovies.length}</span> movies
                {searchQuery && <span> for "<span className="text-red-500">{searchQuery}</span>"</span>}
              </p>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="text-center py-20">
                <MagnifyingGlassIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredMovies.map((movie) => {
                  const isFavorite = favorites.has(movie.id)
                  
                  return (
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
                          toggleFavorite(movie.id)
                        }}
                        className="absolute top-2 right-2 p-2 bg-black/70 rounded-full hover:bg-black transition-colors z-10"
                      >
                        {isFavorite ? (
                          <HeartSolid className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartOutline className="h-5 w-5 text-white" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
