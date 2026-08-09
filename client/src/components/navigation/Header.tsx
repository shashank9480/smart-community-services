import React, { useState } from 'react';
import { Bell, Radio, Shield, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useSocket } from '../../context/SocketContext.js';
import { EditProfileModal } from '../common/EditProfileModal.js';

export const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const { connected } = useSocket();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Socket Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="font-mono text-[11px]">
            {connected ? 'Socket Live' : 'Reconnecting...'}
          </span>
        </div>

        {/* Flat info or Society pill */}
        {user?.flat ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Flat {user.flat.number} ({user.flat.block.name})</span>
          </div>
        ) : user?.society ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <span>{user.society.name}</span>
          </div>
        ) : null}

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          title="Edit Profile Settings"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
        >
          <UserCog className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Profile</span>
        </button>

        {/* Alerts Bell */}
        <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
        </button>
      </div>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};
