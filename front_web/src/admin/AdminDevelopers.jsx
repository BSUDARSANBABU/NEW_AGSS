import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import apiService from '../services/api';

const AdminDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    skills: '',
    experience_years: 0,
    github_link: '',
    linkedin_link: '',
    is_active: true,
    profile_image: null
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const data = await apiService.getDevelopers();
      setDevelopers(data);
    } catch (err) {
      console.error('Failed to fetch developers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeveloper = () => {
    setEditingDeveloper(null);
    setCurrentImage(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      skills: '',
      experience_years: 0,
      github_link: '',
      linkedin_link: '',
      is_active: true,
      profile_image: null
    });
    setShowForm(true);
  };

  const handleEditDeveloper = (developer) => {
    setEditingDeveloper(developer);
    setCurrentImage(developer.profile_image);
    setFormData({
      name: developer.name || '',
      title: developer.title || '',
      bio: developer.bio || '',
      skills: developer.skills || '',
      experience_years: developer.experience_years || 0,
      github_link: developer.github_link || '',
      linkedin_link: developer.linkedin_link || '',
      is_active: developer.is_active !== false,
      profile_image: null
    });
    setShowForm(true);
  };

  const handleDeleteDeveloper = async (developerId) => {
    if (window.confirm('Are you sure you want to delete this developer?')) {
      try {
        await apiService.deleteDeveloper(developerId);
        setDevelopers(developers.filter(d => d.id !== developerId));
      } catch (err) {
        console.error('Failed to delete developer:', err);
        alert('Failed to delete developer');
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
        if (key !== 'profile_image') {
          submitData.append(key, formData[key]);
        }
      });

      // Add file if selected - use correct field name for backend
      if (formData.profile_image && formData.profile_image instanceof File) {
        console.log('Adding profile image file:', formData.profile_image.name);
        submitData.append('profile_image', formData.profile_image);
      } else {
        console.log('No profile image file to upload');
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      if (editingDeveloper) {
        // Update existing developer
        const updatedDeveloper = await apiService.updateDeveloper(editingDeveloper.id, submitData);
        setDevelopers(developers.map(d => d.id === editingDeveloper.id ? updatedDeveloper : d));
      } else {
        // Create new developer
        const newDeveloper = await apiService.createDeveloper(submitData);
        setDevelopers([...developers, newDeveloper]);
      }

      setShowForm(false);
      setEditingDeveloper(null);
      setCurrentImage(null);
    } catch (err) {
      console.error('Failed to save developer:', err);
      alert('Failed to save developer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    console.log('Input changed:', { name, value, type, checked, files: files?.length });

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : (type === 'file' ? files[0] : value))
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDeveloper(null);
    setCurrentImage(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      skills: '',
      experience_years: 0,
      github_link: '',
      linkedin_link: '',
      is_active: true,
      profile_image: null
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Developers Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading developers...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Developers Management">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Developers Management</h1>
        <button
          onClick={handleAddDeveloper}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Developer
        </button>
      </div>

      {developers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No developers found. Add your first developer to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {developers.map((dev) => (
                <tr key={dev.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {dev.profile_image && (
                        <img
                          src={dev.profile_image}
                          alt={dev.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dev.name}</div>
                        <div className="text-sm text-gray-500">{dev.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dev.skills}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dev.experience_years} years</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dev.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {dev.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditDeveloper(dev)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDeveloper(dev.id)}
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

      {/* Add/Edit Developer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingDeveloper ? 'Edit Developer' : 'Add New Developer'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="React, Python, Django"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                    <input
                      type="file"
                      name="profile_image"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.profile_image && formData.profile_image instanceof File && (
                      <div className="mt-2 text-sm text-green-600">
                        New image selected: {formData.profile_image.name}
                      </div>
                    )}
                    {currentImage && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <img
                          src={currentImage}
                          alt="Current profile"
                          className="w-20 h-20 rounded-full object-cover border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                    <input
                      type="url"
                      name="github_link"
                      value={formData.github_link}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedin_link"
                      value={formData.linkedin_link}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
                    Active Developer
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
                    {submitting ? 'Saving...' : (editingDeveloper ? 'Update Developer' : 'Create Developer')}
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

export default AdminDevelopers;
