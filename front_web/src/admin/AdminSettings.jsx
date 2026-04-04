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
    projectDisplayName: 'Portfolio Projects',
    heroHeading: 'ENGINEERED PRECISION. ISOFORM PRIME.',
    heroSubheading: 'Architecting the future of high-frequency deployments with surgical accuracy and clinical performance metrics.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrXEeYK7RxE0S_zQDdZb31pqpsxaASgmUhbPl_WRSo2SwfxzLQJgqTD7qbudBERjnNEbk9mHPByY8JfIJxLAK8_ksMB84SflWIS2DUxCeEBL_QkYyp_sna5QRFdbFHdv3ly4yezaWwV91RLMUyocrJm66GXd5coklbKERUkmfl7y_JBmiEVQ71bO0RILvYUmsKRtJWPXTD9z6SyonIbjSdKIVz_zp0tNfLdK8ocY8CeqDZTJLRsUdlkqgrCTaluQSQu2uKAz62p80',
    heroButton1Text: 'Initiate Deployment',
    heroButton1Url: '/admin',
    heroButton1IsPrimary: true,
    heroButton2Text: 'View Technical Specs',
    heroButton2Url: '#',
    heroButton2IsPrimary: false,
    // Hero Styling Settings
    heroHeadingFontFamily: 'Inter, sans-serif',
    heroHeadingFontSize: '4rem',
    heroSubheadingFontFamily: 'Inter, sans-serif',
    heroSubheadingFontSize: '1.125rem',
    heroImageWidth: '100%',
    heroImageHeight: 'auto'
  });
  const [navbarLinks, setNavbarLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('branding');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');
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
      formData.append('hero_heading', siteSettings.heroHeading);
      formData.append('hero_subheading', siteSettings.heroSubheading);
      formData.append('hero_button1_text', siteSettings.heroButton1Text);
      formData.append('hero_button1_url', siteSettings.heroButton1Url);
      formData.append('hero_button1_is_primary', siteSettings.heroButton1IsPrimary);
      formData.append('hero_button2_text', siteSettings.heroButton2Text);
      formData.append('hero_button2_url', siteSettings.heroButton2Url);
      formData.append('hero_button2_is_primary', siteSettings.heroButton2IsPrimary);

      // Hero Styling Settings
      formData.append('hero_heading_font_family', siteSettings.heroHeadingFontFamily);
      formData.append('hero_heading_font_size', siteSettings.heroHeadingFontSize);
      formData.append('hero_subheading_font_family', siteSettings.heroSubheadingFontFamily);
      formData.append('hero_subheading_font_size', siteSettings.heroSubheadingFontSize);
      formData.append('hero_image_width', siteSettings.heroImageWidth);
      formData.append('hero_image_height', siteSettings.heroImageHeight);

      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (siteSettings.logo && siteSettings.logo.startsWith('http')) {
        // If it's a URL, don't send it (keep existing logo)
      }

      if (heroImageFile) {
        formData.append('hero_image', heroImageFile);
      } else if (siteSettings.heroImage && siteSettings.heroImage.startsWith('http')) {
        // If it's a URL, don't send it (keep existing hero image)
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

  const handleHeroImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUrlChange = (value) => {
    setSiteSettings({ ...siteSettings, heroImage: value });
    setHeroImagePreview(value);
    setHeroImageFile(null);
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
            projectDisplayName: data.project_display_name || 'Portfolio Projects',
            heroHeading: data.hero_heading || 'ENGINEERED PRECISION. ISOFORM PRIME.',
            heroSubheading: data.hero_subheading || 'Architecting the future of high-frequency deployments with surgical accuracy and clinical performance metrics.',
            heroImage: data.hero_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrXEeYK7RxE0S_zQDdZb31pqpsxaASgmUhbPl_WRSo2SwfxzLQJgqTD7qbudBERjnNEbk9mHPByY8JfIJxLAK8_ksMB84SflWIS2DUxCeEBL_QkYyp_sna5QRFdbFHdv3ly4yezaWwV91RLMUyocrJm66GXd5coklbKERUkmfl7y_JBmiEVQ71bO0RILvYUmsKRtJWPXTD9z6SyonIbjSdKIVz_zp0tNfLdK8ocY8CeqDZTJLRsUdlkqgrCTaluQSQu2uKAz62p80',
            heroButton1Text: data.hero_button1_text || 'Initiate Deployment',
            heroButton1Url: data.hero_button1_url || '/admin',
            heroButton1IsPrimary: data.hero_button1_is_primary !== undefined ? data.hero_button1_is_primary : true,
            heroButton2Text: data.hero_button2_text || 'View Technical Specs',
            heroButton2Url: data.hero_button2_url || '#',
            heroButton2IsPrimary: data.hero_button2_is_primary !== undefined ? data.hero_button2_is_primary : false,
            // Hero Styling Settings
            heroHeadingFontFamily: data.hero_heading_font_family || 'Inter, sans-serif',
            heroHeadingFontSize: data.hero_heading_font_size || '4rem',
            heroSubheadingFontFamily: data.hero_subheading_font_family || 'Inter, sans-serif',
            heroSubheadingFontSize: data.hero_subheading_font_size || '1.125rem',
            heroImageWidth: data.hero_image_width || '100%',
            heroImageHeight: data.hero_image_height || 'auto'
          });
          setLogoPreview(data.logo || '');
          setHeroImagePreview(data.hero_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrXEeYK7RxE0S_zQDdZb31pqpsxaASgmUhbPl_WRSo2SwfxzLQJgqTD7qbudBERjnNEbk9mHPByY8JfIJxLAK8_ksMB84SflWIS2DUxCeEBL_QkYyp_sna5QRFdbFHdv3ly4yezaWwV91RLMUyocrJm66GXd5coklbKERUkmfl7y_JBmiEVQ71bO0RILvYUmsKRtJWPXTD9z6SyonIbjSdKIVz_zp0tNfLdK8ocY8CeqDZTJLRsUdlkqgrCTaluQSQu2uKAz62p80');
        }

        // Set default navbar links since endpoint doesn't exist yet
        setNavbarLinks([
          { id: 1, title: 'Home', url: '/', order: 0, is_active: true, open_in_new_tab: false },
          { id: 2, title: 'Projects', url: '/projects', order: 1, is_active: true, open_in_new_tab: false },
          { id: 3, title: 'Developers', url: '/developers', order: 2, is_active: true, open_in_new_tab: false },
          { id: 4, title: 'Resources', url: '/resources', order: 3, is_active: true, open_in_new_tab: false },
          { id: 5, title: 'Reviews', url: '/reviews', order: 4, is_active: true, open_in_new_tab: false },
          { id: 6, title: 'Contact', url: '/contact', order: 5, is_active: true, open_in_new_tab: false },
          { id: 7, title: 'Hiring', url: '/hiring', order: 6, is_active: true, open_in_new_tab: false },
          { id: 8, title: 'Book Demo', url: '/book-demo', order: 7, is_active: true, open_in_new_tab: false },
          { id: 9, title: 'Sign Up', url: '/signup', order: 8, is_active: true, open_in_new_tab: false }
        ]);

      } catch (error) {
        console.error('Error fetching site settings:', error);
        // Set default values if API fails
        setNavbarLinks([
          { id: 1, title: 'Home', url: '/', order: 0, is_active: true, open_in_new_tab: false },
          { id: 2, title: 'Projects', url: '/projects', order: 1, is_active: true, open_in_new_tab: false },
          { id: 3, title: 'Developers', url: '/developers', order: 2, is_active: true, open_in_new_tab: false },
          { id: 4, title: 'Resources', url: '/resources', order: 3, is_active: true, open_in_new_tab: false },
          { id: 5, title: 'Reviews', url: '/reviews', order: 4, is_active: true, open_in_new_tab: false },
          { id: 6, title: 'Contact', url: '/contact', order: 5, is_active: true, open_in_new_tab: false },
          { id: 7, title: 'Hiring', url: '/hiring', order: 6, is_active: true, open_in_new_tab: false },
          { id: 8, title: 'Book Demo', url: '/book-demo', order: 7, is_active: true, open_in_new_tab: false },
          { id: 9, title: 'Sign Up', url: '/signup', order: 8, is_active: true, open_in_new_tab: false }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'branding', label: 'Branding' },
    { id: 'hero', label: 'Hero Section' },
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

        {/* Hero Section Settings */}
        {activeTab === 'hero' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">home</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hero Section</h2>
              </div>
            </div>
            <div className="p-8 space-y-8">
              {/* Hero Heading */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Hero Heading</label>
                <textarea
                  value={siteSettings.heroHeading}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroHeading: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                  placeholder="ENGINEERED PRECISION. ISOFORM PRIME."
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Main heading displayed in the hero section. You can use line breaks for multi-line text.</p>
              </div>

              {/* Hero Subheading */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Hero Subheading</label>
                <textarea
                  value={siteSettings.heroSubheading}
                  onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheading: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                  placeholder="Architecting the future of high-frequency deployments with surgical accuracy and clinical performance metrics."
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Descriptive text that appears below the main heading.</p>
              </div>

              {/* Hero Image */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Hero Right Side Image</label>

                {/* Hero Image Preview */}
                {heroImagePreview && (
                  <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-4">
                    <img
                      src={heroImagePreview}
                      alt="Hero image preview"
                      className="w-full h-full object-cover bg-slate-100 dark:bg-slate-800"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200/f3f4f6/1f2937?text=HERO+IMAGE';
                      }}
                    />
                  </div>
                )}

                {/* Hero Image Upload Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-sm">upload</span>
                      <span>Upload Hero Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageFileChange}
                        className="hidden"
                      />
                    </label>
                    {heroImageFile && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
                        Selected: {heroImageFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={siteSettings.heroImage}
                      onChange={(e) => handleHeroImageUrlChange(e.target.value)}
                      placeholder="Or enter hero image URL..."
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommended size: 800x600px. This image appears on the right side of the hero section.</p>
              </div>

              {/* Hero Buttons */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hero Section Buttons</h3>

                {/* Button 1 */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">Primary Button</h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={siteSettings.heroButton1IsPrimary}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroButton1IsPrimary: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Make this primary</span>
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Button Text</label>
                      <input
                        type="text"
                        value={siteSettings.heroButton1Text}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroButton1Text: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Initiate Deployment"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Button URL</label>
                      <input
                        type="text"
                        value={siteSettings.heroButton1Url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroButton1Url: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="/admin"
                      />
                    </div>
                  </div>
                </div>

                {/* Button 2 */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">Secondary Button</h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={siteSettings.heroButton2IsPrimary}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroButton2IsPrimary: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Make this primary</span>
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Button Text</label>
                      <input
                        type="text"
                        value={siteSettings.heroButton2Text}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroButton2Text: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="View Technical Specs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Button URL</label>
                      <input
                        type="text"
                        value={siteSettings.heroButton2Url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroButton2Url: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="#"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Styling Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hero Section Styling</h3>

                {/* Heading Typography */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Heading Typography</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Font Family</label>
                      <select
                        value={siteSettings.heroHeadingFontFamily}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadingFontFamily: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="Inter, sans-serif">Inter (Default)</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                        <option value="system-ui, sans-serif">System UI</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Font Size</label>
                      <input
                        type="text"
                        value={siteSettings.heroHeadingFontSize}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadingFontSize: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="4rem"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use CSS units like rem, px, em (e.g., 4rem, 64px)</p>
                    </div>
                  </div>
                </div>

                {/* Subheading Typography */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Subheading Typography</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Font Family</label>
                      <select
                        value={siteSettings.heroSubheadingFontFamily}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheadingFontFamily: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="Inter, sans-serif">Inter (Default)</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                        <option value="system-ui, sans-serif">System UI</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Font Size</label>
                      <input
                        type="text"
                        value={siteSettings.heroSubheadingFontSize}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheadingFontSize: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="1.125rem"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use CSS units like rem, px, em (e.g., 1.125rem, 18px)</p>
                    </div>
                  </div>
                </div>

                {/* Image Sizing */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Hero Image Sizing</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Image Width</label>
                      <input
                        type="text"
                        value={siteSettings.heroImageWidth}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroImageWidth: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="100%"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use CSS units like %, px, rem (e.g., 100%, 500px)</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Image Height</label>
                      <input
                        type="text"
                        value={siteSettings.heroImageHeight}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroImageHeight: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="auto"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use CSS units like auto, px, rem (e.g., auto, 400px)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Live Preview</h4>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                      {siteSettings.heroHeading.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < siteSettings.heroHeading.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {siteSettings.heroSubheading}
                    </p>

                    {/* Button Preview */}
                    <div className="flex flex-wrap gap-3">
                      {(siteSettings.heroButton1IsPrimary || !siteSettings.heroButton2IsPrimary) && siteSettings.heroButton1Text && (
                        <div className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-full">
                          {siteSettings.heroButton1Text}
                        </div>
                      )}
                      {siteSettings.heroButton2IsPrimary && siteSettings.heroButton2Text && (
                        <div className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-full">
                          {siteSettings.heroButton2Text}
                        </div>
                      )}
                      {!siteSettings.heroButton1IsPrimary && siteSettings.heroButton2IsPrimary && siteSettings.heroButton1Text && (
                        <div className="px-6 py-3 bg-surface-container-high text-slate-900 dark:text-white text-sm font-bold rounded-full">
                          {siteSettings.heroButton1Text}
                        </div>
                      )}
                      {siteSettings.heroButton1IsPrimary && !siteSettings.heroButton2IsPrimary && siteSettings.heroButton2Text && (
                        <div className="px-6 py-3 bg-surface-container-high text-slate-900 dark:text-white text-sm font-bold rounded-full">
                          {siteSettings.heroButton2Text}
                        </div>
                      )}
                      {!siteSettings.heroButton1IsPrimary && !siteSettings.heroButton2IsPrimary && siteSettings.heroButton1Text && (
                        <div className="px-6 py-3 bg-surface-container-high text-slate-900 dark:text-white text-sm font-bold rounded-full">
                          {siteSettings.heroButton1Text}
                        </div>
                      )}
                      {!siteSettings.heroButton1IsPrimary && !siteSettings.heroButton2IsPrimary && siteSettings.heroButton2Text && (
                        <div className="px-6 py-3 bg-surface-container-high text-slate-900 dark:text-white text-sm font-bold rounded-full">
                          {siteSettings.heroButton2Text}
                        </div>
                      )}
                    </div>
                  </div>
                  {heroImagePreview && (
                    <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={heroImagePreview}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">This is how your hero section will appear on the home page.</p>
              </div>

              <button
                onClick={handleSaveSiteSettings}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Save Hero Settings
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
