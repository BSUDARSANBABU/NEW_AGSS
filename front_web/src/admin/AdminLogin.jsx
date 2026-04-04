import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, ArrowRight, Terminal, Keyboard, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '' });

  const { login, isAuthenticated, error } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onLogin();
    }
  }, [isAuthenticated, onLogin]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, text: '' });
      return;
    }

    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push('8+ characters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('lowercase');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('uppercase');

    if (/\d/.test(password)) score++;
    else feedback.push('number');

    if (/[@$!%*?&]/.test(password)) score++;
    else feedback.push('special');

    const strengthLevels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

    setPasswordStrength({
      score,
      text: strengthLevels[score],
      color: strengthColors[score],
      feedback: score < 5 ? feedback : []
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);

    // Clear password error when user starts typing
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    // Clear username error when user starts typing
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password, rememberMe);
      // Login successful - useEffect will handle redirect
    } catch (err) {
      // Error is handled by AuthContext, no additional action needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans selection:bg-primary/30 selection:text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Hero Content Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      </div>

      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-[#d0bcff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/40 backdrop-blur-xl shadow-[0_0_12px_rgba(59,130,246,0.1)] h-16 flex items-center justify-between px-8">
        <div className="text-xl font-serif tracking-tighter text-blue-400">ARCHITECT_VOID</div>
        <div className="flex items-center gap-6">
          <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium">Security Protocol: Active</span>
          <div className="w-2 h-2 rounded-full bg-[#adc6ff] animate-pulse shadow-[0_0_15px_rgba(173,198,255,0.5)]"></div>
        </div>
      </nav>

      {/* Content Container */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10 space-y-2">
          <h1 className="font-serif text-4xl tracking-tight text-[#e2e2e2]">Initialize Core Access</h1>
          <p className="text-[#c2c6d6] text-[10px] uppercase tracking-[0.3em] opacity-70">Infrastructure Authentication Gateway</p>
        </div>

        <section className="bg-[#353535]/20 backdrop-blur-xl rounded-xl p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock className="w-16 h-16" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-widest text-[#adc6ff] mb-2 ml-1 font-bold">Identity Identifier</label>
                <div className="flex items-center bg-[#0e0e0e]/50 rounded-lg px-4 py-3 border border-[#424754]/30 focus-within:border-[#adc6ff]/50 transition-all duration-300">
                  <Mail className="w-4 h-4 text-[#8c909f] mr-3" />
                  <input
                    className="bg-transparent border-none focus:ring-0 text-[#e2e2e2] w-full placeholder:text-[#8c909f]/50 font-medium text-sm"
                    placeholder="username@void.io"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
                {fieldErrors.username && (
                  <div className="flex items-center mt-1 text-[10px] text-red-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.username}
                  </div>
                )}
              </div>

              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-widest text-[#adc6ff] mb-2 ml-1 font-bold">Encryption Key</label>
                <div className="flex items-center bg-[#0e0e0e]/50 rounded-lg px-4 py-3 border border-[#424754]/30 focus-within:border-[#adc6ff]/50 transition-all duration-300">
                  <Key className="w-4 h-4 text-[#8c909f] mr-3" />
                  <input
                    className="bg-transparent border-none focus:ring-0 text-[#e2e2e2] w-full placeholder:text-[#8c909f]/50 text-sm"
                    placeholder="•••••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-[#8c909f] hover:text-[#adc6ff] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div className="flex items-center mt-1 text-[10px] text-red-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.password}
                  </div>
                )}
                {password && passwordStrength.score > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase tracking-widest" style={{ color: passwordStrength.color }}>
                        {passwordStrength.text}
                      </span>
                      {passwordStrength.score === 5 && (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: level <= passwordStrength.score ? passwordStrength.color : '#424754'
                          }}
                        />
                      ))}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="mt-1 text-[8px] text-[#8c909f]">
                        Add: {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-[#424754]/30 bg-[#0e0e0e]/50 text-[#adc6ff] focus:ring-0 focus:ring-offset-0"
                />
                <span className="ml-2 text-[10px] uppercase tracking-widest text-[#8c909f] group-hover:text-[#adc6ff] transition-colors">
                  Remember Session
                </span>
              </label>
            </div>

            <button
              className="w-full py-4 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-bold rounded-full shadow-[0_0_20px_rgba(173,198,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#002e6a] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Void
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-[#8c909f]">Alternative Protocol</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              className="w-full py-3 bg-[#353535]/20 hover:bg-[#353535]/40 border border-[#424754]/20 backdrop-blur-md text-[#e2e2e2] font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img alt="Google logo" className="w-5 h-5 grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANeVC9a9Gei8Nz6PiA_RjScKhtmq1JeuvQxvi9hund31D1oCs56wVa74_HOGAqOw6srPlAwoKfQqUoKwdWiKmyhC28ZGmPHvFht2jGQ4KDXoga-NprBw_NqZPlPW0StPYpQK6fg9yzlJiROb5eAVsftxhJ9XITZIxPJ_fzGVGNjjRs2Gp7fuO0bAK3ImnnDLZauHAwL7KE7iziLieGgQVEdgLTvFvB0IJ1EnWxhx8CqXggqtCNSX08QjLLXrdVfuSOGW34t50GuSk" />
              <span className="text-[10px] uppercase tracking-wider font-bold">Sign in with Google</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f] hover:text-[#adc6ff] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleForgotPassword}
              disabled={isLoading}
              type="button"
            >
              Recover Access Rights
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center text-red-400">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-[10px]">{error}</span>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-12 grid grid-cols-2 gap-4">
          <div className="bg-[#353535]/20 backdrop-blur-xl rounded-lg p-6 border border-white/5 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-2 font-bold">System Load</span>
            <div className="flex items-end gap-2">
              <div className="w-1 h-3 bg-[#adc6ff]/20 rounded-full"></div>
              <div className="w-1 h-5 bg-[#adc6ff]/40 rounded-full"></div>
              <div className="w-1 h-2 bg-[#adc6ff]/20 rounded-full"></div>
              <div className="w-1 h-4 bg-[#adc6ff]/60 rounded-full"></div>
              <span className="font-serif text-xl text-[#adc6ff] leading-none">0.02ms</span>
            </div>
          </div>

          <div className="bg-[#353535]/20 backdrop-blur-xl rounded-lg p-6 border border-dashed border-[#adc6ff]/20 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-4 h-4 text-[#adc6ff]" />
              <span className="text-[10px] uppercase tracking-widest text-[#8c909f] font-bold">Legacy Sequence</span>
            </div>
            <div className="flex gap-1 opacity-40 grayscale group hover:grayscale-0 transition-all">
              <ArrowRight className="w-3 h-3 -rotate-90" />
              <ArrowRight className="w-3 h-3 -rotate-90" />
              <ArrowRight className="w-3 h-3 rotate-90" />
              <ArrowRight className="w-3 h-3 rotate-90" />
              <span className="text-[8px] flex items-center font-bold tracking-tighter">...</span>
            </div>
          </div>
        </footer>

        <div className="mt-12 flex justify-between items-center px-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/50">© 2024 ARCHITECT_VOID SYSTEMS</span>
          <div className="flex gap-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/50 cursor-pointer hover:text-[#8c909f] transition-colors">v4.0.2-alpha</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/50 cursor-pointer hover:text-[#8c909f] transition-colors">Privacy</span>
          </div>
        </div>
      </motion.main>

      <div className="fixed bottom-0 right-0 p-12 pointer-events-none select-none opacity-5">
        <h2 className="font-serif text-[12vw] leading-none tracking-tighter">VOID</h2>
      </div>
    </div>
  );
};

export default Login;
