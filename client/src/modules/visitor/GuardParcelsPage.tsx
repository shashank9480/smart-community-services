import React, { useEffect, useState } from 'react';
import { Package, Plus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Badge } from '../../components/common/Badge.js';

export const GuardParcelsPage: React.FC = () => {
  const [parcels, setParcels] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState('');

  const loadData = async () => {
    try {
      const [pRes, fltRes] = await Promise.all([
        api.get('/visitor/parcels'),
        api.get('/foundation/flats'),
      ]);
      if (pRes.data.success) setParcels(pRes.data.data);
      if (fltRes.data.success) setFlats(fltRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateParcel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlat) return alert('Select flat');
    try {
      const res = await api.post('/visitor/parcels', { flat_id: selectedFlat });
      if (res.data.success) {
        setIsModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      alert('Failed to log parcel');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Parcel Inward & Gate Storage Console</h2>
          <p className="text-xs text-slate-400 mt-0.5">Log courier deliveries and dispatch collection OTPs to residents.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Log New Inward Parcel
        </Button>
      </div>

      <Card dark title="Active & Recent Gate Parcels">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm font-mono">Loading parcels...</div>
        ) : parcels.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No parcels at gate.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-sans">
            {parcels.map((prc) => (
              <div key={prc.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Flat {prc.flat?.number} ({prc.flat?.block?.name})
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Collection OTP: <span className="font-bold text-amber-400">{prc.otp}</span>
                    </p>
                  </div>
                </div>
                <Badge variant={prc.status === 'pending' ? 'warning' : 'success'}>
                  {prc.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Inward Courier Parcel">
        <form onSubmit={handleCreateParcel} className="space-y-4 font-sans text-slate-900">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Flat Unit</label>
            <select className="form-input" value={selectedFlat} onChange={(e) => setSelectedFlat(e.target.value)} required>
              <option value="">-- Select Flat --</option>
              {flats.map((f) => (
                <option key={f.id} value={f.id}>Flat {f.number} ({f.block?.name})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Dispatch OTP & Store</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
