import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, logout, isAuthenticated } from '../service/auth/authService';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await isAuthenticated();
        if (isLoggedIn) {
          const userId = await AsyncStorage.getItem('@user_id');
          const email = await AsyncStorage.getItem('@user_email');
          const name = await AsyncStorage.getItem('@user_name');
          
          if (userId && email) {
            setUser({
              id: userId,
              email: email,
              name: name || undefined
            });
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await login(email, password);
      
      // Extract user info from response or token
      const userData = response.user || { 
        id: await AsyncStorage.getItem('@user_id') || '',
        email: email 
      };
      
      // Store user email and name
      await AsyncStorage.setItem('@user_email', email);
      if (userData.name) {
        await AsyncStorage.setItem('@user_name', userData.name);
      }
      
      setUser(userData);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await register(email, password, name);
      
      // Extract user info from response or token
      const userData = response.user || { 
        id: await AsyncStorage.getItem('@user_id') || '',
        email: email,
        name: name
      };
      
      // Store user email and name
      await AsyncStorage.setItem('@user_email', email);
      await AsyncStorage.setItem('@user_name', name);
      
      setUser(userData);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      router.replace('/login');
    } catch (err: any) {
      setError(err.message || 'Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};