import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import apiService from '../services/api';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'BLOG',
    tool_type: '',
    author_name: '',
    published_on: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await apiService.getResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleAddResource = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      content: '',
      category: 'BLOG',
      tool_type: '',
      author_name: '',
      published_on: ''
    });
    setShowForm(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      content: resource.content || '',
      category: resource.category || 'BLOG',
      tool_type: resource.tool_type || '',
      author_name: resource.author_name || '',
      published_on: resource.published_on || ''
    });
    setShowForm(true);
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await apiService.deleteResource(resourceId);
        setResources(resources.filter(r => r.id !== resourceId));
      } catch (err) {
        console.error('Failed to delete resource:', err);
        alert('Failed to delete resource');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingResource) {
        // Update existing resource
        const updatedResource = await apiService.updateResource(editingResource.id, formData);
        setResources(resources.map(r => r.id === editingResource.id ? updatedResource : r));
      } else {
        // Create new resource
        const newResource = await apiService.createResource(formData);
        setResources([...resources, newResource]);
      }

      setShowForm(false);
      setEditingResource(null);
    } catch (err) {
      console.error('Failed to save resource:', err);
      alert('Failed to save resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Resources Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading resources...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Resources Management">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Resource Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage blogs, guides, tools, and documentation for the platform.</p>
        </div>
        <button onClick={handleAddResource} className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Resource
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Total Resources</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{resources.length}</span>
              <span className="text-primary font-bold text-sm">ITEMS</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Blog Posts</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{resources.filter(r => r.category === 'BLOG').length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">PUBLISHED</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Guides</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{resources.filter(r => r.category === 'GUIDE').length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">AVAILABLE</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Tools</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{resources.filter(r => r.category === 'TOOL').length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Title</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Author</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Published</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {resources.map((resource, idx) => (
              <tr key={resource.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <td className="px-8 py-6">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{resource.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{resource.content?.substring(0, 100)}...</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${resource.category === 'BLOG' ? 'bg-blue-100 text-blue-700' :
                    resource.category === 'GUIDE' ? 'bg-green-100 text-green-700' :
                      resource.category === 'TOOL' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                    {resource.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium">{resource.author_name || 'Admin'}</span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-mono text-slate-500">{resource.published_on || 'Recently'}</p>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="Edit Resource"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Delete Resource"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase">SHOWING {resources.length} RESOURCES</span>
        </div>
      </div>

      {/* Resource Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Enter resource title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="BLOG">Blog</option>
                      <option value="GUIDE">Guide</option>
                      <option value="TOOL">Tool</option>
                      <option value="GLOSSARY">Glossary Item</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Write your resource content..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Author Name</label>
                    <input
                      type="text"
                      name="author_name"
                      value={formData.author_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Published Date</label>
                    <input
                      type="date"
                      name="published_on"
                      value={formData.published_on}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                {formData.category === 'TOOL' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tool Type</label>
                    <select
                      name="tool_type"
                      value={formData.tool_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Select Tool Type</option>
                      <option value="currency">Currency Converter</option>
                      <option value="gst">GST Calculator</option>
                      <option value="emi">EMI Calculator</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (editingResource ? 'Update Resource' : 'Create Resource')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminResources;
