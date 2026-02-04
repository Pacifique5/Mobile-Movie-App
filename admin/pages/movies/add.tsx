import { useState } from 'react'
import { useRouter } from 'next/router'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { searchTMDBMovies, getTMDBMovieDetails, addMovie } from '../../lib/api'
import toast from 'react-hot-toast'

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
}

export default function AddMovie() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const results = await searchTMDBMovies(searchQuery)
      setSearchResults(results.results || [])
    } catch (error) {
      toast.error('Failed to search movies')
      console.error('Error searching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMovie(tmdbMovie: TMDBMovie) {
    try {
      setAdding(true)
      
      // Get detailed movie information
      const details = await getTMDBMovieDetails(tmdbMovie.id.toString())
      
      // Prepare movie data for database
      const movieData = {
        id: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        poster_path: tmdbMovie.poster_path,
        backdrop_path: tmdbMovie.backdrop_path,
        release_date: tmdbMovie.release_date,
        vote_average: tmdbMovie.vote_average,
        vote_count: tmdbMovie.vote_count,
        genre_ids: tmdbMovie.genre_ids,
        adult: tmdbMovie.adult,
        original_language: tmdbMovie.original_language,
        popularity: tmdbMovie.popularity,
        cached_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await addMovie(movieData)
      toast.success('Movie added successfully!')
      router.push('/movies')
    } catch (error) {
      toast.error('Failed to add movie')
      console.error('Error adding movie:', error)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Movie</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search for movies from TMDB and add them to your database
        </p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search for movies to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
          </div>
          <div className="card-body p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {searchResults.map((movie) => (
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
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate" title={movie.title}>
                      {movie.title}
                    </h3>
                    
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {movie.overview}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>{movie.release_date}</span>
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddMovie(movie)}
                      disabled={adding}
                      className="mt-3 w-full btn-primary text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      {adding ? 'Adding...' : 'Add Movie'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchQuery && !loading && searchResults.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
            <p className="text-gray-500">
              Try searching with a different title or keyword
            </p>
          </div>
        </div>
      )}
    </div>
  )
}