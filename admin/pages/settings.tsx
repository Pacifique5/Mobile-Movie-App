import { useState } from 'react'
import { 
  CogIcon,
  ServerIcon,
  ShieldCheckIcon,
  BellIcon,
  DatabaseIcon,
  KeyIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      app_name: 'CinemaMax',
      app_description: 'Your ultimate movie streaming platform',
      maintenance_mode: false,
      registration_enabled: true,
      guest_access: true
    },
    security: {
      two_factor_required: false,
      password_min_length: 8,
      session_timeout: 30,
      max_login_attempts: 5,
      require_email_verification: true
    },
    notifications: {
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      system_alerts: true,
      user_activity_alerts: true
    },
    api: {
      tmdb_api_key: 'your-tmdb-api-key',
      rate_limit: 1000,
      cache_duration: 3600,
      enable_cors: true
    },
    database: {
      backup_frequency: 'daily',
      retention_days: 30,
      auto_cleanup: true,
      connection_pool_size: 20
    }
  })

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic app configuration and preferences',
      icon: CogIcon
    },
    {
      id: 'security',
      title: 'Security & Authentication',
      description: 'User security and authentication settings',
      icon: ShieldCheckIcon
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email and push notification preferences',
      icon: BellIcon
    },
    {
      id: 'api',
      title: 'API Configuration',
      description: 'External API keys and rate limiting',
      icon: KeyIcon
    },
    {
      id: 'database',
      title: 'Database Settings',
      description: 'Backup and maintenance configuration',
      icon: DatabaseIcon
    }
  ]

  const handleSave = (section: string) => {
    // Simulate API call
    setTimeout(() => {
      toast.success(`${sections.find(s => s.id === section)?.title} saved successfully!`)
    }, 500)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Name
        </label>
        <input
          type="text"
          value={settings.general.app_name}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, app_name: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Description
        </label>
        <textarea
          value={settings.general.app_description}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, app_description: e.target.value }
          })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
            <p className="text-sm text-gray-500">Temporarily disable the app for maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.maintenance_mode}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, maintenance_mode: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">User Registration</h4>
            <p className="text-sm text-gray-500">Allow new users to register accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.registration_enabled}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, registration_enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Guest Access</h4>
            <p className="text-sm text-gray-500">Allow users to browse without registration</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.guest_access}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, guest_access: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Password Length
        </label>
        <input
          type="number"
          min="6"
          max="20"
          value={settings.security.password_min_length}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, password_min_length: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          min="5"
          max="1440"
          value={settings.security.session_timeout}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, session_timeout: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Login Attempts
        </label>
        <input
          type="number"
          min="3"
          max="10"
          value={settings.security.max_login_attempts}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, max_login_attempts: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.two_factor_required}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, two_factor_required: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Verification</h4>
            <p className="text-sm text-gray-500">Require email verification for new accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.require_email_verification}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, require_email_verification: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Send notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.email_notifications}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email_notifications: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Send push notifications to mobile apps</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.push_notifications}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, push_notifications: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">System Alerts</h4>
            <p className="text-sm text-gray-500">Receive alerts about system issues</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.system_alerts}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, system_alerts: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">User Activity Alerts</h4>
            <p className="text-sm text-gray-500">Get notified about user activities</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.user_activity_alerts}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, user_activity_alerts: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          TMDB API Key
        </label>
        <input
          type="password"
          value={settings.api.tmdb_api_key}
          onChange={(e) => setSettings({
            ...settings,
            api: { ...settings.api, tmdb_api_key: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your TMDB API key"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limit (requests per hour)
        </label>
        <input
          type="number"
          min="100"
          max="10000"
          value={settings.api.rate_limit}
          onChange={(e) => setSettings({
            ...settings,
            api: { ...settings.api, rate_limit: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cache Duration (seconds)
        </label>
        <input
          type="number"
          min="300"
          max="86400"
          value={settings.api.cache_duration}
          onChange={(e) => setSettings({
            ...settings,
            api: { ...settings.api, cache_duration: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Enable CORS</h4>
          <p className="text-sm text-gray-500">Allow cross-origin requests</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.api.enable_cors}
            onChange={(e) => setSettings({
              ...settings,
              api: { ...settings.api, enable_cors: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Backup Frequency
        </label>
        <select
          value={settings.database.backup_frequency}
          onChange={(e) => setSettings({
            ...settings,
            database: { ...settings.database, backup_frequency: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Backup Retention (days)
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={settings.database.retention_days}
          onChange={(e) => setSettings({
            ...settings,
            database: { ...settings.database, retention_days: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Connection Pool Size
        </label>
        <input
          type="number"
          min="5"
          max="100"
          value={settings.database.connection_pool_size}
          onChange={(e) => setSettings({
            ...settings,
            database: { ...settings.database, connection_pool_size: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Auto Cleanup</h4>
          <p className="text-sm text-gray-500">Automatically clean up old data</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.database.auto_cleanup}
            onChange={(e) => setSettings({
              ...settings,
              database: { ...settings.database, auto_cleanup: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'api':
        return renderApiSettings()
      case 'database':
        return renderDatabaseSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your CinemaMax admin panel and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <div>
                    <div className="text-sm font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                {sections.find(s => s.id === activeSection)?.title}
              </h3>
            </div>
            <div className="card-body">
              {renderContent()}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleSave(activeSection)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}