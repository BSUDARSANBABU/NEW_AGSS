import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import apiService from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 5,
    feedback: '',
    review_period: '',
    project: null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiService.getReviews();
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Check for project data from navigation state
  useEffect(() => {
    if (location.state?.projectData) {
      const projectData = location.state.projectData;
      setFormData(prev => ({
        ...prev,
        project: projectData.id,
        project_title: projectData.title || projectData.name
      }));
      setShowForm(true);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.createReview(formData);
      setReviews(prev => [formData, ...prev]);
      setFormData({
        reviewer_name: '',
        rating: 5,
        feedback: '',
        review_period: '',
        project: null
      });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header showProfile={false} activeTab="reviews" />
        <main className="max-w-[1440px] mx-auto px-10 py-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg font-medium text-on-surface-variant">Loading reviews...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header showProfile={false} activeTab="reviews" />
      <main className="max-w-[1440px] mx-auto px-10 py-20">
        {/* Hero & Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-24">
          <div className="lg:col-span-8">
            <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-[0.2em] font-bold uppercase bg-primary-fixed text-on-primary-fixed-variant rounded-full">System Integrity</span>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-none mb-8">
              Verified Performance <span className="text-primary">Reviews</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              A high-precision audit of architectural excellence and code durability. Our platform maintains a rigorous standard for clinical-grade software development.
            </p>
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between aspect-square">
              <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">Global Rating</span>
              <div>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tighter">
                    {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm font-bold text-primary ml-1">/5.0</span>
                </div>
                <div className="flex gap-0.5 mt-2 text-primary">
                  {[...Array(5)].map((_, i) => {
                    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0;
                    return (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: i < Math.round(avgRating) ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {i < Math.round(avgRating) ? 'star' : 'star_outline'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-primary-container p-8 rounded-xl flex flex-col justify-between aspect-square text-on-primary-container">
              <span className="text-xs font-bold tracking-widest uppercase opacity-80">Verified Logs</span>
              <div>
                <div className="text-5xl font-extrabold tracking-tighter">{reviews.length}</div>
                <div className="text-sm font-medium mt-2 opacity-90">Reviews completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Grid: Dynamic Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review.id || index} className={`${index === 0 || index === 3 ? 'lg:col-span-2' : ''} bg-surface-container-lowest ghost-border p-10 rounded-xl relative overflow-hidden group h-full`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-9xl">rate_review</span>
                </div>
                <div className="flex flex-col h-full">
                  {/* Header Section */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg text-on-surface-variant">person</span>
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-bold text-on-surface truncate">
                        {review.reviewer_name || review.client_name || review.author_name || 'Anonymous'}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-medium truncate">
                        {review.project_title || review.project_name || 'General Feedback'}
                      </p>
                    </div>
                  </div>

                  {/* Rating and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm ${i < (review.rating || 5)
                              ? 'text-primary'
                              : 'text-outline-variant'
                              }`}
                            style={{ fontVariationSettings: i < (review.rating || 5) ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {i < (review.rating || 5) ? 'star' : 'star_outline'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-on-surface">{review.rating || 5}.0</span>
                    </div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap">
                      {review.review_period || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Review Content */}
                  <div className="flex-grow mb-4">
                    <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-4">
                      {review.review_text || review.content || review.feedback || 'No review text provided'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-3 py-1 text-[10px] font-bold bg-surface-container text-on-surface-variant rounded-full">#Verified</span>
                    <span className="px-3 py-1 text-[10px] font-bold bg-surface-container text-on-surface-variant rounded-full">#Performance</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">rate_review</span>
              <h3 className="text-2xl font-bold text-on-surface mb-2">No Reviews Yet</h3>
              <p className="text-on-surface-variant mb-8">Be the first to share your experience and help others make informed decisions.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all"
              >
                Submit First Review
              </button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="mt-32 relative overflow-hidden bg-white ghost-border rounded-2xl p-12 md:p-20 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary-fixed/20 blur-[100px] -z-10 rounded-full"></div>
          <span className="material-symbols-outlined text-primary mb-6 scale-150">rate_review</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">Contribute to the <span className="text-primary">Ecosystem</span></h2>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Your performance audit helps maintain the standard of clinical excellence. Submit your project review for verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              Submit Your Review
            </button>
            <button className="px-10 py-4 bg-surface-container-high text-on-surface font-bold rounded-full hover:bg-surface-container-highest transition-all">Download Audit Guide</button>
          </div>
        </section>

        {/* Review Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Submit Performance Review</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Your Name</label>
                      <input
                        type="text"
                        name="reviewer_name"
                        value={formData.reviewer_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Rating</label>
                      <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very Poor</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Review Period</label>
                    <input
                      type="text"
                      name="review_period"
                      value={formData.review_period}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Q1 2024"
                    />
                  </div>

                  {formData.project_title && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Project</label>
                      <div className="w-full px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-on-primary font-medium">
                        {formData.project_title}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Feedback</label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      placeholder="Share your detailed experience..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-8 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reviews;
