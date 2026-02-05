import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  UsersIcon,
  FilmIcon,
  HeartIcon,
  EyeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  userGrowth: { date: string; users: number; premium: number }[]
  movieStats: { genre: string; count: number; popularity: number }[]
  userActivity: { date: string; views: number; favorites: number; reviews: number }[]
  topMovies: { title: string; views: number; rating: number; favorites: number }[]
  revenueData: { date: string; revenue: number; subscriptions: number }[]
}

interface MetricCard {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    // Mock analytics data - replace with API calls
    const mockAnalytics: AnalyticsData = {
      userGrowth: [
        { date: '2024-01-28', users: 1200, premium: 150 },
        { date: '2024-01-29', users: 1235, premium: 155 },
        { date: '2024-01-30', users: 1250, premium: 160 },
        { date: '2024-01-31', users: 1280, premium: 165 },
        { date: '2024-02-01', users: 1310, premium: 170 },
        { date: '2024-02-02', users: 1340, premium: 175 },
        { date: '2024-02-03', users: 1375, premium: 180 }
      ],
      movieStats: [
        { genre: 'Action', count: 245, popularity: 85 },
        { genre: 'Drama', count: 189, popularity: 72 },
        { genre: 'Comedy', count: 156, popularity: 68 },
        { genre: 'Thriller', count: 134, popularity: 79 },
        { genre: 'Horror', count: 98, popularity: 65 },
        { genre: 'Sci-Fi', count: 87, popularity: 81 }
      ],
      userActivity: [
        { date: '2024-01-28', views: 2500, favorites: 180, reviews: 45 },
        { date: '2024-01-29', views: 2650, favorites: 195, reviews: 52 },
        { date: '2024-01-30', views: 2800, favorites: 210, reviews: 48 },
        { date: '2024-01-31', views: 3100, favorites: 225, reviews: 61 },
        { date: '2024-02-01', views: 3350, favorites: 240, reviews: 58 },
        { date: '2024-02-02', views: 3200, favorites: 235, reviews: 55 },
        { date: '2024-02-03', views: 3450, favorites: 250, reviews: 63 }
      ],
      topMovies: [
        { title: 'The Dark Knight', views: 15420, rating: 9.0, favorites: 2340 },
        { title: 'Inception', views: 14230, rating: 8.8, favorites: 2180 },
        { title: 'Interstellar', views: 13890, rating: 8.6, favorites: 2050 },
        { title: 'Pulp Fiction', views: 12560, rating: 8.9, favorites: 1980 },
        { title: 'The Matrix', views: 11340, rating: 8.7, favorites: 1850 }
      ],
      revenueData: [
        { date: '2024-01-28', revenue: 2500, subscriptions: 15 },
        { date: '2024-01-29', revenue: 2750, subscriptions: 18 },
        { date: '2024-01-30', revenue: 2600, subscriptions: 16 },
        { date: '2024-01-31', revenue: 3100, subscriptions: 22 },
        { date: '2024-02-01', revenue: 3350, subscriptions: 25 },
        { date: '2024-02-02', revenue: 3200, subscriptions: 20 },
        { date: '2024-02-03', revenue: 3650, subscriptions: 28 }
      ]
    }

    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '1,375',
      change: '+12.5%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Premium Users',
      value: '180',
      change: '+20.0%',
      changeType: 'increase',
      icon: TrendingUpIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Movies',
      value: '909',
      change: '+5.2%',
      changeType: 'increase',
      icon: FilmIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Daily Views',
      value: '3,450',
      change: '+8.1%',
      changeType: 'increase',
      icon: EyeIcon,
      color: 'bg-orange-500'
    },
    {
      title: 'Favorites Added',
      value: '250',
      change: '+15.3%',
      changeType: 'increase',
      icon: HeartIcon,
      color: 'bg-pink-500'
    },
    {
      title: 'Revenue (Today)',
      value: '$3,650',
      change: '+22.4%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-indigo-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            View detailed analytics and insights for your CinemaMax app
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${metric.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{metric.title}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{metric.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.changeType === 'increase' ? (
                            <TrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : (
                            <TrendingDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          )}
                          <span className="sr-only">
                            {metric.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                          </span>
                          {metric.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics?.userGrowth.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                    <div 
                      className="bg-blue-500 rounded-t absolute bottom-0 w-full"
                      style={{ height: `${(data.users / 1400) * 100}%` }}
                    />
                    <div 
                      className="bg-green-500 rounded-t absolute bottom-0 w-full opacity-70"
                      style={{ height: `${(data.premium / 1400) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Total Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Premium Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Genre Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Movie Genres</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {analytics?.movieStats.map((genre, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{genre.genre}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(genre.count / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-900 font-medium">{genre.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Movies Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Movies</h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Favorites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics?.topMovies.map((movie, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movie.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{movie.rating}</span>
                        <div className="ml-1 flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(movie.rating / 2) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movie.favorites.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(movie.views / 16000) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Revenue & Subscriptions</h3>
        </div>
        <div className="card-body">
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics?.revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                  <div 
                    className="bg-indigo-500 rounded-t absolute bottom-0 w-full"
                    style={{ height: `${(data.revenue / 4000) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs font-medium text-gray-900">${data.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}