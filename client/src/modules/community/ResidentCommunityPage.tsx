import React, { useEffect, useState } from 'react';
import { Calendar, Radio, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Badge } from '../../components/common/Badge.js';

export const ResidentCommunityPage: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [bookingFacilityId, setBookingFacilityId] = useState<string | null>(null);

  const [date, setDate] = useState('2026-07-28');
  const [slot, setSlot] = useState('10:00 - 11:00 AM');

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

  const handleTriggerSOS = async () => {
    if (!window.confirm('⚠️ TRIGGER EMERGENCY SOS ALARM TO MAIN GATE GUARDS?')) return;
    try {
      const res = await api.post('/community/sos', { type: 'medical' });
      if (res.data.success) {
        setSosTriggered(true);
      }
    } catch (err: any) {
      alert('Failed to trigger SOS');
    }
  };

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFacilityId) return;
    try {
      const res = await api.post('/community/bookings', { facility_id: bookingFacilityId, date, slot });
      if (res.data.success) {
        setBookingFacilityId(null);
        alert('Slot booked successfully!');
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to book slot');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* High Priority Red Emergency SOS Button Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-slate-950 to-red-950 border border-red-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 text-red-300 font-mono text-xs font-bold border border-red-700 mb-2">
            <Radio className="w-4 h-4 animate-ping text-red-400" /> REAL-TIME WEBSOCKET RADAR
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Emergency SOS Gate Alarm</h2>
          <p className="text-xs text-red-200 mt-1 max-w-lg">
            Clicking the SOS alarm immediately broadcasts an audible siren and visual radar flash directly to on-duty security guard terminals.
          </p>
        </div>

        {sosTriggered ? (
          <div className="p-4 rounded-xl bg-red-900 border border-red-500 text-white font-mono text-center font-bold animate-pulse">
            🚨 ALARM BROADCASTED TO GUARDS!
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTriggerSOS}
            className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-black text-lg uppercase tracking-wider shadow-lg shadow-red-600/40 transition-all hover:scale-105"
          >
            🚨 TRIGGER SOS ALARM
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices */}
        <Card title="Society Notice Board" subtitle="Official announcements">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading notices...</div>
          ) : notices.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No notices posted.</p>
          ) : (
            <div className="space-y-4 mt-4">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Posted on {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Amenity Booking */}
        <Card title="Amenity Booking Calendar" subtitle="Clubhouse, Pool & Tennis Court">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading facilities...</div>
          ) : (
            <div className="space-y-4 mt-4">
              {facilities.map((fac) => (
                <div key={fac.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{fac.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{fac.rules}</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => setBookingFacilityId(fac.id)}>
                    Book Slot
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={!!bookingFacilityId} onClose={() => setBookingFacilityId(null)} title="Book Facility Slot">
        <form onSubmit={handleBookSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Select Booking Date</label>
            <input type="date" className="form-input font-mono text-xs" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Select Slot Time</label>
            <select className="form-input font-mono text-xs" value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="07:00 - 08:00 AM">07:00 - 08:00 AM</option>
              <option value="10:00 - 11:00 AM">10:00 - 11:00 AM</option>
              <option value="04:00 - 05:00 PM">04:00 - 05:00 PM</option>
              <option value="06:00 - 07:00 PM">06:00 - 07:00 PM</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setBookingFacilityId(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Slot Booking</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
