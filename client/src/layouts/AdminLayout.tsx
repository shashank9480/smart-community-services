import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.js';
import { Header } from '../components/navigation/Header.js';
import { useAuth } from '../context/AuthContext.js';

export const AdminLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm tracking-wider text-slate-300">Loading Smart Community Services Console...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar role="ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Management Control Console" subtitle="System Administration & Master Registry" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
