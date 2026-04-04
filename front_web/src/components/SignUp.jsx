import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Shield, Smartphone, Chrome } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CUSTOMER_API } from '../config/api';
import { initializeGoogleSignIn, renderGoogleButton, handleGoogleSignInSuccess, handleGoogleSignInError, cleanupGoogleSignIn } from '../services/googleAuth';
import { GOOGLE_OAUTH } from '../config/api';
import { Header } from './Header';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);

  const { customerLogin } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect state from navigation
  const redirectState = location.state || {};
  const { message, returnUrl, action, formData: redirectFormData } = redirectState;

  // Pre-fill form data if coming from demo request
  useEffect(() => {
    if (action === 'request_demo' && redirectFormData) {
      setFormData(prev => ({
        ...prev,
        name: redirectFormData.name || prev.name,
        email: redirectFormData.email || prev.email,
        phone: redirectFormData.phone || prev.phone
      }));
    }
  }, [action, redirectFormData]); // Remove setFormData from dependencies to prevent infinite loop

  // Refs to prevent multiple initializations
  const googleInitializedRef = useRef(false);
  const clientIdRef = useRef(null);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!showOtpVerification &&
      GOOGLE_OAUTH.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' &&
      !googleInitializedRef.current &&
      clientIdRef.current !== GOOGLE_OAUTH.CLIENT_ID) {

      const initGoogleSignUp = async () => {
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

                  setSuccess('Account created successfully with Google! Redirecting...');
                  setTimeout(() => {
                    navigate(returnUrl || '/projects');
                  }, 1500);
                } else {
                  setGoogleError(result.error);
                }
              } catch (error) {
                setGoogleError('Google sign-up failed');
              } finally {
                setGoogleLoading(false);
              }
            }
          );

          // Render Google Sign-Up button
          setTimeout(() => {
            const googleButtonElement = document.getElementById('google-signup-button');
            if (googleButtonElement) {
              renderGoogleButton(google, 'google-signup-button', {
                theme: 'filled_blue',
                size: 'large',
                text: 'signup_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 320,
              });
            }
          }, 100);
        } catch (error) {
          console.error('Failed to initialize Google Sign-Up:', error);
          googleInitializedRef.current = false;
          clientIdRef.current = null;
        }
      };

      initGoogleSignUp();

      // Cleanup function
      return () => {
        googleInitializedRef.current = false;
        clientIdRef.current = null;
        cleanupGoogleSignIn();
      };
    }
  }, [showOtpVerification, navigate]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[@$!%*?&]/.test(password)) strength += 12.5;

    return Math.min(strength, 100);
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Sending OTP to:', formData.email);
      console.log('OTP endpoint:', CUSTOMER_API.SEND_OTP);

      const response = await axios.post(CUSTOMER_API.SEND_OTP, {
        email: formData.email
      });

      console.log('OTP Response:', response.data);

      if (response.data.success) {
        setOtpSent(true);
        setShowOtpVerification(true);
        setSuccess('OTP sent to your email. Please check your inbox.');
      } else {
        throw new Error(response.data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('OTP Send Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      const errorMessage = err.response?.data?.error || err.message || 'Failed to send OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(CUSTOMER_API.VERIFY_OTP, {
        email: formData.email,
        otp: otp
      });

      if (response.data.success) {
        setIsEmailVerified(true);
        setShowOtpVerification(false);
        setSuccess('Email verified successfully! You can now complete your registration.');
      } else {
        throw new Error(response.data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setError('Please verify your email first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Submitting registration with:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: '***' // Don't log actual password
      });
      console.log('Registration endpoint:', CUSTOMER_API.REGISTER);

      const response = await axios.post(CUSTOMER_API.REGISTER, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      console.log('Registration Response:', response.data);

      if (response.data.success) {
        setSuccess('Registration successful! Logging you in...');

        // Auto login after successful registration
        setTimeout(async () => {
          try {
            await customerLogin(formData.email, formData.password, true);
            navigate(returnUrl || '/projects');
          } catch (loginErr) {
            setError('Registration successful but login failed. Please try signing in manually.');
          }
        }, 1500);
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error response stringified:', JSON.stringify(err.response?.data));

      let errorMessage = 'Registration failed';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <h1 className="font-serif text-3xl tracking-tight text-[#e2e2e2]">Create Account</h1>
            <p className="text-[#c2c6d6] text-sm">
              {message || 'Join our community today'}
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

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            {/* OTP Verification Modal */}
            {showOtpVerification && (
              <div className="mb-6 p-6 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-[#adc6ff]" />
                  <h3 className="text-lg font-medium text-[#e2e2e2]">Email Verification</h3>
                </div>
                <p className="text-sm text-[#c2c6d6] mb-4">
                  Enter the 6-digit OTP sent to {formData.email}
                </p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1 px-4 py-3 bg-[#131313]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] text-center text-lg font-mono focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                    placeholder="000000"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 py-2 bg-[#adc6ff] text-[#002e6a] font-medium rounded-lg hover:bg-[#adc6ff]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Verify
                  </button>
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="px-4 py-2 bg-[#424754]/30 text-[#e2e2e2] font-medium rounded-lg hover:bg-[#424754]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#adc6ff] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#adc6ff] mb-2">
                  Email Address
                  {isEmailVerified && (
                    <CheckCircle className="inline-block w-4 h-4 text-green-400 ml-2" />
                  )}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-20 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                    disabled={loading || isEmailVerified}
                  />
                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={loading || !formData.email}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#adc6ff] text-[#002e6a] text-xs font-medium rounded hover:bg-[#adc6ff]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#adc6ff] mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#adc6ff] mb-2">
                  Password
                  <span className="text-xs text-[#8c909f] ml-2">
                    ({passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'})
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                    placeholder="Create a password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c909f] hover:text-[#adc6ff] transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-3 h-3 text-[#8c909f]" />
                      <div className="flex-1 h-2 bg-[#424754]/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength < 50 ? 'bg-red-500' : passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#8c909f]">{passwordStrength}%</span>
                    </div>
                    <p className="text-xs text-[#8c909f]">
                      Use 8+ characters with uppercase, lowercase, numbers, and symbols
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#adc6ff] mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c909f]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-[#0e0e0e]/50 border border-[#424754]/30 rounded-lg text-[#e2e2e2] placeholder:text-[#8c909f]/50 focus:outline-none focus:border-[#adc6ff]/50 transition-all duration-300"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c909f] hover:text-[#adc6ff] transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-[#0e0e0e]/50 border-[#424754]/30 rounded text-[#adc6ff] focus:ring-[#adc6ff]"
                  required
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-[#c2c6d6]">
                  I agree to the <a href="#" className="text-[#adc6ff] hover:text-[#adc6ff]/80 transition-colors">Terms of Service</a> and <a href="#" className="text-[#adc6ff] hover:text-[#adc6ff]/80 transition-colors">Privacy Policy</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !isEmailVerified || googleLoading}
                className="w-full py-3 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google Sign-Up Button */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#424754]/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#353535]/20 text-[#8c909f]">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6">
                {GOOGLE_OAUTH.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' ? (
                  <div className="flex justify-center">
                    <div id="google-signup-button"></div>
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
                    Sign up with Google
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#c2c6d6]">
                Already have an account? <button onClick={() => navigate('/signin', { state: redirectState })} className="text-[#adc6ff] hover:text-[#adc6ff]/80 transition-colors underline bg-transparent border-none cursor-pointer">Sign in</button>
              </p>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export { SignUp };
