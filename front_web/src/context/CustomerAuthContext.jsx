import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CustomerAuthContext = createContext();

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const customerData = localStorage.getItem('customerData');

    if (token && customerData) {
      try {
        const parsedCustomer = JSON.parse(customerData);
        setCustomer(parsedCustomer);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Error parsing customer data:', err);
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerData');
      }
    }
    setLoading(false);
  }, []);

  const customerLogin = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await axios.post('http://127.0.0.1:8000/customer/login/', {
        email,
        password
      });

      if (response.data.success) {
        const { token, customer } = response.data;

        setCustomer(customer);
        setIsAuthenticated(true);

        if (rememberMe) {
          localStorage.setItem('customerToken', token);
          localStorage.setItem('customerData', JSON.stringify(customer));
        } else {
          sessionStorage.setItem('customerToken', token);
          sessionStorage.setItem('customerData', JSON.stringify(customer));
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true, customer };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const customerLoginWithGoogle = async (credential) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://127.0.0.1:8000/auth/google/', {
        credential
      });

      if (response.data.success) {
        const { token, customer } = response.data;

        setCustomer(customer);
        setIsAuthenticated(true);

        localStorage.setItem('customerToken', token);
        localStorage.setItem('customerData', JSON.stringify(customer));

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true, customer };
      } else {
        throw new Error(response.data.error || 'Google login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Google login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const customerLogout = () => {
    setCustomer(null);
    setIsAuthenticated(false);
    setError(null);

    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    sessionStorage.removeItem('customerToken');
    sessionStorage.removeItem('customerData');

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

  const checkCustomerSession = () => {
    const token = localStorage.getItem('customerToken') || sessionStorage.getItem('customerToken');
    if (!token) {
      customerLogout();
      return false;
    }
    return true;
  };

  const updateCustomerPassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
        throw new Error('Password must contain uppercase, lowercase, number, and special character');
      }

      const response = await axios.post('http://127.0.0.1:8000/reset-customer-password/', {
        email: customer.email,
        current_password: currentPassword,
        new_password: newPassword
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
    customer,
    loading,
    error,
    customerLogin,
    customerLoginWithGoogle,
    customerLogout,
    checkCustomerSession,
    updateCustomerPassword,
    setError
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export default CustomerAuthContext;
