import React, { useEffect, useState } from 'react';
import { Building2, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';

export const AdminSocietiesPage: React.FC = () => {
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSociety, setEditingSociety] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSocieties = async () => {
    try {
      const res = await api.get('/foundation/societies');
      if (res.data.success) {
        setSocieties(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching societies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocieties();
  }, []);

  const openCreateModal = () => {
    setEditingSociety(null);
    setName('');
    setAddress('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (soc: any) => {
    setEditingSociety(soc);
    setName(soc.name);
    setAddress(soc.address);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingSociety) {
        const res = await api.put(`/foundation/societies/${editingSociety.id}`, { name, address });
        if (res.data.success) {
          setIsModalOpen(false);
          loadSocieties();
        }
      } else {
        const res = await api.post('/foundation/societies', { name, address });
        if (res.data.success) {
          setIsModalOpen(false);
          loadSocieties();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save society');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (soc: any) => {
    if (!window.confirm(`Are you sure you want to delete "${soc.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/foundation/societies/${soc.id}`);
      loadSocieties();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete society');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Society Master Registry</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage registered residential communities and physical addresses.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Add New Society
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading societies...</div>
      ) : societies.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900">No Societies Created</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Create your first residential society or run `npm run db:seed` to load demo data.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {societies.map((soc) => (
            <Card key={soc.id} className="relative overflow-hidden border-slate-200/90 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{soc.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {soc.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(soc)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Society"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(soc)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Society"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center font-mono text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block uppercase text-[10px]">Blocks</span>
                  <span className="font-bold text-slate-900 text-base">{soc._count?.blocks || 0}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block uppercase text-[10px]">Registered Users</span>
                  <span className="font-bold text-slate-900 text-base">{soc._count?.users || 0}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSociety ? "Edit Society Details" : "Register New Society"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <Input
            label="Society Name"
            placeholder="e.g., Prestige Tranquility or Sobha Dream Acres"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Full Physical Address"
            placeholder="e.g., 124, Whitefield Main Rd, Bangalore - 560066"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingSociety ? "Save Changes" : "Create Society"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

