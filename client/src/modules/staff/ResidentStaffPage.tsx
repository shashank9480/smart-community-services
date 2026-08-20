import React, { useEffect, useState } from 'react';
import { UserCheck, Star, Clock, CheckCircle, Search, Filter, Phone, Home, MessageSquare } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';
import { AnimatedCard } from '../../components/common/AnimatedCard.js';

export const ResidentStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [reviewStaffId, setReviewStaffId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get('/staff');
      if (res.data.success) setStaff(res.data.data);
    } catch (err) {
      console.error('Error loading staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewStaffId) return;
    setSubmittingReview(true);
    try {
      const res = await api.post('/staff/review', { staff_id: reviewStaffId, rating, comment });
      if (res.data.success) {
        setReviewStaffId(null);
        setComment('');
        setRating(5);
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const categories = ['ALL', 'Maid', 'Cook', 'Driver', 'Plumber', 'Electrician'];

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'maid':
        return '🧹';
      case 'driver':
        return '🚗';
      case 'cook':
        return '🍳';
      case 'plumber':
        return '🔧';
      case 'electrician':
        return '⚡';
      default:
        return '👤';
    }
  };

  return (
    <PageMotion className="space-y-6">
      {/* Header */}
      <MotionItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Domestic Staff & Gate Telemetry</h2>
              <p className="text-sm text-slate-500 mt-0.5">Live gate punch alerts, staff roster, and star rating reviews.</p>
            </div>
          </div>
        </div>
      </MotionItem>

      {/* Search & Category Filter */}
      <MotionItem className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search staff by name, category, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'All Helpers' : `${getCategoryIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>
      </MotionItem>

      {/* Staff Cards Grid */}
      <MotionItem>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading domestic staff roster...</div>
        ) : filteredStaff.length === 0 ? (
          <Card className="text-center py-12">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900">No Domestic Staff Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Try adjusting your search query or role category filter.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((s) => (
              <AnimatedCard key={s.id}>
                <Card className="p-5 space-y-4 border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xl border border-blue-200">
                        {getCategoryIcon(s.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                        <span className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 mt-0.5">
                          {s.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      {s.avg_rating}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 font-mono text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" /> Gate Punch Status
                      </span>
                      <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 uppercase">Verified</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-sans">
                      Gate punch activity logged by security guard telemetry console.
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}
                  </p>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 border-slate-300 font-semibold"
                    onClick={() => setReviewStaffId(s.id)}
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    Rate & Review Staff Member
                  </Button>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        )}
      </MotionItem>

      {/* Submit Review Modal */}
      <Modal isOpen={!!reviewStaffId} onClose={() => setReviewStaffId(null)} title="Submit Resident Rating & Review">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              Rating Score (1 to 5 Stars)
            </label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-bold text-sm transition-all ${
                    rating >= star
                      ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-400 text-amber-500' : ''}`} />
                  <span className="text-[10px] mt-0.5">{star}★</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Resident Comment & Feedback (Optional)
            </label>
            <textarea
              className="form-input text-sm font-sans"
              rows={3}
              placeholder="e.g., Extremely punctual, polite behavior, and excellent work quality."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setReviewStaffId(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submittingReview}>
              Submit Star Review
            </Button>
          </div>
        </form>
      </Modal>
    </PageMotion>
  );
};
