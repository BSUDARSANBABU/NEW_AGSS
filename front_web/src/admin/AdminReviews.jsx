import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import apiService from '../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    reviewer_name: '',
    rating: 5,
    feedback: '',
    review_period: 'Project Delivery'
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPerformanceReviews();
      // Handle direct array response
      const reviewsData = Array.isArray(response) ? response : [];
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    // Status functionality removed as PerformanceReview model doesn't have status field
    console.log('Status update not supported - PerformanceReview model has no status field');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await apiService.deletePerformanceReview(id);
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review.id);
    setEditForm({
      reviewer_name: review.reviewer_name || review.client_name || review.author_name || '',
      rating: review.rating || 5,
      feedback: review.feedback || review.review_text || review.content || '',
      review_period: review.review_period || 'Project Delivery'
    });
  };

  const handleSaveEdit = async () => {
    try {
      await apiService.updatePerformanceReview(editingReview, editForm);
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({
      reviewer_name: '',
      rating: 5,
      feedback: '',
      review_period: 'Project Delivery'
    });
  };

  const filteredReviews = reviews.filter(r =>
    (r.client_name || r.author_name || '')?.toLowerCase().includes(search.toLowerCase()) ||
    (r.content || r.review_text || '')?.toLowerCase().includes(search.toLowerCase()) ||
    (r.project_title || r.project_name || '')?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Reviews Management">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Review Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Manage client reviews and feedback for the platform.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Total Reviews</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{reviews.length}</span>
              <span className="text-primary font-bold text-sm">ITEMS</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">5 Star Reviews</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{reviews.filter(r => r.rating === 5).length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">EXCELLENT</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">4 Star Reviews</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{reviews.filter(r => r.rating === 4).length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">GOOD</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Average Rating</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">STARS</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <div className="relative w-full max-w-md group">
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none pl-12"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary">search</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Reviewer</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Review Content</th>
              <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Rating</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredReviews.map((review, idx) => (
              <tr key={review.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-500">person</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">{review.client_name || review.author_name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500 mt-1">{review.project_title || review.project_name || 'General Feedback'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {editingReview === review.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.reviewer_name}
                        onChange={(e) => setEditForm({ ...editForm, reviewer_name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Reviewer name"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditForm({ ...editForm, rating: star })}
                              className="text-yellow-500 hover:text-yellow-400 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">{star <= editForm.rating ? 'star' : 'star_outline'}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editForm.feedback}
                        onChange={(e) => setEditForm({ ...editForm, feedback: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        rows={3}
                        placeholder="Review feedback"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{review.project_title || review.project_name || 'General Feedback'}</p>
                      <p className="text-sm text-slate-900 dark:text-white line-clamp-2 leading-relaxed">{review.review_text || review.content || 'No review text'}</p>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-sm ${i < review.rating
                          ? 'text-yellow-500'
                          : 'text-slate-300'
                          }`}
                      >
                        {i < review.rating ? 'star' : 'star_outline'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingReview === review.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Save"
                        >
                          <span className="material-symbols-outlined text-sm">save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-slate-600 hover:text-slate-800 p-1 rounded"
                          title="Cancel"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Edit Review"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete Review"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase">SHOWING {filteredReviews.length} REVIEWS</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;

