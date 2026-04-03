import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { apiService } from '../services/api';

const AdminFooter = () => {
  const [footerData, setFooterData] = useState({
    email: '',
    phone: '',
    address: '',
    company_description: '',
    social_links: {},
    copyright_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFooter();
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        setFooterData({
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          company_description: data.company_description || '',
          social_links: data.social_links || {},
          copyright_text: data.copyright_text || ''
        });
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      // Don't set error state on 404, as it might mean no footer exists yet
      if (error.response?.status !== 404) {
        setErrors({ general: 'Failed to load footer data' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSocialLinkChange = (platform, url) => {
    setFooterData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: url
      }
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      handleSocialLinkChange(newSocialLink.platform, newSocialLink.url);
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const removeSocialLink = (platform) => {
    const newSocialLinks = { ...footerData.social_links };
    delete newSocialLinks[platform];
    setFooterData(prev => ({
      ...prev,
      social_links: newSocialLinks
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!footerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(footerData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!footerData.address) {
      newErrors.address = 'Address is required';
    }

    if (!footerData.company_description) {
      newErrors.company_description = 'Company description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setErrors({});
      setSuccess(false);

      let footerId = null;
      try {
        const response = await apiService.getFooter();
        footerId = response.data[0]?.id;
      } catch (error) {
        // Footer doesn't exist yet, will create new one
        console.log('No existing footer found, creating new one');
      }

      if (footerId) {
        // Update existing footer
        await apiService.updateFooter(footerId, footerData);
      } else {
        // Create new footer
        await apiService.createFooter(footerData);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving footer data:', error);
      setErrors({ general: 'Failed to save footer data' });
    } finally {
      setSaving(false);
    }
  };

  const socialPlatforms = [
    { name: 'facebook', color: 'text-blue-600' },
    { name: 'twitter', color: 'text-sky-500' },
    { name: 'linkedin', color: 'text-blue-700' },
    { name: 'instagram', color: 'text-pink-600' },
    { name: 'website', color: 'text-green-600' }
  ];

  if (loading) {
    return (
      <AdminLayout title="Footer Settings">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading footer settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Footer Settings">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Footer Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage footer contact information, company details, and social links.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Contact Fields</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">3</span>
              <span className="text-primary font-bold text-sm">ITEMS</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Social Links</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{Object.keys(footerData.social_links).length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Status</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{footerData.email ? '1' : '0'}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">CONFIGURED</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Last Updated</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">NOW</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">REFRESH</span>
            </div>
          </div>
        </div>
      </section>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
          <span className="text-green-700 dark:text-green-300 font-medium">Footer settings saved successfully!</span>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
          <span className="text-red-700 dark:text-red-300 font-medium">{errors.general}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">business</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                <span className="material-symbols-outlined text-sm align-middle mr-2">mail</span>
                Email Address
              </label>
              <input
                type="email"
                value={footerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                placeholder="contact@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                <span className="material-symbols-outlined text-sm align-middle mr-2">phone</span>
                Phone Number
              </label>
              <input
                type="tel"
                value={footerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                <span className="material-symbols-outlined text-sm align-middle mr-2">location_on</span>
                Address
              </label>
              <textarea
                value={footerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none ${errors.address ? 'ring-2 ring-red-500' : ''}`}
                rows={3}
                placeholder="123 Business Street, City, State 12345"
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                <span className="material-symbols-outlined text-sm align-middle mr-2">description</span>
                Company Description
              </label>
              <textarea
                value={footerData.company_description}
                onChange={(e) => handleInputChange('company_description', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none ${errors.company_description ? 'ring-2 ring-red-500' : ''}`}
                rows={4}
                placeholder="Brief description of your company for the footer"
              />
              {errors.company_description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.company_description}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={footerData.copyright_text}
                onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">link</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Social Links</h2>
            </div>
          </div>
          <div className="p-8 space-y-6">
            {/* Existing Social Links */}
            {Object.entries(footerData.social_links).map(([platform, url]) => {
              const platformData = socialPlatforms.find(p => p.name === platform);
              const IconComponent = platformData?.icon || 'link';

              return (
                <div key={platform} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-lg ${platformData?.color || 'text-slate-400'}`}>
                    {platform === 'facebook' ? 'facebook' :
                      platform === 'twitter' ? 'twitter' :
                        platform === 'linkedin' ? 'linkedin' :
                          platform === 'instagram' ? 'instagram' : 'language'}
                  </span>
                  <input
                    type="text"
                    value={platform}
                    readOnly
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none text-slate-500 capitalize font-medium"
                  />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="https://..."
                  />
                  <button
                    onClick={() => removeSocialLink(platform)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              );
            })}

            {/* Add New Social Link */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Add New Social Link</h3>
              <div className="flex items-center gap-3">
                <select
                  value={newSocialLink.platform}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select platform</option>
                  {socialPlatforms.map(platform => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="https://..."
                />
                <button
                  onClick={addSocialLink}
                  disabled={!newSocialLink.platform || !newSocialLink.url}
                  className="p-3 bg-primary text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={fetchFooterData}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {saving ? (
            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-sm">save</span>
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminFooter;
