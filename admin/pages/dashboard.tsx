import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  FilmIcon, 
  HeartIcon, 
  StarIcon,
  TrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { getSystemStats, getUserActivity } from '../lib/api'
import { SystemStats, UserActivity } from '../lib/supabase'
import { format } from 'date-fns'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card">
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
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <TrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                    <span className="sr-only">Increased by</span>
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
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [activity, setActivity] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, activityData] = await Promise.all([
          getSystemStats(),
          getUserActivity(20)
        ])
        setStats(statsData)
        setActivity(activityData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to CinemaMax Admin Panel. Here's what's happening with your app.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          change={`+${stats?.new_users_this_week || 0} this week`}
          icon={UsersIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Movies"
          value={stats?.total_movies || 0}
          icon={FilmIcon}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Favorites"
          value={stats?.total_favorites || 0}
          icon={HeartIcon}
          color="bg-pink-500"
        />
        <StatCard
          title="Total Reviews"
          value={stats?.total_reviews || 0}
          icon={StarIcon}
          color="bg-yellow-500"
        />
      </div>

      {/* Growth Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600">{stats?.new_users_today || 0}</div>
            <div className="text-sm text-gray-500">New Users Today</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-blue-600">{stats?.new_users_this_week || 0}</div>
            <div className="text-sm text-gray-500">New Users This Week</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-purple-600">{stats?.new_users_this_month || 0}</div>
            <div className="text-sm text-gray-500">New Users This Month</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="card-body">
          {activity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
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
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            item.activity_type === 'signup' ? 'bg-green-500' :
                            item.activity_type === 'favorite' ? 'bg-pink-500' :
                            'bg-blue-500'
                          }`}>
                            {item.activity_type === 'signup' && <UsersIcon className="h-4 w-4 text-white" />}
                            {item.activity_type === 'favorite' && <HeartIcon className="h-4 w-4 text-white" />}
                            {item.activity_type === 'view' && <EyeIcon className="h-4 w-4 text-white" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{item.user_name}</span>
                              {item.activity_type === 'signup' && ' signed up'}
                              {item.activity_type === 'favorite' && ` added ${item.movie_title} to favorites`}
                              {item.activity_type === 'view' && ` viewed ${item.movie_title}`}
                            </p>
                            <p className="text-xs text-gray-400">{item.user_email}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {format(new Date(item.created_at), 'MMM d, HH:mm')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}