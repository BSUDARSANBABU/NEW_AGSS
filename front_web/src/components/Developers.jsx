import React, { useState, useEffect, useMemo } from 'react';
import { PublicLayout } from './PublicLayout';
import { Search, Verified, Terminal, X, ChevronDown, Eye } from 'lucide-react';
import { DeveloperDetails } from './DeveloperDetails';
import apiService from '../services/api';

const DeveloperSidebar = ({
  selectedSkills,
  setSelectedSkills,
  experienceLevel,
  setExperienceLevel,
  availableOnly,
  setAvailableOnly,
  allSkills
}) => (
  <div className="space-y-10">
    <h2 className="text-xs font-black tracking-widest uppercase text-on-surface-variant mb-8">Directory Filters</h2>

    {/* Filter Section: Skills */}
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Core Skills</h3>
      <div className="space-y-3">
        {(allSkills || []).map((skill) => (
          <label key={skill} className="flex items-center gap-3 cursor-pointer group">
            <input
              className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20"
              type="checkbox"
              checked={selectedSkills.includes(skill)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSkills([...selectedSkills, skill]);
                } else {
                  setSelectedSkills(selectedSkills.filter(s => s !== skill));
                }
              }}
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{skill}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Filter Section: Experience */}
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Experience Level</h3>
      <div className="space-y-3">
        {['Entry Level', 'Mid-Senior', 'Principal / Architect'].map((level) => (
          <label key={level} className="flex items-center gap-3 cursor-pointer group">
            <input
              className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
              name="exp"
              type="radio"
              checked={experienceLevel === level}
              onChange={() => setExperienceLevel(level)}
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{level}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Filter Section: Availability */}
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Availability</h3>
      <div className="p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setAvailableOnly(!availableOnly)}>
          <span className="text-xs font-semibold text-primary">Available Now</span>
          <div className={`w-8 h-4 ${availableOnly ? 'bg-primary' : 'bg-primary/20'} rounded-full relative transition-colors`}>
            <div className={`absolute ${availableOnly ? 'right-1' : 'left-1'} top-1 w-2 h-2 bg-primary rounded-full transition-all`}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('experience');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Developer details modal state
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [developerProjects, setDeveloperProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Extract all unique skills from developers
  const allSkills = useMemo(() => {
    const skills = new Set();
    developers.forEach(dev => {
      if (dev.skills) {
        const skillList = Array.isArray(dev.skills) ? dev.skills : dev.skills.split(',').map(s => s.trim());
        skillList.forEach(skill => {
          if (skill) skills.add(skill);
        });
      }
    });
    return Array.from(skills).sort();
  }, [developers]);

  // Filter and sort developers
  const filteredDevelopers = useMemo(() => {
    let filtered = [...developers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(dev =>
        dev.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.skills?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(dev => {
        if (!dev.skills) return false;
        const devSkills = Array.isArray(dev.skills) ? dev.skills : dev.skills.split(',').map(s => s.trim());
        return selectedSkills.some(skill => devSkills.includes(skill));
      });
    }

    // Experience level filter
    if (experienceLevel) {
      filtered = filtered.filter(dev => {
        const years = dev.experience_years || 0;
        if (experienceLevel === 'Entry Level') return years <= 2;
        if (experienceLevel === 'Mid-Senior') return years > 2 && years <= 7;
        if (experienceLevel === 'Principal / Architect') return years > 7;
        return true;
      });
    }

    // Availability filter
    if (availableOnly) {
      filtered = filtered.filter(dev => dev.available === true);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'experience':
          aValue = a.experience_years || 0;
          bValue = b.experience_years || 0;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'skills':
          aValue = (a.skills ? a.skills.split(',').length : 0);
          bValue = (b.skills ? b.skills.split(',').length : 0);
          break;
        default:
          aValue = a.experience_years || 0;
          bValue = b.experience_years || 0;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [developers, searchQuery, selectedSkills, experienceLevel, availableOnly, sortBy, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setExperienceLevel('');
    setAvailableOnly(false);
    setSortBy('experience');
    setSortOrder('desc');
  };

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedSkills.length > 0) count++;
    if (experienceLevel) count++;
    if (availableOnly) count++;
    return count;
  }, [searchQuery, selectedSkills, experienceLevel, availableOnly]);

  // Handle developer details modal
  const handleDeveloperClick = async (developer) => {
    setSelectedDeveloper(developer);
    setLoadingProjects(true);

    try {
      // Fetch projects for this developer
      const allProjects = await apiService.getProjects();
      const developerProjects = allProjects.filter(project =>
        project.developer_id === developer.id ||
        project.lead === developer.name ||
        project.developer === developer.name
      );
      setDeveloperProjects(developerProjects);
    } catch (error) {
      console.error('Failed to fetch developer projects:', error);
      setDeveloperProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const closeDeveloperDetails = () => {
    setSelectedDeveloper(null);
    setDeveloperProjects([]);
  };

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDevelopers();
        setDevelopers(data);
      } catch (err) {
        console.error('Failed to fetch developers:', err);
        setError('Failed to load developers');
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  if (loading) {
    return (
      <PublicLayout activeTab="developers" showSidebar sidebar={<DeveloperSidebar />}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading developers...</div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout activeTab="developers" showSidebar sidebar={<DeveloperSidebar />}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-error">{error}</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout activeTab="developers" showSidebar sidebar={
      <DeveloperSidebar
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        experienceLevel={experienceLevel}
        setExperienceLevel={setExperienceLevel}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        allSkills={allSkills}
      />
    }>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Engineers</h1>
          <p className="text-on-surface-variant text-sm tracking-wide">
            Showing {filteredDevelopers.length} of {developers.length} verified technical specialists
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-primary font-medium">
                ({activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 rounded-full">
            <Search className="w-4 h-4 text-outline mr-2" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-outline-variant outline-none w-48"
              placeholder="Search developers..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-outline hover:text-on-surface-variant"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="bg-surface-container-high px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-highest transition-all flex items-center gap-2"
            >
              Sort: {sortBy === 'experience' ? 'Experience' : sortBy === 'name' ? 'Name' : 'Skills'}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-10 min-w-48">
                <div className="p-2">
                  {['experience', 'name', 'skills'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-surface-container-low transition-colors capitalize"
                    >
                      {option === 'experience' ? 'Years of Experience' : option === 'name' ? 'Name' : 'Number of Skills'}
                    </button>
                  ))}
                  <div className="border-t border-outline-variant/20 my-2"></div>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-surface-container-low transition-colors"
                  >
                    Order: {sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="bg-error-container text-error px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-error-container-hover transition-all flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Clear {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Profile Card Grid */}
      {filteredDevelopers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-lg font-medium text-on-surface-variant mb-4">No developers found</div>
          <p className="text-sm text-on-surface-variant/70 mb-6">Try adjusting your filters or search criteria</p>
          <button
            onClick={clearFilters}
            className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full hover:bg-primary-container transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div key={dev.id || dev.name} className="bg-surface-container-lowest p-6 flex flex-col shadow-sm hover:shadow-md transition-all hover:scale-[1.01] relative overflow-hidden group border border-outline-variant/10 rounded-xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden">
                    <img
                      alt={`${dev.name} avatar`}
                      src={dev.profile_image || dev.avatar}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface tracking-tight">{dev.name}</h3>
                    <p className="text-xs font-medium text-on-surface-variant/70 uppercase tracking-widest">{dev.title || dev.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-primary tracking-tighter">
                    {dev.experience_years || 'N/A'}
                    <span className="text-[10px] font-bold text-outline-variant ml-1 uppercase">Years</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {(dev.skills ? dev.skills.split(',').map(s => s.trim()) : dev.skills || []).map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-surface-container-low text-[10px] font-bold uppercase tracking-wider text-primary rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-outline-variant/10">
                <div className="flex -space-x-2">
                  {dev.github_link && (
                    <div className="w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center border-2 border-surface-container-lowest">
                      <Terminal className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  {dev.linkedin_link && (
                    <div className="w-6 h-6 rounded-full bg-secondary-container/40 flex items-center justify-center border-2 border-surface-container-lowest">
                      <Verified className="w-3 h-3 text-secondary" />
                    </div>
                  )}
                </div>
                <button className="bg-primary text-white text-[10px] font-extrabold uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-primary-container transition-all shadow-lg shadow-primary/10">
                  Connect
                </button>
                <button
                  onClick={() => handleDeveloperClick(dev)}
                  className="bg-surface-container-high text-on-surface text-[10px] font-extrabold uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-surface-container-highest transition-all flex items-center gap-2"
                >
                  <Eye className="w-3 h-3" />
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Developer Details Modal */}
      {selectedDeveloper && (
        <DeveloperDetails
          developer={selectedDeveloper}
          projects={developerProjects}
          onClose={closeDeveloperDetails}
        />
      )}
    </PublicLayout>
  );
}

export default Developers;
