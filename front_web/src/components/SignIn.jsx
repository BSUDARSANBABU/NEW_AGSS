import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Chrome } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ForgotPassword } from './ForgotPassword';
import { Header } from './Header';
import { initializeGoogleSignIn, renderGoogleButton, handleGoogleSignInSuccess, handleGoogleSignInError, cleanupGoogleSignIn } from '../services/googleAuth';
import { GOOGLE_OAUTH } from '../config/api';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);

  const { customerLogin, loading, error } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect state from navigation
  const redirectState = location.state || {};
  const { message, returnUrl, action } = redirectState;

  // Refs to prevent multiple initializations
  const googleInitializedRef = useRef(false);
  const clientIdRef = useRef(null);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!showForgotPassword &&
      GOOGLE_OAUTH.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' &&
      !googleInitializedRef.current &&
      clientIdRef.current !== GOOGLE_OAUTH.CLIENT_ID) {

      const initGoogleSignIn = async () => {
        try {
          googleInitializedRef.current = true;
          clientIdRef.current = GOOGLE_OAUTH.CLIENT_ID;

          const google = await initializeGoogleSignIn(
            GOOGLE_OAUTH.CLIENT_ID,
            async (response) => {
              setGoogleLoading(true);
              setGoogleError(null);

              try {
                const result = await handleGoogleSignInSuccess(response);

                if (result.success) {
                  // Store token and customer data
                  localStorage.setItem('customerToken', result.token);
                  localStorage.setItem('customerData', JSON.stringify(result.customer));

                  navigate(returnUrl || '/projects');
                } else {
                  setGoogleError(result.error);
                }
              } catch (error) {
                setGoogleError('Google sign-in failed');
              } finally {
                setGoogleLoading(false);
              }
            }
          );

          // Render Google Sign-In button
          setTimeout(() => {
            const googleButtonElement = document.getElementById('google-signin-button');
            if (googleButtonElement) {
              renderGoogleButton(google, 'google-signin-button', {
                theme: 'filled_blue',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 320,
              });
            }
          }, 100);
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
          googleInitializedRef.current = false;
          clientIdRef.current = null;
        }
      };

      initGoogleSignIn();

      // Cleanup function
      return () => {
        googleInitializedRef.current = false;
        clientIdRef.current = null;
        cleanupGoogleSignIn();
      };
    }
  }, [showForgotPassword, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await customerLogin(email, password, rememberMe);
      navigate(returnUrl || '/projects');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <>
      {showForgotPassword ? (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      ) : (
        <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans selection:bg-primary/30 selection:text-primary">
          {/* Header */}
          <Header
            showProfile={false}
            onLoginClick={() => { }}
          />

          <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
            </div>

            <div className="fixed top-1/4 -left-20 w-64 h-64 bg-[#d0bcff]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md z-10"
            >
              <div className="text-center mb-8 space-y-2">
                <h1 className="font-serif text-3xl tracking-tight text-[#e2e2e2]">Welcome Back</h1>
                <p className="text-[#c2c6d6] text-sm">
                  {message || 'Sign in to your account'}
                </p>
              </div>

              {/* Authentication requirement message */}
              {message && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-blue-300 text-sm">{message}</p>
                </div>
              )}

              <div className="bg-[#353535]/20 backdrop-blur-xl rounded-xl p-8 border border-white/5 shadow-2xl">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {googleError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{googleError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#adc6ff] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                        placeholder="Enter your email"
                        required
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#adc6ff] mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                        placeholder="Enter your password"
                        required
                        disabled={loading || googleLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c909f] hover:text-[#adc6ff] transition-colors"
                        disabled={loading || googleLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 bg-[#0e0e0e]/50 border-[#424754]/30 rounded text-[#adc6ff] focus:ring-[#adc6ff]"
                        disabled={loading || googleLoading}
                      />
                      <span className="ml-2 text-sm text-[#c2c6d6]">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#adc6ff] hover:text-[#adc6ff]/80 transition-colors"
                      disabled={loading || googleLoading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Google Sign-In Button */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#424754]/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#353535]/20 text-[#8c909f]">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    {GOOGLE_OAUTH.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' ? (
                      <div className="flex justify-center">
                        <div id="google-signin-button"></div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={loading || googleLoading}
                        className="w-full py-3 bg-[#4285f4] text-white font-medium rounded-lg hover:bg-[#357ae8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        onClick={() => {
                          setGoogleError('Google OAuth is not configured. Please set up your Google Client ID.');
                        }}
                      >
                        <Chrome className="w-5 h-5" />
                        Sign in with Google
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[#c2c6d6]">
                    Don't have an account? <button onClick={() => navigate('/signup', { state: redirectState })} className="text-[#adc6ff] hover:text-[#adc6ff]/80 transition-colors underline bg-transparent border-none cursor-pointer">Sign up</button>
                  </p>
                </div>
              </div>
            </motion.main>
          </div>
        </div>
      )}
    </>
  );
};

export { SignIn };
