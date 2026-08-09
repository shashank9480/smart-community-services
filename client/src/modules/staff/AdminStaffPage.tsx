import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Star, Phone, Home } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';

export const AdminStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Maid');

  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedFlatId, setSelectedFlatId] = useState('');

  const [assignError, setAssignError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [stfRes, fltRes] = await Promise.all([
        api.get('/staff'),
        api.get('/foundation/flats'),
      ]);
      if (stfRes.data.success) {
        setStaff(stfRes.data.data);
        if (stfRes.data.data.length > 0 && !selectedStaffId) {
          setSelectedStaffId(stfRes.data.data[0].id);
        }
      }
      if (fltRes.data.success) {
        setFlats(fltRes.data.data);
        if (fltRes.data.data.length > 0 && !selectedFlatId) {
          setSelectedFlatId(fltRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/staff', { name, phone, category });
      if (res.data.success) {
        setIsCreateOpen(false);
        setName('');
        setPhone('');
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to create staff');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError(null);
    if (!selectedStaffId || !selectedFlatId) {
      setAssignError('Please select both staff member and flat');
      return;
    }
    try {
      const res = await api.post('/staff/assign', { staff_id: selectedStaffId, flat_id: selectedFlatId });
      if (res.data.success) {
        setIsAssignOpen(false);
        loadData();
      }
    } catch (err: any) {
      setAssignError(err.response?.data?.error?.message || 'Failed to assign staff');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Domestic Staff Directory & Ratings</h2>
          <p className="text-sm text-slate-500 mt-0.5">Maids, drivers, cooks, plumbers, and flat assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Home className="w-4 h-4" />} onClick={() => setIsAssignOpen(true)}>
            Assign Staff to Flat
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            Add New Staff Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-mono text-sm">Loading staff directory...</div>
        ) : staff.map((s) => (
          <Card key={s.id} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                  {s.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{s.name}</h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {s.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400" /> {s.avg_rating}
              </div>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}
            </p>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">Assigned Flats</p>
              {s.assignments?.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No flats linked</span>
              ) : (
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {s.assignments?.map((a: any) => (
                    <span key={a.id} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Flat {a.flat?.number} ({a.flat?.block?.name})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register New Domestic Staff">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Full Name" placeholder="e.g. Radha Devi" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Phone Number" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Staff Category</label>
            <select className="form-input font-semibold text-slate-800" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Maid">Maid (Housekeeping)</option>
              <option value="Driver">Personal Driver</option>
              <option value="Cook">Private Cook</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Staff Member</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Staff Member to Flat">
        <form onSubmit={handleAssign} className="space-y-4">
          {assignError && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">{assignError}</p>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Select Staff</label>
            <select className="form-input text-xs font-mono" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required>
              <option value="">-- Select Staff --</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>{st.name} ({st.category})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Select Flat</label>
            <select className="form-input text-xs font-mono" value={selectedFlatId} onChange={(e) => setSelectedFlatId(e.target.value)} required>
              <option value="">-- Select Flat --</option>
              {flats.map((fl) => (
                <option key={fl.id} value={fl.id}>Flat {fl.number} ({fl.block?.name})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Assign Staff</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
