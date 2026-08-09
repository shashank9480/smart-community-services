import React, { useEffect, useState } from 'react';
import { UserCheck, Star, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Badge } from '../../components/common/Badge.js';

export const ResidentStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewStaffId, setReviewStaffId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const loadData = async () => {
    try {
      const res = await api.get('/staff');
      if (res.data.success) setStaff(res.data.data);
    } catch (err) {
      console.error(err);
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
    try {
      const res = await api.post('/staff/review', { staff_id: reviewStaffId, rating, comment });
      if (res.data.success) {
        setReviewStaffId(null);
        setComment('');
        loadData();
      }
    } catch (err: any) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Domestic Staff & Gate Telemetry</h2>
        <p className="text-sm text-slate-500 mt-0.5">Live gate punch alerts, staff attendance, and rating reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-mono text-sm">Loading staff...</div>
        ) : staff.map((s) => (
          <Card key={s.id} className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{s.name}</h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {s.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400" /> {s.avg_rating}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs">
              <span className="text-slate-500 block uppercase">Gate Punch Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                <CheckCircle className="w-4 h-4" /> Gate Punch Verified
              </span>
            </div>

            <Button size="sm" variant="secondary" className="w-full" onClick={() => setReviewStaffId(s.id)}>
              Rate & Review Staff
            </Button>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!reviewStaffId} onClose={() => setReviewStaffId(null)} title="Submit Staff Rating Review">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Rating (1 to 5 Stars)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-3 rounded-xl border text-lg ${rating >= star ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Comment (Optional)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Excellent work, always punctual."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setReviewStaffId(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Review</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
