'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { 
  StarIcon, 
  PlayIcon, 
  HeartIcon, 
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FilmIcon
} from '@heroicons/react/24/solid'
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
  trailer_url?: string
}

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isGuest } = useAuth()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const [downloadQuality, setDownloadQuality] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchMovieDetails()
      fetchSimilarMovies()
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

  const fetchSimilarMovies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?limit=6`)
      if (response.ok) {
        const data = await response.json()
        setSimilarMovies(data.movies || [])
      }
    } catch (error) {
      console.error('Error fetching similar movies:', error)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites/${params.id}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const handleDownload = (quality: string) => {
    if (isGuest) {
      toast.error('Please sign in to download movies')
      return
    }
    setDownloadQuality(quality)
    toast.success(`Downloading ${movie?.title} in ${quality}...`)
    // Simulate download
    setTimeout(() => {
      setDownloadQuality(null)
      toast.success('Download complete!')
    }, 3000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: movie?.overview,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading movie details...</p>
          </div>
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
            <FilmIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
            <button 
              onClick={() => router.push('/home')} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
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
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-16">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-80 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <button
                onClick={() => router.back()}
                className="text-gray-300 hover:text-white mb-6 flex items-center space-x-2 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-semibold">Back</span>
              </button>

              <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-500 px-4 py-2 rounded-full shadow-lg">
                  <StarIcon className="h-6 w-6 text-white mr-2" />
                  <span className="text-white font-bold text-lg">{movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A'}</span>
                </div>
                <span className="text-white font-semibold text-lg bg-gray-800/70 px-4 py-2 rounded-full">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                {movie.runtime && (
                  <span className="text-white font-semibold text-lg bg-gray-800/70 px-4 py-2 rounded-full">
                    {movie.runtime} min
                  </span>
                )}
                <span className="text-white font-semibold text-lg bg-gray-800/70 px-4 py-2 rounded-full">
                  {movie.genres}
                </span>
              </div>

              <p className="text-gray-200 text-xl mb-8 max-w-3xl leading-relaxed drop-shadow-lg">
                {movie.overview}
              </p>

              {movie.director && (
                <div className="mb-4">
                  <span className="text-gray-300 text-lg">Director: </span>
                  <span className="text-white font-semibold text-lg">{movie.director}</span>
                </div>
              )}

              {movie.movie_cast && (
                <div className="mb-8">
                  <span className="text-gray-300 text-lg">Cast: </span>
                  <span className="text-white text-lg">{movie.movie_cast}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg flex items-center space-x-3 transition-all transform hover:scale-105 shadow-xl"
                >
                  <PlayIcon className="h-6 w-6" />
                  <span>Watch Trailer</span>
                </button>
                
                <button
                  onClick={toggleFavorite}
                  className={`${
                    isFavorite 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-800/80 hover:bg-gray-700'
                  } text-white font-bold py-4 px-10 rounded-lg flex items-center space-x-3 transition-all transform hover:scale-105 shadow-xl`}
                >
                  {isFavorite ? (
                    <HeartIcon className="h-6 w-6" />
                  ) : (
                    <HeartOutlineIcon className="h-6 w-6" />
                  )}
                  <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="bg-gray-800/80 hover:bg-gray-700 text-white font-bold py-4 px-10 rounded-lg flex items-center space-x-3 transition-all transform hover:scale-105 shadow-xl"
                >
                  <ShareIcon className="h-6 w-6" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <ArrowDownTrayIcon className="h-8 w-8 mr-3 text-red-500" />
            Download Options
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            Download this movie to watch offline on your devices
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['720p HD', '1080p Full HD', '4K Ultra HD', 'HDR'].map((quality) => (
              <button
                key={quality}
                onClick={() => handleDownload(quality)}
                disabled={downloadQuality === quality}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {downloadQuality === quality ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Downloading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    {quality}
                  </span>
                )}
              </button>
            ))}
          </div>
          {isGuest && (
            <p className="text-yellow-400 mt-4 text-sm">
              * Sign in to download movies for offline viewing
            </p>
          )}
        </div>
      </div>

      {/* Movie Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-8">Movie Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Release Date</h3>
              <p className="text-white font-bold text-xl">
                {new Date(movie.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Rating</h3>
              <p className="text-white font-bold text-xl">
                {movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A'} / 10
              </p>
              <p className="text-gray-400 text-sm mt-1">
                ({movie.vote_count?.toLocaleString() || 0} votes)
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Genres</h3>
              <p className="text-white font-bold text-xl">{movie.genres}</p>
            </div>
            {movie.runtime && (
              <div className="bg-gray-900 p-6 rounded-xl">
                <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Runtime</h3>
                <p className="text-white font-bold text-xl">{movie.runtime} minutes</p>
              </div>
            )}
            {movie.director && (
              <div className="bg-gray-900 p-6 rounded-xl">
                <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Director</h3>
                <p className="text-white font-bold text-xl">{movie.director}</p>
              </div>
            )}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Language</h3>
              <p className="text-white font-bold text-xl">English</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-white mb-8">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {similarMovies.filter(m => m.id !== movie.id).slice(0, 6).map((similarMovie) => (
              <Link
                key={similarMovie.id}
                href={`/movie/${similarMovie.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/w500${similarMovie.poster_path}`}
                    alt={similarMovie.title}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {similarMovie.title}
                      </h3>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-white text-sm">
                          {similarMovie.vote_average ? Number(similarMovie.vote_average).toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-2xl font-bold">{movie.title} - Trailer</h3>
              <button
                onClick={() => setShowTrailer(false)}
                className="text-white hover:text-red-500 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="h-24 w-24 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Trailer coming soon...</p>
                <p className="text-gray-500 text-sm mt-2">
                  Trailer playback will be available in the full version
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
