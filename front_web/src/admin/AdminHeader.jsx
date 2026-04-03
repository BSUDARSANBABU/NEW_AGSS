import React from 'react';

const AdminHeader = ({ title }) => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-10 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center h-16 px-8 transition-all duration-200">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-900 border-none focus:ring-1 focus:ring-primary text-sm rounded-lg"
            placeholder="Search systems or documentation..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-cyan-700 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:text-cyan-700 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800"></div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
