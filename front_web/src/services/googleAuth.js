import { GOOGLE_OAUTH, CUSTOMER_API } from '../config/api';

// Google OAuth Helper Functions
export const googleAuthHelpers = {
  // Generate Google OAuth URL
  getGoogleAuthUrl: (redirectUri = null) => {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH.CLIENT_ID,
      redirect_uri: redirectUri || window.location.origin + '/auth/google/callback',
      response_type: 'code',
      scope: GOOGLE_OAUTH.SCOPE,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${GOOGLE_OAUTH.AUTH_URL}?${params.toString()}`;
  },

  // Initiate Google OAuth flow
  initiateGoogleAuth: (redirectUri = null) => {
    const authUrl = googleAuthHelpers.getGoogleAuthUrl(redirectUri);
    window.location.href = authUrl;
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (code) => {
    try {
      const response = await fetch(CUSTOMER_API.GOOGLE_CALLBACK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          customer: data.customer,
          token: data.token,
        };
      } else {
        throw new Error(data.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      return {
        success: false,
        error: error.message || 'Google authentication failed',
      };
    }
  },

  // Check if user is coming from Google OAuth callback
  isGoogleCallback: () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && urlParams.has('state');
  },

  // Extract authorization code from URL
  getAuthCode: () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  },

  // Clean up URL parameters after callback
  cleanupCallbackUrl: () => {
    const url = new URL(window.location);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url.toString());
  },
};

// Google Sign-In Singleton Manager with React Strict Mode protection
class GoogleSignInManager {
  constructor() {
    this.isInitialized = false;
    this.currentClientId = null;
    this.initPromise = null;
    this.isInitializing = false;
    this.lastInitTime = 0;
    this.initTimeout = null;
  }

  async initialize(clientId, callback) {
    // Prevent rapid successive calls (React Strict Mode double execution)
    const now = Date.now();
    if (now - this.lastInitTime < 100) {
      console.log('Ignoring rapid successive initialization (React Strict Mode)');
      return window.google;
    }
    this.lastInitTime = now;

    // If already initialized with the same client ID, return existing instance
    if (this.isInitialized && this.currentClientId === clientId && window.google) {
      return window.google;
    }

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      try {
        await this.initPromise;
        if (this.currentClientId === clientId && window.google) {
          return window.google;
        }
      } catch (e) {
        // If previous init failed, continue with new init
      }
    }

    // Prevent multiple simultaneous initializations
    if (this.isInitializing) {
      return this.initPromise;
    }

    // Start new initialization
    this.initPromise = this._doInitialize(clientId, callback);
    return this.initPromise;
  }

  async _doInitialize(clientId, callback) {
    this.isInitializing = true;

    try {
      // Clear any existing timeout
      if (this.initTimeout) {
        clearTimeout(this.initTimeout);
      }

      // Load Google script if not already loaded
      if (!window.google) {
        await this._loadGoogleScript();
      }

      // Wait a bit to ensure any previous initialization is fully complete
      await new Promise(resolve => setTimeout(resolve, 50));

      // Check if Google API is available
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        throw new Error('Google Sign-In API not available');
      }

      // Cancel any existing initialization safely
      try {
        if (window.google.accounts.id) {
          window.google.accounts.id.cancel();
        }
      } catch (e) {
        // Ignore cancellation errors
      }

      // Wait a bit more before re-initializing
      await new Promise(resolve => setTimeout(resolve, 50));

      // Initialize with new client ID
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      this.isInitialized = true;
      this.currentClientId = clientId;

      return window.google;
    } catch (error) {
      this.isInitialized = false;
      this.currentClientId = null;
      throw error;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  _loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existingScript) {
        // Wait for existing script to load
        const checkLoaded = () => {
          if (window.google) {
            resolve(window.google);
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Wait a bit for the Google API to be fully ready
        setTimeout(() => resolve(window.google), 100);
      };

      script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));

      document.head.appendChild(script);
    });
  }

  reset() {
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
    }

    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.cancel();
      } catch (e) {
        // Ignore cancellation errors
      }
    }

    this.isInitialized = false;
    this.currentClientId = null;
    this.initPromise = null;
    this.isInitializing = false;
    this.lastInitTime = 0;
  }
}

// Global singleton instance
const googleSignInManager = new GoogleSignInManager();

// Initialize Google Sign-In using the singleton manager
export const initializeGoogleSignIn = async (clientId, callback) => {
  try {
    const google = await googleSignInManager.initialize(clientId, callback);
    return google;
  } catch (error) {
    console.error('Failed to initialize Google Sign-In:', error);
    throw error;
  }
};

// Render Google Sign-In button
export const renderGoogleButton = (google, elementId, options = {}) => {
  const defaultOptions = {
    theme: 'filled_blue',
    size: 'large',
    text: 'signin_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    width: 320,
  };

  const buttonOptions = { ...defaultOptions, ...options };

  google.accounts.id.renderButton(
    document.getElementById(elementId),
    buttonOptions
  );
};

// Handle Google Sign-In success
export const handleGoogleSignInSuccess = async (response) => {
  try {
    const backendResponse = await fetch(CUSTOMER_API.GOOGLE_AUTH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: response.credential,
      }),
    });

    const data = await backendResponse.json();

    if (data.success) {
      return {
        success: true,
        customer: data.customer,
        token: data.token,
      };
    } else {
      throw new Error(data.error || 'Google authentication failed');
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error.message || 'Google authentication failed',
    };
  }
};

// Handle Google Sign-In error
export const handleGoogleSignInError = (error) => {
  console.error('Google Sign-In error:', error);
  return {
    success: false,
    error: 'Google sign-in was cancelled or failed',
  };
};

// Cleanup Google Sign-In instance using the singleton manager
export const cleanupGoogleSignIn = () => {
  googleSignInManager.reset();
};
