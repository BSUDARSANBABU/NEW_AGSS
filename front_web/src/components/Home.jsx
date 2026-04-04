import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { KonamiTransition } from './KonamiTransition';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { ProjectDetails } from './ProjectDetails';
import { ImageCarousel } from './ImageCarousel';
import apiService from '../services/api';
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Terminal,
  Database,
  Shield,
  Activity,
  Users,
  Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Home = () => {
  const [showKonamiTransition, setShowKonamiTransition] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectImages, setProjectImages] = useState({});
  const [developers, setDevelopers] = useState([]);
  const [resources, setResources] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [heroContent, setHeroContent] = useState({
    heading: 'ENGINEERED PRECISION. ISOFORM PRIME.',
    subheading: 'Architecting the future of high-frequency deployments with surgical accuracy and clinical performance metrics.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrXEeYK7RxE0S_zQDdZb31pqpsxaASgmUhbPl_WRSo2SwfxzLQJgqTD7qbudBERjnNEbk9mHPByY8JfIJxLAK8_ksMB84SflWIS2DUxCeEBL_QkYyp_sna5QRFdbFHdv3ly4yezaWwV91RLMUyocrJm66GXd5coklbKERUkmfl7y_JBmiEVQ71bO0RILvYUmsKRtJWPXTD9z6SyonIbjSdKIVz_zp0tNfLdK8ocY8CeqDZTJLRsUdlkqgrCTaluQSQu2uKAz62p80',
    button1Text: 'Initiate Deployment',
    button1Url: '/admin',
    button1IsPrimary: true,
    button2Text: 'View Technical Specs',
    button2Url: '#',
    button2IsPrimary: false,
    // Hero Styling Settings
    headingFontFamily: 'Inter, sans-serif',
    headingFontSize: '4rem',
    subheadingFontFamily: 'Inter, sans-serif',
    subheadingFontSize: '1.125rem',
    imageWidth: '100%',
    imageHeight: 'auto'
  });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();

  // Initialize Konami code detection
  useKonamiCode(() => {
    setShowKonamiTransition(true);
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, developersData, resourcesData, reviewsData, siteSettingsData] = await Promise.all([
          apiService.getProjects(),
          apiService.getDevelopers(),
          apiService.getResources(),
          apiService.getPerformanceReviews(),
          apiService.getSiteSettings()
        ]);

        setProjects(projectsData || []);
        setDevelopers(developersData || []);
        setResources(resourcesData || []);
        setReviews(reviewsData || []);

        // Update hero content from site settings
        if (siteSettingsData && siteSettingsData.data && siteSettingsData.data.length > 0) {
          const settings = siteSettingsData.data[0];
          setHeroContent({
            heading: settings.hero_heading || 'ENGINEERED PRECISION. ISOFORM PRIME.',
            subheading: settings.hero_subheading || 'Architecting the future of high-frequency deployments with surgical accuracy and clinical performance metrics.',
            image: settings.hero_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrXEeYK7RxE0S_zQDdZb31pqpsxaASgmUhbPl_WRSo2SwfxzLQJgqTD7qbudBERjnNEbk9mHPByY8JfIJxLAK8_ksMB84SflWIS2DUxCeEBL_QkYyp_sna5QRFdbFHdv3ly4yezaWwV91RLMUyocrJm66GXd5coklbKERUkmfl7y_JBmiEVQ71bO0RILvYUmsKRtJWPXTD9z6SyonIbjSdKIVz_zp0tNfLdK8ocY8CeqDZTJLRsUdlkqgrCTaluQSQu2uKAz62p80',
            button1Text: settings.hero_button1_text || 'Initiate Deployment',
            button1Url: settings.hero_button1_url || '/admin',
            button1IsPrimary: settings.hero_button1_is_primary !== undefined ? settings.hero_button1_is_primary : true,
            button2Text: settings.hero_button2_text || 'View Technical Specs',
            button2Url: settings.hero_button2_url || '#',
            button2IsPrimary: settings.hero_button2_is_primary !== undefined ? settings.hero_button2_is_primary : false,
            // Hero Styling Settings
            headingFontFamily: settings.hero_heading_font_family || 'Inter, sans-serif',
            headingFontSize: settings.hero_heading_font_size || '4rem',
            subheadingFontFamily: settings.hero_subheading_font_family || 'Inter, sans-serif',
            subheadingFontSize: settings.hero_subheading_font_size || '1.125rem',
            imageWidth: settings.hero_image_width || '100%',
            imageHeight: settings.hero_image_height || 'auto'
          });
        }

        // Extract images from project response (already included in project_images field)
        const imagesData = {};
        for (const project of projectsData || []) {
          // Use project_images from the serializer response
          const projectImages = project.project_images || [];
          const allImages = [
            project.project_image || project.image,
            ...projectImages.map(img => img.image).filter(Boolean)
          ].filter(Boolean); // Remove null/undefined values
          imagesData[project.id] = allImages;
        }
        setProjectImages(imagesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleKonamiComplete = () => {
    setShowKonamiTransition(false);
    window.location.href = '/login';
  };

  // Handle project details modal
  const handleProjectClick = (project) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to signup page with a return URL
      navigate('/signup', {
        state: {
          message: 'Please sign up to view project details',
          returnUrl: '/',
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
      desc: project.description || project.desc || 'No description available',
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
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Konami Transition Overlay */}
      {showKonamiTransition && (
        <KonamiTransition onComplete={handleKonamiComplete} />
      )}

      <Header showProfile={false} activeTab="home" />

      <main className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Hero Section */}
        <section className="mb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
            <div className="z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-widest uppercase rounded-full"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                System v4.2.0 Online
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-extrabold tracking-tighter text-on-surface mb-8 leading-[0.95]"
                style={{
                  fontFamily: heroContent.headingFontFamily,
                  fontSize: heroContent.headingFontSize
                }}
              >
                {heroContent.heading.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < heroContent.heading.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-on-surface-variant max-w-lg mb-12 leading-relaxed"
                style={{
                  fontFamily: heroContent.subheadingFontFamily,
                  fontSize: heroContent.subheadingFontSize
                }}
              >
                {heroContent.subheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                {heroContent.button1Text && (
                  <Link
                    to={heroContent.button1Url}
                    className={`px-8 py-4 font-bold rounded-full hover:opacity-90 transition-all flex items-center gap-3 shadow-lg ${heroContent.button1IsPrimary
                      ? 'bg-primary text-on-primary shadow-primary/20'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                  >
                    {heroContent.button1Text}
                    {heroContent.button1IsPrimary && <Rocket className="w-5 h-5" />}
                  </Link>
                )}

                {heroContent.button2Text && (
                  <Link
                    to={heroContent.button2Url}
                    className={`px-8 py-4 font-bold rounded-full hover:opacity-90 transition-all flex items-center gap-3 shadow-lg ${heroContent.button2IsPrimary
                      ? 'bg-primary text-on-primary shadow-primary/20'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                  >
                    {heroContent.button2Text}
                    {heroContent.button2IsPrimary && <Rocket className="w-5 h-5" />}
                  </Link>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/20 p-8">
                <div className="w-full h-full bg-surface-container-lowest rounded-lg border border-outline-variant/20 overflow-hidden relative shadow-sm">
                  <img
                    alt="Hero Visualization"
                    className="object-cover opacity-80"
                    style={{
                      width: heroContent.imageWidth,
                      height: heroContent.imageHeight
                    }}
                    src={heroContent.image}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600/f3f4f6/1f2937?text=HERO+IMAGE';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 bg-white/90 backdrop-blur-md rounded border border-outline-variant/20">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Active Core</p>
                          <p className="text-xl font-black text-on-surface tracking-tighter">PRIME-NODE-01</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-primary leading-none tracking-tighter">99<span className="text-xs uppercase ml-1">.9%</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative architectural lines */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border-t-2 border-r-2 border-primary-fixed opacity-50"></div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-4 gap-px bg-surface-container overflow-hidden rounded-xl border border-outline-variant/20">
          {[
            {
              label: 'Total Projects',
              value: loading ? '...' : projects.length.toString(),
              suffix: projects.length > 0 ? '+12%' : '',
              suffixColor: 'text-primary'
            },
            {
              label: 'Developers',
              value: loading ? '...' : developers.length.toString(),
              icon: Users
            },
            {
              label: 'Resources',
              value: loading ? '...' : resources.length.toString(),
              suffix: resources.length > 0 ? '+' : ''
            },
            {
              label: 'System Status',
              value: loading ? '...' : '99.9',
              suffix: '%'
            },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-container-lowest p-10 group hover:bg-surface-container-low transition-colors">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tighter">{stat.value}</span>
                {stat.suffix && <span className={cn("text-xs font-bold", stat.suffixColor || "text-on-surface-variant")}>{stat.suffix}</span>}
                {stat.icon && <stat.icon className="w-4 h-4 text-primary ml-1" />}
              </div>
            </div>
          ))}
        </section>

        {/* Featured Projects */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-on-surface uppercase">Featured Projects</h2>
              <p className="text-on-surface-variant font-medium">Recent projects from our development team.</p>
            </div>
            <Link to="/projects" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project, i) => (
                <div key={project.id || i} className="bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/20 hover:shadow-lg transition-shadow">
                  <div className="aspect-video mb-6 overflow-hidden rounded-lg">
                    <ImageCarousel
                      images={projectImages[project.id] || []}
                      alt={project.title}
                    />
                  </div>
                  <div className="px-6 pb-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                      <span className="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold rounded uppercase">
                        {project.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                      {project.description ? (project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description) : 'No description available'}
                    </p>
                    <div className="flex justify-between items-center border-t border-surface-container pt-4">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        {project.technologies_used ? project.technologies_used.split(',').slice(0, 2).join(', ') : 'Web Development'}
                      </span>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleProjectClick(project)}
                          className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          See More
                        </button>
                        {project.live_link && (
                          <a
                            href={project.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                          >
                            Details <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">No projects available yet.</p>
            </div>
          )}
        </section>

        {/* Featured Developers */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-on-surface uppercase">Featured Developers</h2>
              <p className="text-on-surface-variant font-medium">Talented developers from our team.</p>
            </div>
            <Link to="/developers" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">Loading developers...</p>
            </div>
          ) : developers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developers.slice(0, 6).map((developer, i) => (
                <div key={developer.id || i} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    {developer.profile_image && (
                      <img
                        src={developer.profile_image}
                        alt={developer.name}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=' + developer.name.charAt(0);
                        }}
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{developer.name}</h3>
                      <p className="text-sm text-on-surface-variant">{developer.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                    {developer.bio ? (developer.bio.length > 80 ? developer.bio.substring(0, 80) + '...' : developer.bio) : 'No bio available'}
                  </p>
                  {developer.skills && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {developer.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-surface-container-high text-[10px] font-bold rounded uppercase">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-surface-container pt-4">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                      {developer.experience_years} years exp
                    </span>
                    <div className="flex gap-2">
                      {developer.github_link && (
                        <a href={developer.github_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          GitHub
                        </a>
                      )}
                      {developer.linkedin_link && (
                        <a href={developer.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">No developers available yet.</p>
            </div>
          )}
        </section>

        {/* Technical Resources */}
        <section className="mb-24 py-16 px-12 bg-surface-container-low rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-lowest skew-x-[-12deg] translate-x-1/2 opacity-50"></div>
          <div className="relative z-10">
            <div className="max-w-xl mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mb-6 uppercase">Technical Resources</h2>
              <p className="text-on-surface-variant">Deep-dive documentation and protocols for building within the Isoform Prime ecosystem.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-on-surface-variant">Loading resources...</p>
                </div>
              ) : resources.length > 0 ? (
                resources.slice(0, 4).map((resource, i) => (
                  <a key={resource.id || i} className="block p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/20 hover:translate-y-[-4px] transition-all" href={resource.link || "#"} target="_blank" rel="noopener noreferrer">
                    <Terminal className="w-8 h-8 text-primary mb-6" />
                    <h4 className="font-bold mb-2">{resource.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{resource.description || resource.content?.substring(0, 100) + '...'}</p>
                  </a>
                ))
              ) : (
                // Fallback to default resources if no data
                [
                  { title: 'CLI Handbook', desc: 'Master the forge command line interface for rapid prototyping.', icon: Terminal },
                  { title: 'API Reference', desc: 'Comprehensive endpoints for the PRIME infrastructure.', icon: Database },
                  { title: 'Security Protocols', desc: 'Advanced encryption and authentication standards.', icon: Shield },
                  { title: 'System Health', desc: 'Real-time status monitoring and latency tracking guides.', icon: Activity },
                ].map((resource, i) => (
                  <a key={i} className="block p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/20 hover:translate-y-[-4px] transition-all" href="#">
                    <resource.icon className="w-8 h-8 text-primary mb-6" />
                    <h4 className="font-bold mb-2">{resource.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{resource.desc}</p>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Latest High-Rating Reviews */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-on-surface uppercase">Latest High-Rating Reviews</h2>
              <p className="text-on-surface-variant font-medium">Recent performance reviews with exceptional ratings.</p>
            </div>
            <Link to="/reviews" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews
                .filter(review => review.rating >= 4) // Filter for high ratings (4+)
                .slice(0, 6) // Show latest 6 high-rating reviews
                .map((review, i) => (
                  <div key={review.id || i} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight mb-2">
                          {review.reviewer_name || 'Anonymous Reviewer'}
                        </h3>
                        <p className="text-sm text-on-surface-variant">
                          Performance Review
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={cn(
                              "w-4 h-4",
                              index < review.rating ? "text-primary fill-current" : "text-outline"
                            )}
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-primary">{review.rating}.0</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Feedback</h4>
                      <p className="text-sm text-on-surface leading-relaxed">
                        {review.feedback ? (review.feedback.length > 150 ? review.feedback.substring(0, 150) + '...' : review.feedback) : 'No feedback provided'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-surface-container pt-4">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        {review.review_period || 'Recent Review'}
                      </span>
                      {review.project && (
                        <span className="text-xs text-primary font-medium">
                          {review.project.title || 'Project Review'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">No high-rating reviews available yet.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-surface-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 py-12 max-w-[1440px] mx-auto text-[10px] tracking-wide uppercase">
          <div className="flex flex-col gap-6">
            <span className="text-lg font-black text-on-surface">DEVFORGE</span>
            <p className="text-on-surface-variant normal-case tracking-normal max-w-sm">
              PRECISION SYSTEMS FOR MODERN ARCHITECTS. BUILT FOR SCALE, DESIGNED FOR CLARITY.
            </p>
            <p className="text-on-surface-variant">© 2026 DEVFORGE Precision Systems. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <p className="font-bold text-on-surface">Platform</p>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">About</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Projects</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-bold text-on-surface">Legal</p>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-bold text-on-surface">Support</p>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">API Documentation</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">System Status</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={closeProjectDetails}
        />
      )}
    </div>
  );
};

export default Home;
