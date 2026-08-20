import React, { useEffect, useState } from 'react';
import { Building2, Home, Users, ShieldCheck, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api.js';
import { StatCard } from '../../components/common/StatCard.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';
import { AnimatedCard } from '../../components/common/AnimatedCard.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    societiesCount: 0,
    blocksCount: 0,
    flatsCount: 0,
    residentsCount: 0,
    guardsCount: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      const [socRes, blkRes, fltRes, usrRes] = await Promise.all([
        api.get('/foundation/societies'),
        api.get('/foundation/blocks'),
        api.get('/foundation/flats'),
        api.get('/foundation/users'),
      ]);

      const societies = socRes.data?.data || [];
      const blocks = blkRes.data?.data || [];
      const flats = fltRes.data?.data || [];
      const users = usrRes.data?.data || [];

      const residents = users.filter((u: any) => u.role === 'RESIDENT');
      const guards = users.filter((u: any) => u.role === 'GUARD');

      setStats({
        societiesCount: societies.length,
        blocksCount: blocks.length,
        flatsCount: flats.length,
        residentsCount: residents.length,
        guardsCount: guards.length,
      });
      setRecentUsers(users.slice(0, 6));
    } catch (err) {
      console.error('Error loading dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <PageMotion className="space-y-8">
      {/* Welcome Banner */}
      <MotionItem>
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium mb-3 border border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Society Hub OS v1.0 — Module 1 Active
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-sans">
              Society Master Registry & Administration
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              You are viewing the foundation control panel. Configure Societies, Blocks, and Flats before assigning Residents or Guard telemetry passes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <Link to="/admin/flats">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="secondary" size="sm" className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
                  Manage Flats
                </Button>
              </motion.div>
            </Link>
            <Link to="/admin/residents">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                  Invite Resident
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </MotionItem>

      {/* Metrics Row */}
      <MotionItem className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard glowColor="#059669">
          <StatCard
            label="Active Societies"
            value={loading ? '...' : stats.societiesCount}
            icon={<Building2 className="w-6 h-6" />}
            change="100%"
            isIncrease={true}
          />
        </AnimatedCard>
        <AnimatedCard glowColor="#3b82f6">
          <StatCard
            label="Registered Blocks"
            value={loading ? '...' : stats.blocksCount}
            icon={<Home className="w-6 h-6" />}
          />
        </AnimatedCard>
        <AnimatedCard glowColor="#10b981">
          <StatCard
            label="Total Flats"
            value={loading ? '...' : stats.flatsCount}
            icon={<Building2 className="w-6 h-6 text-emerald-600" />}
          />
        </AnimatedCard>
        <AnimatedCard glowColor="#8b5cf6">
          <StatCard
            label="Residents & Guards"
            value={loading ? '...' : `${stats.residentsCount} + ${stats.guardsCount}G`}
            icon={<Users className="w-6 h-6 text-blue-600" />}
          />
        </AnimatedCard>
      </MotionItem>

      {/* Quick Navigation / Module Status Cards */}
      <MotionItem className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard>
          <Card
            title="1. Societies & Blocks"
            subtitle="Establish physical property hierarchy"
            action={
              <Link to="/admin/societies" className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1">
                View <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <p className="text-sm text-slate-600 mb-4">
              Manage society master records, addresses, and physical blocks inside Prestige Tranquility and future estates.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="success">Active</Badge>
              <span className="text-xs text-slate-400 font-mono">Prisma relational sync</span>
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard>
          <Card
            title="2. Flats Registry"
            subtitle="BHK, Sqft, and Owner linking"
            action={
              <Link to="/admin/flats" className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1">
                Registry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <p className="text-sm text-slate-600 mb-4">
              Add 2BHK, 3BHK, or penthouse flats across blocks and link primary owners and resident family members.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="success">Active</Badge>
              <span className="text-xs text-slate-400 font-mono">Unique block-number constraints</span>
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard>
          <Card
            title="3. User Access Control"
            subtitle="Role-Based Security & JWT"
            action={
              <Link to="/admin/residents" className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1">
                Users <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <p className="text-sm text-slate-600 mb-4">
              Create and verify Residents (`Priya Nair`), Gate Guards (`Ramesh Singh`), and Staff Managers with hashed passwords.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="success">Active</Badge>
              <span className="text-xs text-slate-400 font-mono">Bcrypt + JWT 7d Auth</span>
            </div>
          </Card>
        </AnimatedCard>
      </MotionItem>

      {/* Recent Users Table */}
      <MotionItem>
        <Card title="Recently Registered Users & Personnel" subtitle="Live feed from user directory">
          {loading ? (
            <div className="py-8 text-center text-slate-400 font-mono text-sm">Loading user directory...</div>
          ) : recentUsers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No users registered yet. Run `npm run db:seed` to populate.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold font-mono">
                    <th className="py-3 px-4">Name & Contact</th>
                    <th className="py-3 px-4">Role Badge</th>
                    <th className="py-3 px-4">Assigned Flat</th>
                    <th className="py-3 px-4">Society</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.9)' }}
                      className="transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{u.email} • {u.phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            u.role === 'ADMIN' ? 'danger' : u.role === 'GUARD' ? 'warning' : 'success'
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {u.flat ? (
                          <span className="font-semibold text-emerald-700">
                            {u.flat.number} ({u.flat.block?.name})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 font-medium">
                        {u.society?.name || u.flat?.block?.society?.name || 'Prestige Tranquility'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </MotionItem>
    </PageMotion>
  );
};

