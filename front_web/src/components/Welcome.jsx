import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';
import useOnboardingFlow from '../hooks/useOnboardingFlow';

const Welcome = () => {
  const navigate = useNavigate();
  const { markStepCompleted, getNextRoute } = useOnboardingFlow();

  const handleStartJourney = () => {
    markStepCompleted('welcome');
    navigate('/projects');
  };

  const handleQuickOverview = () => {
    // Could show a modal or navigate to an overview page
    console.log('Quick overview clicked');
  };
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed-variant min-h-screen">
      {/* TopNavBar */}
      <nav className="flex justify-between items-center px-8 py-4 max-w-full bg-[#f9f9f9] dark:bg-[#1a1c1c] w-full top-0 tonal-shift bg-[#f3f3f4] dark:bg-[#1a1c1c]">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-[#1a1c1c] dark:text-[#f9f9f9] tracking-tight">Isoform Prime</span>
          <div className="h-4 w-[1px] bg-outline-variant/30 mx-2"></div>
          <span className="text-xs font-['Plus_Jakarta_Sans'] font-semibold tracking-tight text-[#00606b]">Clinical Architect</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 rounded-full hover:bg-[#eeeeee] dark:hover:bg-[#3e494b]/10 transition-opacity duration-200 active:opacity-70 text-[#3e494b]">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-6 lg:px-24">
        {/* Welcome Hero Section: Asymmetric Layout */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center py-12">
          {/* Left Content: High-Precision Typography */}
          <div className="lg:col-span-7 flex flex-col space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-fixed/20 text-primary text-[11px] font-bold tracking-[0.1em] uppercase">Phase 01: Initiation</span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface tracking-[-0.03em] leading-[1.1]">
                Welcome to the Forge, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Alex Carter</span>!
              </h1>
            </div>
            <p className="text-lg lg:text-xl text-on-surface-variant leading-relaxed max-w-2xl">
              Isoform Prime is your digital clinical architecture—a space where technical precision meets surgical efficiency. Today, we begin crafting your high-performance environment.
            </p>

            {/* Feature Highlighting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="surface-container-low p-6 rounded-xl flex items-start gap-4 transition-all duration-300 hover:bg-surface-container">
                <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary">architecture</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface tracking-wide uppercase text-[12px] mb-1">Blueprint Engine</h3>
                  <p className="text-sm text-on-surface-variant">Standardized clinical workflows with millisecond latency.</p>
                </div>
              </div>
              <div className="surface-container-low p-6 rounded-xl flex items-start gap-4 transition-all duration-300 hover:bg-surface-container">
                <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary">clinical_notes</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface tracking-wide uppercase text-[12px] mb-1">Neural Archiving</h3>
                  <p className="text-sm text-on-surface-variant">Automated technical documentation and research mapping.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={handleStartJourney}
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 rounded-full font-bold text-base shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
              >
                Start Your Journey
              </button>
              <button
                onClick={handleQuickOverview}
                className="text-on-surface-variant hover:text-primary font-semibold text-sm flex items-center gap-2 group transition-colors"
              >
                Quick Overview
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Content: Celebratory Illustration */}
          <div className="lg:col-span-5 relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-square">
              {/* Layered Visual Composition */}
              <div className="absolute inset-0 bg-primary-fixed/10 rounded-[4rem] rotate-6"></div>
              <div className="absolute inset-0 bg-surface-container-lowest ghost-border rounded-[4rem] -rotate-3 overflow-hidden shadow-[0_20px_50px_rgba(0,31,36,0.06)]">
                <img
                  alt="Technical Illustration"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAaqxQgJtLt7ohHo1eFm3bKRf-92-DUJagfPVLWUYDHQmT2zA-ilUMg1liFSCCUudJfgnVfSIfYEDZoYgeT_9DYSTyNxB5gVSqwAdOKtNm0VCrWjq3Sezw_9bscEeXpYIS98r_v5fbHVUjmHKCdg7morWtwBj6hC7PanJcmTP2wSA1SqLIXXc1j1Y8ZI1nkKzX9i1KaRH2WOt4-pzsjCTJ3knEczWTzG63WsNeQoT4INBgladcRg9ua5Wo4v1y-3FpN3CqKFuRLWw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>

                {/* Floating Data Points (Brand Calibration) */}
                <div className="absolute top-8 left-8 p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-primary-fixed/30 flex flex-col">
                  <span className="text-[32px] font-extrabold text-primary leading-none tracking-tighter">99.8<span className="text-xs uppercase font-bold text-on-surface-variant align-top ml-1">%</span></span>
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-[0.1em] uppercase mt-1">Sync Precision</span>
                </div>
                <div className="absolute bottom-8 right-8 p-4 bg-primary text-white rounded-xl shadow-lg flex flex-col items-end">
                  <span className="text-[32px] font-extrabold leading-none tracking-tighter">Forge</span>
                  <span className="text-[10px] font-bold text-primary-fixed tracking-[0.1em] uppercase">Identity Active</span>
                </div>
              </div>

              {/* Decorative Iconography */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center text-primary shadow-xl">
                <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#ffffff] dark:bg-[#1a1c1c] border-t border-[#bdc8cb]/20 shadow-[0_-4px_20px_-2px_rgba(0,31,36,0.04)] md:hidden">
        <div className="flex flex-col items-center justify-center bg-[#a2effd]/30 text-[#00606b] dark:text-[#a2effd] rounded-full px-6 py-1 transition-transform duration-150 scale-95">
          <span className="material-symbols-outlined">start</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[12px] uppercase tracking-wider font-bold">Welcome</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#3e494b] dark:text-[#bdc8cb] hover:text-[#00606b] transition-transform duration-150 scale-95">
          <span className="material-symbols-outlined">person_add</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[12px] uppercase tracking-wider font-bold">Profile</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#3e494b] dark:text-[#bdc8cb] hover:text-[#00606b] transition-transform duration-150 scale-95">
          <span className="material-symbols-outlined">search</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[12px] uppercase tracking-wider font-bold">Discover</span>
        </div>
      </nav>

      {/* Desktop Background Element */}
      <div className="welcome-bg-element welcome-bg-element-1"></div>
      <div className="welcome-bg-element welcome-bg-element-2"></div>
    </div>
  );
};

export default Welcome;
