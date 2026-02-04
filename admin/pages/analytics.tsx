import { useState, useEffect } from 'react'
import { 
  TrendingUpIcon,
  UsersIcon,
  FilmIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { getSystemStats, getUserActivity, getMovieStats } from '../lib/api'
import { SystemStats } from '../lib/supabase'

// Mock data for charts (in a real app, this would come from your analytics API)
const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 180 },
  { month: 'Mar', users: 240 },
  { month: 'Apr', users: 320 },
  { month: 'May', users: 450 },
  { month: 'Jun', users: 580 },
]

const moviePopularityData = [
  { name: 'Action', value: 35 },
  { name: 'Comedy', value: 25 },
  { name: 'Drama', value: 20 },
  { name: 'Horror', value: 12 },
  { name: 'Sci-Fi', value: 8 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

export default function Analytics() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await getSystemStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Insights and metrics for your CinemaMax app
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats?.total_users || 0}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      <span className="sr-only">Increased by</span>
                      +{stats?.new_users_this_month || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-500">
                  <FilmIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Movies</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.total_movies || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-pink-500">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Favorites</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.total_favorites || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-yellow-500">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.total_reviews || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Popularity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Popular Genres</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moviePopularityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moviePopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Engagement */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">User Engagement</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats?.new_users_today || 0}</div>
              <div className="text-sm text-gray-500">New Users Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats?.new_users_this_week || 0}</div>
              <div className="text-sm text-gray-500">New Users This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats?.new_users_this_month || 0}</div>
              <div className="text-sm text-gray-500">New Users This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Movies */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Performance Insights</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">{((stats?.total_favorites || 0) / (stats?.total_users || 1)).toFixed(1)}</div>
              <div className="text-sm opacity-90">Avg Favorites per User</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">{((stats?.total_reviews || 0) / (stats?.total_users || 1)).toFixed(1)}</div>
              <div className="text-sm opacity-90">Avg Reviews per User</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">{((stats?.total_favorites || 0) / (stats?.total_movies || 1)).toFixed(1)}</div>
              <div className="text-sm opacity-90">Avg Favorites per Movie</div>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">{stats?.active_users || 0}</div>
              <div className="text-sm opacity-90">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}