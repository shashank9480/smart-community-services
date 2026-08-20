import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Star, Phone, Home, Building2, Search, Filter, MessageSquare, ShieldCheck } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';
import { AnimatedCard } from '../../components/common/AnimatedCard.js';

export const AdminStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeReviewsStaff, setActiveReviewsStaff] = useState<any | null>(null);

  // Form state - Create
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Maid');

  // Form state - Assign
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignSocietyId, setAssignSocietyId] = useState('');
  const [selectedFlatId, setSelectedFlatId] = useState('');
  const [assignError, setAssignError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [stfRes, fltRes, socRes] = await Promise.all([
        api.get('/staff'),
        api.get('/foundation/flats'),
        api.get('/foundation/societies'),
      ]);

      if (stfRes.data.success) {
        const staffList = stfRes.data.data || [];
        setStaff(staffList);
        if (staffList.length > 0 && !selectedStaffId) {
          setSelectedStaffId(staffList[0].id);
        }
      }

      if (fltRes.data.success) {
        const flatList = fltRes.data.data || [];
        setFlats(flatList);
      }

      if (socRes.data.success) {
        const socList = socRes.data.data || [];
        setSocieties(socList);
        if (socList.length > 0 && !assignSocietyId) {
          setAssignSocietyId(socList[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading staff directory:', err);
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
      alert(err.response?.data?.error?.message || 'Failed to create staff member');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError(null);
    if (!selectedStaffId || !selectedFlatId) {
      setAssignError('Please select both staff member and target flat');
      return;
    }
    try {
      const res = await api.post('/staff/assign', { staff_id: selectedStaffId, flat_id: selectedFlatId });
      if (res.data.success) {
        setIsAssignOpen(false);
        loadData();
      }
    } catch (err: any) {
      setAssignError(err.response?.data?.error?.message || 'Failed to assign staff member');
    }
  };

  // Filtered staff logic
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.assignments?.some((a: any) => a.flat?.number?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;

    const matchesSociety =
      selectedSocietyId === 'ALL' ||
      s.assignments?.some(
        (a: any) =>
          a.flat?.block?.society_id === selectedSocietyId || a.flat?.block?.society?.id === selectedSocietyId
      );

    return matchesSearch && matchesCategory && matchesSociety;
  });

  const availableFlatsForAssign = assignSocietyId
    ? flats.filter((f) => f.block?.society_id === assignSocietyId || f.block?.society?.id === assignSocietyId)
    : flats;

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'maid':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'driver':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cook':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'plumber':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'electrician':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'maid':
        return '🧹';
      case 'driver':
        return '🚗';
      case 'cook':
        return '🍳';
      case 'plumber':
        return '🔧';
      case 'electrician':
        return '⚡';
      default:
        return '👤';
    }
  };

  const categories = ['ALL', 'Maid', 'Cook', 'Driver', 'Plumber', 'Electrician'];

  return (
    <PageMotion className="space-y-6">
      {/* Header */}
      <MotionItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Domestic Staff Directory & Ratings</h2>
              <p className="text-sm text-slate-500 mt-0.5">Manage daily helpers, housekeeping, drivers, cooks, and resident ratings.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Home className="w-4 h-4" />} onClick={() => setIsAssignOpen(true)}>
            Assign Staff to Flat
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            Add New Staff Member
          </Button>
        </div>
      </MotionItem>

      {/* Metrics Row */}
      <MotionItem className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedCard glowColor="#3b82f6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Total Active Staff</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{filteredStaff.length} Personnel</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard glowColor="#f59e0b">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Average Star Rating</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1 flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                {filteredStaff.length > 0
                  ? (filteredStaff.reduce((acc, curr) => acc + (curr.avg_rating || 5.0), 0) / filteredStaff.length).toFixed(1)
                  : '5.0'} / 5.0
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard glowColor="#10b981">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Assigned Flat Links</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {filteredStaff.reduce((acc, s) => acc + (s.assignments?.length || 0), 0)} Linked
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
          </Card>
        </AnimatedCard>
      </MotionItem>

      {/* Filter Controls */}
      <MotionItem className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search staff by name, category, phone number, or flat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 text-sm w-full"
            />
          </div>

          {/* Society Select */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
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
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" /> Role:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'All Roles' : `${getCategoryIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>
      </MotionItem>

      {/* Staff Grid */}
      <MotionItem>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading domestic staff roster...</div>
        ) : filteredStaff.length === 0 ? (
          <Card className="text-center py-12">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900">No Domestic Staff Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Add domestic helpers or change category/society filter selection.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((s) => (
              <AnimatedCard key={s.id}>
                <Card className="p-5 space-y-4 border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xl border border-slate-200">
                        {getCategoryIcon(s.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                        <span className={`inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded border mt-0.5 ${getCategoryBadgeColor(s.category)}`}>
                          {s.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-amber-600 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        {s.avg_rating}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {s.reviews?.length || 0} reviews
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}
                    </span>
                    <a
                      href={`tel:${s.phone}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Call Staff
                    </a>
                  </div>

                  {/* Assigned Flats */}
                  <div className="pt-2">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Assigned Residences
                    </p>
                    {!s.assignments || s.assignments.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No flats linked</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                        {s.assignments.map((a: any) => (
                          <span
                            key={a.id}
                            className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1"
                          >
                            <Home className="w-3 h-3 text-emerald-600" />
                            Flat {a.flat?.number} ({a.flat?.block?.name})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveReviewsStaff(s)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                      View Resident Reviews ({s.reviews?.length || 0})
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">Verified ID</span>
                  </div>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        )}
      </MotionItem>

      {/* Modal - Register Staff */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register New Domestic Staff Member">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Full Name" placeholder="e.g. Radha Devi" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Phone Number" type="tel" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Staff Role Category</label>
            <select className="form-input font-semibold text-slate-800 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Maid">Maid (Housekeeping)</option>
              <option value="Driver">Personal Driver</option>
              <option value="Cook">Private Cook</option>
              <option value="Plumber">Plumber (Maintenance)</option>
              <option value="Electrician">Electrician (Resident Service)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Staff Account</Button>
          </div>
        </form>
      </Modal>

      {/* Modal - Assign Staff */}
      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Domestic Staff to Flat">
        <form onSubmit={handleAssign} className="space-y-4">
          {assignError && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium">{assignError}</p>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Select Staff Member</label>
            <select className="form-input text-xs font-mono" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required>
              <option value="">-- Select Staff --</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Target Society</label>
              <select
                className="form-input text-xs font-mono"
                value={assignSocietyId}
                onChange={(e) => {
                  setAssignSocietyId(e.target.value);
                  setSelectedFlatId('');
                }}
                required
              >
                {societies.map((soc) => (
                  <option key={soc.id} value={soc.id}>
                    {soc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">Select Flat</label>
              <select className="form-input text-xs font-mono" value={selectedFlatId} onChange={(e) => setSelectedFlatId(e.target.value)} required>
                <option value="">-- Select Flat --</option>
                {availableFlatsForAssign.map((fl) => (
                  <option key={fl.id} value={fl.id}>
                    Flat {fl.number} ({fl.block?.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Assign Staff Member</Button>
          </div>
        </form>
      </Modal>

      {/* Modal - Resident Reviews Details */}
      {activeReviewsStaff && (
        <Modal
          isOpen={!!activeReviewsStaff}
          onClose={() => setActiveReviewsStaff(null)}
          title={`Resident Star Reviews — ${activeReviewsStaff.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div>
                <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">Average Rating Score</span>
                <h3 className="text-3xl font-extrabold text-amber-700 mt-0.5 flex items-center gap-2">
                  <Star className="w-7 h-7 fill-amber-400 text-amber-500" />
                  {activeReviewsStaff.avg_rating} / 5.0
                </h3>
              </div>
              <Badge variant="warning">{activeReviewsStaff.reviews?.length || 0} Resident Reviews</Badge>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {!activeReviewsStaff.reviews || activeReviewsStaff.reviews.length === 0 ? (
                <p className="text-center py-6 text-slate-400 text-xs font-mono">No resident feedback comments posted yet.</p>
              ) : (
                activeReviewsStaff.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-xs">{rev.reviewer?.name || 'Society Resident'}</p>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{rev.comment || 'No detailed comment provided.'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{new Date(rev.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setActiveReviewsStaff(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </PageMotion>
  );
};
