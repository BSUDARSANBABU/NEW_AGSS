import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import apiService from '../services/api';

const AdminDocumentation = () => {
  const [docs, setDocs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    project: '',
    category: '',
    uploaded_by: ''
  });

  useEffect(() => {
    fetchDocs();
    fetchProjects();
    fetchDevelopers();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDocumentation();
      setDocs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching docs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const data = await apiService.getDevelopers();
      setDevelopers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load developers:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !editingDoc) {
      alert("Please select a PDF file");
      return;
    }

    const data = new FormData();
    data.append("project", formData.project);
    data.append("category", formData.category);
    data.append("uploaded_by", formData.uploaded_by);

    if (file) {
      data.append("file", file);
    }

    try {
      if (editingDoc) {
        await apiService.updateDocumentation(editingDoc.id, data);
      } else {
        await apiService.createDocumentation(data);
      }

      resetForm();
      fetchDocs();

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed");
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
    setFormData({ project: '', category: '', uploaded_by: '' });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmDelete = async () => {
    setDeletingId(docToDelete.id);

    try {
      await apiService.deleteDocumentation(docToDelete.id);
      setDocs(prev => prev.filter(d => d.id !== docToDelete.id));
      setDocToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (docItem) => {
    setEditingDoc(docItem);
    setFormData({
      project: docItem.project,
      category: docItem.category,
      uploaded_by: docItem.uploaded_by
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const categories = ['all', ...new Set(docs.map(doc => doc.category).filter(Boolean))];

  const filteredDocs = docs.filter(d => {
    const matchesSearch = search === '' ||
      d.category?.toLowerCase().includes(search.toLowerCase()) ||
      d.project_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.uploaded_by?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout title="Documentation Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading documentation...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Documentation Management">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Documentation Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage project documentation and PDF files for the platform.</p>
        </div>
        <button
          onClick={() => {
            setEditingDoc(null);
            setFormData({ project: '', category: '', uploaded_by: '' });
            setFile(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">upload</span>
          Upload New Document
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Total Documents</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{docs.length}</span>
              <span className="text-primary font-bold text-sm">FILES</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Categories</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{categories.length - 1}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">TYPES</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Projects</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{projects.length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Filtered</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{filteredDocs.length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">RESULTS</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full max-w-md group">
          <input
            type="text"
            placeholder="Search documentation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none pl-12"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary">search</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-500 font-medium">Filter by category:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all font-medium ${selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              {category === 'all' ? 'All Categories' : category}
              {category !== 'all' && (
                <span className="ml-1 text-slate-500">
                  ({docs.filter(doc => doc.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Project</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Uploaded By</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">File</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDocs.map((doc, idx) => (
              <tr key={doc.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-900 dark:text-white leading-tight">{doc.project_name}</div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {doc.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{doc.uploaded_by}</span>
                </td>
                <td className="px-8 py-6">
                  {doc.file && (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline text-sm font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                      {doc.file.split('/').pop()}
                    </a>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="Edit Document"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Delete Document"
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
          <span className="text-xs font-bold text-slate-500 uppercase">SHOWING {filteredDocs.length} DOCUMENTS</span>
        </div>
      </div>

      {/* Document Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingDoc ? 'Edit Document' : 'Upload New Document'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project</label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Enter category"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Uploaded By</label>
                  <select
                    name="uploaded_by"
                    value={formData.uploaded_by}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  >
                    <option value="">Select Developer</option>
                    {developers.map(dev => (
                      <option key={dev.id} value={dev.name}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">PDF File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                  />
                  {file && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all"
                  >
                    {editingDoc ? 'Update Document' : 'Upload Document'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">delete</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirm Delete</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete <span className="font-semibold">{docToDelete.project_name}</span>?
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
                >
                  {deletingId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDocumentation;
