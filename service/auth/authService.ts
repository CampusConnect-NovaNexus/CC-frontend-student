import { EXPO_AUTH_API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthResponse {
  message?: string;
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    // Check if response is likely HTML instead of JSON
    const responseText = await response.text();
    if (responseText.trim().startsWith('<')) {
      throw new Error('Server returned HTML instead of JSON. Check server configuration.');
    }
    
    // Parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Login failed');
    }
    
    // Store auth tokens and user info
    await AsyncStorage.setItem('@auth_token', data.accessToken);
    await AsyncStorage.setItem('@refresh_token', data.refreshToken);
    
    // Store user data from response
    if (data.user?.id) {
      await AsyncStorage.setItem('@user_id', data.user.id);
    }
    
    // Store email directly from response or use the input email
    if (data.user?.email) {
      await AsyncStorage.setItem('@user_email', data.user.email);
    } else {
      await AsyncStorage.setItem('@user_email', email);
    }
    
    // Store name if available
    if (data.user?.name) {
      await AsyncStorage.setItem('@user_name', data.user.name);
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  email: string, 
  password: string, 
  name: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    // Check if response is likely HTML instead of JSON
    const responseText = await response.text();
    if (responseText.trim().startsWith('<')) {
      throw new Error('Server returned HTML instead of JSON. Check server configuration.');
    }
    
    // Parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed');
    }
    
    // Store auth tokens and user info
    await AsyncStorage.setItem('@auth_token', data.accessToken);
    await AsyncStorage.setItem('@refresh_token', data.refreshToken);
    
    // Store user data from response
    if (data.user?.id) {
      await AsyncStorage.setItem('@user_id', data.user.id);
    }
    
    // Store email directly from response or use the input email
    if (data.user?.email) {
      await AsyncStorage.setItem('@user_email', data.user.email);
    } else {
      await AsyncStorage.setItem('@user_email', email);
    }
    
    // Store name from response or input
    if (data.user?.name) {
      await AsyncStorage.setItem('@user_name', data.user.name);
    } else {
      await AsyncStorage.setItem('@user_name', name);
    }

    return data;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${EXPO_AUTH_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token }),
    });
    
    // Check if response is likely HTML instead of JSON
    const responseText = await response.text();
    if (responseText.trim().startsWith('<')) {
      throw new Error('Server returned HTML instead of JSON. Check server configuration.');
    }
    
    // Parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Token refresh failed');
    }
    
    // Update stored tokens
    await AsyncStorage.setItem('@auth_token', data.accessToken);
    await AsyncStorage.setItem('@refresh_token', data.refreshToken);

    return data;
  } catch (error: any) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Clear auth-related items from storage
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@refresh_token');
    await AsyncStorage.removeItem('@user_id');
    await AsyncStorage.removeItem('@user_email');
    await AsyncStorage.removeItem('@user_name');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    return !!token;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};