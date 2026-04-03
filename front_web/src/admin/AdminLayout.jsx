import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useSidebar } from './SidebarContext';

const AdminLayout = ({ children, title }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <AdminSidebar />
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'
        }`}>
        <main className="flex-1">
          <div className="px-10 py-12 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
