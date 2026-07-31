import React, { useEffect, useState } from 'react';
import { FileText, Plus, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';

export const AdminInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const [selectedFlat, setSelectedFlat] = useState('');
  const [month, setMonth] = useState('2026-07');
  const [maintenance, setMaintenance] = useState('3000');
  const [sinkingFund, setSinkingFund] = useState('500');
  const [water, setWater] = useState('600');
  const [parking, setParking] = useState('400');
  const [dueDate, setDueDate] = useState('2026-08-05');

  const loadData = async () => {
    try {
      const [invRes, fltRes] = await Promise.all([
        api.get('/erp/invoices'),
        api.get('/foundation/flats'),
      ]);
      if (invRes.data.success) setInvoices(invRes.data.data);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedFlat) {
      setFormError('Please select a target flat.');
      return;
    }

    const breakdown = {
      maintenance: Number(maintenance),
      sinking_fund: Number(sinkingFund),
      water_charges: Number(water),
      parking: Number(parking),
    };
    const total = breakdown.maintenance + breakdown.sinking_fund + breakdown.water_charges + breakdown.parking;

    try {
      const res = await api.post('/erp/invoices', {
        flat_id: selectedFlat,
        month,
        amount: total,
        breakdown,
        due_date: dueDate,
      });
      if (res.data.success) {
        setIsModalOpen(false);
        setFormError(null);
        loadData();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to create invoice');
    }
  };

  const totalCollected = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial ERP & Maintenance Invoices</h2>
          <p className="text-sm text-slate-500 mt-0.5">Automated maintenance billing, line item breakdown, and dues collection.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setFormError(null); setIsModalOpen(true); }}>
          Generate Monthly Invoice
        </Button>
      </div>

      {/* Top Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-emerald-900 text-white shadow-md">
          <span className="text-xs uppercase text-emerald-200 font-bold">Total Dues Collected</span>
          <p className="text-3xl font-extrabold mt-1">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md">
          <span className="text-xs uppercase text-amber-400 font-bold">Pending Outstanding Dues</span>
          <p className="text-3xl font-extrabold mt-1 text-amber-300">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      <Card title="Society Maintenance Invoices Ledger" subtitle="Flat-wise breakdown">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading invoices...</div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-mono uppercase text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4">Flat Unit</th>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Flat {inv.flat?.number} ({inv.flat?.block?.name})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{inv.month}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{inv.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {new Date(inv.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                        {inv.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Monthly Maintenance Invoice">
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Flat</label>
            <select className="form-input font-mono text-xs" value={selectedFlat} onChange={(e) => setSelectedFlat(e.target.value)} required>
              <option value="">-- Select Flat --</option>
              {flats.map((f) => (
                <option key={f.id} value={f.id}>Flat {f.number} ({f.block?.name})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Billing Month" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="YYYY-MM" required />
            <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono">
            <Input label="Maintenance Charges (₹)" type="number" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} required />
            <Input label="Sinking Fund (₹)" type="number" value={sinkingFund} onChange={(e) => setSinkingFund(e.target.value)} required />
            <Input label="Water Charges (₹)" type="number" value={water} onChange={(e) => setWater(e.target.value)} required />
            <Input label="Parking Slot (₹)" type="number" value={parking} onChange={(e) => setParking(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate & Issue Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
