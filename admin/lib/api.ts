import { supabaseAdmin } from './supabase'
import { AdminUser, MovieStats, SystemStats, UserActivity } from './supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// User Management
export async function getUsers(page = 1, limit = 20, search = '') {
  try {
    let query = supabaseAdmin
      .from('profiles')
      .select(`
        *,
        user_favorites(count),
        user_reviews(count)
      `)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return {
      users: data?.map(user => ({
        ...user,
        total_favorites: user.user_favorites?.[0]?.count || 0,
        total_reviews: user.user_reviews?.[0]?.count || 0
      })) || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export async function updateUser(userId: string, updates: Partial<AdminUser>) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete user data in order (due to foreign key constraints)
    await supabaseAdmin.from('user_reviews').delete().eq('user_id', userId)
    await supabaseAdmin.from('user_favorites').delete().eq('user_id', userId)
    await supabaseAdmin.from('user_watchlist').delete().eq('user_id', userId)
    await supabaseAdmin.from('watch_history').delete().eq('user_id', userId)
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Movie Management
export async function getMovieStats(page = 1, limit = 20) {
  try {
    const { data, error, count } = await supabaseAdmin
      .from('movie_cache')
      .select(`
        *,
        user_favorites(count),
        user_reviews(count, rating)
      `)
      .order('cached_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return {
      movies: data?.map(movie => ({
        ...movie,
        total_favorites: movie.user_favorites?.[0]?.count || 0,
        total_reviews: movie.user_reviews?.length || 0,
        average_rating: movie.user_reviews?.length > 0 
          ? movie.user_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / movie.user_reviews.length
          : 0
      })) || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching movie stats:', error)
    throw error
  }
}

export async function addMovie(movieData: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('movie_cache')
      .insert(movieData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding movie:', error)
    throw error
  }
}

export async function updateMovie(movieId: string, updates: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('movie_cache')
      .update(updates)
      .eq('id', movieId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating movie:', error)
    throw error
  }
}

export async function deleteMovie(movieId: string) {
  try {
    // Delete related data first
    await supabaseAdmin.from('user_reviews').delete().eq('movie_id', movieId)
    await supabaseAdmin.from('user_favorites').delete().eq('movie_id', movieId)
    await supabaseAdmin.from('user_watchlist').delete().eq('movie_id', movieId)
    await supabaseAdmin.from('watch_history').delete().eq('movie_id', movieId)
    
    const { error } = await supabaseAdmin
      .from('movie_cache')
      .delete()
      .eq('id', movieId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting movie:', error)
    throw error
  }
}

// Analytics
export async function getSystemStats(): Promise<SystemStats> {
  try {
    const [
      { count: totalUsers },
      { count: totalMovies },
      { count: totalFavorites },
      { count: totalReviews },
      { count: newUsersToday },
      { count: newUsersThisWeek },
      { count: newUsersThisMonth }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('movie_cache').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('user_favorites').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('user_reviews').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ])

    return {
      total_users: totalUsers || 0,
      active_users: totalUsers || 0, // TODO: Implement active user tracking
      total_movies: totalMovies || 0,
      total_favorites: totalFavorites || 0,
      total_reviews: totalReviews || 0,
      new_users_today: newUsersToday || 0,
      new_users_this_week: newUsersThisWeek || 0,
      new_users_this_month: newUsersThisMonth || 0
    }
  } catch (error) {
    console.error('Error fetching system stats:', error)
    throw error
  }
}

export async function getUserActivity(limit = 50): Promise<UserActivity[]> {
  try {
    // This would require activity logging in the main app
    // For now, we'll return recent user signups and favorites
    const { data: recentUsers } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(limit / 2)

    const { data: recentFavorites } = await supabaseAdmin
      .from('user_favorites')
      .select(`
        *,
        profiles(name, email),
        movie_cache(title)
      `)
      .order('created_at', { ascending: false })
      .limit(limit / 2)

    const activities: UserActivity[] = []

    // Add user signups
    recentUsers?.forEach(user => {
      activities.push({
        id: `signup-${user.id}`,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        activity_type: 'signup',
        created_at: user.created_at
      })
    })

    // Add favorites
    recentFavorites?.forEach(fav => {
      activities.push({
        id: `favorite-${fav.id}`,
        user_id: fav.user_id,
        user_name: fav.profiles?.name || 'Unknown',
        user_email: fav.profiles?.email || 'Unknown',
        activity_type: 'favorite',
        movie_id: fav.movie_id,
        movie_title: fav.movie_cache?.title || 'Unknown Movie',
        created_at: fav.created_at
      })
    })

    return activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.error('Error fetching user activity:', error)
    throw error
  }
}

// TMDB Integration
export async function searchTMDBMovies(query: string) {
  try {
    const response = await fetch(`${API_URL}/movies/search?query=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search movies')
    return await response.json()
  } catch (error) {
    console.error('Error searching TMDB movies:', error)
    throw error
  }
}

export async function getTMDBMovieDetails(movieId: string) {
  try {
    const response = await fetch(`${API_URL}/movies/${movieId}`)
    if (!response.ok) throw new Error('Failed to get movie details')
    return await response.json()
  } catch (error) {
    console.error('Error getting TMDB movie details:', error)
    throw error
  }
}