import React, { useEffect, useState } from 'react';
import { Users, Plus, Trash2, Mail, Phone, Home, Search, Building2 } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';
import { AnimatedCard } from '../../components/common/AnimatedCard.js';

export const AdminResidentsPage: React.FC = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('ALL');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('resident123');
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

      if (usrRes.data.success) {
        // Filter ONLY residents
        const allUsers = usrRes.data.data || [];
        const residentUsers = allUsers.filter((u: any) => u.role === 'RESIDENT');
        setResidents(residentUsers);
      }

      if (fltRes.data.success) setFlats(fltRes.data.data || []);
      if (socRes.data.success) {
        const socs = socRes.data.data || [];
        setSocieties(socs);
        if (socs.length > 0 && !societyId) {
          setSocietyId(socs[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading residents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateResident = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: 'RESIDENT',
        society_id: societyId || null,
        flat_id: flatId || null,
      };

      const res = await api.post('/foundation/users', payload);
      if (res.data.success) {
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('resident123');
        setFlatId('');
        loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create resident account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete resident account for "${userName}"?`)) return;
    try {
      await api.delete(`/foundation/users/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete resident');
    }
  };

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      (r.flat?.number && r.flat.number.toLowerCase().includes(searchTerm.toLowerCase()));

    const resSocId = r.society_id || r.society?.id || r.flat?.block?.society_id || r.flat?.block?.society?.id;
    const matchesSociety = selectedSocietyId === 'ALL' || resSocId === selectedSocietyId;

    return matchesSearch && matchesSociety;
  });

  const availableFlatsForSociety = societyId
    ? flats.filter((f) => f.block?.society_id === societyId || f.block?.society?.id === societyId)
    : flats;

  return (
    <PageMotion className="space-y-6">
      {/* Header */}
      <MotionItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Residents Directory</h2>
              <p className="text-sm text-slate-500 mt-0.5">Manage resident accounts, flat allocations, and owner invitations.</p>
            </div>
          </div>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add New Resident
        </Button>
      </MotionItem>

      {/* Metrics Header */}
      <MotionItem className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedCard glowColor="#10b981">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Total Residents</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{filteredResidents.length} Residents</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard glowColor="#3b82f6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Assigned Flats</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {filteredResidents.filter((r) => r.flat_id).length} Occupied
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard glowColor="#8b5cf6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Account Access</p>
              <h3 className="text-2xl font-extrabold text-purple-600 mt-1">Active Portal</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Badge variant="success">Registered</Badge>
            </div>
          </Card>
        </AnimatedCard>
      </MotionItem>

      {/* Search Input & Society Filter */}
      <MotionItem className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search residents by name, flat number (e.g. A-101), phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-slate-500" />
          <select
            value={selectedSocietyId}
            onChange={(e) => setSelectedSocietyId(e.target.value)}
            className="form-input text-xs font-semibold py-2 px-3 bg-white border-slate-200 shadow-sm"
          >
            <option value="ALL">🏢 All Societies ({societies.length})</option>
            {societies.map((soc) => (
              <option key={soc.id} value={soc.id}>
                {soc.name}
              </option>
            ))}
          </select>
        </div>
      </MotionItem>

      {/* Residents Table */}
      <MotionItem>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading resident directory...</div>
        ) : filteredResidents.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900">No Residents Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Invite residents to assign them to their flat numbers.</p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold font-mono">
                    <th className="py-3.5 px-6">Resident Details</th>
                    <th className="py-3.5 px-6">Assigned Flat & Block</th>
                    <th className="py-3.5 px-6">Society Estate</th>
                    <th className="py-3.5 px-6">Portal Role</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white">
                  {filteredResidents.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                            🏡
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{res.name}</p>
                            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 font-mono">
                              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {res.email}</span>
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {res.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs">
                        {res.flat ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            <Home className="w-3.5 h-3.5 text-emerald-600" />
                            {res.flat.number} ({res.flat.block?.name})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No Flat Linked</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-600 font-medium">
                        {res.society?.name || res.flat?.block?.society?.name ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            {res.society?.name || res.flat?.block?.society?.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned Society</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <Badge variant="success">RESIDENT</Badge>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleDelete(res.id, res.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Resident"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </MotionItem>

      {/* Add Resident Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite & Create Resident Account">
        <form onSubmit={handleCreateResident} className="space-y-4">
          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <Input
            label="Resident Full Name"
            placeholder="e.g., Priya Nair"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="resident@smartcommunityservices.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="9876543213"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Society</label>
              <select
                className="form-input text-xs"
                value={societyId}
                onChange={(e) => {
                  setSocietyId(e.target.value);
                  setFlatId('');
                }}
                required
              >
                {societies.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assign Flat</label>
              <select
                className="form-input font-mono text-xs"
                value={flatId}
                onChange={(e) => setFlatId(e.target.value)}
              >
                <option value="">-- No Flat Linked --</option>
                {availableFlatsForSociety.map((f) => (
                  <option key={f.id} value={f.id}>
                    Flat {f.number} ({f.block?.name}) — {f.bhk_type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Initial Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Invite Resident
            </Button>
          </div>
        </form>
      </Modal>
    </PageMotion>
  );
};
