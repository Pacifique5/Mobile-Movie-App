'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { StarIcon, PlayIcon, FireIcon, TrophyIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutline, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
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
  favorite_count?: number
}

export default function HomePage() {
  const { user, isGuest } = useAuth()
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchMovies()
    if (!isGuest) {
      fetchFavorites()
    }
  }, [isGuest])

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?limit=50`)
      
      if (response.ok) {
        const data = await response.json()
        const moviesArray = data.movies || []
        setAllMovies(moviesArray)
        
        if (moviesArray.length > 0) {
          setFeaturedMovie(moviesArray[Math.floor(Math.random() * Math.min(5, moviesArray.length))])
        }
      } else {
        toast.error('Failed to load movies')
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
      } else {
        toast.error('Failed to update favorites')
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast.error('Failed to update favorites')
    }
  }

  // Categorize movies
  const trendingMovies = allMovies
    .sort((a, b) => (b.favorite_count || 0) - (a.favorite_count || 0))
    .slice(0, 10)

  const topRatedMovies = allMovies
    .filter(m => m.vote_average)
    .sort((a, b) => Number(b.vote_average) - Number(a.vote_average))
    .slice(0, 10)

  const newReleases = allMovies
    .filter(m => m.release_date)
    .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
    .slice(0, 10)

  const popularMovies = allMovies.slice(0, 10)

  const MovieCard = ({ movie }: { movie: Movie }) => {
    const isFavorite = favorites.has(movie.id)
    
    return (
      <div className="group relative flex-shrink-0 w-48">
        <Link href={`/movie/${movie.id}`}>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:z-10">
            <img
              src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between mb-2">
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
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      window.location.href = `/movie/${movie.id}`
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded transition-colors flex items-center justify-center space-x-1"
                  >
                    <PlayIcon className="h-3 w-3" />
                    <span>Play</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(movie.id)
                    }}
                    className={`p-2 rounded transition-colors ${
                      isFavorite 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isFavorite ? (
                      <HeartSolid className="h-4 w-4 text-white" />
                    ) : (
                      <HeartOutline className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  const MovieRow = ({ title, movies, icon }: { title: string; movies: Movie[]; icon: React.ReactNode }) => {
    const scrollRef = useState<HTMLDivElement | null>(null)

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef[0]) {
        const scrollAmount = direction === 'left' ? -800 : 800
        scrollRef[0].scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }

    return (
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          {icon}
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="relative group/row">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div
            ref={(el) => scrollRef[1](el)}
            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading amazing content...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <div className="relative h-[80vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/original${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl">
              <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-4">
                FEATURED
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                {featuredMovie.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                  <StarIcon className="h-5 w-5 mr-1" />
                  <span>{featuredMovie.vote_average ? Number(featuredMovie.vote_average).toFixed(1) : 'N/A'}</span>
                </div>
                {featuredMovie.release_date && (
                  <span className="text-white font-semibold">
                    {new Date(featuredMovie.release_date).getFullYear()}
                  </span>
                )}
                {featuredMovie.genres && (
                  <span className="text-gray-300 bg-gray-800/50 px-3 py-1 rounded">
                    {featuredMovie.genres}
                  </span>
                )}
              </div>
              <p className="text-gray-200 text-lg mb-8 line-clamp-3 drop-shadow-lg">
                {featuredMovie.overview}
              </p>
              <div className="flex space-x-4">
                <Link 
                  href={`/movie/${featuredMovie.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg flex items-center space-x-3 transition-all transform hover:scale-105 shadow-lg"
                >
                  <PlayIcon className="h-6 w-6" />
                  <span>Watch Now</span>
                </Link>
                <button
                  onClick={() => toggleFavorite(featuredMovie.id)}
                  className={`font-bold py-4 px-10 rounded-lg flex items-center space-x-3 transition-all transform hover:scale-105 shadow-lg ${
                    favorites.has(featuredMovie.id)
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800/80 hover:bg-gray-700 text-white'
                  }`}
                >
                  {favorites.has(featuredMovie.id) ? (
                    <HeartSolid className="h-6 w-6" />
                  ) : (
                    <HeartOutline className="h-6 w-6" />
                  )}
                  <span>{favorites.has(featuredMovie.id) ? 'In My List' : 'Add to List'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {trendingMovies.length > 0 && (
          <MovieRow 
            title="Trending Now" 
            movies={trendingMovies}
            icon={<FireIcon className="h-8 w-8 text-red-500" />}
          />
        )}

        {topRatedMovies.length > 0 && (
          <MovieRow 
            title="Top Rated" 
            movies={topRatedMovies}
            icon={<TrophyIcon className="h-8 w-8 text-yellow-500" />}
          />
        )}

        {newReleases.length > 0 && (
          <MovieRow 
            title="New Releases" 
            movies={newReleases}
            icon={<SparklesIcon className="h-8 w-8 text-blue-500" />}
          />
        )}

        {popularMovies.length > 0 && (
          <MovieRow 
            title="Popular on CinemaMax" 
            movies={popularMovies}
            icon={<ClockIcon className="h-8 w-8 text-green-500" />}
          />
        )}

        {allMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No movies available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
