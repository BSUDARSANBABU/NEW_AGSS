import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import apiService from '../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_image: '',
    project_images: [],
    github_repo: '',
    live_link: '',
    technologies_used: '',
    is_featured: false,
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      project_image: '',
      project_images: [],
      github_repo: '',
      live_link: '',
      technologies_used: '',
      is_featured: false,
      status: 'Active'
    });
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      project_image: project.project_image || '',
      project_images: project.project_images || [],
      github_repo: project.github_repo || '',
      live_link: project.live_link || '',
      technologies_used: project.technologies_used || '',
      is_featured: project.is_featured || false,
      status: project.status || 'Active'
    });
    setShowForm(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiService.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'project_images') {
          submitData.append(key, formData[key]);
        }
      });

      // Add multiple images
      if (formData.project_images && formData.project_images.length > 0) {
        formData.project_images.forEach(file => {
          submitData.append('project_images', file);
        });
      }

      if (editingProject) {
        // Update existing project
        const updatedProject = await apiService.updateProject(editingProject.id, submitData);
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      } else {
        // Create new project
        const newProject = await apiService.createProject(submitData);
        setProjects([...projects, newProject]);
      }

      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' && name === 'project_images' ? Array.from(files) : (type === 'file' ? files[0] : value))
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      project_image: '',
      project_images: [],
      github_repo: '',
      live_link: '',
      technologies_used: '',
      is_featured: false,
      status: 'Active'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Projects Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading projects...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Projects Management">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects Management</h1>
        <button
          onClick={handleAddProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found. Add your first project to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.project_image ? (
                        <img
                          src={project.project_image}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      ) : project.project_images && project.project_images.length > 0 ? (
                        <img
                          src={project.project_images[0].image}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      ) : null}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                        {project.project_images && project.project_images.length > 1 && (
                          <div className="text-xs text-blue-600">{project.project_images.length} images</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{project.technologies_used}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : project.status === 'Inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {project.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.is_featured
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {project.is_featured ? 'Featured' : 'Not Featured'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Project Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma separated)</label>
                  <input
                    type="text"
                    name="technologies_used"
                    value={formData.technologies_used}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="React, Node.js, AWS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repo</label>
                    <input
                      type="text"
                      name="github_repo"
                      value={formData.github_repo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live Link</label>
                    <input
                      type="text"
                      name="live_link"
                      value={formData.live_link}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Images (Multiple)</label>
                    <input
                      type="file"
                      name="project_images"
                      onChange={handleInputChange}
                      accept="image/*"
                      multiple
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.project_images && formData.project_images.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {formData.project_images.length} image(s) selected
                      </div>
                    )}
                    {editingProject && editingProject.project_images && editingProject.project_images.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Current Images:</p>
                        <div className="flex flex-wrap gap-2">
                          {editingProject.project_images.map((img, index) => (
                            <div key={index} className="relative">
                              <img
                                src={img.image}
                                alt={`${editingProject.title} - Image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded border border-gray-300"
                              />
                              {img.is_featured && (
                                <span className="absolute top-0 right-0 bg-yellow-400 text-xs px-1 rounded-bl">★</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm font-medium text-gray-700">
                    Feature this project on the homepage
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
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

export default AdminProjects;
