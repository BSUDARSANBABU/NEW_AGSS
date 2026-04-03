import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { apiService } from '../services/api';

const AdminHiring = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_range: '',
    status: 'open'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsResponse, appsResponse] = await Promise.all([
          apiService.getJobs(),
          apiService.getJobApplications()
        ]);

        const jobsData = Array.isArray(jobsResponse) ? jobsResponse : [];
        const appsData = Array.isArray(appsResponse) ? appsResponse : [];

        setJobs(jobsData);
        setApplications(appsData);
      } catch (error) {
        console.error("Error fetching hiring data:", error);
        // Use mock data as fallback
        setJobs([
          { id: 1, title: 'Senior Developer', description: 'Lead developer role', salary_range: '$100k-$150k', status: 'open' },
          { id: 2, title: 'UI Designer', description: 'Design user interfaces', salary_range: '$80k-$120k', status: 'closed' }
        ]);
        setApplications([
          { id: 1, full_name: 'John Doe', email: 'john@example.com', applied_at: '2024-01-15', status: 'pending', resume_url: '#' },
          { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', applied_at: '2024-01-16', status: 'reviewing', resume_url: '#' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await apiService.updateJob(editingJob.id, jobFormData);
      } else {
        await apiService.createJob(jobFormData);
      }
      setShowJobModal(false);
      setEditingJob(null);
      setJobFormData({ title: '', description: '', requirements: '', salary_range: '', status: 'open' });
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await apiService.updateJobApplication(appId, { status: newStatus });
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await apiService.deleteJob(jobId);
        // Refetch data
        window.location.reload();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const filteredApps = applications.filter(app =>
    app.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    app.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Hiring Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading hiring data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Hiring Management">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Hiring Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage job postings and review candidate applications.</p>
        </div>
        <div className="flex items-center gap-4">
          {activeTab === 'jobs' && (
            <button
              onClick={() => {
                setEditingJob(null);
                setJobFormData({ title: '', description: '', requirements: '', salary_range: '', status: 'open' });
                setShowJobModal(true);
              }}
              className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Post New Job
            </button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Job Postings</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{jobs.length}</span>
              <span className="text-primary font-bold text-sm">ACTIVE</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Applications</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{applications.length}</span>
              <span className="text-green-600 dark:text-green-400 font-bold text-sm">SUBMITTED</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Pending</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{applications.filter(app => app.status === 'pending').length}</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">REVIEW</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Hired</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{applications.filter(app => app.status === 'hired').length}</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">PLACED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'applications'
              ? 'bg-primary text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'jobs'
              ? 'bg-primary text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Job Postings
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full max-w-md group">
          <input
            type="text"
            placeholder={activeTab === 'applications' ? "Search candidates..." : "Search jobs..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none pl-12"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary">search</span>
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === 'applications' ? (
        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-slate-400">person_search</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Applications Found</h3>
              <p className="text-slate-500 dark:text-slate-400">No applications match your search criteria.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div key={app.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500">person</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{app.full_name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-slate-600 dark:text-slate-400 text-sm">{app.email}</span>
                          <span className="text-slate-500 dark:text-slate-400 text-sm">Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {app.resume_url && (
                        <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">description</span>
                          Resume
                        </a>
                      )}
                      {app.portfolio_url && (
                        <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">work</span>
                          Portfolio
                        </a>
                      )}
                      {app.github_url && (
                        <a href={app.github_url} target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">code</span>
                          GitHub
                        </a>
                      )}
                      {app.linkedin_url && (
                        <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">work</span>
                          LinkedIn
                        </a>
                      )}

                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  </div>
                  {app.cover_letter && (
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Cover Letter</p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">"{app.cover_letter}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-slate-400">work</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Job Postings</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first job posting to attract talent.</p>
              <button
                onClick={() => {
                  setEditingJob(null);
                  setJobFormData({ title: '', description: '', requirements: '', salary_range: '', status: 'open' });
                  setShowJobModal(true);
                }}
                className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Create Job Posting
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{job.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setJobFormData({
                            title: job.title,
                            description: job.description,
                            requirements: job.requirements || '',
                            salary_range: job.salary_range || '',
                            status: job.status || 'open'
                          });
                          setShowJobModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        title="Edit Job"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        title="Delete Job"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{job.salary_range || 'Competitive'}</span>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${job.status === 'open'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingJob ? 'Edit' : 'Create'} Job Posting
                </h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Job Title</label>
                    <input
                      type="text"
                      required
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      placeholder="Senior Full Stack Engineer"
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={jobFormData.salary_range}
                      onChange={(e) => setJobFormData({ ...jobFormData, salary_range: e.target.value })}
                      placeholder="$120k - $180k"
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Description</label>
                  <textarea
                    rows={4}
                    required
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    placeholder="Briefly describe the role and its impact..."
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Status</label>
                  <select
                    value={jobFormData.status}
                    onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  {editingJob ? 'Update Posting' : 'Publish Job Posting'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHiring;
