import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { getUsers, updateUser, deleteUser } from '../lib/api'
import { AdminUser } from '../lib/supabase'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [page, search])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getUsers(page, 20, search)
      setUsers(data.users)
      setTotalPages(data.totalPages)
    } catch (error) {
      toast.error('Failed to load users')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateUser(userId: string, updates: Partial<AdminUser>) {
    try {
      await updateUser(userId, updates)
      toast.success('User updated successfully')
      loadUsers()
      setShowEditModal(false)
    } catch (error) {
      toast.error('Failed to update user')
      console.error('Error updating user:', error)
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await deleteUser(userId)
      toast.success('User deleted successfully')
      loadUsers()
    } catch (error) {
      toast.error('Failed to delete user')
      console.error('Error deleting user:', error)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    loadUsers()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users in your CinemaMax app
          </p>
        </div>
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
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">User</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Joined</th>
                    <th className="table-header-cell">Favorites</th>
                    <th className="table-header-cell">Reviews</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar_url ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.avatar_url}
                                alt={user.name}
                              />
                            ) : (
                              <UserCircleIcon className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell">
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="table-cell">
                        {user.total_favorites || 0}
                      </td>
                      <td className="table-cell">
                        {user.total_reviews || 0}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowEditModal(true)
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const updates = {
                  name: formData.get('name') as string,
                  is_active: formData.get('is_active') === 'true',
                  dark_mode: formData.get('dark_mode') === 'true'
                }
                handleUpdateUser(selectedUser.id, updates)
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={selectedUser.name}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={selectedUser.email}
                        className="form-input bg-gray-50"
                        disabled
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        value="true"
                        defaultChecked={selectedUser.is_active}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Active User
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="dark_mode"
                        value="true"
                        defaultChecked={selectedUser.dark_mode}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Dark Mode Enabled
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary sm:ml-3">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}