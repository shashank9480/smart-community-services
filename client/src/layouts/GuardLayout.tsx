import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.js';
import { Header } from '../components/navigation/Header.js';
import { useAuth } from '../context/AuthContext.js';

export const GuardLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm tracking-wider text-amber-400 uppercase">Initializing Gate Avionics Console...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'GUARD') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      <Sidebar role="GUARD" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Gate Command Terminal" subtitle={`On Duty: ${user.name} — Main & Service Gate Verification`} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
