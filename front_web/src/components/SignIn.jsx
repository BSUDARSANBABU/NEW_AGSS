import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignIn = ({ onToggleSignUp, onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sign in attempt:', formData);
      // Handle successful sign in here
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-6 py-20" style={{
        backgroundImage: 'linear-gradient(#eeeeee 1px, transparent 1px), linear-gradient(90deg, #eeeeee 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}>
        {/* Background Accents */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#a2effd] opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[#cde7ed] opacity-30 blur-[100px] rounded-full"></div>

        {/* Central Identity and Login Card */}
        <div className="w-full max-w-[480px] z-10">
          {/* Branding Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-8 h-8 bg-[#00606b] rounded-full flex items-center justify-center">
                <span className="text-white text-sm" style={{ fontFamily: 'Material Symbols Outlined' }}>architecture</span>
              </div>
              <span className="font-bold text-2xl tracking-tighter text-on-surface" style={{ fontFamily: 'Plus Jakarta Sans' }}>DEVFORGE</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>System Access</h1>
            <p className="text-[#3e494b] text-sm tracking-wide uppercase" style={{ fontFamily: 'Plus Jakarta Sans' }}>Architectural Operating System v4.0.2</p>
          </div>

          {/* Main Auth Card */}
          <div className="bg-white/70 backdrop-blur-[20px] rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] border border-[#bdc8cb]/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#3e494b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Identity Identifier</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e797b]" style={{ fontFamily: 'Material Symbols Outlined' }}>alternate_email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#bdc8cb]/20 focus:border-[#00606b] focus:ring-2 focus:ring-[#85d2e0]/30 rounded-lg transition-all outline-none text-sm"
                    placeholder="email@architect.os"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#3e494b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Security Protocol</label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs font-semibold text-[#00606b] hover:underline transition-all"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e797b]" style={{ fontFamily: 'Material Symbols Outlined' }}>lock</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#bdc8cb]/20 focus:border-[#00606b] focus:ring-2 focus:ring-[#85d2e0]/30 rounded-lg transition-all outline-none text-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#00606b] text-white font-bold rounded-full hover:bg-[#247985] transition-all shadow-lg shadow-[#00606b]/10 flex items-center justify-center gap-2 group"
                >
                  <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  <span className="text-sm group-hover:translate-x-1 transition-transform" style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
                </button>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-[#bdc8cb]/30"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-[#6e797b] uppercase tracking-tighter" style={{ fontFamily: 'Plus Jakarta Sans' }}>Authorized Third Party</span>
                  <div className="flex-grow border-t border-[#bdc8cb]/30"></div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 bg-[#e8e8e8] text-[#1a1c1c] font-semibold rounded-full hover:bg-[#dadada] transition-all flex items-center justify-center gap-3 border border-[#bdc8cb]/10"
                >
                  <img
                    alt="Google logo"
                    className="w-5 h-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuhtHjb5HiWp_30QwFve7cqxJ_WN0qG7cCvCt87Df6OM5AY5bqdB8_LGFPnAevfKTemmPCB-LtssM1xd3Sr13z4NQKBCTWRI-GvRm4rM4HnJue4tlN7MXWsld5jzq2KfGToM4OeIIj4iadJuCC8rHpr3ua5NZAewud6iqTm9yjrI374_Dg_RgYJLyz1n6TWAztf83BHdJ5f5eBGWFhfZs6qZDGQTT4PiWi-qP4f33QdWWXiZlC7V16iRLHDRFENKMYNefRZ8t_kcg"
                  />
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-10 text-center">
              <p className="text-sm text-[#3e494b]">
                New terminal?
                <button
                  onClick={() => navigate('/signup')}
                  className="text-[#00606b] font-bold hover:underline ml-1"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>

          {/* Technical Detail Metadata */}
          <div className="mt-8 flex justify-between items-center px-4 opacity-40">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>Region</span>
              <span className="font-bold text-xs" style={{ fontFamily: 'Plus Jakarta Sans' }}>US-EAST-01</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>Status</span>
              <div className="flex items-center gap-2 justify-end">
                <span className="w-1.5 h-1.5 bg-[#00606b] rounded-full"></span>
                <span className="font-bold text-xs" style={{ fontFamily: 'Plus Jakarta Sans' }}>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto border-t border-[#bdc8cb]/20 bg-[#f9f9f9]">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 max-w-[1440px] mx-auto gap-4">
          <div className="text-xs uppercase tracking-widest text-[#3e494b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            © 2024 Clinical Architect Industries. All rights reserved.
          </div>
          <div className="flex gap-8">
            <a className="text-xs uppercase tracking-widest text-[#3e494b] hover:text-[#00606b] transition-all" style={{ fontFamily: 'Plus Jakarta Sans' }} href="#">Privacy Policy</a>
            <a className="text-xs uppercase tracking-widest text-[#3e494b] hover:text-[#00606b] transition-all" style={{ fontFamily: 'Plus Jakarta Sans' }} href="#">Terms of Service</a>
            <a className="text-xs uppercase tracking-widest text-[#3e494b] hover:text-[#00606b] transition-all" style={{ fontFamily: 'Plus Jakarta Sans' }} href="#">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
