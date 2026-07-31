import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'RESIDENT' | 'GUARD' | 'ADMIN' | 'STAFF_MANAGER';
  flat_id?: string | null;
  society_id?: string | null;
  flat?: {
    id: string;
    number: string;
    bhk_type: string;
    block: {
      id: string;
      name: string;
    };
  } | null;
  society?: {
    id: string;
    name: string;
    address: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('smart_community_services_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('smart_community_services_user', JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('smart_community_services_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    refreshUser();
  }, [token]);

  const login = async (emailOrPhone: string, pass: string) => {
    try {
      const response = await api.post('/auth/login', { emailOrPhone, password: pass });
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem('smart_community_services_token', newToken);
        localStorage.setItem('smart_community_services_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Invalid credentials';
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (data: { name: string; email: string; phone: string; password?: string }) => {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('smart_community_services_user', JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, error: 'Profile update failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to update profile';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('smart_community_services_token');
    localStorage.removeItem('smart_community_services_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
