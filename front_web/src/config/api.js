// API Configuration for DevHub Application
export const API_BASE_URL = 'http://127.0.0.1:8000';

// Google OAuth Configuration
export const GOOGLE_OAUTH = {
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE', // 👈 REPLACE THIS with your actual Google Client ID from Google Cloud Console
  REDIRECT_URI: `${API_BASE_URL}/auth/google/callback/`,
  SCOPE: 'email profile',
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
};

// Customer Authentication Endpoints
export const CUSTOMER_API = {
  LOGIN: `${API_BASE_URL}/customer/login/`,
  REGISTER: `${API_BASE_URL}/customer/register/`,
  SEND_OTP: `${API_BASE_URL}/send-otp/`,
  VERIFY_OTP: `${API_BASE_URL}/verify-otp/`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-customer-password/`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google/`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/auth/google/callback/`,
};

// Admin Authentication Endpoints
export const ADMIN_API = {
  LOGIN: `${API_BASE_URL}/admin/login/`,
  REFRESH_TOKEN: `${API_BASE_URL}/admin/refresh-token/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/admin/change-password/`,
  LOGOUT: `${API_BASE_URL}/admin/logout/`,
};

// Core API Endpoints
export const CORE_API = {
  DEVELOPERS: `${API_BASE_URL}/api/core/developers/`,
  PROJECTS: `${API_BASE_URL}/api/core/projects/`,
  RESOURCES: `${API_BASE_URL}/api/core/resources/`,
  JOBS: `${API_BASE_URL}/api/core/jobs/`,
  JOB_APPLICATIONS: `${API_BASE_URL}/api/core/job-applications/`,
  DEMO_BOOKINGS: `${API_BASE_URL}/api/core/demo-bookings/`,
  CLIENTS: `${API_BASE_URL}/api/core/clients/`,
  PERFORMANCE_REVIEWS: `${API_BASE_URL}/api/core/performance-reviews/`,
  DOCUMENTATION: `${API_BASE_URL}/api/core/documentation/`,
  SITE_SETTINGS: `${API_BASE_URL}/api/core/site-settings/`,
  FOOTER: `${API_BASE_URL}/api/core/footer/`,
};

// Axios instance with default configuration
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customerToken') ||
      sessionStorage.getItem('customerToken') ||
      localStorage.getItem('adminToken') ||
      sessionStorage.getItem('adminToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerData');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('customerToken');
      sessionStorage.removeItem('customerData');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');

      // Redirect to login page
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
