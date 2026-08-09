import React, { useEffect, useState } from 'react';
import { Home, Plus, Building2 } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';

export const AdminBlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [societyId, setSocietyId] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [blkRes, socRes] = await Promise.all([
        api.get('/foundation/blocks'),
        api.get('/foundation/societies'),
      ]);
      if (blkRes.data.success) setBlocks(blkRes.data.data);
      if (socRes.data.success) {
        setSocieties(socRes.data.data);
        if (socRes.data.data.length > 0 && !societyId) {
          setSocietyId(socRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!societyId) {
      setError('Please select a society first');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/foundation/blocks', { society_id: societyId, name });
      if (res.data.success) {
        setIsModalOpen(false);
        setName('');
        loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create block');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Blocks Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">Define physical wings and blocks within societies.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add New Block
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading blocks...</div>
      ) : blocks.length === 0 ? (
        <Card className="text-center py-12">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900">No Blocks Defined</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Add Block A, Block B, or Tower 1 to organize flats.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blocks.map((blk) => (
            <Card key={blk.id} className="hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <Home className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">{blk.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {blk.society?.name}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-600">
                <span>Flats in Block:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {blk._count?.flats || 0} Flats
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Block / Wing">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Select Society</label>
            <select
              className="form-input"
              value={societyId}
              onChange={(e) => setSocietyId(e.target.value)}
              required
            >
              <option value="" disabled>Select a society...</option>
              {societies.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Block / Wing Name"
            placeholder="e.g., Block A - Alpha or Tower 4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Create Block
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
