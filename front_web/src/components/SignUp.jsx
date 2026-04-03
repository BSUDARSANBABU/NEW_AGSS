import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUp = ({ onToggleSignIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sign up attempt:', formData);
      // Handle successful sign up here
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden" style={{
        background: 'radial-gradient(circle at 100% 0%, #a2effd 0%, transparent 40%), radial-gradient(circle at 0% 100%, #eeeeee 0%, transparent 40%)'
      }}>
        {/* Abstract Architectural Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 border-[0.5px] border-[#bdc8cb]/20 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 border-[0.5px] border-[#bdc8cb]/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-[1px] h-screen bg-gradient-to-b from-transparent via-[#bdc8cb]/20 to-transparent"></div>

        <div className="w-full max-w-md z-10">
          {/* Branding Anchor */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[#f3f3f4] border border-[#bdc8cb]/10">
              <span className="text-[#00606b] text-sm" style={{ fontFamily: 'Material Symbols Outlined' }}>terminal</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#3e494b] font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>Protocol Alpha-9</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              DEVFORGE<span className="text-[#00606b]">_</span>
            </h1>
            <p className="mt-2 text-[#3e494b] font-medium text-sm tracking-tight opacity-70" style={{ fontFamily: 'Plus Jakarta Sans' }}>Architecting high-precision digital environments.</p>
          </div>

          {/* Registration Card */}
          <div className="bg-white/70 backdrop-blur-[12px] border border-white/40 shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] rounded-xl p-8 lg:p-10">
            <div className="flex justify-between items-end mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/signin')}
                  className="w-8 h-8 rounded-full bg-[#f3f3f4] border border-[#bdc8cb]/20 flex items-center justify-center hover:bg-[#e8e8e8] transition-all"
                >
                  <span className="text-[#3e494b] text-sm" style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_back</span>
                </button>
                <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>Create Account</h2>
              </div>
              <span className="text-[10px] text-[#3e494b] opacity-40 uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>v2.0.44</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#3e494b] font-bold ml-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Full Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#bdc8cb]/20 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#85d2e0]/30 focus:border-[#00606b] outline-none transition-all duration-200"
                    placeholder="Nikola Tesla"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Professional Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#3e494b] font-bold ml-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Professional Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#bdc8cb]/20 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#85d2e0]/30 focus:border-[#00606b] outline-none transition-all duration-200"
                  placeholder="architect@devforge.io"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#3e494b] font-bold ml-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#bdc8cb]/20 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#85d2e0]/30 focus:border-[#00606b] outline-none transition-all duration-200"
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e797b]/40 hover:text-[#00606b] transition-colors"
                  >
                    <span className="text-lg" style={{ fontFamily: 'Material Symbols Outlined' }}>visibility</span>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded-sm border-[#bdc8cb]/40 text-[#00606b] focus:ring-[#85d2e0]/30 bg-white transition-all"
                  />
                </div>
                <label className="text-xs text-[#3e494b] leading-relaxed" htmlFor="terms">
                  I agree to the <a className="text-[#00606b] hover:underline font-semibold" href="#">Terms of Service</a> and <a className="text-[#00606b] hover:underline font-semibold" href="#">Privacy Policy</a> regarding my data.
                </label>
              </div>

              {/* Primary Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00606b] to-[#247985] text-white font-bold py-3.5 rounded-full shadow-lg shadow-[#00606b]/20 hover:shadow-[#00606b]/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform" style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_forward</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-grow bg-[#bdc8cb]/20"></div>
                <span className="text-[10px] text-[#6e797b] uppercase tracking-widest font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>OR</span>
                <div className="h-[1px] flex-grow bg-[#bdc8cb]/20"></div>
              </div>

              {/* Social Sign Up */}
              <button
                type="button"
                className="w-full bg-white border border-[#bdc8cb]/20 text-[#3e494b] font-semibold py-3.5 rounded-full hover:bg-[#f3f3f4] hover:text-[#1a1c1c] active:opacity-80 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <img
                  alt="Google Logo"
                  className="w-4 h-4 opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk_d-QbzaXP4nJcml3fRHMMuU_kEx6P2wNbLgzkfFP-do75xrNRwv0GVOqHeQ7OVCcPxYrF0IH76GJAnizeei4bS-_5V9FnWJNLaI8Bym7BXPd-CEcQ96ChS_3Tpb1nw2cdkLWlgAa-dekPzenJHv3XV-B6Rya153qgfpVeECxYswmJG5OBg_eNrWcliIM-JmUB1Gsj-FXe0Qyq-gJ6SZZvw3pft8Dj9BoOH1J0ibpAeDDLPxDMpVfMSTOal-az126yLTlpuNNBYE"
                />
                <span className="text-sm">Sign up with Google</span>
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#3e494b] tracking-tight">
                Already have an account?
                <button
                  onClick={onToggleSignIn || (() => navigate('/signin'))}
                  className="text-[#00606b] font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Technical Metadata Footer (Internal) */}
          <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px]" style={{ fontFamily: 'Material Symbols Outlined', fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px]" style={{ fontFamily: 'Material Symbols Outlined', fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>Architecture Ready</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f9f9f9] w-full py-12 mt-auto border-t border-[#bdc8cb]/20">
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
