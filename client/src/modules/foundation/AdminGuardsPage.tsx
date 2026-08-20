import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Trash2, Mail, Phone, Building2, Search, ShieldAlert, KeyRound } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';
import { AnimatedCard } from '../../components/common/AnimatedCard.js';

export const AdminGuardsPage: React.FC = () => {
  const [guards, setGuards] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('ALL');

  // Form states for creating a Guard
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('guard123');
  const [societyId, setSocietyId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [usrRes, socRes] = await Promise.all([
        api.get('/foundation/users'),
        api.get('/foundation/societies'),
      ]);

      if (usrRes.data.success) {
        // Filter ONLY security guards
        const allUsers = usrRes.data.data || [];
        const guardUsers = allUsers.filter((u: any) => u.role === 'GUARD');
        setGuards(guardUsers);
      }

      if (socRes.data.success) {
        const socs = socRes.data.data || [];
        setSocieties(socs);
        if (socs.length > 0 && !societyId) {
          setSocietyId(socs[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading guards data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGuard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: 'GUARD',
        society_id: societyId || null,
        flat_id: null,
      };

      const res = await api.post('/foundation/users', payload);
      if (res.data.success) {
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('guard123');
        loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create security guard account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGuard = async (id: string, guardName: string) => {
    if (!window.confirm(`Are you sure you want to revoke access and delete guard account for "${guardName}"?`)) return;
    try {
      await api.delete(`/foundation/users/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete guard account');
    }
  };

  const filteredGuards = guards.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm);

    const guardSocId = g.society_id || g.society?.id;
    const matchesSociety = selectedSocietyId === 'ALL' || guardSocId === selectedSocietyId;

    return matchesSearch && matchesSociety;
  });

  return (
    <PageMotion className="space-y-6">
      {/* Header */}
      <MotionItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Guards Directory</h2>
              <p className="text-sm text-slate-500 mt-0.5">Manage gate personnel, console credentials, and active security rosters.</p>
            </div>
          </div>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add Security Guard
        </Button>
      </MotionItem>

      {/* Metrics Row */}
      <MotionItem className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedCard glowColor="#f59e0b">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Total Guards</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{filteredGuards.length} Personnel</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard glowColor="#10b981">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Gate Duty Status</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">100% Active</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Badge variant="success">Online</Badge>
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard glowColor="#3b82f6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Console Security</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">JWT Hashed</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
          </Card>
        </AnimatedCard>
      </MotionItem>

      {/* Search Bar & Society Filter */}
      <MotionItem className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search guards by name, phone number, or email address..."
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

      {/* Guards Table */}
      <MotionItem>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading security guards roster...</div>
        ) : filteredGuards.length === 0 ? (
          <Card className="text-center py-12">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900">No Security Guards Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Add security personnel to grant them access to the Gate Verification & SOS Radar Console.
            </p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold font-mono">
                    <th className="py-3.5 px-6">Guard Personnel</th>
                    <th className="py-3.5 px-6">Contact Info</th>
                    <th className="py-3.5 px-6">Assigned Society Base</th>
                    <th className="py-3.5 px-6">Gate Duty Status</th>
                    <th className="py-3.5 px-6 text-right">Revoke Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white">
                  {filteredGuards.map((guard) => (
                    <tr key={guard.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                            🛡️
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{guard.name}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200 mt-0.5">
                              SECURITY GUARD
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="space-y-1 text-xs text-slate-600 font-mono">
                          <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {guard.email}</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {guard.phone}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-700 font-medium">
                        {guard.society?.name ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                            <Building2 className="w-3.5 h-3.5 text-amber-600" />
                            {guard.society.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned Base</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <Badge variant="warning">Gate Console Active</Badge>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleDeleteGuard(guard.id, guard.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revoke & Delete Guard"
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

      {/* Add Guard Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Security Guard Account">
        <form onSubmit={handleCreateGuard} className="space-y-4">
          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <Input
            label="Guard Full Name"
            placeholder="e.g., Ramesh Singh (Main Gate)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Login Email Address"
              type="email"
              placeholder="guard@smartcommunityservices.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Phone Number"
              type="tel"
              placeholder="9876543211"
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
                onChange={(e) => setSocietyId(e.target.value)}
                required
              >
                {societies.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <Input
              label="Set Login Password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Add Security Guard
            </Button>
          </div>
        </form>
      </Modal>
    </PageMotion>
  );
};
