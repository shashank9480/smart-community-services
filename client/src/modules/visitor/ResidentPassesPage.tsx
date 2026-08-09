import React, { useEffect, useState } from 'react';
import { Plus, ShieldCheck, KeyRound, Package, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';

export const ResidentPassesPage: React.FC = () => {
  const [passes, setPasses] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [guestName, setGuestName] = useState('');
  const [purpose, setPurpose] = useState('Guest Visit');
  const [submitting, setSubmitting] = useState(false);

  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');

  const loadData = async () => {
    try {
      const [pRes, prcRes] = await Promise.all([
        api.get('/visitor/passes'),
        api.get('/visitor/parcels'),
      ]);
      if (pRes.data.success) setPasses(pRes.data.data);
      if (prcRes.data.success) setParcels(prcRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/visitor/passes', { guest_name: guestName, purpose });
      if (res.data.success) {
        setIsModalOpen(false);
        setGuestName('');
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to create pass');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCollectParcel = async (parcelId: string) => {
    try {
      const res = await api.post(`/visitor/parcels/${parcelId}/collect`, { otp: otpInput });
      if (res.data.success) {
        setCollectingId(null);
        setOtpInput('');
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gate Passcodes & Deliveries</h2>
          <p className="text-sm text-slate-500 mt-0.5">Pre-approve guests & cab drivers with 6-digit gate OTPs.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Pre-Approve Guest Pass
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active & Past Passcodes */}
        <Card title="My Active & Historical Passcodes" subtitle="Share 6-digit code with visitor for entry">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading passes...</div>
          ) : passes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No gate passcodes created yet.</div>
          ) : (
            <div className="space-y-3 mt-4">
              {passes.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-black tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        {p.code}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900">{p.guest_name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{p.purpose}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant={p.status === 'active' ? 'success' : 'neutral'}>
                    {p.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Deliveries & Parcels */}
        <Card title="Gate Parcels & Deliveries" subtitle="OTP required for collection">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading parcels...</div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No pending gate parcels.</div>
          ) : (
            <div className="space-y-3 mt-4">
              {parcels.map((prc) => (
                <div key={prc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Amazon / Delivery Courier</h4>
                      <p className="text-xs text-slate-500 font-mono">OTP: <span className="font-bold text-amber-700">{prc.otp}</span></p>
                    </div>
                  </div>

                  {prc.status === 'pending' ? (
                    collectingId === prc.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="4-digit OTP"
                          className="w-24 text-center font-mono"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                        />
                        <Button size="sm" variant="primary" onClick={() => handleCollectParcel(prc.id)}>Confirm</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => { setCollectingId(prc.id); setOtpInput(prc.otp); }}>
                        Collect Parcel
                      </Button>
                    )
                  ) : (
                    <Badge variant="success">COLLECTED</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Pre-Approve New Visitor Passcode">
        <form onSubmit={handleCreatePass} className="space-y-4">
          <Input
            label="Guest / Driver Name"
            placeholder="e.g. Ramesh Kumar or Uber Driver"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Purpose of Visit</label>
            <select className="form-input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="Guest Visit">Guest Visit</option>
              <option value="Cab Driver (Ola/Uber)">Cab Driver (Ola/Uber)</option>
              <option value="Food Delivery (Zomato/Swiggy)">Food Delivery (Zomato/Swiggy)</option>
              <option value="Maintenance / Home Service">Maintenance / Home Service</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Generate 6-Digit Passcode</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
