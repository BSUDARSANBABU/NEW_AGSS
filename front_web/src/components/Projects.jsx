import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, PlusCircle, ChevronDown, Eye, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { PublicLayout } from './PublicLayout';
import apiService from '../services/api';
import { ImageCarousel } from './ImageCarousel';
import { ProjectDetails } from './ProjectDetails';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const DiscoveryFilters = ({
  categories,
  technologies,
  projectStatuses,
  selectedCategories,
  selectedTechnologies,
  selectedStatus,
  onCategoryChange,
  onTechnologyChange,
  onStatusChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState({
    categories: true,
    technologies: true,
    status: true
  });

  const hasActiveFilters = selectedCategories.length > 0 || selectedTechnologies.length > 0 || selectedStatus !== '';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant flex items-center">
          <span className="w-2 h-2 bg-primary-fixed mr-2"></span>
          Discovery Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[10px] uppercase tracking-wider text-error hover:text-error-container transition-colors font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <button
            onClick={() => setIsExpanded(prev => ({ ...prev, categories: !prev.categories }))}
            className="flex justify-between items-center w-full text-xs font-bold text-on-surface mb-4 uppercase tracking-wider hover:text-primary transition-colors"
          >
            <span>Categories</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded.categories ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.categories && (
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center group cursor-pointer">
                  <input
                    checked={selectedCategories.includes(cat)}
                    onChange={() => onCategoryChange(cat)}
                    className="rounded-sm border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5"
                    type="checkbox"
                  />
                  <span className="ml-3 text-sm text-on-surface-variant group-hover:text-primary transition-colors">{cat}</span>
                  <span className="ml-auto text-xs text-on-surface-variant/50">
                    {Math.floor(Math.random() * 20) + 1}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section>
          <button
            onClick={() => setIsExpanded(prev => ({ ...prev, technologies: !prev.technologies }))}
            className="flex justify-between items-center w-full text-xs font-bold text-on-surface mb-4 uppercase tracking-wider hover:text-primary transition-colors"
          >
            <span>Technologies</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded.technologies ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.technologies && (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => onTechnologyChange(tech)}
                  className={cn(
                    "px-2 py-1 text-[10px] font-semibold rounded-sm border transition-all cursor-pointer",
                    selectedTechnologies.includes(tech)
                      ? "bg-primary text-on-primary border-transparent"
                      : "bg-surface-container-low text-on-secondary-container border-transparent hover:border-primary-fixed"
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <button
            onClick={() => setIsExpanded(prev => ({ ...prev, status: !prev.status }))}
            className="flex justify-between items-center w-full text-xs font-bold text-on-surface mb-4 uppercase tracking-wider hover:text-primary transition-colors"
          >
            <span>Project Status</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded.status ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.status && (
            <div className="space-y-3">
              {projectStatuses.map((status) => (
                <label key={status} className="flex items-center group cursor-pointer">
                  <input
                    checked={selectedStatus === status}
                    onChange={() => onStatusChange(status)}
                    className="border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5"
                    name="status"
                    type="radio"
                  />
                  <span className="ml-3 text-sm text-on-surface-variant group-hover:text-primary transition-colors">{status}</span>
                  <span className="ml-auto text-xs text-on-surface-variant/50">
                    {Math.floor(Math.random() * 15) + 1}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectImages, setProjectImages] = useState({});
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();

  // Project details modal state
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Available filter options
  const [categories] = useState(['Cloud Architecture', 'Neural Networks', 'Blockchain Protocols', 'Machine Learning', 'DevOps', 'Mobile Development']);
  const [technologies] = useState(['RUST', 'GO', 'REACT', 'PYTHON', 'WASM', 'TYPESCRIPT', 'NODEJS', 'DOCKER', 'KUBERNETES']);
  const [projectStatuses] = useState(['Active Sprint', 'Alpha Testing', 'Staging Deployment', 'Production', 'On Hold', 'Planning']);

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'featured', label: 'Featured First' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjects();
        setProjects(data);
        setFilteredProjects(data);

        // Extract images from project response (already included in project_images field)
        const imagesData = {};
        for (const project of data) {
          // Use project_images from the serializer response
          const projectImages = project.project_images || [];
          const allImages = [
            project.project_image || project.image,
            ...projectImages.map(img => img.image).filter(Boolean)
          ].filter(Boolean); // Remove null/undefined values
          imagesData[project.id] = allImages;
        }
        setProjectImages(imagesData);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.desc?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(project =>
        selectedCategories.some(cat =>
          project.category?.toLowerCase().includes(cat.toLowerCase()) ||
          project.title?.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Apply technology filter
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(project =>
        selectedTechnologies.some(tech =>
          project.technologies_used?.toLowerCase().includes(tech.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(project =>
        project.status?.toLowerCase().includes(selectedStatus.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'featured':
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [projects, searchQuery, selectedCategories, selectedTechnologies, selectedStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Filter handlers
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTechnologyChange = (technology) => {
    setSelectedTechnologies(prev =>
      prev.includes(technology)
        ? prev.filter(t => t !== technology)
        : [...prev, technology]
    );
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(prev => prev === status ? '' : status);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTechnologies([]);
    setSelectedStatus('');
    setSearchQuery('');
  };

  const activeFilterCount = selectedCategories.length + selectedTechnologies.length + (selectedStatus ? 1 : 0) + (searchQuery ? 1 : 0);

  // Handle project details modal
  const handleProjectClick = (project) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to signup page with a return URL
      navigate('/signup', {
        state: {
          message: 'Please sign up to view project details',
          returnUrl: '/projects',
          action: 'view_project',
          projectId: project.id
        }
      });
      return;
    }

    // Get all images for this project from projectImages state
    const projectAllImages = projectImages[project.id] || [project.project_image || project.image || 'https://via.placeholder.com/800x400'];

    // Transform project data to match ProjectDetails component expectations
    const transformedProject = {
      id: project.id,
      title: project.title,
      desc: project.description || project.desc,
      img: project.project_image || project.image || 'https://via.placeholder.com/800x400',
      images: projectAllImages, // Pass all images array
      status: project.status || 'Active',
      category: project.category || 'Development',
      tech: project.technologies_used ? project.technologies_used.split(',').map(t => t.trim()) : ['REACT', 'NODEJS'],
      lead: project.lead_name || 'System Administrator',
      leadAvatar: project.lead_avatar || 'https://via.placeholder.com/100',
      created_at: project.created_at,
      team_size: project.team_size || 'Small'
    };

    setSelectedProject(transformedProject);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  // Handle review button click
  const handleReviewClick = (project) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to signup page with a return URL
      navigate('/signup', {
        state: {
          message: 'Please sign up to add reviews',
          returnUrl: '/projects',
          action: 'add_review',
          projectId: project.id
        }
      });
      return;
    }

    navigate('/reviews', {
      state: {
        projectData: {
          id: project.id,
          title: project.title,
          name: project.title
        }
      }
    });
  };

  if (loading) {
    return (
      <PublicLayout activeTab="projects" showSidebar sidebar={
        <DiscoveryFilters
          categories={categories}
          technologies={technologies}
          projectStatuses={projectStatuses}
          selectedCategories={selectedCategories}
          selectedTechnologies={selectedTechnologies}
          selectedStatus={selectedStatus}
          onCategoryChange={handleCategoryChange}
          onTechnologyChange={handleTechnologyChange}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
        />
      }>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading projects...</div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout activeTab="projects" showSidebar sidebar={
        <DiscoveryFilters
          categories={categories}
          technologies={technologies}
          projectStatuses={projectStatuses}
          selectedCategories={selectedCategories}
          selectedTechnologies={selectedTechnologies}
          selectedStatus={selectedStatus}
          onCategoryChange={handleCategoryChange}
          onTechnologyChange={handleTechnologyChange}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
        />
      }>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-error">{error}</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout activeTab="projects" showSidebar sidebar={
      <DiscoveryFilters
        categories={categories}
        technologies={technologies}
        projectStatuses={projectStatuses}
        selectedCategories={selectedCategories}
        selectedTechnologies={selectedTechnologies}
        selectedStatus={selectedStatus}
        onCategoryChange={handleCategoryChange}
        onTechnologyChange={handleTechnologyChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />
    }>
      {/* Header with search and filters */}
      <header className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-primary mb-2 block">System Repository</span>
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">
              Active Projects
              <span className="text-primary opacity-30 text-2xl font-normal ml-2">/ {filteredProjects.length}</span>
              {activeFilterCount > 0 && (
                <span className="text-primary opacity-60 text-lg font-normal ml-2">({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)</span>
              )}
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-10">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${sortBy === option.value ? 'text-primary font-semibold' : 'text-on-surface'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {cat}
                <button onClick={() => handleCategoryChange(cat)} className="hover:text-primary-container">×</button>
              </span>
            ))}
            {selectedTechnologies.map(tech => (
              <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {tech}
                <button onClick={() => handleTechnologyChange(tech)} className="hover:text-primary-container">×</button>
              </span>
            ))}
            {selectedStatus && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {selectedStatus}
                <button onClick={() => handleStatusChange(selectedStatus)} className="hover:text-primary-container">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-primary-container">×</button>
              </span>
            )}
          </div>
        )}
      </header>

      {/* Projects Grid */}
      {paginatedProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {paginatedProjects.map((project) => (
              <article key={project.id} className="bg-surface-container-lowest group relative transition-all duration-300 border border-outline-variant/20">
                <div className="aspect-[16/9] w-full bg-surface-container-high overflow-hidden relative">
                  <ImageCarousel
                    images={projectImages[project.id] || []}
                    alt={project.title}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-on-surface text-[9px] font-black text-surface tracking-tighter uppercase">
                      {project.is_featured ? 'FEATURED' : 'ACTIVE'}
                    </span>
                    <span className="px-2 py-1 bg-primary-fixed text-[9px] font-black text-on-primary-fixed tracking-tighter uppercase">
                      {project.technologies_used?.split(',')[0]?.trim() || 'PROJECT'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold tracking-tight text-on-surface">{project.title}</h3>
                    <span className="text-[10px] font-mono text-on-surface-variant opacity-50">#{project.id}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-8 h-10 line-clamp-2">{project.description || project.desc}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex -space-x-2">
                      {(project.project_developers || project.team || []).map((dev, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-primary/20"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleProjectClick(project)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-container transition-all scale-[0.98] active:scale-[0.95]"
                    >
                      View Project
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleReviewClick(project)}
                      className="flex items-center gap-2 px-6 py-2.5 w-full bg-surface-container-high text-on-surface rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-highest transition-all scale-[0.98] active:scale-[0.95]"
                    >
                      <Star className="w-4 h-4" />
                      Add Review
                    </button>
                  </div>
                </div>
                <div className="absolute -top-px left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500"></div>
              </article>
            ))}

            {/* Create New Card */}
            <article className="bg-surface-container-lowest group relative transition-all duration-300 border border-outline-variant/20">
              <div className="aspect-[16/9] w-full bg-surface-container-low flex items-center justify-center p-12">
                <div className="text-center">
                  <PlusCircle className="w-10 h-10 text-outline-variant mb-2 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Initialize New Project</p>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold tracking-tight text-on-surface mb-2">Create New Instance</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-8 max-w-[240px]">Bootstrap a new repository using pre-approved precision templates.</p>
                <button className="px-8 py-2.5 bg-surface-container-high text-on-surface rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-highest transition-all">
                  Open Architect
                </button>
              </div>
            </article>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <footer className="mt-20 flex items-center justify-between border-t border-outline-variant/20 pt-10">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
              </span>
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/20 text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
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
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-xs transition-colors ${currentPage === pageNum
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface hover:bg-surface-container-low'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="text-on-surface-variant px-2">...</span>
                )}

                {totalPages > 5 && currentPage < totalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface font-bold text-xs hover:bg-surface-container-low transition-colors"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/20 text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </footer>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-on-surface mb-2">No projects found</h3>
          <p className="text-on-surface-variant mb-6">Try adjusting your filters or search query</p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-container transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={closeProjectDetails}
        />
      )}
    </PublicLayout>
  );
};

export default Projects;
