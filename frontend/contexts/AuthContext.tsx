import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile, isConfigured } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isGuest: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  addToFavorites: (movieId: string) => Promise<{ success: boolean; error?: string }>;
  removeFromFavorites: (movieId: string) => Promise<{ success: boolean; error?: string }>;
  getFavorites: () => Promise<string[]>;
  toggleDarkMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, use demo mode
    if (!isConfigured) {
      loadDemoData();
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadDemoData = async () => {
    try {
      const demoProfile = await AsyncStorage.getItem('demoProfile');
      const guestMode = await AsyncStorage.getItem('isGuest');
      
      if (demoProfile) {
        const profile = JSON.parse(demoProfile);
        setProfile(profile);
        setUser({ id: profile.id, email: profile.email } as User);
      } else if (guestMode === 'true') {
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Error loading demo data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Demo mode fallback if Supabase not configured
    if (!isConfigured) {
      const demoProfile: Profile = {
        id: Date.now().toString(),
        email: email,
        name: name,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B6B&color=fff&size=150`,
        member_since: new Date().toISOString(),
        dark_mode: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProfile(demoProfile);
      setUser({ id: demoProfile.id, email: demoProfile.email } as User);
      await AsyncStorage.setItem('demoProfile', JSON.stringify(demoProfile));
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B6B&color=fff&size=150`
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: name,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B6B&color=fff&size=150`,
            member_since: new Date().toISOString(),
            dark_mode: true
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Demo mode fallback if Supabase not configured
    if (!isConfigured) {
      if (email === 'demo@cinemamax.com' && password === 'password') {
        const demoProfile: Profile = {
          id: '1',
          email: 'demo@cinemamax.com',
          name: 'Demo User',
          avatar_url: 'https://ui-avatars.com/api/?name=Demo%20User&background=FF6B6B&color=fff&size=150',
          member_since: new Date().toISOString(),
          dark_mode: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setProfile(demoProfile);
        setUser({ id: demoProfile.id, email: demoProfile.email } as User);
        await AsyncStorage.setItem('demoProfile', JSON.stringify(demoProfile));
        return { success: true };
      } else {
        return { success: false, error: 'Demo credentials: demo@cinemamax.com / password' };
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      setIsGuest(false);
      
      if (!isConfigured) {
        setUser(null);
        setProfile(null);
        await AsyncStorage.removeItem('demoProfile');
        await AsyncStorage.removeItem('isGuest');
        return;
      }
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const continueAsGuest = async () => {
    setIsGuest(true);
    setUser(null);
    setProfile(null);
    setSession(null);
    await AsyncStorage.setItem('isGuest', 'true');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local profile state
      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const addToFavorites = async (movieId: string) => {
    if (!user) {
      return { success: false, error: 'Please sign in to add favorites' };
    }

    // Demo mode - use AsyncStorage
    if (!isConfigured) {
      try {
        const favorites = await AsyncStorage.getItem('demoFavorites');
        const currentFavorites = favorites ? JSON.parse(favorites) : [];
        if (!currentFavorites.includes(movieId)) {
          currentFavorites.push(movieId);
          await AsyncStorage.setItem('demoFavorites', JSON.stringify(currentFavorites));
        }
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to add favorite' };
      }
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          movie_id: movieId
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const removeFromFavorites = async (movieId: string) => {
    if (!user) {
      return { success: false, error: 'Please sign in to manage favorites' };
    }

    // Demo mode - use AsyncStorage
    if (!isConfigured) {
      try {
        const favorites = await AsyncStorage.getItem('demoFavorites');
        const currentFavorites = favorites ? JSON.parse(favorites) : [];
        const updatedFavorites = currentFavorites.filter((id: string) => id !== movieId);
        await AsyncStorage.setItem('demoFavorites', JSON.stringify(updatedFavorites));
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to remove favorite' };
      }
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const getFavorites = async (): Promise<string[]> => {
    if (!user) {
      return [];
    }

    // Demo mode - use AsyncStorage
    if (!isConfigured) {
      try {
        const favorites = await AsyncStorage.getItem('demoFavorites');
        return favorites ? JSON.parse(favorites) : [];
      } catch (error) {
        console.error('Error fetching demo favorites:', error);
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('movie_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }

      return data.map(fav => fav.movie_id);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  };

  const toggleDarkMode = async () => {
    if (!profile) return;

    const newDarkMode = !profile.dark_mode;
    await updateProfile({ dark_mode: newDarkMode });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isGuest,
        isLoading,
        signUp,
        signIn,
        signOut,
        continueAsGuest,
        updateProfile,
        addToFavorites,
        removeFromFavorites,
        getFavorites,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};