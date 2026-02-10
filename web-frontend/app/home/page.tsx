'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { StarIcon, PlayIcon } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genres: string
}

export default function HomePage() {
  const { user, isGuest } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`)
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
        if (data.length > 0) {
          setFeaturedMovie(data[Math.floor(Math.random() * Math.min(5, data.length))])
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Failed to load movies')
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

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/original${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {featuredMovie.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">{featuredMovie.vote_average.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">{new Date(featuredMovie.release_date).getFullYear()}</span>
                <span className="text-gray-300">{featuredMovie.genres}</span>
              </div>
              <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                {featuredMovie.overview}
              </p>
              <div className="flex space-x-4">
                <Link 
                  href={`/movie/${featuredMovie.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Watch Now</span>
                </Link>
                <button
                  onClick={() => addToFavorites(featuredMovie.id)}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <HeartIcon className="h-5 w-5" />
                  <span>Add to List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Movies</h2>
        
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
    </div>
  )
}
