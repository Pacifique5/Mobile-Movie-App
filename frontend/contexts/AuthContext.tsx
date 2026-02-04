import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  watchedMovies: number;
  favorites: string[];
  downloads: string[];
  watchHistory: string[];
  darkMode: boolean;
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
  updateUser: (updates: Partial<User>) => void;
  addToFavorites: (movieId: string) => void;
  removeFromFavorites: (movieId: string) => void;
  toggleDarkMode: () => void;
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
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const guestMode = await AsyncStorage.getItem('isGuest');
      
      if (userData) {
        setUser(JSON.parse(userData));
      } else if (guestMode === 'true') {
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo authentication
    if (email === 'demo@cinemamax.com' && password === 'password') {
      const userData: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@cinemamax.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        memberSince: 'January 2024',
        watchedMovies: 127,
        favorites: ['1', '2'],
        downloads: ['1'],
        watchHistory: ['1', '2', '3'],
        darkMode: true
      };
      
      setUser(userData);
      setIsGuest(false);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.removeItem('isGuest');
      return true;
    }
    return false;
  };

  const signup = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };
      
      setUser(newUser);
      setIsGuest(false);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.removeItem('isGuest');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear all state
      setUser(null);
      setIsGuest(false);
      
      // Clear storage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isGuest');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const continueAsGuest = async () => {
    setIsGuest(true);
    setUser(null);
    await AsyncStorage.setItem('isGuest', 'true');
    await AsyncStorage.removeItem('user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const addToFavorites = async (movieId: string) => {
    if (user && !user.favorites.includes(movieId)) {
      const updatedFavorites = [...user.favorites, movieId];
      await updateUser({ favorites: updatedFavorites });
    }
  };

  const removeFromFavorites = async (movieId: string) => {
    if (user) {
      const updatedFavorites = user.favorites.filter(id => id !== movieId);
      await updateUser({ favorites: updatedFavorites });
    }
  };

  const toggleDarkMode = async () => {
    if (user) {
      await updateUser({ darkMode: !user.darkMode });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoading,
        login,
        signup,
        logout,
        continueAsGuest,
        updateUser,
        addToFavorites,
        removeFromFavorites,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};