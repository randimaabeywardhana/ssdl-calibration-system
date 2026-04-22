// src/components/admin/AdminReports.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Stack, alpha, useTheme, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Tooltip, Avatar, CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf, FileCopy, Refresh, CheckCircle, Warning,
  AttachMoney, Inventory,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend, Filler);

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const monthlyCalibrations = {
  labels: ['May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'],
  completed: [18, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 27],
  target: [20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 30],
};

const complianceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  rates: [92, 94, 93, 95, 96, 94.2],
};

const statusData = {
  labels: ['Completed', 'Pending', 'Overdue', 'In Progress'],
  values: [168, 42, 12, 23],
  colors: ['#22c55e', '#eab308', '#ef4444', '#3b82f6'],
};

const staffWorkload = [
  { name: 'M. Perera', calibrations: 45, avgTime: 2.5 },
  { name: 'K. Silva', calibrations: 38, avgTime: 2.8 },
  { name: 'R. Jayawardena', calibrations: 42, avgTime: 2.3 },
  { name: 'T. Fernando', calibrations: 30, avgTime: 3.1 },
];

const monthlyRevenue = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  revenue: [420000, 385000, 455000, 490000, 510000, 378000],
};

const overdueEquipment = [
  { id: 'E1003', name: 'Ion Chamber Z', client: 'GHI Research', dueDate: '2024-10-20', days: 180, priority: 'High' },
  { id: 'E1005', name: 'Dosimeter W', client: 'JKL Hospital', dueDate: '2024-11-15', days: 155, priority: 'High' },
  { id: 'E1008', name: 'Survey Meter A', client: 'MNO Labs', dueDate: '2025-01-10', days: 99, priority: 'Medium' },
];

const staffPerformance = [
  { name: 'M. Perera', completed: 45, rejected: 2, avgUncertainty: 2.3, onTime: 98 },
  { name: 'K. Silva', completed: 38, rejected: 1, avgUncertainty: 2.5, onTime: 95 },
  { name: 'R. Jayawardena', completed: 42, rejected: 3, avgUncertainty: 2.1, onTime: 97 },
];

const formatCurrency = (amount) => `LKR ${amount.toLocaleString()}`;

// ----------------------------------------------------------------------
// Export Functions (Fast + All Data)
// ----------------------------------------------------------------------
const exportToPDF = () => {
  const doc = new jsPDF('landscape');
  let y = 20;

  doc.setFontSize(18);
  doc.text('SSDL Calibration Management System - Full Report', 14, y);
  y += 8;
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
  y += 15;

  // KPI Summary
  doc.setFontSize(13);
  doc.text('Key Performance Indicators', 14, y);
  y += 10;
  const kpiData = [
    ['Compliance Rate', '94.2%'],
    ['Overdue Calibrations', '12'],
    ['Revenue (MTD)', 'LKR 378,000'],
    ['Active Equipment', '245'],
  ];
  doc.autoTable({ head: [['Metric', 'Value']], body: kpiData, startY: y, theme: 'striped', headStyles: { fillColor: [59, 130, 246] } });
  y = doc.lastAutoTable.finalY + 15;

  // All Tables
  const tables = [
    { title: 'Calibration Trend', head: [['Month', 'Completed', 'Target']], body: monthlyCalibrations.labels.map((l, i) => [l, monthlyCalibrations.completed[i], monthlyCalibrations.target[i]]) },
    { title: 'Compliance Trend', head: [['Month', 'Compliance Rate (%)']], body: complianceData.labels.map((l, i) => [l, complianceData.rates[i]]) },
    { title: 'Status Distribution', head: [['Status', 'Count']], body: statusData.labels.map((l, i) => [l, statusData.values[i]]) },
    { title: 'Staff Workload', head: [['Staff', 'Calibrations', 'Avg Time (hrs)']], body: staffWorkload.map(s => [s.name, s.calibrations, s.avgTime]) },
    { title: 'Monthly Revenue', head: [['Month', 'Revenue (LKR)']], body: monthlyRevenue.labels.map((l, i) => [l, monthlyRevenue.revenue[i]]) },
    { title: 'Overdue Equipment', head: [['ID', 'Equipment', 'Client', 'Due Date', 'Days Overdue', 'Priority']], body: overdueEquipment.map(e => [e.id, e.name, e.client, e.dueDate, e.days, e.priority]) },
    { title: 'Staff Performance', head: [['Staff', 'Completed', 'Rejected', 'Avg Uncertainty (%)', 'On-Time (%)']], body: staffPerformance.map(s => [s.name, s.completed, s.rejected, s.avgUncertainty, `${s.onTime}%`]) },
  ];

  tables.forEach((table) => {
    if (y > 180) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.text(table.title, 14, y);
    y += 8;
    doc.autoTable({ head: table.head, body: table.body, startY: y, theme: 'striped', headStyles: { fillColor: [59, 130, 246] } });
    y = doc.lastAutoTable.finalY + 18;
  });

  doc.save(`SSDL_Full_Report_${new Date().toISOString().slice(0, 19)}.pdf`);
};

const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Month', 'Completed', 'Target'], ...monthlyCalibrations.labels.map((l, i) => [l, monthlyCalibrations.completed[i], monthlyCalibrations.target[i]])]), 'Calibration Trend');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Month', 'Compliance Rate (%)'], ...complianceData.labels.map((l, i) => [l, complianceData.rates[i]])]), 'Compliance');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Status', 'Count'], ...statusData.labels.map((l, i) => [l, statusData.values[i]])]), 'Status Distribution');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Staff', 'Calibrations', 'Avg Time (hrs)'], ...staffWorkload.map(s => [s.name, s.calibrations, s.avgTime])]), 'Staff Workload');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Month', 'Revenue (LKR)'], ...monthlyRevenue.labels.map((l, i) => [l, monthlyRevenue.revenue[i]])]), 'Monthly Revenue');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['ID', 'Equipment', 'Client', 'Due Date', 'Days Overdue', 'Priority'], ...overdueEquipment.map(e => [e.id, e.name, e.client, e.dueDate, e.days, e.priority])]), 'Overdue Equipment');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Staff', 'Completed', 'Rejected', 'Avg Uncertainty (%)', 'On-Time (%)'], ...staffPerformance.map(s => [s.name, s.completed, s.rejected, s.avgUncertainty, s.onTime])]), 'Staff Performance');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([excelBuffer]), `SSDL_Full_Report_${new Date().toISOString().slice(0, 19)}.xlsx`);
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
const AdminReports = () => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2026-04-30' });
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportPDF = async () => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    exportToPDF();
    setExportLoading(false);
  };

  const handleExportExcel = async () => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    exportToExcel();
    setExportLoading(false);
  };

  // Chart Options
  const lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };
  const complianceOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { min: 80, max: 100 } } };
  const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };
  const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  // Chart Data
  const lineData = {
    labels: monthlyCalibrations.labels,
    datasets: [
      { label: 'Completed', data: monthlyCalibrations.completed, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 },
      { label: 'Target', data: monthlyCalibrations.target, borderColor: '#94a3b8', borderDash: [5, 5], fill: false },
    ],
  };

  const complianceChartData = {
    labels: complianceData.labels,
    datasets: [{ label: 'Compliance Rate', data: complianceData.rates, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.3 }],
  };

  const pieData = {
    labels: statusData.labels,
    datasets: [{ data: statusData.values, backgroundColor: statusData.colors, borderWidth: 0 }],
  };

  const workloadData = {
    labels: staffWorkload.map(s => s.name),
    datasets: [{ label: 'Calibrations Completed', data: staffWorkload.map(s => s.calibrations), backgroundColor: '#8b5cf6', borderRadius: 8 }],
  };

  const revenueData = {
    labels: monthlyRevenue.labels,
    datasets: [{ label: 'Revenue (LKR)', data: monthlyRevenue.revenue, backgroundColor: '#f59e0b', borderRadius: 8 }],
  };

  const stats = {
    complianceRate: 94.2,
    overdueCount: 12,
    revenueMTD: 378000,
    activeEquipment: 245,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 3, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Reports & Analytics</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <TextField size="small" label="From" type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField size="small" label="To" type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} InputLabelProps={{ shrink: true }} />
              <Button variant="outlined" startIcon={<Refresh />}>Apply</Button>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
                onClick={handleExportPDF}
                disabled={exportLoading}
              >
                {exportLoading ? 'Generating PDF...' : 'Export PDF'}
              </Button>
              <Button
                variant="contained"
                startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <FileCopy />}
                onClick={handleExportExcel}
                disabled={exportLoading}
              >
                {exportLoading ? 'Generating Excel...' : 'Export Excel'}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Compliance Rate" value={`${stats.complianceRate}%`} icon={<CheckCircle />} color="#10b981" trend="+2.5%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Overdue Calibrations" value={stats.overdueCount} icon={<Warning />} color="#ef4444" trend="-3" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Revenue (MTD)" value={formatCurrency(stats.revenueMTD)} icon={<AttachMoney />} color="#f59e0b" trend="+8%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Active Equipment" value={stats.activeEquipment} icon={<Inventory />} color="#3b82f6" trend="+12" />
            </Grid>
          </Grid>
        </Box>

        {/* Charts */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Calibration Trend (Last 12 Months)</Typography>
            <Box sx={{ height: 400 }}><Line data={lineData} options={lineOptions} /></Box>
          </Card>

          <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Compliance Trend</Typography>
            <Box sx={{ height: 400 }}><Line data={complianceChartData} options={complianceOptions} /></Box>
          </Card>

          <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Calibration Status Distribution</Typography>
            <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: 500 }}><Pie data={pieData} options={pieOptions} /></Box>
            </Box>
          </Card>

          <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Staff Workload</Typography>
            <Box sx={{ height: 400 }}><Bar data={workloadData} options={barOptions} /></Box>
          </Card>

          <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Monthly Revenue</Typography>
            <Box sx={{ height: 400 }}><Bar data={revenueData} options={barOptions} /></Box>
          </Card>
        </Box>

        {/* Tables */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Top Overdue Equipment</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Equipment</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Days Overdue</TableCell>
                      <TableCell>Priority</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overdueEquipment.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.client}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell sx={{ color: '#ef4444', fontWeight: 600 }}>{item.days}</TableCell>
                        <TableCell><Chip label={item.priority} color={item.priority === 'High' ? 'error' : 'warning'} size="small" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Staff Performance</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Rejected</TableCell>
                      <TableCell>Avg Uncertainty (%)</TableCell>
                      <TableCell>On-Time (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffPerformance.map(row => (
                      <TableRow key={row.name}>
                        <TableCell>
                          <Avatar sx={{ width: 28, height: 28, mr: 1, display: 'inline-flex', bgcolor: '#3b82f6' }}>{row.name[0]}</Avatar>
                          {row.name}
                        </TableCell>
                        <TableCell>{row.completed}</TableCell>
                        <TableCell>{row.rejected}</TableCell>
                        <TableCell>{row.avgUncertainty}</TableCell>
                        <TableCell>{row.onTime}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Card>
    </Box>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, p: 2, borderColor: alpha(theme.palette.divider, 0.08), transition: 'all 0.2s', '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.5) } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Box sx={{ bgcolor: alpha(color, 0.1), borderRadius: 2, p: 0.5 }}>{icon}</Box>
      </Box>
      <Typography variant="h4" fontWeight={700} sx={{ color }}>{value}</Typography>
      {trend && <Typography variant="caption" color={trend.startsWith('+') ? 'success.main' : 'error.main'}>{trend}</Typography>}
    </Card>
  );
};

export default AdminReports;