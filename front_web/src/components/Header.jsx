import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Header = ({
  showProfile = true,
  activeTab = 'home',
  onTabChange,
  onLoginClick
}) => {
  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'developers', label: 'Developers', path: '/developers' },
    { id: 'resources', label: 'Resources', path: '/resources' },
    { id: 'reviews', label: 'Reviews', path: '/reviews' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="w-full top-0 sticky z-50 bg-surface dark:bg-slate-950 border-b border-surface-container">
      <nav className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto font-sans text-sm tracking-tight">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-bold tracking-tighter text-on-surface dark:text-white uppercase">DEVFORGE</Link>
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "transition-colors pb-1",
                  activeTab === item.id
                    ? "text-primary dark:text-primary-fixed font-semibold border-b-2 border-primary dark:border-primary-fixed"
                    : "text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-surface-container-low dark:bg-slate-900 rounded-md px-3 py-1.5 mr-2">
            <Search className="w-4 h-4 text-on-surface-variant mr-2" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface p-0 outline-none"
              placeholder="Search systems..."
              type="text"
            />
          </div>
          <button className="p-2 hover:bg-surface-container dark:hover:bg-slate-800 rounded-md transition-all">
            <Bell className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button className="p-2 hover:bg-surface-container dark:hover:bg-slate-800 rounded-md transition-all">
            <Settings className="w-5 h-5 text-on-surface-variant" />
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden ml-2 border border-outline-variant/20">
            <img
              alt="User avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWVq59hntPo22RdA0JeJGbC4Ab7PX10laYIbuuRj5iFJvvM3zeWs5uqZUkjpDmDdClCWe9ot65VC5su9zvOBk1saKezq-Tk71fpMjp_ld1W7s1fu32563LN_AFW6_1f12MUdeWkT2Y9EmMsgOQEGNXSF3DNgjSvFR6S46iXiz2-direwQ57YgeWaRbket53Mw2nofQ7_PpPCn-DQ6gRziKwePriHj71KNi79eyT2RwtdkslqXxPheXbx3RzDnDrX6oxq8mdg8A64s"
              referrerPolicy="no-referrer"
            />
          </div>
          <Link
            to="/signup"
            className="ml-4 px-4 py-2 text-sm font-medium text-on-primary dark:text-white bg-primary dark:bg-primary-fixed rounded-md hover:bg-primary-hover dark:hover:bg-primary-fixed-hover transition-all"
          >
            Sign Up
          </Link>
          <Link
            to="/book-demo"
            className="ml-2 px-4 py-2 text-sm font-medium text-on-primary dark:text-white bg-secondary dark:bg-secondary-fixed rounded-md hover:bg-secondary-hover dark:hover:bg-secondary-fixed-hover transition-all"
          >
            Book Demo
          </Link>
        </div>
      </nav>
    </header>
  );
};
