import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        if (token && token.startsWith('demo-token-') && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else if (token) {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (googleCredential) => {
    try {
      setLoading(true);
      const response = await authApi.googleLogin(googleCredential);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password) => {
    setLoading(true);
    // Build a mock user purely on the frontend so the demo works without a backend.
    const roleFromEmail = (email || '').split('@')[0].toUpperCase();
    const role = ['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(roleFromEmail) ? roleFromEmail : 'STUDENT';
    const mockUser = {
      id: `demo-${role.toLowerCase()}`,
      email,
      name: role.charAt(0) + role.slice(1).toLowerCase() + ' User',
      role,
      profilePicture: null,
    };
    const mockResponse = { token: `demo-token-${role.toLowerCase()}`, user: mockUser };

    try {
      // Try real backend first; fall back to mock if unreachable.
      const response = await authApi.demoLogin(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.warn('Backend unreachable, using offline demo login:', error?.message);
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      return mockResponse;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    demoLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
