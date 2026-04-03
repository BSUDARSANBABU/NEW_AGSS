import React, { useState, useEffect } from 'react';
import { PublicLayout } from './PublicLayout';
import { Search, ArrowRight, Download, Bookmark, ChevronLeft, ChevronRight, Terminal, Settings2, Calendar, User, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

export const Resources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    tool_type: '',
    date_from: '',
    date_to: '',
    search: '',
    sorting: '-created_at'
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // Fetch all resources without filtering - we'll filter client-side
        const data = await apiService.getResources();
        setResources(data);

        // Extract unique authors
        const uniqueAuthors = [...new Set(data.map(r => r.author_name).filter(Boolean))];
        setAuthors(uniqueAuthors);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []); // Only fetch once on mount

  useEffect(() => {
    let filtered = resources;

    // Apply category filter from activeFilter (main filter buttons)
    if (activeFilter !== 'All') {
      filtered = filtered.filter(resource => resource.category === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply advanced filters
    if (filters.category) {
      filtered = filtered.filter(resource => resource.category === filters.category);
    }

    if (filters.author) {
      filtered = filtered.filter(resource => resource.author_name === filters.author);
    }

    if (filters.tool_type) {
      filtered = filtered.filter(resource => resource.tool_type === filters.tool_type);
    }

    if (filters.date_from) {
      filtered = filtered.filter(resource => new Date(resource.published_on) >= new Date(filters.date_from));
    }

    if (filters.date_to) {
      filtered = filtered.filter(resource => new Date(resource.published_on) <= new Date(filters.date_to));
    }

    setFilteredResources(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, resources, filters, activeFilter]);

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return null;
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://localhost:8000${thumbnail}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      tool_type: '',
      date_from: '',
      date_to: '',
      search: '',
      sorting: '-created_at'
    });
    setSearchTerm('');
    setActiveFilter('All');
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '') || activeFilter !== 'All' || searchTerm !== '';
  };

  const handleResourceClick = (resourceId) => {
    navigate(`/resources/${resourceId}`);
  };

  const toggleBookmark = (resourceId) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(resourceId)) {
      newBookmarks.delete(resourceId);
    } else {
      newBookmarks.add(resourceId);
    }
    setBookmarkedItems(newBookmarks);
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'blog':
        return 'bg-secondary-container text-secondary';
      case 'guide':
        return 'bg-tertiary-fixed text-[#4b5675]';
      case 'tool':
        return 'bg-primary-fixed text-primary';
      default:
        return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'tool':
        return <Settings2 className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getActionText = (category) => {
    switch (category?.toLowerCase()) {
      case 'tool':
        return 'Get Started';
      default:
        return 'Read Now';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const featuredResource = resources.find(r => r.category === 'GUIDE') || resources[0];

  if (loading) {
    return (
      <PublicLayout activeTab="resources">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading resources...</div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout activeTab="resources">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-error">{error}</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout activeTab="resources">
      {/* Search and Filter Section */}
      <section className="mb-12 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl w-full">
            <h1 className="text-4xl font-extrabold tracking-tighter mb-6 text-on-surface">Resources</h1>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                <Search className="w-5 h-5" />
              </div>
              <input
                className="w-full bg-surface-container-lowest border-none py-4 pl-12 pr-4 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] outline outline-1 outline-outline-variant/20"
                placeholder="Search technical documentation, blogs, or tools..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-all"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {hasActiveFilters() && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 text-outline hover:text-on-surface transition-all"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
          {['All', 'Blog', 'Guide', 'Tool'].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeFilter === filter
                ? "bg-surface-container-lowest text-primary shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)]"
                : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] outline outline-1 outline-outline-variant/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Author</label>
                <select
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">All Authors</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tool Type</label>
                <select
                  value={filters.tool_type}
                  onChange={(e) => handleFilterChange('tool_type', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">All Tools</option>
                  <option value="currency">Currency Converter</option>
                  <option value="gst">GST Calculator</option>
                  <option value="emi">EMI Calculator</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date From</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date To</label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sort By</label>
                <select
                  value={filters.sorting}
                  onChange={(e) => handleFilterChange('sorting', e.target.value)}
                  className="px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="-created_at">Latest First</option>
                  <option value="created_at">Oldest First</option>
                  <option value="-published_on">Recently Published</option>
                  <option value="published_on">Earlier Published</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="-title">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Resource */}
      {featuredResource && (
        <section className="mb-16">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] outline outline-1 outline-outline-variant/20">
            <div className="lg:w-3/5 h-[400px] relative overflow-hidden bg-surface-container">
              {getImageUrl(featuredResource.thumbnail) ? (
                <img
                  alt={featuredResource.title}
                  className="w-full h-full object-cover"
                  src={getImageUrl(featuredResource.thumbnail)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Terminal className="w-24 h-24 text-primary/40" />
                </div>
              )}
              <div className="absolute top-6 left-6">
                <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-on-primary tracking-widest uppercase">Featured {featuredResource.category}</span>
              </div>
            </div>
            <div className="lg:w-2/5 p-10 flex flex-col justify-center">
              <div className="text-xs font-bold tracking-[0.15em] text-primary uppercase mb-4">{featuredResource.category}</div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">{featuredResource.title}</h2>
              <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                {featuredResource.content?.substring(0, 150)}...
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleResourceClick(featuredResource.id)}
                  className="bg-primary text-on-primary px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  {getActionText(featuredResource.category)}
                  {getCategoryIcon(featuredResource.category)}
                </button>
                <span className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {formatDate(featuredResource.published_on)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resource Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedResources.map((resource, index) => (
          <div key={resource.id || index} className="bg-surface-container-lowest p-1 rounded-xl flex flex-col shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] outline outline-1 outline-outline-variant/20 hover:scale-[1.01] transition-transform">
            <div className="h-48 rounded-lg overflow-hidden mb-6">
              {getImageUrl(resource.thumbnail) ? (
                <img
                  alt={resource.title}
                  className="w-full h-full object-cover"
                  src={getImageUrl(resource.thumbnail)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-surface-container flex items-center justify-center p-8">
                  <div className="text-center">
                    {resource.category?.toLowerCase() === 'tool' ? (
                      <Settings2 className="w-12 h-12 text-primary opacity-40 mb-2 mx-auto" />
                    ) : (
                      <Terminal className="w-12 h-12 text-primary opacity-40 mb-2 mx-auto" />
                    )}
                    <div className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
                      {resource.category || 'Resource'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 pb-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${getCategoryColor(resource.category)}`}>
                  {resource.category || 'Article'}
                </span>
                <span className="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(resource.published_on)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-3 tracking-tight">{resource.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-grow">
                {resource.content?.substring(0, 120)}...
              </p>
              <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                <button
                  onClick={() => handleResourceClick(resource.id)}
                  className="text-primary font-bold text-sm flex items-center gap-1 group"
                >
                  {getActionText(resource.category)}
                  {getCategoryIcon(resource.category)}
                </button>
                <button
                  onClick={() => toggleBookmark(resource.id)}
                  className={`transition-colors ${bookmarkedItems.has(resource.id)
                    ? 'text-primary fill-current'
                    : 'text-outline hover:text-primary'
                    }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
              {resource.author_name && (
                <div className="mt-3 pt-3 border-t border-outline-variant/10 flex items-center gap-2 text-xs text-on-surface-variant">
                  <User className="w-3 h-3" />
                  {resource.author_name}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-lg border border-outline-variant/20 flex items-center justify-center text-outline hover:bg-surface-container-low transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === pageNum
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant/20 hover:bg-surface-container-low'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <div className="text-outline">...</div>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-10 h-10 rounded-lg border border-outline-variant/20 flex items-center justify-center text-sm font-medium hover:bg-surface-container-low transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-lg border border-outline-variant/20 flex items-center justify-center text-outline hover:bg-surface-container-low transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </PublicLayout>
  );
};

export default Resources;
