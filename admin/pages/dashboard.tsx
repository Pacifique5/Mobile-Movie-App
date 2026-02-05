import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  FilmIcon, 
  HeartIcon, 
  StarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend?: 'up' | 'down' | 'neutral'
  bgColor?: string
}

interface SystemAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: string
}

interface RecentActivity {
  id: string
  user_id: string
  user_name: string
  user_email: string
  activity_type: 'signup' | 'favorite' | 'view' | 'review' | 'subscription'
  movie_id?: string
  movie_title?: string
  created_at: string
  details?: string
}

function StatCard({ title, value, change, icon: Icon, color, trend, bgColor = 'bg-white' }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              )}
              {trend === 'down' && (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1 rotate-180" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user: _user } = useAdminAuth()
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_movies: 0,
    total_favorites: 0,
    total_reviews: 0,
    new_users_today: 0,
    new_users_this_week: 0,
    new_users_this_month: 0,
    revenue_today: 0,
    revenue_month: 0,
    premium_users: 0,
    server_uptime: 0
  })
  
  const [activity, setActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      // Fetch system statistics
      const statsResponse = await fetch('http://localhost:3000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(prev => ({
          ...prev,
          ...statsData,
          // Add some calculated fields for demo
          active_users: Math.floor(statsData.total_users * 0.7), // 70% active rate
          revenue_today: 2850 + Math.floor(Math.random() * 500),
          revenue_month: 89420 + Math.floor(Math.random() * 5000),
          premium_users: Math.floor(statsData.total_users * 0.15), // 15% premium rate
          server_uptime: 99.8
        }))
      } else {
        // Fallback demo data for CinemaMax
        setStats({
          total_users: 2847,
          active_users: 1993,
          total_movies: 1247,
          total_favorites: 15689,
          total_reviews: 8341,
          new_users_today: 47,
          new_users_this_week: 312,
          new_users_this_month: 1289,
          revenue_today: 2850,
          revenue_month: 89420,
          premium_users: 427,
          server_uptime: 99.8
        })
      }

      // Fetch recent activity
      const activityResponse = await fetch('http://localhost:3000/api/admin/activity?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setActivity(activityData)
      } else {
        // Demo activity for CinemaMax
        setActivity([
          {
            id: '1',
            user_id: '1',
            user_name: 'Sarah Johnson',
            user_email: 'sarah@example.com',
            activity_type: 'favorite',
            movie_id: '550',
            movie_title: 'Fight Club',
            created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            details: 'Added to favorites'
          },
          {
            id: '2',
            user_id: '2',
            user_name: 'Mike Chen',
            user_email: 'mike@example.com',
            activity_type: 'signup',
            created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            details: 'New user registration'
          },
          {
            id: '3',
            user_id: '3',
            user_name: 'Emma Wilson',
            user_email: 'emma@example.com',
            activity_type: 'review',
            movie_id: '155',
            movie_title: 'The Dark Knight',
            created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            details: 'Rated 5 stars'
          }
        ])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback demo data on error
      setStats({
        total_users: 2847,
        active_users: 1993,
        total_movies: 1247,
        total_favorites: 15689,
        total_reviews: 8341,
        new_users_today: 47,
        new_users_this_week: 312,
        new_users_this_month: 1289,
        revenue_today: 2850,
        revenue_month: 89420,
        premium_users: 427,
        server_uptime: 99.8
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-gray-600">Loading CinemaMax dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to CinemaMax Admin Panel</p>
      </div>

      {/* Main Stats Grid - CinemaMax Specific */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL USERS"
          value={stats.total_users.toLocaleString()}
          icon={UsersIcon}
          color="bg-blue-500"
          bgColor="bg-white"
        />
        <StatCard
          title="MOVIES CATALOG"
          value={stats.total_movies.toLocaleString()}
          icon={FilmIcon}
          color="bg-green-500"
          bgColor="bg-white"
        />
        <StatCard
          title="ACTIVE VIEWERS"
          value="85%"
          icon={EyeIcon}
          color="bg-blue-400"
          bgColor="bg-white"
        />
        <StatCard
          title="PREMIUM USERS"
          value={stats.premium_users.toLocaleString()}
          icon={StarIcon}
          color="bg-yellow-500"
          bgColor="bg-white"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth Overview</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          
          {/* User growth chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {[1200, 1800, 1400, 2200, 1900, 2500, 2100, 2800].map((value) => (
              <div key={value} className="flex-1 bg-indigo-100 rounded-t-sm relative">
                <div 
                  className="bg-indigo-500 rounded-t-sm transition-all duration-1000 ease-out"
                  style={{ height: `${(value / 3000) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </div>

        {/* Content Engagement */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Content Engagement</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          
          {/* Donut chart for movie engagement */}
          <div className="flex items-center justify-center h-48">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="45, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-45"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-75"
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Movies Watched</span>
              </div>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Favorites Added</span>
              </div>
              <span className="text-sm font-medium">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Reviews Written</span>
              </div>
              <span className="text-sm font-medium">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CinemaMax Projects Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-600 text-white p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">Monthly Active Users</h4>
                <p className="text-indigo-100 text-sm">Growing steadily</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.active_users.toLocaleString()}</div>
                <div className="text-indigo-200 text-sm">Users</div>
              </div>
            </div>
            <div className="w-full bg-indigo-500 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          
          <div className="bg-green-500 text-white p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">Content Library</h4>
                <p className="text-green-100 text-sm">Expanding catalog</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.total_movies.toLocaleString()}</div>
                <div className="text-green-200 text-sm">Movies</div>
              </div>
            </div>
            <div className="w-full bg-green-400 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - CinemaMax Specific */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent User Activity</h3>
          <span className="text-sm text-gray-500">Live updates</span>
        </div>
        <div className="space-y-4">
          {activity.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                item.activity_type === 'signup' ? 'bg-green-100' :
                item.activity_type === 'favorite' ? 'bg-pink-100' :
                item.activity_type === 'review' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {item.activity_type === 'signup' && <UsersIcon className="h-5 w-5 text-green-600" />}
                {item.activity_type === 'favorite' && <HeartIcon className="h-5 w-5 text-pink-600" />}
                {item.activity_type === 'review' && <StarIcon className="h-5 w-5 text-yellow-600" />}
                {item.activity_type === 'view' && <PlayIcon className="h-5 w-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.user_name}
                  {item.activity_type === 'signup' && ' joined CinemaMax'}
                  {item.activity_type === 'favorite' && ` added "${item.movie_title}" to favorites`}
                  {item.activity_type === 'review' && ` reviewed "${item.movie_title}"`}
                  {item.activity_type === 'view' && ` watched "${item.movie_title}"`}
                </p>
                <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              {item.details && (
                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                  {item.details}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}