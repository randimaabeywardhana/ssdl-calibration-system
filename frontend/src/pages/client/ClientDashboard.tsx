import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Avatar, IconButton, Badge, Tooltip, Alert, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import {
  Inventory, Warning, Assignment, TrendingUp, BarChart as BarIcon,
  Description, Logout, Pending, Receipt,
  Add, PictureAsPdf,
} from '@mui/icons-material';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Title, ChartTooltip, Legend);

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate('/');

  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [requestData, setRequestData] = useState({
    equipmentType: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    purpose: '',
    urgency: 'Routine',
  });

  // Mock data
  const clientEquipment = [
    { id: 'E1001', name: 'Dosimeter X', model: 'RAD-60', lastCal: '2025-01-10', nextDue: '2026-01-10', status: 'Calibrated' },
    { id: 'E1002', name: 'Survey Meter Y', model: 'X5 DE', lastCal: '2024-12-05', nextDue: '2025-12-05', status: 'Pending' },
    { id: 'E1003', name: 'Ion Chamber Z', model: '2575', lastCal: '2023-10-20', nextDue: '2024-10-20', status: 'Overdue' },
    { id: 'E1004', name: 'Dosimeter W', model: 'RAD-60S', lastCal: '2023-09-15', nextDue: '2024-09-15', status: 'Overdue' },
  ];

  const overdueEquipment = clientEquipment.filter(eq => eq.status === 'Overdue');

  const recentCertificates = [
    { id: 1, equipment: 'Dosimeter X', issueDate: '2025-01-15', certificateNumber: 'CERT-2025-001' },
  ];

  const invoices = [
    { id: 1, number: 'INV-2025-001', date: '2025-04-10', total: 14000, status: 'Unpaid' },
  ];

  const serviceRequests = [
    { id: 'SR-101', equipment: 'Dosimeter X', status: 'Approved', date: '2025-04-01' },
    { id: 'SR-102', equipment: 'New EPD', status: 'Pending', date: '2025-04-05' },
  ];

  // Chart data
  const calibrationStatusCounts = {
    calibrated: clientEquipment.filter(e => e.status === 'Calibrated').length,
    pending: clientEquipment.filter(e => e.status === 'Pending').length,
    overdue: clientEquipment.filter(e => e.status === 'Overdue').length,
  };

  const pieData = {
    labels: ['Calibrated', 'Pending', 'Overdue'],
    datasets: [{
      data: [calibrationStatusCounts.calibrated, calibrationStatusCounts.pending, calibrationStatusCounts.overdue],
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

  const openRequestForEquipment = (equipment: any) => {
    setSelectedEquipment(equipment);
    setRequestData({
      equipmentType: equipment.name,
      manufacturer: equipment.model.split(' ')[0] || '',
      model: equipment.model,
      serialNumber: equipment.id,
      purpose: `Calibration request for ${equipment.name} (overdue)`,
      urgency: 'Urgent',
    });
    setOpenRequestDialog(true);
  };

  const handleRequestSubmit = () => {
    console.log('Service request submitted:', requestData, selectedEquipment);
    setOpenRequestDialog(false);
    setSelectedEquipment(null);
    setRequestData({ equipmentType: '', manufacturer: '', model: '', serialNumber: '', purpose: '', urgency: 'Routine' });
    alert('Service request submitted successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setRequestData({ ...requestData, urgency: e.target.value as string });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden', m: 0, p: 0 }}>
      {/* Sidebar (unchanged) */}
      <Box sx={{ width: 280, background: 'linear-gradient(180deg, #0f172a 0%, #1e2937 100%)', color: '#e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', overflow: 'hidden', flexShrink: 0 }}>
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
              { label: 'My Equipment', icon: <Inventory /> },
              { label: 'Service Requests', icon: <Assignment /> },
              { label: 'Certificates', icon: <Description /> },
              { label: 'Invoices', icon: <Receipt /> },
            ].map((item, index) => (
              <Button key={index} fullWidth variant={item.active ? 'contained' : 'text'} startIcon={item.icon} sx={{ justifyContent: 'flex-start', mb: 1, py: 1.8, px: 3, borderRadius: 2, color: item.active ? 'white' : '#cbd5e1', backgroundColor: item.active ? '#3b82f6' : 'transparent', '&:hover': { backgroundColor: item.active ? '#2563eb' : '#334155', transform: 'translateX(4px)' }, transition: 'all 0.2s ease', textTransform: 'none', fontWeight: item.active ? 600 : 500 }}>{item.label}</Button>
            ))}
          </Box>
        </Box>
        <Box sx={{ p: 3, borderTop: '1px solid #334155' }}>
          <Button fullWidth variant="outlined" color="error" startIcon={<Logout />} onClick={handleLogout} sx={{ py: 1.6, borderRadius: 2 }}>Logout</Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, overflow: 'auto', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#0f172a' }}>Client Dashboard</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tooltip title="Notifications" arrow><IconButton sx={{ color: '#64748b' }}><Badge badgeContent={2} color="error"><Bell size={28} /></Badge></IconButton></Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48 }}>AB</Avatar><Box><Typography variant="subtitle1" fontWeight={600}>ABC Hospital</Typography><Typography variant="body2" color="text.secondary">Client</Typography></Box></Box>
          </Box>
        </Box>

        {/* Welcome Alert */}
        <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>Welcome back! Your equipment calibration status is displayed below.</Alert>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Total Equipment</Typography><Typography variant="h3" fontWeight={700}>{clientEquipment.length}</Typography></Box><Avatar sx={{ bgcolor: '#3b82f620', color: '#3b82f6' }}><Inventory /></Avatar></Box></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Overdue Equipment</Typography><Typography variant="h3" fontWeight={700} color="#ef4444">{overdueEquipment.length}</Typography></Box><Avatar sx={{ bgcolor: '#ef444420', color: '#ef4444' }}><Warning /></Avatar></Box></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Pending Calibrations</Typography><Typography variant="h3" fontWeight={700} color="#eab308">{clientEquipment.filter(e => e.status === 'Pending').length}</Typography></Box><Avatar sx={{ bgcolor: '#eab30820', color: '#eab308' }}><Pending /></Avatar></Box></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%' }}><CardContent sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="body2" color="text.secondary">Unpaid Invoices</Typography><Typography variant="h3" fontWeight={700} color="#ef4444">{invoices.filter(i => i.status === 'Unpaid').length}</Typography></Box><Avatar sx={{ bgcolor: '#ef444420', color: '#ef4444' }}><Receipt /></Avatar></Box></CardContent></Card></Grid>
        </Grid>

        {/* Calibration Status Distribution - FULL SECTION */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6, p: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} align="center" gutterBottom sx={{ mb: 3 }}>
              Calibration Status Distribution
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Box sx={{ width: '100%', maxWidth: 600, height: 450 }}>
                <Pie data={pieData} options={pieOptions} />
              </Box>
            </Box>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
              This chart shows the current calibration status of all your equipment.
            </Typography>
          </CardContent>
        </Card>

        {/* Overdue Equipment Section */}
        {overdueEquipment.length > 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6, border: '2px solid #ef4444', backgroundColor: '#fff5f5' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
                <Warning /> Overdue Equipment - Immediate Action Required
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fee2e2' }}>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Equipment Name</strong></TableCell>
                      <TableCell><strong>Model</strong></TableCell>
                      <TableCell><strong>Due Date</strong></TableCell>
                      <TableCell align="center"><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overdueEquipment.map((eq) => (
                      <TableRow key={eq.id} hover sx={{ borderLeft: '4px solid #ef4444' }}>
                        <TableCell>{eq.id}</TableCell>
                        <TableCell>{eq.name}</TableCell>
                        <TableCell>{eq.model}</TableCell>
                        <TableCell sx={{ color: '#ef4444', fontWeight: 'bold' }}>{eq.nextDue}</TableCell>
                        <TableCell align="center">
                          <Button variant="contained" color="error" size="small" startIcon={<Add />} onClick={() => openRequestForEquipment(eq)}>
                            Request Service
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* My Equipment Section */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>My Equipment</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead><TableRow><TableCell><strong>ID</strong></TableCell><TableCell><strong>Name</strong></TableCell><TableCell><strong>Model</strong></TableCell><TableCell><strong>Last Cal</strong></TableCell><TableCell><strong>Next Due</strong></TableCell><TableCell><strong>Status</strong></TableCell></TableRow></TableHead>
                <TableBody>
                  {clientEquipment.map((eq) => (
                    <TableRow key={eq.id} hover>
                      <TableCell>{eq.id}</TableCell>
                      <TableCell>{eq.name}</TableCell>
                      <TableCell>{eq.model}</TableCell>
                      <TableCell>{eq.lastCal}</TableCell>
                      <TableCell>{eq.nextDue}</TableCell>
                      <TableCell><Chip label={eq.status} size="small" color={eq.status === 'Calibrated' ? 'success' : eq.status === 'Pending' ? 'warning' : 'error'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" startIcon={<Add />} sx={{ mt: 2, bgcolor: '#3b82f6' }} onClick={() => { setSelectedEquipment(null); setOpenRequestDialog(true); }}>Submit New Service Request</Button>
          </CardContent>
        </Card>

        {/* Service Request Status */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 6 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Service Request Status</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead><TableRow><TableCell><strong>Request ID</strong></TableCell><TableCell><strong>Equipment</strong></TableCell><TableCell><strong>Date</strong></TableCell><TableCell><strong>Status</strong></TableCell></TableRow></TableHead>
                <TableBody>
                  {serviceRequests.map((req) => (
                    <TableRow key={req.id} hover><TableCell>{req.id}</TableCell><TableCell>{req.equipment}</TableCell><TableCell>{req.date}</TableCell><TableCell><Chip label={req.status} size="small" color={req.status === 'Approved' ? 'success' : 'warning'} /></TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Recent Certificates - Full Width Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>Recent Certificates</Typography>
                {recentCertificates.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No certificates available.</Typography>
                ) : (
                  recentCertificates.map((cert) => (
                    <Box key={cert.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid #e2e8f0' }}>
                      <Box><Typography variant="body1" fontWeight={500}>{cert.equipment}</Typography><Typography variant="caption" color="text.secondary">{cert.issueDate}</Typography></Box>
                      <Button size="small" variant="outlined" startIcon={<PictureAsPdf />} sx={{ color: '#ef4444', borderColor: '#ef4444' }}>Download PDF</Button>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Invoices - Full Width Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>Invoices</Typography>
                {invoices.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No invoices available.</Typography>
                ) : (
                  invoices.map((inv) => (
                    <Box key={inv.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid #e2e8f0' }}>
                      <Box><Typography variant="body1" fontWeight={500}>{inv.number}</Typography><Typography variant="caption" color="text.secondary">Due: {inv.date}</Typography></Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" fontWeight={600}>LKR {inv.total.toLocaleString()}</Typography>
                        <Chip label={inv.status} size="small" color={inv.status === 'Unpaid' ? 'error' : 'success'} />
                      </Box>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Service Request Dialog */}
        <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedEquipment ? `Request Service for ${selectedEquipment.name}` : 'Submit New Service Request'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField name="equipmentType" label="Equipment Type" fullWidth required value={requestData.equipmentType} onChange={handleInputChange} />
              <TextField name="manufacturer" label="Manufacturer" fullWidth required value={requestData.manufacturer} onChange={handleInputChange} />
              <TextField name="model" label="Model" fullWidth required value={requestData.model} onChange={handleInputChange} />
              <TextField name="serialNumber" label="Serial Number" fullWidth required value={requestData.serialNumber} onChange={handleInputChange} />
              <TextField name="purpose" label="Purpose / Usage Context" fullWidth multiline rows={2} value={requestData.purpose} onChange={handleInputChange} />
              <FormControl fullWidth>
                <InputLabel>Urgency</InputLabel>
                <Select name="urgency" value={requestData.urgency} label="Urgency" onChange={handleSelectChange}>
                  <MenuItem value="Routine">Routine</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleRequestSubmit}>Submit Request</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ClientDashboard;