import React, { useState } from 'react';
import { PublicLayout } from './PublicLayout';
import { Calendar, Clock, Video, Send } from 'lucide-react';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const BookDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    project_type: 'web',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to signup page with a return URL
      navigate('/signup', {
        state: {
          message: 'Please sign up to request a demo',
          returnUrl: '/book-demo',
          action: 'request_demo',
          formData: formData
        }
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.createDemoBooking(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferred_date: '',
        project_type: 'web',
        message: ''
      });
    } catch (err) {
      setError('Failed to book demo. Please try again.');
      console.error('Demo booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PublicLayout activeTab="bookdemo">
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="p-10 bg-surface-container-lowest rounded-3xl border border-outline-variant/20">
            <h2 className="text-3xl font-black tracking-tighter mb-4 text-primary">Demo Booked Successfully!</h2>
            <p className="text-on-surface-variant text-lg mb-8">
              Thank you for your interest. Our team will contact you within 24 hours to confirm the technical deep-dive session.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 transition-all"
            >
              Book Another Demo
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout activeTab="bookdemo">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">Schedule a Technical Deep-Dive</h1>
          <p className="text-on-surface-variant text-lg">Connect with our systems architects for a precision demonstration of DevForge ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="text-primary" />
                Select a Date
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }).map((_, i) => (
                  <button key={i} className="aspect-square flex items-center justify-center rounded-lg hover:bg-primary hover:text-on-primary transition-all text-sm font-bold">
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Clock className="text-primary" />
                Available Slots
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map((time) => (
                  <button key={time} className="py-3 rounded-xl border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-xs font-bold uppercase tracking-widest">
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-xl">
            <h3 className="text-2xl font-bold mb-8">Demo Configuration</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Elena Vance"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Work Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="elena@blackmesa.org"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Preferred Date</label>
                <input
                  type="date"
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Project Type</label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="design">UI/UX Design</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Tell us about your technical requirements..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:opacity-90 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Request Demo Sequence'}
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-center gap-4 text-on-surface-variant">
              <Video className="w-5 h-5" />
              <p className="text-xs font-medium">Conducted via secure encrypted video link.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BookDemo;
