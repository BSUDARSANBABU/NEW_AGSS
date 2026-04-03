import React from 'react';
import { Header } from './Header';
import { cn } from '../lib/utils';

export const PublicLayout = ({ children, activeTab, showSidebar, sidebar }) => (
  <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
    <Header showProfile={false} activeTab={activeTab} />
    <main className={cn(
      "max-w-[1440px] mx-auto px-8 py-10 min-h-screen flex gap-10",
      !showSidebar && "block"
    )}>
      {showSidebar && sidebar && (
        <aside className="w-64 flex-shrink-0 space-y-10 hidden lg:block">
          {sidebar}
        </aside>
      )}
      <div className="flex-grow">
        {children}
      </div>
    </main>
    <footer className="w-full mt-auto bg-surface-container-low dark:bg-slate-900 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 py-12 max-w-[1440px] mx-auto">
        <div className="space-y-4">
          <span className="text-lg font-black text-on-surface dark:text-white uppercase tracking-tighter">DEVFORGE</span>
          <p className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide leading-relaxed max-w-sm uppercase">
            Precision high-performance systems for the next generation of technological architecture.
          </p>
          <p className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase">
            © 2024 DEVFORGE Precision Systems. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <a className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase hover:text-primary transition-colors" href="#">About</a>
            <a className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
          <div className="space-y-2 flex flex-col">
            <a className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase hover:text-primary transition-colors" href="#">Contact</a>
            <a className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase hover:text-primary transition-colors" href="#">API Documentation</a>
            <a className="text-on-surface-variant dark:text-slate-400 text-xs tracking-wide uppercase hover:text-primary transition-colors" href="#">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
