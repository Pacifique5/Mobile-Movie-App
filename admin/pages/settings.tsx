import { useState } from 'react'
import { 
  CogIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  BellIcon,
  ServerIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'CinemaMax',
    siteDescription: 'Discover your next favorite movie',
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    maintenanceMode: false,
    maxUsersPerDay: 100,
    maxMoviesPerUser: 1000,
    apiRateLimit: 1000,
    backupFrequency: 'daily',
    logLevel: 'info'
  })

  const [loading, setLoading] = useState(false)

  async function handleSaveSettings() {
    try {
      setLoading(true)
      // In a real app, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your CinemaMax application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <CogIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label">Site Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="form-label">Site Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Allow new user registration
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Require email verification
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Security & Limits</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label">Max Users Per Day</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.maxUsersPerDay}
                  onChange={(e) => setSettings({...settings, maxUsersPerDay: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="form-label">Max Movies Per User</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.maxMoviesPerUser}
                  onChange={(e) => setSettings({...settings, maxMoviesPerUser: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="form-label">API Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.apiRateLimit}
                  onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Maintenance mode (disable app access)
                </label>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <ServerIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label">Backup Frequency</label>
                <select
                  className="form-input"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Log Level</label>
                <select
                  className="form-input"
                  value={settings.logLevel}
                  onChange={(e) => setSettings({...settings, logLevel: e.target.value})}
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable system notifications
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* System Info Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
            </div>
            <div className="card-body space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Database</span>
                <span className="badge badge-success">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">API Server</span>
                <span className="badge badge-success">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">TMDB API</span>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Storage</span>
                <span className="badge badge-info">85% Used</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body space-y-3">
              <button className="w-full btn-secondary text-left">
                <DatabaseIcon className="h-4 w-4 mr-2" />
                Backup Database
              </button>
              <button className="w-full btn-secondary text-left">
                <ServerIcon className="h-4 w-4 mr-2" />
                Clear Cache
              </button>
              <button className="w-full btn-secondary text-left">
                <BellIcon className="h-4 w-4 mr-2" />
                Send Test Notification
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Environment</h3>
            </div>
            <div className="card-body space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Environment:</span>
                <span>Development</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Node.js:</span>
                <span>18.x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database:</span>
                <span>PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}