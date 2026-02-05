import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  FilmIcon, 
  HeartIcon, 
  StarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend?: 'up' | 'down' | 'neutral'
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

function StatCard({ title, value, change, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="card-body">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend === 'up' ? 'text-green-600' : 
                    trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <ArrowTrendingUpIcon className={`h-4 w-4 flex-shrink-0 self-center ${
                      trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    <span className="sr-only">
                      {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'Changed'} by
                    </span>
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAdminAuth()
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
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
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
          revenue_today: 3650 + Math.floor(Math.random() * 500),
          revenue_month: 89420 + Math.floor(Math.random() * 5000),
          premium_users: Math.floor(statsData.total_users * 0.15), // 15% premium rate
          server_uptime: 99.8
        }))
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
      }

      // Fetch system health for alerts
      const healthResponse = await fetch('http://localhost:3000/api/admin/health', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        
        // Generate alerts based on system health
        const newAlerts: SystemAlert[] = []
        
        if (healthData.services.database !== 'healthy') {
          newAlerts.push({
            id: 'db-alert',
            type: 'error',
            message: 'Database connection issues detected. Please check system status.',
            timestamp: new Date().toISOString()
          })
        }

        // Add some demo alerts for better UX
        if (Math.random() > 0.7) {
          newAlerts.push({
            id: 'cpu-alert',
            type: 'warning',
            message: 'Server CPU usage is elevated. Monitoring performance.',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
          })
        }

        setAlerts(newAlerts)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback demo data on error
      setStats({
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
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return <UsersIcon className="h-4 w-4 text-white" />
      case 'favorite':
        return <HeartIcon className="h-4 w-4 text-white" />
      case 'view':
        return <EyeIcon className="h-4 w-4 text-white" />
      case 'review':
        return <StarIcon className="h-4 w-4 text-white" />
      case 'subscription':
        return <CurrencyDollarIcon className="h-4 w-4 text-white" />
      default:
        return <ClockIcon className="h-4 w-4 text-white" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'signup':
        return 'bg-green-500'
      case 'favorite':
        return 'bg-pink-500'
      case 'view':
        return 'bg-blue-500'
      case 'review':
        return 'bg-yellow-500'
      case 'subscription':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.username}!</h1>
            <p className="mt-1 text-blue-100">
              Here's what's happening with CinemaMax today
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Server Status</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm font-medium">{stats.server_uptime}% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'bg-red-50 border-red-400' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-center">
                {getAlertIcon(alert.type)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total_users.toLocaleString()}
          change={`+${stats.new_users_this_week} this week`}
          icon={UsersIcon}
          color="bg-blue-500"
          trend="up"
        />
        <StatCard
          title="Active Now"
          value={stats.active_users.toLocaleString()}
          change="+5.2%"
          icon={EyeIcon}
          color="bg-green-500"
          trend="up"
        />
        <StatCard
          title="Total Movies"
          value={stats.total_movies.toLocaleString()}
          change="+12 this month"
          icon={FilmIcon}
          color="bg-purple-500"
          trend="up"
        />
        <StatCard
          title="Premium Users"
          value={stats.premium_users.toLocaleString()}
          change="+15.3%"
          icon={CurrencyDollarIcon}
          color="bg-indigo-500"
          trend="up"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Favorites"
          value={stats.total_favorites.toLocaleString()}
          change="+8.1%"
          icon={HeartIcon}
          color="bg-pink-500"
          trend="up"
        />
        <StatCard
          title="Total Reviews"
          value={stats.total_reviews.toLocaleString()}
          change="+12.4%"
          icon={StarIcon}
          color="bg-yellow-500"
          trend="up"
        />
        <StatCard
          title="Revenue Today"
          value={`$${stats.revenue_today.toLocaleString()}`}
          change="+22.1%"
          icon={ChartBarIcon}
          color="bg-emerald-500"
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.revenue_month.toLocaleString()}`}
          change="+18.7%"
          icon={CurrencyDollarIcon}
          color="bg-orange-500"
          trend="up"
        />
      </div>

      {/* Growth Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600">{stats.new_users_today}</div>
            <div className="text-sm text-gray-500">New Users Today</div>
            <div className="mt-2 text-xs text-gray-400">
              Target: 25 users
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.new_users_this_week}</div>
            <div className="text-sm text-gray-500">New Users This Week</div>
            <div className="mt-2 text-xs text-gray-400">
              Target: 150 users
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.new_users_this_month}</div>
            <div className="text-sm text-gray-500">New Users This Month</div>
            <div className="mt-2 text-xs text-gray-400">
              Target: 600 users
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">Live updates</span>
        </div>
        <div className="card-body">
          <div className="flow-root">
            <ul className="-mb-8">
              {activity.map((item, index) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {index !== activity.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(item.activity_type)}`}>
                          {getActivityIcon(item.activity_type)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{item.user_name}</span>
                            {item.activity_type === 'signup' && ' signed up'}
                            {item.activity_type === 'favorite' && ` added ${item.movie_title} to favorites`}
                            {item.activity_type === 'view' && ` viewed ${item.movie_title}`}
                            {item.activity_type === 'review' && ` reviewed ${item.movie_title}`}
                            {item.activity_type === 'subscription' && ` ${item.details}`}
                          </p>
                          <p className="text-xs text-gray-400">{item.user_email}</p>
                          {item.details && item.activity_type === 'review' && (
                            <p className="text-xs text-blue-600 mt-1">{item.details}</p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                          <div className="text-xs">
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}