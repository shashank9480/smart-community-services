import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, UserCheck, FileText, LifeBuoy, Calendar, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';
import { AnimatedCard } from '../../components/common/AnimatedCard.js';

export const ResidentPortalPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageMotion className="space-y-8">
      {/* Resident Welcome & Status Card */}
      <MotionItem>
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-slate-900 text-white shadow-xl border border-emerald-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium mb-3 border border-emerald-500/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Resident Account Verified • {user?.society?.name || 'Prestige Tranquility'}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Welcome home, {user?.name?.split(' ')[0] || 'Resident'}!
              </h2>
              <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
                You are signed into your high-security apartment portal. Access visitor passes, domestic staff telemetry, and community helpdesk directly below.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shrink-0 font-mono text-center min-w-[180px] shadow-lg"
            >
              <span className="text-xs text-emerald-300/80 block uppercase tracking-wider">Registered Flat</span>
              {user?.flat ? (
                <div className="mt-1">
                  <span className="text-3xl font-extrabold text-white block leading-none">{user.flat.number}</span>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">{user.flat.block?.name} • {user.flat.bhk_type}</span>
                </div>
              ) : (
                <span className="text-sm text-amber-400 font-bold block mt-2">No Flat Linked</span>
              )}
            </motion.div>
          </div>
        </div>
      </MotionItem>

      {/* Module Roadmap / Quick Launch Grid */}
      <MotionItem>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-900 tracking-tight">System Modules Roadmap</h3>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
            Module 1 Foundation Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavLink to="/resident/passes">
            <AnimatedCard glowColor="#059669" className="h-full">
              <Card
                title="Gate Passcodes (Phase 2)"
                subtitle="Pre-approve guests & cabs"
                action={<Badge variant="success">Active Module</Badge>}
                className="border-0 p-0 shadow-none hover:shadow-none"
              >
                <p className="text-sm text-slate-600 mb-4">
                  Generate 6-digit verification passcodes for guests, delivery executives, and cabs with custom validity timers.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> OTP Verification</span>
                  <span className="text-emerald-600 font-bold">Open Module →</span>
                </div>
              </Card>
            </AnimatedCard>
          </NavLink>

          <NavLink to="/resident/staff">
            <AnimatedCard glowColor="#3b82f6" className="h-full">
              <Card
                title="My Domestic Staff (Phase 3)"
                subtitle="Attendance & live punch alerts"
                action={<Badge variant="success">Active Module</Badge>}
                className="border-0 p-0 shadow-none hover:shadow-none"
              >
                <p className="text-sm text-slate-600 mb-4">
                  Register maids, cooks, and drivers linked to your flat. Receive instant real-time push alerts when they enter the gate.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-blue-600" /> Socket.io Pings</span>
                  <span className="text-blue-600 font-bold">Open Module →</span>
                </div>
              </Card>
            </AnimatedCard>
          </NavLink>

          <NavLink to="/resident/invoices">
            <AnimatedCard glowColor="#f59e0b" className="h-full">
              <Card
                title="ERP & Invoices (Phase 4)"
                subtitle="Maintenance payments & dues"
                action={<Badge variant="success">Active Module</Badge>}
                className="border-0 p-0 shadow-none hover:shadow-none"
              >
                <p className="text-sm text-slate-600 mb-4">
                  View automated monthly billing breakdowns per BHK/Sqft, pay online via Razorpay test checkout, and track ledger history.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-amber-600" /> Pay Dues</span>
                  <span className="text-amber-600 font-bold">Open Module →</span>
                </div>
              </Card>
            </AnimatedCard>
          </NavLink>

          <NavLink to="/resident/tickets">
            <AnimatedCard glowColor="#a855f7" className="h-full">
              <Card
                title="Helpdesk Tickets (Phase 5)"
                subtitle="Maintenance & complaints"
                action={<Badge variant="success">Active Module</Badge>}
                className="border-0 p-0 shadow-none hover:shadow-none"
              >
                <p className="text-sm text-slate-600 mb-4">
                  Raise maintenance tickets (Plumbing, Electrical, Common Area) with photo attachments and track live updates from Admin.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><LifeBuoy className="w-4 h-4 text-purple-600" /> SLA Workflow</span>
                  <span className="text-purple-600 font-bold">Open Module →</span>
                </div>
              </Card>
            </AnimatedCard>
          </NavLink>

          <NavLink to="/resident/community">
            <AnimatedCard glowColor="#ef4444" className="h-full">
              <Card
                title="Community & SOS (Phase 6)"
                subtitle="Amenities calendar & emergency"
                action={<Badge variant="danger">Live Radar</Badge>}
                className="border-0 p-0 shadow-none hover:shadow-none"
              >
                <p className="text-sm text-slate-600 mb-4">
                  Book clubhouse or tennis slots without conflicts, check notice board, and trigger 1-tap real-time SOS broadcasts to all guards.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-red-600 animate-pulse" /> Live Radar Broadcast</span>
                  <span className="text-red-600 font-bold">Open Module →</span>
                </div>
              </Card>
            </AnimatedCard>
          </NavLink>

          <AnimatedCard glowColor="#10b981" className="h-full">
            <Card
              title="Account & Flat Telemetry"
              subtitle="Foundation verification status"
              action={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              className="border-0 p-0 shadow-none hover:shadow-none"
            >
              <p className="text-sm text-slate-600 mb-4 font-mono text-xs">
                • User ID: {user?.id?.slice(0, 8)}...<br />
                • Email: {user?.email}<br />
                • Phone: {user?.phone}<br />
                • Auth Tier: JWT Bearer Guarded
              </p>
              <div className="pt-3 border-t border-slate-100 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                Sanity Check Passed <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </Card>
          </AnimatedCard>
        </div>
      </MotionItem>
    </PageMotion>
  );
};

