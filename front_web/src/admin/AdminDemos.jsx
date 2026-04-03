import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { apiService } from '../services/api';

const AdminDemos = () => {
  const [stats, setStats] = useState({
    projects: 0,
    developers: 0,
    resources: 0,
    applications: 0
  });
  const [recentDemos, setRecentDemos] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [projectsResponse, developersResponse, resourcesResponse, applicationsResponse, demosResponse] = await Promise.all([
          apiService.getProjects(),
          apiService.getDevelopers(),
          apiService.getResources(),
          apiService.getJobApplications(),
          apiService.getDemoBookings()
        ]);

        const projectsData = Array.isArray(projectsResponse) ? projectsResponse : [];
        const developersData = Array.isArray(developersResponse) ? developersResponse : [];
        const resourcesData = Array.isArray(resourcesResponse) ? resourcesResponse : [];
        const applicationsData = Array.isArray(applicationsResponse) ? applicationsResponse : [];
        const demosData = Array.isArray(demosResponse) ? demosResponse : [];

        setStats({
          projects: projectsData.length,
          developers: developersData.length,
          resources: resourcesData.length,
          applications: applicationsData.length
        });

        setRecentDemos(demosData.slice(0, 5).map(demo => ({
          id: demo.id,
          name: demo.name || demo.client_name || 'Unknown',
          company: demo.company || 'N/A',
          created_at: demo.created_at,
          scheduled_date: demo.scheduled_date,
          status: demo.status || 'pending'
        })));

        setRecentApps(applicationsData.slice(0, 5).map(app => ({
          id: app.id,
          full_name: app.full_name || app.name || 'Unknown',
          email: app.email,
          applied_at: app.applied_at || app.created_at,
          status: app.status || 'pending'
        })));

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats({
          projects: 0,
          developers: 0,
          resources: 0,
          applications: 0
        });
        setRecentDemos([]);
        setRecentApps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleDemoStatusUpdate = async (id, status) => {
    try {
      await apiService.updateDemoBooking(id, { status });
      setRecentDemos(prev => prev.map(demo =>
        demo.id === id ? { ...demo, status } : demo
      ));
    } catch (error) {
      console.error("Error updating demo status:", error);
    }
  };

  const handleApplicationStatusUpdate = async (id, status) => {
    try {
      await apiService.updateJobApplication(id, { status });
      setRecentApps(prev => prev.map(app =>
        app.id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleDeleteDemo = async (id) => {
    if (window.confirm('Are you sure you want to delete this demo request?')) {
      try {
        await apiService.deleteDemoBooking(id);
        setRecentDemos(prev => prev.filter(demo => demo.id !== id));
      } catch (error) {
        console.error("Error deleting demo:", error);
      }
    }
  };

  const handleDeleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await apiService.deleteJobApplication(id);
        setRecentApps(prev => prev.filter(app => app.id !== id));
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Demo Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading demo data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Demo Management">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Demo Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage demo requests and job applications for the platform.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Projects</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{stats.projects}</span>
              <span className="text-primary font-bold text-sm">TOTAL</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Developers</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{stats.developers}</span>
              <span className="text-green-600 dark:text-green-400 font-bold text-sm">ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Resources</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{stats.resources}</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">ITEMS</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Applications</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{stats.applications}</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">SUBMITTED</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Demo Requests */}
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">event</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Demo Requests</h2>
            </div>
          </div>
          <div className="p-8">
            {recentDemos.length > 0 ? (
              <div className="space-y-4">
                {recentDemos.map((demo) => (
                  <div key={demo.id} className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white">{demo.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{demo.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Created: {new Date(demo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={demo.status}
                          onChange={(e) => handleDemoStatusUpdate(demo.id, e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteDemo(demo.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Delete Demo"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">event_available</span>
                <p className="text-slate-500 dark:text-slate-400">No recent demo requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">work</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h2>
            </div>
          </div>
          <div className="p-8">
            {recentApps.length > 0 ? (
              <div className="space-y-4">
                {recentApps.map((app) => (
                  <div key={app.id} className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white">{app.full_name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{app.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={app.status}
                          onChange={(e) => handleApplicationStatusUpdate(app.id, e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Delete Application"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">work</span>
                <p className="text-slate-500 dark:text-slate-400">No recent applications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDemos;

