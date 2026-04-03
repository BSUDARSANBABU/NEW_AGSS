import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  Plus,
  Users,
  Layers,
  Shield,
  Code,
  Rocket,
  Settings,
  FileText,
  UserCheck,
  Calendar,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    developers: 0,
    reviews: 0,
    demoBookings: 0,
    jobs: 0,
    resources: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [
        projects,
        developers,
        reviews,
        demoBookings,
        jobs,
        resources
      ] = await Promise.all([
        apiService.getProjects().catch(() => []),
        apiService.getDevelopers().catch(() => []),
        apiService.getPerformanceReviews().catch(() => []),
        apiService.getDemoBookings().catch(() => []),
        apiService.getJobs().catch(() => []),
        apiService.getResources().catch(() => [])
      ]);

      // Update stats
      setStats({
        projects: projects.length || 0,
        developers: developers.length || 0,
        reviews: reviews.length || 0,
        demoBookings: demoBookings.length || 0,
        jobs: jobs.length || 0,
        resources: resources.length || 0
      });

      // Create recent activity from latest data
      const activity = [
        ...projects.slice(0, 2).map(p => ({
          user: 'System',
          action: 'added project',
          target: p.title,
          time: 'Recently',
          icon: Rocket
        })),
        ...developers.slice(0, 2).map(d => ({
          user: 'System',
          action: 'registered developer',
          target: d.name || d.full_name || 'Unknown',
          time: 'Recently',
          icon: UserCheck
        })),
        ...reviews.slice(0, 2).map(r => ({
          user: 'System',
          action: 'submitted review',
          target: `Review #${r.id}`,
          time: 'Recently',
          icon: FileText
        })),
        ...demoBookings.slice(0, 2).map(d => ({
          user: 'System',
          action: 'booked demo',
          target: d.name || 'Demo Booking',
          time: 'Recently',
          icon: Calendar
        }))
      ].slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-slate-600">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-10 pb-10">
        {/* Platform Health Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Platform Overview</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              System Live
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { label: 'Projects', value: stats.projects, icon: Rocket, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20', path: '/admin/projects' },
              { label: 'Developers', value: stats.developers, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', path: '/admin/developers' },
              { label: 'Reviews', value: stats.reviews, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', path: '/admin/reviews' },
              { label: 'Demo Bookings', value: stats.demoBookings, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', path: '/admin/demos' },
              { label: 'Jobs', value: stats.jobs, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', path: '/admin/hiring' },
              { label: 'Resources', value: stats.resources, icon: Layers, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', path: '/admin/resources' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all cursor-pointer hover:scale-105"
                onClick={() => handleCardClick(stat.path)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Deployment Queue */}
          <div className="lg:col-span-8 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Deployment Queue</h2>
                <button className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline">View History</button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: 'Auth_Module.v4', status: 'In Progress', progress: 65, time: '2m left', type: 'Production' },
                    { name: 'GoSync_Engine', status: 'Queued', progress: 0, time: 'Pending', type: 'Staging' },
                    { name: 'RustKernel.v2', status: 'Success', progress: 100, time: '14m ago', type: 'Production' },
                  ].map((item, i) => (
                    <div key={item.name} className="p-5 flex items-center gap-6 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {item.status === 'Success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                          item.status === 'In Progress' ? <RotateCcw className="w-5 h-5 text-cyan-500 animate-spin" /> :
                            <Clock className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate">{item.name}</p>
                          <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase tracking-widest">{item.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              className={cn("h-full", item.status === 'Success' ? 'bg-emerald-500' : 'bg-cyan-500')}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{item.time}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Latest Updates Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Latest Updates</h2>
                <button
                  onClick={fetchDashboardData}
                  className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentActivity.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      No recent activity found
                    </div>
                  ) : (
                    recentActivity.map((activity, i) => (
                      <div key={i} className="p-5 flex items-center gap-6 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <activity.icon className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-black text-slate-900 dark:text-white">{activity.user}</span> {activity.action} <span className="font-bold text-cyan-700 dark:text-cyan-400">{activity.target}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{activity.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-10">
            {/* Resource Overview */}
            <section className="bg-slate-900 dark:bg-black p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h2 className="text-lg font-black tracking-tight mb-8">Resource Overview</h2>

              <div className="space-y-8">
                {[
                  { label: 'CPU Usage', value: 42, color: 'bg-cyan-500' },
                  { label: 'Memory', value: 68, color: 'bg-indigo-500' },
                  { label: 'Disk I/O', value: 15, color: 'bg-emerald-500' },
                ].map((resource) => (
                  <div key={resource.label}>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{resource.label}</p>
                      <p className="text-sm font-black">{resource.value}%</p>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resource.value}%` }}
                        className={cn("h-full", resource.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all">
                Full System Report
              </button>
            </section>

            {/* Action Center */}
            <section>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6">Action Center</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'New Project', icon: Plus, color: 'bg-cyan-500' },
                  { label: 'Hire Dev', icon: Users, color: 'bg-indigo-500' },
                  { label: 'Audit Logs', icon: Code, color: 'bg-slate-800' },
                  { label: 'Settings', icon: Settings, color: 'bg-slate-200 text-slate-900' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all active:scale-95 group"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", action.color)}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{action.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const ArrowUpRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export default AdminDashboard;
