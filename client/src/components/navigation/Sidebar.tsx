import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  ShieldCheck, 
  Building2, 
  Home, 
  Users, 
  LogOut, 
  Layers, 
  UserCheck, 
  FileText, 
  LifeBuoy, 
  Calendar,
  Radio,
  UserCog
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { EditProfileModal } from '../common/EditProfileModal.js';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export const Sidebar: React.FC<{ role: 'ADMIN' | 'RESIDENT' | 'GUARD' }> = ({ role }) => {
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const adminNav: SidebarItem[] = [
    { name: 'Dashboard Overview', href: '/admin', icon: <Layers className="w-5 h-5" /> },
    { name: 'Societies Master', href: '/admin/societies', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Blocks Management', href: '/admin/blocks', icon: <Home className="w-5 h-5" /> },
    { name: 'Flats Registry', href: '/admin/flats', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Residents & Guards', href: '/admin/residents', icon: <Users className="w-5 h-5" /> },
    { name: 'Visitor Logs', href: '/admin/visitors', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Staff & Ratings', href: '/admin/staff', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'Invoices & ERP', href: '/admin/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: 'Helpdesk Tickets', href: '/admin/tickets', icon: <LifeBuoy className="w-5 h-5" /> },
    { name: 'Community & SOS', href: '/admin/community', icon: <Calendar className="w-5 h-5" /> },
  ];

  const residentNav: SidebarItem[] = [
    { name: 'Resident Home', href: '/resident', icon: <Home className="w-5 h-5" /> },
    { name: 'Gate Passcodes', href: '/resident/passes', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'My Domestic Staff', href: '/resident/staff', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'Dues & Invoices', href: '/resident/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: 'Helpdesk Tickets', href: '/resident/tickets', icon: <LifeBuoy className="w-5 h-5" /> },
    { name: 'Community & SOS', href: '/resident/community', icon: <Calendar className="w-5 h-5" /> },
  ];

  const guardNav: SidebarItem[] = [
    { name: 'Gate Console Live', href: '/guard', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Pass Verification', href: '/guard/pass-verify', icon: <Layers className="w-5 h-5" /> },
    { name: 'Parcel Handover', href: '/guard/parcels', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Staff Punch In', href: '/guard/staff-punch', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'SOS Receiver', href: '/guard/sos-radar', icon: <Radio className="w-5 h-5 text-red-500" />, badge: 'Live Radar' },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'RESIDENT' ? residentNav : guardNav;
  const isGuard = role === 'GUARD';

  return (
    <aside className={clsx(
      'w-64 flex-shrink-0 flex flex-col border-r min-h-screen select-none',
      isGuard ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-100'
    )}>
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm shadow-emerald-500/30">
          SCS
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white block leading-none">Smart Community Services</span>
          <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase mt-1 block">
            {role === 'ADMIN' ? 'Control Console' : role === 'GUARD' ? 'Gate Instrument' : 'Resident Portal'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-500 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-600">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-3">
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Authorized User'}</p>
            <p className="text-xs text-slate-400 truncate font-mono">{user?.email}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase bg-slate-800 text-emerald-400 border border-slate-700">
            {role}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 hover:bg-emerald-900/40 hover:text-emerald-300 transition-colors"
          >
            <UserCog className="w-4 h-4" />
            Edit Profile Settings
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-950/30 border border-red-900/50 hover:bg-red-900/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Secure Sign Out
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </aside>
  );
};
