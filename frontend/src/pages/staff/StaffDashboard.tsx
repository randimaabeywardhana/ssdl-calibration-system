import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Avatar, IconButton, Badge, Tooltip, Alert, Chip, LinearProgress,
  Tabs, Tab,
} from '@mui/material';
import {
  Inventory, Warning, Assignment, TrendingUp, BarChart as BarIcon, Security,
  Description, Build, Logout, People, Pending, Receipt, Schedule as ScheduleIcon,
  Refresh, Add, RateReview, PictureAsPdf, History, CheckCircle,
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

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate('/');
  const [tabValue, setTabValue] = useState(0);

  // KPI Data
  const kpis = {
    pendingCalibrations: 8,
    completedToday: 2,
    overdueTasks: 1,
    totalEquipment: 120,
  };

  // Chart Data
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Calibrations Scheduled',
      data: [5, 7, 6, 8, 4, 2],
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
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: ['#eab308', '#3b82f6', '#22c55e'],
      borderWidth: 4,
      borderColor: '#ffffff',
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'bottom' } },
  };

  // Today's Schedule
  const todaysSchedule = [
    { time: '09:00', equipment: 'Dosimeter X (E1001)', client: 'ABC Hospital', status: 'Pending', id: 1 },
    { time: '10:30', equipment: 'Survey Meter Y (E1002)', client: 'DEF Medical', status: 'In Progress', id: 2 },
    { time: '14:00', equipment: 'Ion Chamber Z (E1003)', client: 'GHI Research', status: 'Pending', id: 3 },
  ];

  // Overdue Alerts
  const overdueAlerts = [
    { equipment: 'Survey Meter A', client: 'JKL Hospital', dueDate: '2026-04-01', days: 10, priority: 'High' },
    { equipment: 'Dosimeter B', client: 'MNO Labs', dueDate: '2026-04-05', days: 6, priority: 'Medium' },
  ];

  // Recent Service Requests (EXPLICITLY DEFINED)
  const recentServiceRequests = [
    { id: 'SR-101', client: 'ABC Hospital', equipment: 'Dosimeter X', urgency: 'Urgent', status: 'Approved', date: '2026-04-10' },
    { id: 'SR-102', client: 'DEF Medical', equipment: 'Survey Meter Y', urgency: 'Normal', status: 'Pending', date: '2026-04-09' },
    { id: 'SR-103', client: 'GHI Research', equipment: 'Ion Chamber Z', urgency: 'Normal', status: 'Approved', date: '2026-04-08' },
  ];

  // Reference System Status
  const refSystemStatus = [
    { name: 'Stability Check (Sr‑90)', status: 'Pass', lastCheck: '2026-04-01', expiresIn: null },
    { name: 'Gamma Field (Cs‑137)', status: 'In Spec', lastCheck: '2026-04-02', expiresIn: null },
    { name: 'Reference Electrometer', status: 'Expires soon', lastCheck: '2026-03-15', expiresIn: 15 },
    { name: 'Reference Ion Chamber', status: 'OK', lastCheck: '2026-04-10', expiresIn: null },
  ];

  // Recent Activity
  const recentActivity = [
    { action: 'Completed calibration for Dosimeter X (E1001)', timestamp: '2026-04-10 15:20', user: 'M. Perera' },
    { action: 'Started calibration for Survey Meter Y', timestamp: '2026-04-10 10:45', user: 'K. Silva' },
    { action: 'Stability check passed', timestamp: '2026-04-09 16:30', user: 'System' },
  ];

  // Upcoming Tasks
  const upcomingTasks = [
    { task: 'Calibration: Dosimeter X (E1001)', due: '2026-04-11', priority: 'High' },
    { task: 'Monthly Stability Check', due: '2026-04-15', priority: 'Medium' },
    { task: 'Prepare Certificate for ABC Hospital', due: '2026-04-12', priority: 'Low' },
  ];

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden', m: 0, p: 0 }}>
      {/* Sidebar - Fixed Layout with Logout at Bottom */}
      <Box sx={{ width: 280, background: 'linear-gradient(180deg, #0f172a 0%, #1e2937 100%)', color: '#e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', overflow: 'hidden', flexShrink: 0 }}>
        {/* Top Section (Logo + Menu) */}
        <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 460, mx: 'auto' }}>
              <img src="/src/assets/ssdl-logo.png" alt="SSDL Logo" style={{ height: 80, marginBottom: 1, filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))', maxWidth: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/180x118/1e40af/ffffff?text=SSDL+CMS'; }} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: '#f1f5f9' }}>SLAEB - SSDL</Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            {[
              { label: 'Dashboard', icon: <BarIcon />, active: true },
              { label: 'Equipment', icon: <Inventory /> },
              { label: 'Calibration', icon: <ScheduleIcon /> },
              { label: 'My Schedule', icon: <History /> },
              { label: 'Service Requests', icon: <Assignment /> },
              { label: 'Reports', icon: <TrendingUp /> },
            ].map((item, index) => (
              <Button key={index} fullWidth variant={item.active ? 'contained' : 'text'} startIcon={item.icon} sx={{ justifyContent: 'flex-start', mb: 1, py: 1.8, px: 3, borderRadius: 2, color: item.active ? 'white' : '#cbd5e1', backgroundColor: item.active ? '#3b82f6' : 'transparent', '&:hover': { backgroundColor: item.active ? '#2563eb' : '#334155', transform: 'translateX(4px)' }, transition: 'all 0.2s ease', textTransform: 'none', fontWeight: item.active ? 600 : 500 }}>{item.label}</Button>
            ))}
          </Box>
        </Box>
        {/* Bottom Section (Logout Button) */}
        <Box sx={{ p: 3, borderTop: '1px solid #334155' }}>
          <Button fullWidth variant="outlined" color="error" startIcon={<Logout />} onClick={handleLogout} sx={{ py: 1.6, borderRadius: 2 }}>Logout</Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, overflow: 'auto', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#0f172a' }}>Staff Dashboard</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tooltip title="Notifications" arrow><IconButton sx={{ color: '#64748b' }}><Badge badgeContent={2} color="error"><Bell size={28} /></Badge></IconButton></Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ bgcolor: '#10b981', width: 48, height: 48 }}>MP</Avatar><Box><Typography variant="subtitle1" fontWeight={600}>M. Perera</Typography><Typography variant="body2" color="text.secondary">Senior Technician</Typography></Box></Box>
          </Box>
        </Box>

        {/* Reference System Alert */}
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 4, borderRadius: 3 }} action={<Button color="inherit" size="small" startIcon={<Refresh />}>Check Now</Button>}><strong>Reference System Status:</strong> Electrometer calibration expires in <strong>15 days</strong>. Please notify administrator.</Alert>

        {/* KPI Cards - First Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Pending Calibrations</Typography><Typography variant="h3" fontWeight={700} color="#eab308">{kpis.pendingCalibrations}</Typography></Box><Avatar sx={{ bgcolor: '#eab30820', color: '#eab308' }}><Pending /></Avatar></Box></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Completed Today</Typography><Typography variant="h3" fontWeight={700} color="#22c55e">{kpis.completedToday}</Typography></Box><Avatar sx={{ bgcolor: '#22c55e20', color: '#22c55e' }}><CheckCircle /></Avatar></Box></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Overdue Tasks</Typography><Typography variant="h3" fontWeight={700} color="#ef4444">{kpis.overdueTasks}</Typography></Box><Avatar sx={{ bgcolor: '#ef444420', color: '#ef4444' }}><Warning /></Avatar></Box></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Total Equipment</Typography><Typography variant="h3" fontWeight={700}>{kpis.totalEquipment}</Typography></Box><Avatar sx={{ bgcolor: '#3b82f620', color: '#3b82f6' }}><Inventory /></Avatar></Box></CardContent></Card></Grid>
        </Grid>

        {/* Today's Schedule Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}><CardContent><Typography variant="h6" fontWeight={600} gutterBottom>Today's Schedule</Typography><TableContainer component={Paper} sx={{ boxShadow: 'none' }}><Table><TableHead><TableRow><TableCell><strong>Time</strong></TableCell><TableCell><strong>Equipment</strong></TableCell><TableCell><strong>Client</strong></TableCell><TableCell><strong>Status</strong></TableCell><TableCell align="center"><strong>Action</strong></TableCell></TableRow></TableHead><TableBody>{todaysSchedule.map((item) => (<TableRow key={item.id} hover><TableCell>{item.time}</TableCell><TableCell>{item.equipment}</TableCell><TableCell>{item.client}</TableCell><TableCell><Chip label={item.status} size="small" color={item.status === 'In Progress' ? 'info' : 'default'} /></TableCell><TableCell align="center"><Button variant="contained" size="small" sx={{ bgcolor: '#3b82f6' }}>Start</Button></TableCell></TableRow>))}</TableBody></Table></TableContainer></CardContent></Card>

        {/* Recent Service Requests Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}><CardContent><Typography variant="h6" fontWeight={600} gutterBottom>Recent Service Requests</Typography><TableContainer component={Paper} sx={{ boxShadow: 'none' }}><Table><TableHead><TableRow><TableCell><strong>Request ID</strong></TableCell><TableCell><strong>Client</strong></TableCell><TableCell><strong>Equipment</strong></TableCell><TableCell><strong>Urgency</strong></TableCell><TableCell><strong>Status</strong></TableCell><TableCell><strong>Date</strong></TableCell></TableRow></TableHead><TableBody>{recentServiceRequests.map((req) => (<TableRow key={req.id} hover><TableCell>{req.id}</TableCell><TableCell>{req.client}</TableCell><TableCell>{req.equipment}</TableCell><TableCell><Chip label={req.urgency} size="small" color={req.urgency === 'Urgent' ? 'error' : 'default'} /></TableCell><TableCell><Chip label={req.status} size="small" color={req.status === 'Approved' ? 'success' : 'warning'} /></TableCell><TableCell>{req.date}</TableCell></TableRow>))}</TableBody></Table></TableContainer></CardContent></Card>

        {/* Overdue Alerts Section - Enhanced */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6, border: '2px solid #ef4444', backgroundColor: '#fff5f5' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444' }}><Warning sx={{ fontSize: 32, animation: 'pulse 1.5s infinite' }} />Overdue Alerts - Immediate Attention Required</Typography>
            {overdueAlerts.length === 0 ? (<Typography variant="body2" color="text.secondary">No overdue items.</Typography>) : (<TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}><Table><TableHead><TableRow sx={{ backgroundColor: '#fee2e2' }}><TableCell sx={{ fontWeight: 'bold' }}>Equipment</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Days Overdue</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell></TableRow></TableHead><TableBody>{overdueAlerts.map((item, idx) => (<TableRow key={idx} hover sx={{ borderLeft: '4px solid #ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}><TableCell sx={{ fontWeight: 500 }}>{item.equipment}</TableCell><TableCell>{item.client}</TableCell><TableCell>{item.dueDate}</TableCell><TableCell sx={{ color: '#ef4444', fontWeight: 'bold' }}>{item.days} days</TableCell><TableCell><Chip label={item.priority} size="small" color={item.priority === 'High' ? 'error' : 'warning'} sx={{ fontWeight: 'bold' }} /></TableCell></TableRow>))}</TableBody></Table></TableContainer>)}
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}><CardContent><Typography variant="h6" fontWeight={600} align="center" gutterBottom>Weekly Calibration Workload</Typography><Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><Box sx={{ width: '100%', maxWidth: 800, height: 400 }}><Bar data={barData} options={barOptions} /></Box></Box></CardContent></Card>
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}><CardContent><Typography variant="h6" fontWeight={600} align="center" gutterBottom>My Calibration Status</Typography><Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><Box sx={{ width: '100%', maxWidth: 500, height: 400 }}><Pie data={pieData} options={pieOptions} /></Box></Box></CardContent></Card>

        {/* Tabs for Recent Activity & Upcoming Tasks */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}><CardContent sx={{ p: 0 }}><Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}><Tab label="Recent Activity" /><Tab label="Upcoming Tasks" /></Tabs><Box sx={{ p: 4 }}>{tabValue === 0 && (<Box>{recentActivity.map((activity, idx) => (<Box key={idx} sx={{ py: 2, borderBottom: idx < recentActivity.length - 1 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography variant="body1" fontWeight={500}>{activity.action}</Typography><Typography variant="caption" color="text.secondary">by {activity.user}</Typography></Box><Typography variant="caption" color="text.secondary">{activity.timestamp}</Typography></Box>))}</Box>)} {tabValue === 1 && (<Box>{upcomingTasks.map((task, idx) => (<Box key={idx} sx={{ py: 2, borderBottom: idx < upcomingTasks.length - 1 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography variant="body1" fontWeight={500}>{task.task}</Typography><Typography variant="caption" color="text.secondary">Due: {task.due}</Typography></Box><Chip label={task.priority} size="small" color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'} /></Box>))}</Box>)}</Box></CardContent></Card>

        {/* Reference System Status */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}><CardContent sx={{ p: 4 }}><Typography variant="h6" fontWeight={600} gutterBottom>Reference System Status</Typography>{refSystemStatus.map((item, idx) => (<Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}><Typography variant="body2" color="text.secondary">{item.name}</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Chip label={item.status} size="small" color={item.status === 'Pass' || item.status === 'OK' || item.status === 'In Spec' ? 'success' : 'warning'} />{item.expiresIn && <Typography variant="caption" color="error">{item.expiresIn} days left</Typography>}</Box></Box>))}</CardContent></Card>
      </Box>
    </Box>
  );
};

export default StaffDashboard;