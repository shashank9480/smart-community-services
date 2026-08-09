import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Radio, Bell } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';

export const AdminCommunityPage: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const loadData = async () => {
    try {
      const [notRes, facRes] = await Promise.all([
        api.get('/community/notices'),
        api.get('/community/facilities'),
      ]);
      if (notRes.data.success) setNotices(notRes.data.data);
      if (facRes.data.success) setFacilities(facRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/community/notices', { title, body });
      if (res.data.success) {
        setIsNoticeModalOpen(false);
        setTitle('');
        setBody('');
        loadData();
      }
    } catch (err: any) {
      alert('Failed to post notice');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Community Hub & Notice Board</h2>
          <p className="text-sm text-slate-500 mt-0.5">Broadcast society announcements and oversee amenity facilities.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsNoticeModalOpen(true)}>
          Post Official Notice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Broadcast Society Notices">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading notices...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No notices posted.</div>
          ) : (
            <div className="space-y-4 mt-4">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Posted by: {n.author?.name} • {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Society Amenities & Facility Roster">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading facilities...</div>
          ) : (
            <div className="space-y-4 mt-4">
              {facilities.map((fac) => (
                <div key={fac.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{fac.name}</h4>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {fac.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Rules: {fac.rules || 'Standard Guidelines'}</p>
                  <p className="text-xs text-slate-400 font-mono">Slot Duration: {fac.slot_duration} mins</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)} title="Broadcast Official Society Notice">
        <form onSubmit={handlePostNotice} className="space-y-4">
          <Input label="Notice Title" placeholder="e.g. AGM 2026 Meeting or Water Shutdown" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Body Text</label>
            <textarea className="form-input" rows={4} placeholder="Notice details..." value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsNoticeModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Broadcast Notice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
