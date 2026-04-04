import React, { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, ChevronDown, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const Header = ({
  showProfile = true,
  activeTab = 'home',
  onTabChange,
  onLoginClick
}) => {
  const { isAuthenticated, customer, customerLogout } = useCustomerAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLogout = () => {
    customerLogout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Get short name (first name or first letter of name)
  const getShortName = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].substring(0, 2);
  };

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'developers', label: 'Developers', path: '/developers' },
    { id: 'resources', label: 'Resources', path: '/resources' },
    { id: 'reviews', label: 'Reviews', path: '/reviews' },
    { id: 'contact', label: 'Contact', path: '/contact' },
    { id: 'hiring', label: 'Hiring', path: '/hiring' },
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
          <button className="p-2 hover:bg-surface-container dark:hover:bg-slate-800 rounded-md transition-all group">
            <Settings className="w-5 h-5 text-on-surface-variant group-hover:text-on-surface transition-colors" />
          </button>

          {isAuthenticated && customer ? (
            <div className="relative" ref={dropdownRef}>
              {/* Customer dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 ml-2 px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container dark:hover:bg-slate-800 rounded-md transition-all group"
              >
                {/* Customer avatar with short name */}
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                  {getShortName(customer.name)}
                </div>
                <span className="hidden sm:block">
                  {customer.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:text-primary"
                  style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface dark:bg-slate-800 border border-surface-container dark:border-slate-700 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-surface-container dark:border-slate-700">
                      <p className="text-sm font-medium text-on-surface">{customer.name}</p>
                      <p className="text-xs text-on-surface-variant">{customer.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container dark:hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full overflow-hidden ml-2 border border-outline-variant/20">
              <img
                alt="User avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWVq59hntPo22RdA0JeJGbC4Ab7PX10laYIbuuRj5iFJvvM3zeWs5uqZUkjpDmDdClCWe9ot65VC5su9zvOBk1saKezq-Tk71fpMjp_ld1W7s1fu32563LN_AFW6_1f12MUdeWkT2Y9EmMsgOQEGNXSF3DNgjSvFR6S46iXiz2-direwQ57YgeWaRbket53Mw2nofQ7_PpPCn-DQ6gRziKwePriHj71KNi79eyT2RwtdkslqXxPheXbx3RzDnDrX6oxq8mdg8A64s"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

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
