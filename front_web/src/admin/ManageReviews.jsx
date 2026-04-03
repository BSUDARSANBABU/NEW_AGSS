import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AdminLayout from './AdminLayout';

const REVIEWS_API = "http://localhost:8000/performance-reviews/";
const ITEMS_PER_PAGE = 10;

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [editFormData, setEditFormData] = useState({
    reviewer_name: "",
    rating: 1,
    feedback: "",
    review_period: "Project Delivery",
  });

  const load = async () => {
    try {
      const res = await axios.get(REVIEWS_API);
      // Enhance reviews with project titles
      const enhancedReviews = await Promise.all(
        res.data.map(async (review) => {
          if (review.project) {
            try {
              const projectRes = await axios.get(`http://localhost:8000/projects/${review.project}/`);
              return {
                ...review,
                project_title: projectRes.data.title || `Project #${review.project}`
              };
            } catch (err) {
              return {
                ...review,
                project_title: `Project #${review.project}`
              };
            }
          }
          return review;
        })
      );
      setReviews(enhancedReviews);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= Pagination Logic ================= */

  const filteredReviews = useMemo(() => {
    return reviews.filter(review =>
      review.reviewer_name?.toLowerCase().includes(search.toLowerCase()) ||
      review.feedback?.toLowerCase().includes(search.toLowerCase()) ||
      review.project_title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [reviews, search]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ================= CRUD ================= */

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`${REVIEWS_API}${id}/`);
      load();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const startEdit = (review) => {
    setEditingReview(review.id);
    setEditFormData({
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      feedback: review.feedback,
      review_period: review.review_period || "Project Delivery",
    });
  };

  const cancelEdit = () => {
    setEditingReview(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const saveEdit = async () => {
    try {
      const updateData = {
        ...editFormData,
        project: editingReview?.project,
      };

      await axios.put(`${REVIEWS_API}${editingReview}/`, updateData);
      load();
      cancelEdit();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "span"}
          onClick={interactive ? () => onRatingChange?.(star) : undefined}
          className={`${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          disabled={!interactive}
        >
          <span
            className={`material-symbols-outlined text-sm ${star <= rating
              ? 'text-yellow-500'
              : 'text-slate-300'
              }`}
          >
            {star <= rating ? 'star' : 'star_outline'}
          </span>
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout title="Manage Reviews">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-on-surface-variant">Loading reviews...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Reviews">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Review Management</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">Edit and manage client reviews and feedback for the platform.</p>
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
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Average Rating</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">STARS</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-4">Filtered</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{filteredReviews.length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">RESULTS</span>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none pl-12"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary">search</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl text-slate-400">rate_review</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Reviews Found</h3>
          <p className="text-slate-500 dark:text-slate-400">No reviews have been submitted yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Project</th>
                  <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Reviewer</th>
                  <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Rating</th>
                  <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Feedback</th>
                  <th className="px-8 py-4 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Date</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedReviews.map((review, idx) => (
                  <tr key={review.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    {editingReview === review.id ? (
                      <>
                        <td className="px-8 py-6">
                          <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium inline-block">
                            {review.project_title || 'Unknown Project'}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <input
                            type="text"
                            name="reviewer_name"
                            value={editFormData.reviewer_name}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Reviewer name"
                          />
                        </td>
                        <td className="px-8 py-6">
                          {renderStars(editFormData.rating, true, (rating) =>
                            setEditFormData(prev => ({ ...prev, rating }))
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <textarea
                            name="feedback"
                            value={editFormData.feedback}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            rows={3}
                            placeholder="Review feedback"
                          />
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-800 p-1 rounded"
                              title="Save"
                            >
                              <span className="material-symbols-outlined text-sm">save</span>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-slate-600 hover:text-slate-800 p-1 rounded"
                              title="Cancel"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-8 py-6">
                          <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium inline-block">
                            {review.project_title || 'Unknown Project'}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <span className="material-symbols-outlined text-slate-500">person</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white leading-tight">{review.reviewer_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-slate-500 text-sm">({review.rating}/5)</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="max-w-md">
                            <p className="text-sm text-slate-900 dark:text-white line-clamp-3 leading-relaxed">
                              {review.feedback || 'No feedback provided'}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(review)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => remove(review.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">SHOWING {paginatedReviews.length} OF {filteredReviews.length} REVIEWS</span>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`w-10 h-10 rounded-lg transition-colors ${currentPage === index + 1
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default ManageReviews;
