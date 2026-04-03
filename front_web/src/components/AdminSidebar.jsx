import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
      <h2 className="text-xl font-bold text-white mb-8">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Dashboard
        </Link>
        <Link to="/admin/hiring" className="block px-4 py-2 text-white bg-zinc-800 rounded-lg">
          Hiring
        </Link>
        <Link to="/admin/developers" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Developers
        </Link>
        <Link to="/admin/projects" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Projects
        </Link>
        <Link to="/admin/resources" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Resources
        </Link>
        <Link to="/admin/reviews" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Reviews
        </Link>
        <Link to="/admin/demos" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Demos
        </Link>
        <Link to="/admin/manage-reviews" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Manage Reviews
        </Link>
        <Link to="/admin/settings" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Settings
        </Link>
        <Link to="/admin/footer" className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          Footer
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
