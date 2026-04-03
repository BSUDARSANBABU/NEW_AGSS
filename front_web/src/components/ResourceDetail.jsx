import React, { useState, useEffect } from 'react';
import { PublicLayout } from './PublicLayout';
import { ArrowLeft, ArrowRight, Calendar, User, Bookmark, Share2, Download, Settings2, Terminal } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

export const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        // Fetch all resources to find the specific one and related ones
        const allResources = await apiService.getResources();
        const foundResource = allResources.find(r => r.id === parseInt(id));
        
        if (foundResource) {
          setResource(foundResource);
          
          // Get related resources (same category, excluding current)
          const related = allResources
            .filter(r => r.category === foundResource.category && r.id !== parseInt(id))
            .slice(0, 3);
          setRelatedResources(related);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Failed to fetch resource:', err);
        setError('Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return null;
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://localhost:8000${thumbnail}`;
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
        return <Settings2 className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const shareResource = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.content?.substring(0, 150) + '...',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading resource...</div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !resource) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-error">{error || 'Resource not found'}</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/resources')}
        className="mb-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Resources
      </button>

      {/* Resource Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${getCategoryColor(resource.category)}`}>
            {getCategoryIcon(resource.category)}
            <span className="ml-1">{resource.category}</span>
          </span>
          {resource.tool_type && (
            <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
              {resource.tool_type}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
          {resource.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface-variant">
          {resource.author_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {resource.author_name}
            </div>
          )}
          {resource.published_on && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(resource.published_on)}
            </div>
          )}
        </div>
      </header>

      {/* Resource Image */}
      {getImageUrl(resource.thumbnail) && (
        <div className="mb-12 rounded-xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)]">
          <img
            src={getImageUrl(resource.thumbnail)}
            alt={resource.title}
            className="w-full h-[400px] object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={toggleBookmark}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
            bookmarked 
              ? 'bg-primary text-on-primary' 
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        
        <button
          onClick={shareResource}
          className="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-full font-semibold hover:bg-surface-container-high transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        {resource.category?.toLowerCase() === 'tool' && (
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold hover:opacity-90 transition-all">
            <Download className="w-4 h-4" />
            Get Started
          </button>
        )}
      </div>

      {/* Content */}
      <article className="mb-16">
        <div className="prose prose-lg max-w-none">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)]">
            {resource.content ? (
              <div className="whitespace-pre-wrap text-on-surface leading-relaxed">
                {resource.content}
              </div>
            ) : (
              <div className="text-on-surface-variant text-center py-12">
                No content available for this resource.
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-on-surface mb-8">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedResources.map((relatedResource) => (
              <div
                key={relatedResource.id}
                onClick={() => navigate(`/resources/${relatedResource.id}`)}
                className="bg-surface-container-lowest p-1 rounded-xl flex flex-col shadow-[0_4px_20px_-2px_rgba(0,31,36,0.04),0_12px_40px_-8px_rgba(0,31,36,0.08)] outline outline-1 outline-outline-variant/20 hover:scale-[1.01] transition-transform cursor-pointer"
              >
                <div className="h-32 rounded-lg overflow-hidden mb-4">
                  {getImageUrl(relatedResource.thumbnail) ? (
                    <img
                      alt={relatedResource.title}
                      className="w-full h-full object-cover"
                      src={getImageUrl(relatedResource.thumbnail)}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                      <Terminal className="w-8 h-8 text-primary opacity-40" />
                    </div>
                  )}
                </div>
                <div className="px-4 pb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded mb-3 inline-block ${getCategoryColor(relatedResource.category)}`}>
                    {relatedResource.category}
                  </span>
                  <h3 className="font-bold text-on-surface mb-2 text-sm leading-tight">
                    {relatedResource.title}
                  </h3>
                  <p className="text-on-surface-variant text-xs line-clamp-2">
                    {relatedResource.content?.substring(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
};

export default ResourceDetail;
