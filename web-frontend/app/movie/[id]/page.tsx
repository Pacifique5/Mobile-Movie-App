'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import { StarIcon, PlayIcon, HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genres: string
  runtime?: number
  director?: string
  movie_cast?: string
}

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isGuest } = useAuth()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchMovieDetails()
      if (!isGuest) {
        checkFavoriteStatus()
      }
    }
  }, [params.id, isGuest])

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMovie(data)
      }
    } catch (error) {
      console.error('Error fetching movie:', error)
      toast.error('Failed to load movie details')
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const favorites = await response.json()
        setIsFavorite(favorites.some((fav: any) => fav.movie_id === params.id))
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (isGuest) {
      toast.error('Please sign in to add favorites')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (isFavorite) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${params.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          setIsFavorite(false)
          toast.success('Removed from favorites')
        }
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ movie_id: params.id })
        })
        if (response.ok) {
          setIsFavorite(true)
          toast.success('Added to favorites!')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
            <button onClick={() => router.push('/home')} className="btn-primary">
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Movie Hero */}
      <div className="relative h-[80vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-64 rounded-lg shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <button
                onClick={() => router.back()}
                className="text-gray-300 hover:text-white mb-4 flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back</span>
              </button>

              <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-500 px-3 py-1 rounded-full">
                  <StarIcon className="h-5 w-5 text-white mr-1" />
                  <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">{new Date(movie.release_date).getFullYear()}</span>
                {movie.runtime && <span className="text-gray-300">{movie.runtime} min</span>}
                <span className="text-gray-300">{movie.genres}</span>
              </div>

              <p className="text-gray-300 text-lg mb-8 max-w-3xl">
                {movie.overview}
              </p>

              {movie.director && (
                <div className="mb-4">
                  <span className="text-gray-400">Director: </span>
                  <span className="text-white font-semibold">{movie.director}</span>
                </div>
              )}

              {movie.movie_cast && (
                <div className="mb-8">
                  <span className="text-gray-400">Cast: </span>
                  <span className="text-white">{movie.movie_cast}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-colors">
                  <PlayIcon className="h-6 w-6" />
                  <span>Play</span>
                </button>
                
                <button
                  onClick={toggleFavorite}
                  className={`${
                    isFavorite 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  } text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-colors`}
                >
                  {isFavorite ? (
                    <HeartIcon className="h-6 w-6" />
                  ) : (
                    <HeartOutlineIcon className="h-6 w-6" />
                  )}
                  <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Movie Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-400 mb-2">Release Date</h3>
              <p className="text-white font-semibold">
                {new Date(movie.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h3 className="text-gray-400 mb-2">Rating</h3>
              <p className="text-white font-semibold">
                {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count.toLocaleString()} votes)
              </p>
            </div>
            <div>
              <h3 className="text-gray-400 mb-2">Genres</h3>
              <p className="text-white font-semibold">{movie.genres}</p>
            </div>
            {movie.runtime && (
              <div>
                <h3 className="text-gray-400 mb-2">Runtime</h3>
                <p className="text-white font-semibold">{movie.runtime} minutes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
