import React, { useEffect, useState } from 'react';
import { Building2, Plus, UserCheck, Home } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';

export const AdminFlatsPage: React.FC = () => {
  const [flats, setFlats] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [blockId, setBlockId] = useState('');
  const [number, setNumber] = useState('');
  const [bhkType, setBhkType] = useState('2BHK');
  const [sqft, setSqft] = useState('1200');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [fltRes, blkRes] = await Promise.all([
        api.get('/foundation/flats'),
        api.get('/foundation/blocks'),
      ]);
      if (fltRes.data.success) setFlats(fltRes.data.data);
      if (blkRes.data.success) {
        setBlocks(blkRes.data.data);
        if (blkRes.data.data.length > 0 && !blockId) {
          setBlockId(blkRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading flats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockId) {
      setError('Please select a block first');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/foundation/flats', {
        block_id: blockId,
        number,
        bhk_type: bhkType,
        sqft: parseFloat(sqft) || 1200,
      });
      if (res.data.success) {
        setIsModalOpen(false);
        setNumber('');
        loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create flat');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Flats Registry</h2>
          <p className="text-sm text-slate-500 mt-0.5">Physical units, square footage, and owner assignments.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add New Flat
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading flats directory...</div>
      ) : flats.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900">No Flats Registered</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Add flats to blocks to begin linking residents and invoicing.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flats.map((flt) => (
            <Card key={flt.id} className="hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold font-mono text-base">
                    {flt.number}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{flt.block?.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{flt.block?.society?.name}</span>
                  </div>
                </div>
                <Badge variant={flt.bhk_type === '3BHK' ? 'info' : 'neutral'}>{flt.bhk_type}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 font-mono text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Area</span>
                  <span className="font-semibold text-slate-800">{flt.sqft} sq.ft.</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Occupants</span>
                  <span className="font-semibold text-emerald-600">{flt.residents?.length || 0} Residents</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Owner:</span>
                {flt.owner ? (
                  <span className="font-semibold text-slate-900 flex items-center gap-1 truncate max-w-[160px]">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {flt.owner.name}
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium italic">Unassigned</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Flat Unit">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Block / Wing</label>
            <select
              className="form-input"
              value={blockId}
              onChange={(e) => setBlockId(e.target.value)}
              required
            >
              <option value="" disabled>Select block...</option>
              {blocks.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.society?.name})</option>
              ))}
            </select>
          </div>
          <Input
            label="Flat Number"
            placeholder="e.g., A-105 or B-402"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">BHK Type</label>
              <select
                className="form-input"
                value={bhkType}
                onChange={(e) => setBhkType(e.target.value)}
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK+</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
            <Input
              label="Area (Sq. Ft.)"
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Create Flat
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
