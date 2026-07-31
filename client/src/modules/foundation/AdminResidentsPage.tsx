import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, Trash2, Mail, Phone, Home } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';

export const AdminResidentsPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('RESIDENT');
  const [flatId, setFlatId] = useState('');
  const [societyId, setSocietyId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [usrRes, fltRes, socRes] = await Promise.all([
        api.get('/foundation/users'),
        api.get('/foundation/flats'),
        api.get('/foundation/societies'),
      ]);
      if (usrRes.data.success) setUsers(usrRes.data.data);
      if (fltRes.data.success) setFlats(fltRes.data.data);
      if (socRes.data.success) {
        setSocieties(socRes.data.data);
        if (socRes.data.data.length > 0 && !societyId) {
          setSocietyId(socRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        name,
        email,
        phone,
        password,
        role,
        society_id: societyId || null,
        flat_id: role === 'RESIDENT' && flatId ? flatId : null,
      };

      const res = await api.post('/foundation/users', payload);
      if (res.data.success) {
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('password123');
        loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete account for ${userName}?`)) return;
    try {
      await api.delete(`/foundation/users/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Residents & Guards Directory</h2>
          <p className="text-sm text-slate-500 mt-0.5">Role access governance, gate guards, and resident invitations.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add New User
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading user directory...</div>
      ) : users.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900">No Users Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Invite residents or security guards to populate the directory.</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold font-mono">
                  <th className="py-3.5 px-6">User / Contact Info</th>
                  <th className="py-3.5 px-6">Assigned Role</th>
                  <th className="py-3.5 px-6">Flat & Block Link</th>
                  <th className="py-3.5 px-6">Society Base</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 bg-white">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900">{usr.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {usr.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {usr.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={
                          usr.role === 'ADMIN' ? 'danger' : usr.role === 'GUARD' ? 'warning' : 'success'
                        }
                      >
                        {usr.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs">
                      {usr.flat ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          <Home className="w-3.5 h-3.5 text-emerald-600" />
                          {usr.flat.number} ({usr.flat.block?.name})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No Flat Linked</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-600">
                      {usr.society?.name || 'Prestige Tranquility'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {usr.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDelete(usr.id, usr.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite or Create New User">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <Input
            label="Full Name"
            placeholder="e.g., Priya Nair or Ramesh Singh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@smartcommunityservices.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Role Assignment</label>
              <select
                className="form-input font-semibold text-slate-800"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="RESIDENT">RESIDENT (Flat Occupant)</option>
                <option value="GUARD">GUARD (Gate & Security)</option>
                <option value="ADMIN">ADMIN (System Controller)</option>
              </select>
            </div>
            <Input
              label="Initial Password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {role === 'RESIDENT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assign Flat</label>
              <select
                className="form-input font-mono text-xs"
                value={flatId}
                onChange={(e) => setFlatId(e.target.value)}
              >
                <option value="">-- No Flat Linked --</option>
                {flats.map((f) => (
                  <option key={f.id} value={f.id}>
                    Flat {f.number} ({f.block?.name}) — {f.bhk_type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Society</label>
            <select
              className="form-input text-xs"
              value={societyId}
              onChange={(e) => setSocietyId(e.target.value)}
            >
              {societies.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Invite & Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
