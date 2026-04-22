// src/layouts/AdminLayout.tsx
import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import {
  BarChart as BarIcon, 
  People, 
  Assignment, 
  Security, 
  Inventory,
  Description, 
  Build, 
  TrendingUp, 
  CheckCircle,   // ← New for Calibration Records
  Logout
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import NotificationBell from '../components/common/NotificationBell';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate('/');

  const menuItems = [
    { label: 'Dashboard', icon: <BarIcon />, path: '/admin' },
    { label: 'User Management', icon: <People />, path: '/admin/users' },
    { label: 'Service Requests', icon: <Assignment />, path: '/admin/requests' },
    
    // ← New: Calibration Records (Approval Portal)
    { label: 'Calibration Records', icon: <CheckCircle />, path: '/admin/calibrations' },
    
    { label: 'Reference System', icon: <Security />, path: '/admin/reference' },
    { label: 'Equipment Inventory', icon: <Inventory />, path: '/admin/equipment' },
    { label: 'Price List', icon: <Description />, path: '/admin/pricelist' },
    { label: 'Audit Logs', icon: <Build />, path: '/admin/audit' },
    { label: 'Reports & Analytics', icon: <TrendingUp />, path: '/admin/reports' },
  ];

  const currentPath = location.pathname;

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <Box sx={{
        width: 280,
        background: 'linear-gradient(180deg, #0f172a 0%, #1e2937 100%)',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
      }}>
        {/* Logo Section - Your exact path */}
        <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <img
              src="/src/assets/ssdl-logo.png"
              alt="SSDL Logo"
              style={{ height: 80, marginBottom: 1, filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))', maxWidth: '100%', objectFit: 'contain' }}
              onError={(e) => { 
                e.currentTarget.src = 'https://via.placeholder.com/180x118/1e40af/ffffff?text=SSDL+CMS'; 
              }}
            />
            <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: '#f1f5f9' }}>
              SLAEB - SSDL
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.label}
                  fullWidth
                  variant={isActive ? 'contained' : 'text'}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    mb: 1,
                    py: 1.8,
                    px: 3,
                    borderRadius: 2,
                    color: isActive ? 'white' : '#cbd5e1',
                    backgroundColor: isActive ? '#3b82f6' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? '#2563eb' : '#334155',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease',
                    textTransform: 'none',
                    fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Logout Button */}
        <Box sx={{ p: 3, borderTop: '1px solid #334155' }}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<Logout />} 
            onClick={handleLogout} 
            sx={{ py: 1.6, borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
        {/* Top Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={600} sx={{ color: '#0f172a' }}>
            {/* Dynamic title can be added later */}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <NotificationBell />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>RA</Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Randima Abeywardhana
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Child Pages */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;