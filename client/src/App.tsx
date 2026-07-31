import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';

import { LoginPage } from './modules/auth/LoginPage.js';
import { AdminLayout } from './layouts/AdminLayout.js';
import { ResidentLayout } from './layouts/ResidentLayout.js';
import { GuardLayout } from './layouts/GuardLayout.js';

import { AdminDashboardPage } from './modules/foundation/AdminDashboardPage.js';
import { AdminSocietiesPage } from './modules/foundation/AdminSocietiesPage.js';
import { AdminBlocksPage } from './modules/foundation/AdminBlocksPage.js';
import { AdminFlatsPage } from './modules/foundation/AdminFlatsPage.js';
import { AdminResidentsPage } from './modules/foundation/AdminResidentsPage.js';

import { AdminVisitorsPage } from './modules/visitor/AdminVisitorsPage.js';
import { ResidentPassesPage } from './modules/visitor/ResidentPassesPage.js';
import { GuardPassVerifyPage } from './modules/visitor/GuardPassVerifyPage.js';
import { GuardParcelsPage } from './modules/visitor/GuardParcelsPage.js';

import { AdminStaffPage } from './modules/staff/AdminStaffPage.js';
import { ResidentStaffPage } from './modules/staff/ResidentStaffPage.js';
import { GuardStaffPunchPage } from './modules/staff/GuardStaffPunchPage.js';

import { AdminInvoicesPage } from './modules/erp/AdminInvoicesPage.js';
import { ResidentInvoicesPage } from './modules/erp/ResidentInvoicesPage.js';

import { AdminTicketsPage } from './modules/helpdesk/AdminTicketsPage.js';
import { ResidentTicketsPage } from './modules/helpdesk/ResidentTicketsPage.js';

import { AdminCommunityPage } from './modules/community/AdminCommunityPage.js';
import { ResidentCommunityPage } from './modules/community/ResidentCommunityPage.js';
import { GuardSOSRadarPage } from './modules/community/GuardSOSRadarPage.js';

import { ResidentPortalPage } from './modules/foundation/ResidentPortalPage.js';
import { GuardConsolePage } from './modules/foundation/GuardConsolePage.js';

// Route Guard to redirect logged-in users to their respective role home or redirect unauthenticated users to /login
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm">
        Initializing Smart Community Services Avionics...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'GUARD') return <Navigate to="/guard" replace />;
  return <Navigate to="/resident" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="societies" element={<AdminSocietiesPage />} />
              <Route path="blocks" element={<AdminBlocksPage />} />
              <Route path="flats" element={<AdminFlatsPage />} />
              <Route path="residents" element={<AdminResidentsPage />} />
              <Route path="visitors" element={<AdminVisitorsPage />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="invoices" element={<AdminInvoicesPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="community" element={<AdminCommunityPage />} />
            </Route>

            {/* Resident Routes */}
            <Route path="/resident" element={<ResidentLayout />}>
              <Route index element={<ResidentPortalPage />} />
              <Route path="passes" element={<ResidentPassesPage />} />
              <Route path="staff" element={<ResidentStaffPage />} />
              <Route path="invoices" element={<ResidentInvoicesPage />} />
              <Route path="tickets" element={<ResidentTicketsPage />} />
              <Route path="community" element={<ResidentCommunityPage />} />
            </Route>

            {/* Guard Routes */}
            <Route path="/guard" element={<GuardLayout />}>
              <Route index element={<GuardConsolePage />} />
              <Route path="pass-verify" element={<GuardPassVerifyPage />} />
              <Route path="parcels" element={<GuardParcelsPage />} />
              <Route path="staff-punch" element={<GuardStaffPunchPage />} />
              <Route path="sos-radar" element={<GuardSOSRadarPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
