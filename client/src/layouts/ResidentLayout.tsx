import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.js';
import { Header } from '../components/navigation/Header.js';
import { useAuth } from '../context/AuthContext.js';

export const ResidentLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium text-sm text-slate-600">Entering Resident Portal...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'RESIDENT') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar role="RESIDENT" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Resident Dashboard Portal" subtitle={`Flat ${user.flat?.number || 'Unassigned'} — ${user.society?.name || 'Prestige Tranquility'}`} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
