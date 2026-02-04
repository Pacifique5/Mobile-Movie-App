import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { getMovieStats, deleteMovie } from '../lib/api'
import { MovieStats } from '../lib/supabase'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function Movies() {
  const [movies, setMovies] = useState<MovieStats[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadMovies()
  }, [page])

  async function loadMovies() {
    try {
      setLoading(true)
      const data = await getMovieStats(page, 20)
      setMovies(data.movies)
      setTotalPages(data.totalPages)
    } catch (error) {
      toast.error('Failed to load movies')
      console.error('Error loading movies:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteMovie(movieId: string) {
    if (!confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return
    }

    try {
      await deleteMovie(movieId)
      toast.success('Movie deleted successfully')
      loadMovies()
    } catch (error) {
      toast.error('Failed to delete movie')
      console.error('Error deleting movie:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage movies in your CinemaMax database
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/movies/add" className="btn-primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Movie
          </Link>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading movies...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No movies found</p>
              <Link href="/movies/add" className="btn-primary mt-4">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Your First Movie
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {movies.map((movie) => (
                <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-2 aspect-h-3 relative">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Link
                        href={`/movies/edit/${movie.id}`}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                      </Link>
                      <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate" title={movie.title}>
                      {movie.title}
                    </h3>
                    
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <HeartIcon className="h-4 w-4 text-pink-500 mr-1" />
                          {movie.total_favorites}
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          {movie.average_rating ? movie.average_rating.toFixed(1) : '0.0'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400">
                      Added {format(new Date(movie.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}