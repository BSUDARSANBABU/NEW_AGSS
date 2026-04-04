import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - adjust based on your Django backend
  const API_BASE_URL = 'http://localhost:8000/api/core';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Set axios default header for authenticated requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Password strength validation
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // For testing, use mock authentication if backend is not available
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/login/`, {
          username,
          password
        });

        if (response.data.success) {
          const { token, user } = response.data;

          setUser(user);
          setIsAuthenticated(true);

          if (rememberMe) {
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));
          } else {
            sessionStorage.setItem('adminToken', token);
            sessionStorage.setItem('adminUser', JSON.stringify(user));
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          return { success: true, user };
        } else {
          throw new Error(response.data.error || 'Login failed');
        }
      } catch (backendError) {
        // Fallback to mock authentication for testing
        console.log('Backend not available, using mock authentication');

        if (username === 'admin' && password === 'password') {
          const mockUser = {
            id: 1,
            username: username,
            email: 'admin@void.io',
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'manage_users']
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          setUser(mockUser);
          setIsAuthenticated(true);

          if (rememberMe) {
            localStorage.setItem('adminToken', mockToken);
            localStorage.setItem('adminUser', JSON.stringify(mockUser));
          } else {
            sessionStorage.setItem('adminToken', mockToken);
            sessionStorage.setItem('adminUser', JSON.stringify(mockUser));
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

          return { success: true, user: mockUser };
        } else {
          throw new Error('Invalid credentials');
        }
      }

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Clear storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');

    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];

    // Prevent back navigation by manipulating history
    window.history.replaceState(null, '', '/');
    window.history.pushState(null, '', '/');

    // Add popstate listener to prevent back navigation
    const preventBack = () => {
      window.history.pushState(null, '', '/');
    };
    window.addEventListener('popstate', preventBack);

    // Clean up after 5 seconds
    setTimeout(() => {
      window.removeEventListener('popstate', preventBack);
    }, 5000);
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${API_BASE_URL}/admin/refresh-token/`, {
        token
      });

      if (response.data.success) {
        const newToken = response.data.token;
        const storage = localStorage.getItem('adminToken') ? localStorage : sessionStorage;

        storage.setItem('adminToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        return newToken;
      } else {
        throw new Error(response.data.error || 'Token refresh failed');
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      throw err;
    }
  };

  const checkSession = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      logout();
      return false;
    }

    // Mock session validation - replace with actual API call
    // In production, you'd validate the token with the backend
    return true;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      // Password strength validation
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
        throw new Error('Password must contain uppercase, lowercase, number, and special character');
      }

      const response = await axios.put(`${API_BASE_URL}/admin/change-password/`, {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.error || 'Password update failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Password update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    checkSession,
    updatePassword,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
