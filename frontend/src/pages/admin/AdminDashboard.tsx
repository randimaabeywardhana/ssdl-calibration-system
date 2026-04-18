import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Avatar, IconButton, Badge, Tooltip, Alert, Chip, LinearProgress,
  Tabs, Tab,
} from '@mui/material';
import {
  Inventory, Warning, Assignment, TrendingUp, BarChart as BarIcon, Security,
  Description, Build, Logout, People, Pending, Receipt, Schedule,
  Refresh, Add, RateReview, PictureAsPdf,
} from '@mui/icons-material';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, ChartTooltip, Legend);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate('/');
  const [tabValue, setTabValue] = useState(0);

  // KPI Data
  const kpis = {
    totalEquipment: 245,
    activeUsers: 18,
    totalCalibrationsThisMonth: 27,
    overdueCalibrations: 12,
    pendingRequests: 5,
    unpaidInvoices: 3,
    pendingApprovals: 2,
  };

  // Chart Data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Calibrations Performed',
      data: [18, 24, 31, 27],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: '#2563eb',
      borderWidth: 2,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of Calibrations' } } },
  };

  const pieData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [{
      data: [68, 22, 10],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      borderWidth: 4,
      borderColor: '#ffffff',
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'bottom' } },
  };

  // Mock Data
  const pendingApprovals = [
    { id: 'CAL-245', equipment: 'Dosimeter X', staff: 'M. Perera', date: '2026-04-09', type: 'Calibration' },
    { id: 'CAL-246', equipment: 'Survey Meter Y', staff: 'K. Silva', date: '2026-04-09', type: 'Calibration' },
    { id: 'SR-102', equipment: 'Ion Chamber Z', client: 'GHI Research', date: '2026-04-10', type: 'Service Request' },
  ];

  const recentActivity = [
    { action: 'CAL-247 completed for Atomic Energy Hospital', timestamp: '2026-04-10 14:32', user: 'M. Perera' },
    { action: 'Service Request SR-20260418 approved', timestamp: '2026-04-10 11:15', user: 'Admin' },
    { action: 'Stability check performed on Ion Chamber', timestamp: '2026-04-09 16:45', user: 'K. Silva' },
    { action: 'New equipment "Survey Meter RAD-60" registered', timestamp: '2026-04-09 09:20', user: 'Admin' },
    { action: 'Invoice INV-2026-001 paid', timestamp: '2026-04-08 13:10', user: 'System' },
  ];

  const refSystemStatus = [
    { name: 'Stability Check (Sr‑90)', status: 'Pass', lastCheck: '2026-04-01', expiresIn: null },
    { name: 'Gamma Field (Cs‑137)', status: 'In Spec', lastCheck: '2026-04-02', expiresIn: null },
    { name: 'Reference Electrometer', status: 'Expires soon', lastCheck: '2026-03-15', expiresIn: 15 },
    { name: 'Reference Ion Chamber', status: 'OK', lastCheck: '2026-04-10', expiresIn: null },
  ];

  const upcomingTasks = [
    { task: 'Calibration: Dosimeter X (E1001)', due: '2026-04-11', priority: 'High' },
    { task: 'Stability Check (Monthly)', due: '2026-04-15', priority: 'Medium' },
    { task: 'Invoice follow-up: ABC Hospital', due: '2026-04-12', priority: 'Low' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        m: 0,
        p: 0,
      }}
    >
      {/* Sidebar - Fixed Layout with Logout at Bottom */}
      <Box
        sx={{
          width: 280,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e2937 100%)',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Top Section (Logo + Menu) */}
        <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 460, mx: 'auto' }}>
              <img
                src="/src/assets/ssdl-logo.png"
                alt="SSDL Logo"
                style={{
                  height: 80,
                  marginBottom: 1,
                  filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/180x118/1e40af/ffffff?text=SSDL+CMS';
                }}
              />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: '#f1f5f9' }}>
              SLAEB - SSDL
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            {[
              { label: 'Dashboard', icon: <BarIcon />, active: true },
              { label: 'User Management', icon: <People /> },
              { label: 'Service Requests', icon: <Assignment /> },
              { label: 'Reference System', icon: <Security /> },
              { label: 'Equipment Inventory', icon: <Inventory /> },
              { label: 'Price List', icon: <Description /> },
              { label: 'Audit Logs', icon: <Build /> },
              { label: 'Reports & Analytics', icon: <TrendingUp /> },
            ].map((item, index) => (
              <Button
                key={index}
                fullWidth
                variant={item.active ? 'contained' : 'text'}
                startIcon={item.icon}
                sx={{
                  justifyContent: 'flex-start',
                  mb: 1,
                  py: 1.8,
                  px: 3,
                  borderRadius: 2,
                  color: item.active ? 'white' : '#cbd5e1',
                  backgroundColor: item.active ? '#3b82f6' : 'transparent',
                  '&:hover': { backgroundColor: item.active ? '#2563eb' : '#334155', transform: 'translateX(4px)' },
                  transition: 'all 0.2s ease',
                  textTransform: 'none',
                  fontWeight: item.active ? 600 : 500,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Bottom Section (Logout Button) */}
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

      {/* Main Content (unchanged) */}
      <Box sx={{ flex: 1, p: 4, overflow: 'auto', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#0f172a' }}>
            Admin Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tooltip title="Notifications" arrow>
              <IconButton sx={{ color: '#64748b' }}>
                <Badge badgeContent={3} color="error">
                  <Bell size={28} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48 }}>RA</Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>Randima Abeywardhana</Typography>
                <Typography variant="body2" color="text.secondary">Administrator</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Reference System Alert */}
        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{ mb: 4, borderRadius: 3 }}
          action={<Button color="inherit" size="small" startIcon={<Refresh />}>Check Now</Button>}
        >
          <strong>Reference System Status:</strong> Electrometer calibration expires in <strong>15 days</strong>. 
          Please perform stability check and reference calibration before proceeding with customer work.
        </Alert>

        {/* KPI Cards - First Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Equipment</Typography>
                    <Typography variant="h3" fontWeight={700}>{kpis.totalEquipment}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#3b82f620', color: '#3b82f6' }}><Inventory /></Avatar>
                </Box>
                <LinearProgress variant="determinate" value={75} sx={{ mt: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' } }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Active Users</Typography>
                    <Typography variant="h3" fontWeight={700}>{kpis.activeUsers}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#10b98120', color: '#10b981' }}><People /></Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Calibrations (MTD)</Typography>
                    <Typography variant="h3" fontWeight={700}>{kpis.totalCalibrationsThisMonth}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#3b82f620', color: '#3b82f6' }}><Schedule /></Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* KPI Cards - Second Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Overdue Calibrations</Typography>
                    <Typography variant="h3" fontWeight={700} color="#ef4444">{kpis.overdueCalibrations}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#ef444420', color: '#ef4444' }}><Warning /></Avatar>
                </Box>
                <Button size="small" sx={{ mt: 1 }}>View Details</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pending Requests</Typography>
                    <Typography variant="h3" fontWeight={700} color="#8b5cf6">{kpis.pendingRequests}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#8b5cf620', color: '#8b5cf6' }}><Assignment /></Avatar>
                </Box>
                <Button size="small" sx={{ mt: 1 }}>Review</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Unpaid Invoices</Typography>
                    <Typography variant="h3" fontWeight={700} color="#ef4444">{kpis.unpaidInvoices}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#ef444420', color: '#ef4444' }}><Receipt /></Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pending Approvals</Typography>
                    <Typography variant="h3" fontWeight={700} color="#eab308">{kpis.pendingApprovals}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#eab30820', color: '#eab308' }}><Pending /></Avatar>
                </Box>
                <Button size="small" sx={{ mt: 1 }}>Review</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: 1100 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} align="center" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" startIcon={<Add />} sx={{ py: 1.5, px: 4, bgcolor: '#3b82f6' }}>
                  ADD USER
                </Button>
                <Button variant="contained" startIcon={<RateReview />} sx={{ py: 1.5, px: 4, bgcolor: '#8b5cf6' }}>
                  REVIEW REQUESTS
                </Button>
                <Button variant="contained" startIcon={<PictureAsPdf />} sx={{ py: 1.5, px: 4, bgcolor: '#ef4444' }}>
                  EXPORT REPORT
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Monthly Calibration Trend - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: 1100 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} align="center" gutterBottom>
                Monthly Calibration Trend
              </Typography>
              <Box sx={{ width: '100%', height: 420, display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Bar data={barData} options={barOptions} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Calibration Status Distribution - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: 1100 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} align="center" gutterBottom>
                Calibration Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 420, display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2 }}>
                <Pie data={pieData} options={pieOptions} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs Section */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
              <Tab label="Pending Approvals" />
              <Tab label="Recent Activity" />
              <Tab label="Upcoming Tasks" />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {tabValue === 0 && (
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Equipment / Client</strong></TableCell>
                        <TableCell><strong>Requested By</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell align="center"><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingApprovals.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell><strong>{row.id}</strong></TableCell>
                          <TableCell>
                            <Chip label={row.type} size="small" color={row.type === 'Calibration' ? 'primary' : 'secondary'} />
                          </TableCell>
                          <TableCell>{row.equipment || row.client}</TableCell>
                          <TableCell>{row.staff || row.client}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell align="center">
                            <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>Approve</Button>
                            <Button variant="outlined" color="error" size="small">Reject</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tabValue === 1 && (
                <Box>
                  {recentActivity.map((activity, idx) => (
                    <Box key={idx} sx={{ py: 2, borderBottom: idx < recentActivity.length - 1 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>{activity.action}</Typography>
                        <Typography variant="caption" color="text.secondary">by {activity.user}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{activity.timestamp}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  {upcomingTasks.map((task, idx) => (
                    <Box key={idx} sx={{ py: 2, borderBottom: idx < upcomingTasks.length - 1 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>{task.task}</Typography>
                        <Typography variant="caption" color="text.secondary">Due: {task.due}</Typography>
                      </Box>
                      <Chip label={task.priority} size="small" color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Reference System Status */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Reference System Status</Typography>
            {refSystemStatus.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={item.status} size="small" color={item.status === 'Pass' || item.status === 'OK' || item.status === 'In Spec' ? 'success' : 'warning'} />
                  {item.expiresIn && <Typography variant="caption" color="error">{item.expiresIn} days left</Typography>}
                </Box>
              </Box>
            ))}
            <Button variant="outlined" startIcon={<Security />} sx={{ mt: 2 }}>Run Verification</Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;