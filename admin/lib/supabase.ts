import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Admin client with service role (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Regular client for auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface AdminUser {
  id: string
  email: string
  name: string
  avatar_url?: string
  member_since: string
  dark_mode: boolean
  is_active: boolean
  last_login?: string
  total_favorites: number
  created_at: string
  updated_at: string
}

export interface MovieStats {
  id: string
  title: string
  poster_path?: string
  total_favorites: number
  total_views: number
  average_rating: number
  created_at: string
}

export interface SystemStats {
  total_users: number
  active_users: number
  total_movies: number
  total_favorites: number
  total_reviews: number
  new_users_today: number
  new_users_this_week: number
  new_users_this_month: number
}

export interface UserActivity {
  id: string
  user_id: string
  user_name: string
  user_email: string
  activity_type: 'login' | 'signup' | 'favorite' | 'review' | 'view'
  movie_id?: string
  movie_title?: string
  created_at: string
}