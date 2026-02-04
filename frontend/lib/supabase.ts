import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration with environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  console.error('See README.md for setup instructions');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Check if properly configured
export const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key');

// Types for our database
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  member_since: string;
  dark_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
}

export interface UserWatchlist {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
}

export interface UserReview {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  movie_id: string;
  watched_at: string;
}

export interface MovieCache {
  id: string;
  title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  adult: boolean;
  original_language?: string;
  popularity?: number;
  cached_at: string;
  updated_at: string;
}