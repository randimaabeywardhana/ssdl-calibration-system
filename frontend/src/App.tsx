import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserList from './pages/admin/AdminUserList';
import AdminServiceRequests from './pages/admin/AdminServiceRequests';
import AdminReferenceSystem from './pages/admin/AdminReferenceSystem';
import AdminPriceList from './pages/admin/AdminPriceList';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminEquipmentInventory from './pages/admin/AdminEquipmentInventory';
import AdminReports from './pages/admin/AdminReports';
import AdminCalibrationRecords from './pages/admin/AdminCalibrationRecords'; 

// Staff & Client (no layout yet, can add StaffLayout/ClientLayout later)
import StaffDashboard from './pages/staff/StaffDashboard';
import ClientDashboard from './pages/client/ClientDashboard';

// Temporary mock authentication
const isAuthenticated = true;
const userRole = 'admin'; // change to 'staff' or 'client' to test other roles

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes wrapped with AdminLayout (sidebar + header) */}
        <Route element={isAuthenticated && userRole === 'admin' ? <AdminLayout /> : <Navigate to="/" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/admin/requests" element={<AdminServiceRequests />} />
          <Route path="/admin/reference" element={<AdminReferenceSystem />} />
          <Route path="/admin/pricelist" element={<AdminPriceList />} />
          <Route path="/admin/audit" element={<AdminAuditLogs />} />
          <Route path="/admin/equipment" element={<AdminEquipmentInventory />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/calibrations" element={<AdminCalibrationRecords />} />
        </Route>

        {/* Staff routes (add StaffLayout later) */}
        <Route path="/staff" element={isAuthenticated && userRole === 'staff' ? <StaffDashboard /> : <Navigate to="/" />} />

        {/* Client routes (add ClientLayout later) */}
        <Route path="/client" element={isAuthenticated && userRole === 'client' ? <ClientDashboard /> : <Navigate to="/" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;