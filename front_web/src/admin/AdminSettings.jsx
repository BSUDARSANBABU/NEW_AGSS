import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { apiService } from '../services/api';

const AdminSettings = () => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'AI Developer Platform',
    devforgeText: 'DevForge',
    beforeLogo: 'Innovate • Build • Deploy',
    logo: '',
    favicon: '',
    mainHeading: 'Welcome to Our Platform',
    subHeading: 'Building amazing digital experiences',
    projectDisplayName: 'Portfolio Projects'
  });
  const [navbarLinks, setNavbarLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('branding');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    url: '',
    order: 0,
    is_active: true,
    open_in_new_tab: false
  });

  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are allowed
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateLinkForm = () => {
    const newErrors = {};

    if (!linkFormData.title.trim()) {
      newErrors.title = 'Link title is required';
    }

    if (!linkFormData.url.trim()) {
      newErrors.url = 'Link URL is required';
    } else if (!validateUrl(linkFormData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSiteSettings = () => {
    const newErrors = {};

    if (!siteSettings.siteName.trim()) {
      newErrors.siteName = 'Site name is required';
    }

    if (!siteSettings.mainHeading.trim()) {
      newErrors.mainHeading = 'Main heading is required';
    }

    if (!siteSettings.subHeading.trim()) {
      newErrors.subHeading = 'Sub heading is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSiteSettings = async () => {
    if (!validateSiteSettings()) return;

    try {
      const formData = new FormData();

      // Map frontend field names to backend field names
      formData.append('heading', siteSettings.devforgeText);
      formData.append('subheading', siteSettings.subHeading);

      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (siteSettings.logo && siteSettings.logo.startsWith('http')) {
        // If it's a URL, don't send it (keep existing logo)
      }

      await apiService.updateSiteSettings(formData);
      alert('Site settings saved successfully!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Error saving site settings');
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (value) => {
    setSiteSettings({ ...siteSettings, logo: value });
    setLogoPreview(value);
    setLogoFile(null);
  };

  const handleAddLink = () => {
    if (!validateLinkForm()) return;

    const newLink = {
      ...linkFormData,
      id: Date.now(),
      order: navbarLinks.length
    };

    setNavbarLinks([...navbarLinks, newLink]);
    setLinkFormData({
      title: '',
      url: '',
      order: 0,
      is_active: true,
      open_in_new_tab: false
    });
    setIsLinkModalOpen(false);
    setErrors({});
  };

  const handleUpdateLink = () => {
    if (!validateLinkForm()) return;

    setNavbarLinks(navbarLinks.map(link =>
      link.id === editingLink.id
        ? { ...linkFormData, id: editingLink.id }
        : link
    ));

    setLinkFormData({
      title: '',
      url: '',
      order: 0,
      is_active: true,
      open_in_new_tab: false
    });
    setEditingLink(null);
    setIsLinkModalOpen(false);
    setErrors({});
  };

  const handleDeleteLink = (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setNavbarLinks(navbarLinks.filter(link => link.id !== id));
    }
  };

  const openLinkModal = (link = null) => {
    if (link) {
      setEditingLink(link);
      setLinkFormData({
        title: link.title,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
        open_in_new_tab: link.open_in_new_tab
      });
    } else {
      setEditingLink(null);
      setLinkFormData({
        title: '',
        url: '',
        order: navbarLinks.length,
        is_active: true,
        open_in_new_tab: false
      });
    }
    setIsLinkModalOpen(true);
    setErrors({});
  };

  const moveLink = (id, direction) => {
    const index = navbarLinks.findIndex(link => link.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === navbarLinks.length - 1)
    ) {
      return;
    }

    const newLinks = [...navbarLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap positions
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

    // Update order values
    newLinks.forEach((link, i) => {
      link.order = i;
    });

    setNavbarLinks(newLinks);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch site settings
        const settingsResponse = await apiService.getSiteSettings();
        if (settingsResponse.data && settingsResponse.data.length > 0) {
          const data = settingsResponse.data[0];
          setSiteSettings({
            siteName: data.site_name || 'AI Developer Platform',
            devforgeText: data.heading || 'DevForge',
            beforeLogo: data.before_logo || 'Innovate • Build • Deploy',
            logo: data.logo || '',
            favicon: data.favicon || '',
            mainHeading: data.main_heading || 'Welcome to Our Platform',
            subHeading: data.subheading || 'Building amazing digital experiences',
            projectDisplayName: data.project_display_name || 'Portfolio Projects'
          });
          setLogoPreview(data.logo || '');
        }

        // Set default navbar links since endpoint doesn't exist yet
        setNavbarLinks([
          { id: 1, title: 'Home', url: '/', order: 0, is_active: true, open_in_new_tab: false },
          { id: 2, title: 'Projects', url: '/projects', order: 1, is_active: true, open_in_new_tab: false },
          { id: 3, title: 'Developers', url: '/developers', order: 2, is_active: true, open_in_new_tab: false },
          { id: 4, title: 'Hiring', url: '/hiring', order: 3, is_active: true, open_in_new_tab: false }
        ]);

      } catch (error) {
        console.error('Error fetching site settings:', error);
        // Set default values if API fails
        setNavbarLinks([
          { id: 1, title: 'Home', url: '/', order: 0, is_active: true, open_in_new_tab: false },
          { id: 2, title: 'Projects', url: '/projects', order: 1, is_active: true, open_in_new_tab: false },
          { id: 3, title: 'Developers', url: '/developers', order: 2, is_active: true, open_in_new_tab: false },
          { id: 4, title: 'Hiring', url: '/hiring', order: 3, is_active: true, open_in_new_tab: false }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'branding', label: 'Branding' },
    { id: 'navbar', label: 'Navbar' }
  ];

  if (loading) {
    return (
      <AdminLayout title="Site Settings">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Settings Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage site configuration, branding, and navigation settings.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Site Settings</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">8</span>
              <span className="text-primary font-bold text-sm">FIELDS</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Nav Links</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{navbarLinks.length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Configuration</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">2</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">TABS</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Status</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">LIVE</span>
              <span className="text-green-600 dark:text-green-400 font-bold text-sm">ONLINE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Branding Settings */}
        {activeTab === 'branding' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">palette</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Branding & Content</h2>
              </div>
            </div>
            <div className="p-8 space-y-8">
              {/* Logo Management */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Site Logo</label>

                {/* Logo Preview */}
                {logoPreview && (
                  <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-4">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain bg-slate-100 dark:bg-slate-800"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/128x64/f3f4f6/1f2937?text=LOGO';
                      }}
                    />
                  </div>
                )}

                {/* Logo Upload Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-sm">upload</span>
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                      />
                    </label>
                    {logoFile && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
                        Selected: {logoFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={siteSettings.logo}
                      onChange={(e) => handleLogoUrlChange(e.target.value)}
                      placeholder="Or enter logo URL..."
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Live Preview</h4>
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{siteSettings.beforeLogo}</span>
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary">{siteSettings.devforgeText}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This is how your branding elements will appear in the header.</p>
              </div>

              {/* Site Information */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Site Name</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none ${errors.siteName ? 'ring-2 ring-red-500' : ''}`}
                  />
                  {errors.siteName && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.siteName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">DevForge Text</label>
                  <input
                    type="text"
                    value={siteSettings.devforgeText}
                    onChange={(e) => setSiteSettings({ ...siteSettings, devforgeText: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="DevForge"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Before Logo Text</label>
                  <input
                    type="text"
                    value={siteSettings.beforeLogo}
                    onChange={(e) => setSiteSettings({ ...siteSettings, beforeLogo: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Innovate • Build • Deploy"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Project Display Name</label>
                  <input
                    type="text"
                    value={siteSettings.projectDisplayName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, projectDisplayName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Portfolio Projects"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Main Heading</label>
                  <input
                    type="text"
                    value={siteSettings.mainHeading}
                    onChange={(e) => setSiteSettings({ ...siteSettings, mainHeading: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none ${errors.mainHeading ? 'ring-2 ring-red-500' : ''}`}
                  />
                  {errors.mainHeading && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.mainHeading}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Sub Heading</label>
                  <input
                    type="text"
                    value={siteSettings.subHeading}
                    onChange={(e) => setSiteSettings({ ...siteSettings, subHeading: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none ${errors.subHeading ? 'ring-2 ring-red-500' : ''}`}
                  />
                  {errors.subHeading && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.subHeading}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Favicon URL</label>
                  <input
                    type="url"
                    value={siteSettings.favicon}
                    onChange={(e) => setSiteSettings({ ...siteSettings, favicon: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-500"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSiteSettings}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Save Branding Settings
              </button>
            </div>
          </div>
        )}

        {/* Navbar Settings */}
        {activeTab === 'navbar' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">menu</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Navigation Links</h2>
                </div>
                <button
                  onClick={() => openLinkModal()}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Link
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {navbarLinks.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">menu</span>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No navbar links</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Add your first navigation link to get started.</p>
                    <button
                      onClick={() => openLinkModal()}
                      className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add First Link
                    </button>
                  </div>
                ) : (
                  navbarLinks
                    .sort((a, b) => a.order - b.order)
                    .map((link, index) => (
                      <div key={link.id} className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-500 w-4">{index + 1}</span>
                              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">link</span>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{link.title}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {link.is_active ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-full text-xs font-bold uppercase tracking-widest">
                                  Active
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">
                                  Inactive
                                </span>
                              )}
                              {link.open_in_new_tab && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-bold uppercase tracking-widest">
                                  New Tab
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveLink(link.id, 'up')}
                                disabled={index === 0}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                              </button>
                              <button
                                onClick={() => moveLink(link.id, 'down')}
                                disabled={index === navbarLinks.length - 1}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                              </button>
                            </div>

                            <button
                              onClick={() => openLinkModal(link)}
                              className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h2>
                <button onClick={() => setIsLinkModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Link Title</label>
                  <input
                    type="text"
                    value={linkFormData.title}
                    onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none ${errors.title ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="Home"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Link URL</label>
                  <input
                    type="text"
                    value={linkFormData.url}
                    onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none ${errors.url ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="/"
                  />
                  {errors.url && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.url}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={linkFormData.is_active}
                      onChange={(e) => setLinkFormData({ ...linkFormData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Active</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={linkFormData.open_in_new_tab}
                      onChange={(e) => setLinkFormData({ ...linkFormData, open_in_new_tab: e.target.checked })}
                      className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Open in new tab</span>
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(false)}
                    className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingLink ? handleUpdateLink : handleAddLink}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    {editingLink ? 'Update Link' : 'Add Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;
