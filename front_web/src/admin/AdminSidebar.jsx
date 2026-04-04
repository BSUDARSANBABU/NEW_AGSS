import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Clear authentication
    logout();

    // Prevent back navigation by replacing history
    window.history.replaceState(null, '', '/');
    window.history.pushState(null, '', '/');

    // Navigate to home page with replace to prevent back navigation
    navigate('/', { replace: true });
  };

  const mainNavItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { name: 'Projects', icon: 'work', path: '/admin/projects' },
    { name: 'Developers', icon: 'groups', path: '/admin/developers' },
    { name: 'Resources', icon: 'folder', path: '/admin/resources' },
    { name: 'Hiring', icon: 'person_search', path: '/admin/hiring' },
    { name: 'Documentation', icon: 'menu_book', path: '/admin/documentation' },
  ];

  const adminNavItems = [
    { name: 'Reviews', icon: 'rate_review', path: '/admin/reviews' },
    { name: 'Demos', icon: 'event_available', path: '/admin/demos' },
    { name: 'Manage Reviews', icon: 'manage_search', path: '/admin/manage-reviews' },
    { name: 'Footer', icon: 'web_asset', path: '/admin/footer' },
    { name: 'Settings', icon: 'settings', path: '/admin/settings' },
  ];

  return (
    <aside className={`h-screen fixed left-0 top-0 border-r border-blue-800 bg-blue-950 flex flex-col z-20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
      }`}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between px-4 mb-8 pt-6">
        {!isCollapsed && (
          <div className="text-xl font-bold text-white">
            TechHub Admin
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-blue-200 hover:text-white p-2 rounded hover:bg-blue-900 transition-colors"
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''
                  } ${isActive
                    ? 'text-blue-400 font-bold border-r-2 border-blue-400 bg-blue-900'
                    : 'text-blue-200 hover:text-white hover:bg-blue-900'
                  }`}
                title={isCollapsed ? item.name : ''}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium text-sm tracking-tight ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Admin Management Section */}
        <div className="pt-4 mt-4 border-t border-blue-800">
          {!isCollapsed && (
            <p className="px-4 text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Admin Management</p>
          )}
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''
                    } ${isActive
                      ? 'text-blue-400 font-bold border-r-2 border-blue-400 bg-blue-900'
                      : 'text-blue-200 hover:text-white hover:bg-blue-900'
                    }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium text-sm tracking-tight ml-3">{item.name}</span>
                  )}
                  {!isCollapsed && (
                    <span className="material-symbols-outlined text-xs opacity-50 ml-auto">chevron_right</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Fixed Bottom Section */}
      <div className="pt-6 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''
            }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="material-symbols-outlined">logout</span>
          {!isCollapsed && (
            <span className="font-medium text-sm tracking-tight ml-3">Logout</span>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-6 flex items-center gap-3">
          <img
            alt="Admin User Avatar"
            className="w-8 h-8 rounded-full bg-blue-900"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmL6fLxYO5qYXXcP3-uHmYeYGQ4Fh6QPsrepMy4Qfef-QjSAsd19gB4DMdF4yhDhKe6eGyLhUKfeNzx233Fn6o8y_Zm2m5PssBHVxfl_pd8lMBi8YBqepk5ajGCEtYDd0BYtgIbDU804XCxNBq9rGVEHZRXt1eqmxtELIbw_1a2lfsMC3aSlxotUbH-s7jbf2fiDPAk4DgtGc53miT6P8TtdDB_SbVhjjpn2wE9bSTAdR1SC_KO2A-nEIKR2fIdLv8nR_XiKAWopQ"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Admin User</p>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest">Technical Ops</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
