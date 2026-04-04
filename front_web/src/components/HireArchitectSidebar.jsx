import React from 'react';

const HireArchitectSidebar = () => {
  return (
    <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f3f3f4] dark:bg-[#1a1c1c] flex flex-col p-6 space-y-8 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
            architecture
          </span>
        </div>
        <div>
          <h2 className="text-lg font-black text-[#1a1c1c] dark:text-[#ffffff] leading-none">Talent Systems</h2>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 font-bold">
            Enterprise Recruitment
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <a
          className="flex items-center gap-3 px-4 py-3 text-[#3e494b] hover:text-[#00606b] hover:bg-white/50 rounded-lg transition-all duration-300"
          href="#"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-medium text-sm">Dashboard</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 bg-[#ffffff] dark:bg-[#2a2c2c] text-[#00606b] dark:text-[#a2effd] rounded-lg shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04)] font-semibold transition-all duration-300"
          href="#"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            work
          </span>
          <span className="font-medium text-sm">Job Postings</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-[#3e494b] hover:text-[#00606b] hover:bg-white/50 rounded-lg transition-all duration-300"
          href="#"
        >
          <span className="material-symbols-outlined">groups</span>
          <span className="font-medium text-sm">Candidates</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-[#3e494b] hover:text-[#00606b] hover:bg-white/50 rounded-lg transition-all duration-300"
          href="#"
        >
          <span className="material-symbols-outlined">account_tree</span>
          <span className="font-medium text-sm">Pipeline</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-[#3e494b] hover:text-[#00606b] hover:bg-white/50 rounded-lg transition-all duration-300"
          href="#"
        >
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="font-medium text-sm">Analytics</span>
        </a>
      </nav>

      <div className="pt-6 border-t border-outline-variant/10">
        <button className="w-full bg-primary text-white py-3 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-lg">add</span>
          New Posting
        </button>
      </div>

      <div className="space-y-1">
        <a
          className="flex items-center gap-3 px-4 py-2 text-[#3e494b] hover:text-[#00606b] text-xs transition-all"
          href="#"
        >
          <span className="material-symbols-outlined text-lg">contact_support</span>
          Support
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2 text-[#3e494b] hover:text-[#00606b] text-xs transition-all"
          href="#"
        >
          <span className="material-symbols-outlined text-lg">inventory_2</span>
          Archive
        </a>
      </div>
    </aside>
  );
};

export default HireArchitectSidebar;
