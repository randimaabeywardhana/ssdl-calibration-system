// src/components/admin/AdminEquipmentInventory.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, IconButton, Grid, Card, CardContent, Stack,
  alpha, useTheme, MenuItem, Tabs, Tab, Tooltip,
} from '@mui/material';
import {
  Add, Edit, Delete, Search, Clear, CheckCircle, Cancel, Warning,
  Inventory, Business, Science, History,
} from '@mui/icons-material';

// ----------------------------------------------------------------------
// Mock data (no uniqueId)
// ----------------------------------------------------------------------

const mockClients = [
  { userId: 1, companyName: 'ABC Hospital', contactPerson: 'Dr. Smith', phone: '0112345678' },
  { userId: 2, companyName: 'DEF Medical', contactPerson: 'Ms. Johnson', phone: '0118765432' },
  { userId: 3, companyName: 'GHI Research', contactPerson: 'Dr. Lee', phone: '0119988776' },
];

const mockCustomerEquipment = [
  {
    equipmentId: 1,
    name: 'Dosimeter X',
    manufacturer: 'RADOS',
    model: 'RAD-60',
    serialNumber: 'SN12345',
    detectorType: 'Si-Diode',
    status: 'Calibrated',
    lastCalibrationDate: '2025-01-10',
    nextDueDate: '2026-01-10',
    calibrationIntervalMonths: 12,
    instrumentType: 'customer',
    clientId: 1,
    applicationContext: 'Radiation protection monitoring',
    radiationSources: 'Cs-137, Co-60',
    phantomDetails: 'ISO water phantom',
    clientName: 'ABC Hospital',
  },
  {
    equipmentId: 2,
    name: 'Survey Meter Y',
    manufacturer: 'Geaetz',
    model: 'X5 DE',
    serialNumber: 'SN67890',
    detectorType: 'GM',
    status: 'Pending',
    lastCalibrationDate: '2024-12-05',
    nextDueDate: '2025-12-05',
    calibrationIntervalMonths: 12,
    instrumentType: 'customer',
    clientId: 2,
    applicationContext: 'Area monitoring',
    radiationSources: 'Cs-137',
    phantomDetails: null,
    clientName: 'DEF Medical',
  },
  {
    equipmentId: 3,
    name: 'Ion Chamber Z',
    manufacturer: 'NE',
    model: '2575',
    serialNumber: 'SN11223',
    detectorType: 'Ion Chamber',
    status: 'Overdue',
    lastCalibrationDate: '2023-10-20',
    nextDueDate: '2024-10-20',
    calibrationIntervalMonths: 12,
    instrumentType: 'customer',
    clientId: 3,
    applicationContext: 'Reference dosimetry',
    radiationSources: 'Cs-137, Co-60, X-ray',
    phantomDetails: 'Water phantom',
    clientName: 'GHI Research',
  },
];

const mockReferenceInstruments = [
  {
    equipmentId: 101,
    name: 'Farmer Electrometer',
    manufacturer: 'NE',
    model: '2570A',
    serialNumber: '655',
    detectorType: 'Electrometer',
    status: 'Calibrated',
    lastCalibrationDate: '2024-12-31',
    nextDueDate: '2025-12-31',
    calibrationIntervalMonths: 12,
    instrumentType: 'reference',
    type: 'Electrometer',
    cref: null,
    cf: null,
    lastCalibrationDateRef: '2024-12-31',
    certificateNumber: 'CERT-001',
    validUntil: '2025-12-31',
  },
  {
    equipmentId: 102,
    name: 'Ion Chamber',
    manufacturer: 'NE',
    model: '2575',
    serialNumber: '303',
    detectorType: 'Ion Chamber',
    status: 'Calibrated',
    lastCalibrationDate: '2024-06-30',
    nextDueDate: '2025-06-30',
    calibrationIntervalMonths: 12,
    instrumentType: 'reference',
    type: 'Ion Chamber',
    cref: 50.8,
    cf: 1.0,
    lastCalibrationDateRef: '2024-06-30',
    certificateNumber: 'CERT-002',
    validUntil: '2025-06-30',
  },
];

// Calibration history (mock)
const mockCustomerCalHistory = {
  1: [{ calibrationId: 101, date: '2025-01-10', dueDate: '2026-01-10', status: 'Approved', staff: 'M. Perera' }],
  2: [{ calibrationId: 102, date: '2024-12-05', dueDate: '2025-12-05', status: 'Completed', staff: 'M. Perera' }],
  3: [{ calibrationId: 103, date: '2023-10-20', dueDate: '2024-10-20', status: 'Overdue', staff: 'K. Silva' }],
};
const mockRefCalHistory = {
  101: [{ calibrationId: 201, date: '2024-12-31', dueDate: '2025-12-31', status: 'Approved', staff: 'M. Perera', notes: 'Annual electrometer calibration' }],
  102: [{ calibrationId: 202, date: '2024-06-30', dueDate: '2025-06-30', status: 'Approved', staff: 'K. Silva', notes: 'Ion chamber calibration' }],
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const AdminEquipmentInventory = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const [customerEquip, setCustomerEquip] = useState(mockCustomerEquipment);
  const [refEquip, setRefEquip] = useState(mockReferenceInstruments);

  // Search and filter
  const [searchCustomer, setSearchCustomer] = useState('');
  const [statusFilterCustomer, setStatusFilterCustomer] = useState('all');
  const [searchRef, setSearchRef] = useState('');
  const [statusFilterRef, setStatusFilterRef] = useState('all');

  // Sort states
  const [orderByCustomer, setOrderByCustomer] = useState('equipmentId');
  const [orderCustomer, setOrderCustomer] = useState('asc');
  const [orderByRef, setOrderByRef] = useState('equipmentId');
  const [orderRef, setOrderRef] = useState('asc');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogType, setDialogType] = useState('customer');
  const [form, setForm] = useState({
    name: '', manufacturer: '', model: '', serialNumber: '', detectorType: '',
    status: 'Pending', calibrationIntervalMonths: 12,
    clientId: '', applicationContext: '', radiationSources: '', phantomDetails: '',
    type: '', cref: '', cf: '', certificateNumber: '', validUntil: '',
  });

  // History modal state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [calibrationHistory, setCalibrationHistory] = useState([]);

  // Stats
  const totalCustomer = customerEquip.length;
  const pendingCustomer = customerEquip.filter(e => e.status === 'Pending').length;
  const overdueCustomer = customerEquip.filter(e => e.status === 'Overdue').length;
  const totalRef = refEquip.length;
  const expiringRef = refEquip.filter(e => {
    const daysLeft = Math.ceil((new Date(e.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  }).length;

  // Sorting handlers
  const handleSortCustomer = (prop) => {
    const isAsc = orderByCustomer === prop && orderCustomer === 'asc';
    setOrderCustomer(isAsc ? 'desc' : 'asc');
    setOrderByCustomer(prop);
  };
  const handleSortRef = (prop) => {
    const isAsc = orderByRef === prop && orderRef === 'asc';
    setOrderRef(isAsc ? 'desc' : 'asc');
    setOrderByRef(prop);
  };

  // Filtered lists
  const filteredCustomer = customerEquip
    .filter(e => statusFilterCustomer === 'all' || e.status === statusFilterCustomer)
    .filter(e => e.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
                  e.clientName.toLowerCase().includes(searchCustomer.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[orderByCustomer];
      const bVal = b[orderByCustomer];
      if (typeof aVal === 'string') return orderCustomer === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return orderCustomer === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const filteredRef = refEquip
    .filter(e => statusFilterRef === 'all' || e.status === statusFilterRef)
    .filter(e => e.name.toLowerCase().includes(searchRef.toLowerCase()) ||
                  e.model.toLowerCase().includes(searchRef.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[orderByRef];
      const bVal = b[orderByRef];
      if (typeof aVal === 'string') return orderRef === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return orderRef === 'asc' ? aVal - bVal : bVal - aVal;
    });

  // Open add/edit dialog
  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    if (item) {
      if (type === 'customer') {
        setForm({
          name: item.name, manufacturer: item.manufacturer, model: item.model,
          serialNumber: item.serialNumber, detectorType: item.detectorType, status: item.status,
          calibrationIntervalMonths: item.calibrationIntervalMonths,
          clientId: item.clientId, applicationContext: item.applicationContext || '',
          radiationSources: item.radiationSources || '', phantomDetails: item.phantomDetails || '',
          type: '', cref: '', cf: '', certificateNumber: '', validUntil: '',
        });
      } else {
        setForm({
          name: item.name, manufacturer: item.manufacturer, model: item.model,
          serialNumber: item.serialNumber, detectorType: item.detectorType, status: item.status,
          calibrationIntervalMonths: item.calibrationIntervalMonths,
          type: item.type, cref: item.cref || '', cf: item.cf || '',
          certificateNumber: item.certificateNumber || '', validUntil: item.validUntil || '',
          clientId: '', applicationContext: '', radiationSources: '', phantomDetails: '',
        });
      }
    } else {
      setForm({
        name: '', manufacturer: '', model: '', serialNumber: '', detectorType: '',
        status: 'Pending', calibrationIntervalMonths: 12,
        clientId: '', applicationContext: '', radiationSources: '', phantomDetails: '',
        type: '', cref: '', cf: '', certificateNumber: '', validUntil: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (dialogType === 'customer') {
      const client = mockClients.find(c => c.userId === parseInt(form.clientId));
      const newItem = {
        equipmentId: editingItem ? editingItem.equipmentId : Math.max(...customerEquip.map(e => e.equipmentId), 0) + 1,
        name: form.name,
        manufacturer: form.manufacturer,
        model: form.model,
        serialNumber: form.serialNumber,
        detectorType: form.detectorType,
        status: form.status,
        lastCalibrationDate: editingItem ? editingItem.lastCalibrationDate : new Date().toISOString().slice(0,10),
        nextDueDate: editingItem ? editingItem.nextDueDate : '',
        calibrationIntervalMonths: form.calibrationIntervalMonths,
        instrumentType: 'customer',
        clientId: parseInt(form.clientId),
        applicationContext: form.applicationContext,
        radiationSources: form.radiationSources,
        phantomDetails: form.phantomDetails,
        clientName: client ? client.companyName : '',
      };
      if (editingItem) {
        setCustomerEquip(customerEquip.map(e => e.equipmentId === editingItem.equipmentId ? newItem : e));
      } else {
        setCustomerEquip([...customerEquip, newItem]);
      }
    } else {
      const newItem = {
        equipmentId: editingItem ? editingItem.equipmentId : Math.max(...refEquip.map(e => e.equipmentId), 0) + 1,
        name: form.name,
        manufacturer: form.manufacturer,
        model: form.model,
        serialNumber: form.serialNumber,
        detectorType: form.detectorType,
        status: form.status,
        lastCalibrationDate: editingItem ? editingItem.lastCalibrationDate : new Date().toISOString().slice(0,10),
        nextDueDate: '',
        calibrationIntervalMonths: form.calibrationIntervalMonths,
        instrumentType: 'reference',
        type: form.type,
        cref: form.cref ? parseFloat(form.cref) : null,
        cf: form.cf ? parseFloat(form.cf) : null,
        lastCalibrationDateRef: new Date().toISOString().slice(0,10),
        certificateNumber: form.certificateNumber,
        validUntil: form.validUntil,
      };
      if (editingItem) {
        setRefEquip(refEquip.map(e => e.equipmentId === editingItem.equipmentId ? newItem : e));
      } else {
        setRefEquip([...refEquip, newItem]);
      }
    }
    handleCloseDialog();
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Delete this equipment? This action cannot be undone.')) {
      if (type === 'customer') setCustomerEquip(customerEquip.filter(e => e.equipmentId !== id));
      else setRefEquip(refEquip.filter(e => e.equipmentId !== id));
    }
  };

  const handleViewHistory = (equipment) => {
    setSelectedEquipment(equipment);
    let history = [];
    if (equipment.instrumentType === 'customer') {
      history = mockCustomerCalHistory[equipment.equipmentId] || [];
    } else {
      history = mockRefCalHistory[equipment.equipmentId] || [];
    }
    setCalibrationHistory(history);
    setHistoryOpen(true);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Calibrated': return <Chip label="Calibrated" color="success" size="small" icon={<CheckCircle />} />;
      case 'Pending': return <Chip label="Pending" color="warning" size="small" icon={<Warning />} />;
      case 'InProgress': return <Chip label="In Progress" color="info" size="small" />;
      case 'Overdue': return <Chip label="Overdue" color="error" size="small" icon={<Cancel />} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const isExpiringSoon = (validUntil) => {
    const daysLeft = Math.ceil((new Date(validUntil) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, overflow: 'hidden' }}>
        {/* Header with stats */}
        <Box sx={{ p: { xs: 2, sm: 3 }, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory color="primary" /> Equipment Inventory
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><StatCard label="Customer Equipment" value={totalCustomer} /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Pending" value={pendingCustomer} valueColor="warning.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Overdue" value={overdueCustomer} valueColor="error.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Reference Instruments" value={totalRef} /></Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 3, pt: 2 }}>
          <Tab label="Customer Equipment" icon={<Business />} iconPosition="start" />
          <Tab label="Reference Instruments" icon={<Science />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 0: Customer Equipment */}
          {tabValue === 0 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField size="small" placeholder="Search by name or client..." value={searchCustomer} onChange={(e) => setSearchCustomer(e.target.value)} sx={{ flex: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: searchCustomer && (<IconButton onClick={() => setSearchCustomer('')} size="small"><Clear /></IconButton>) }} />
                <TextField select size="small" label="Status" value={statusFilterCustomer} onChange={(e) => setStatusFilterCustomer(e.target.value)} sx={{ minWidth: 150 }}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="InProgress">In Progress</MenuItem>
                  <MenuItem value="Calibrated">Calibrated</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </TextField>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('customer')}>Add Equipment</Button>
              </Stack>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
                <Table sx={{ minWidth: 900 }}>
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                    <TableRow>
                      <TableCell sortDirection={orderByCustomer === 'equipmentId' ? orderCustomer : false}><TableSortLabel active={orderByCustomer === 'equipmentId'} direction={orderCustomer} onClick={() => handleSortCustomer('equipmentId')}>ID</TableSortLabel></TableCell>
                      <TableCell sortDirection={orderByCustomer === 'name' ? orderCustomer : false}><TableSortLabel active={orderByCustomer === 'name'} direction={orderCustomer} onClick={() => handleSortCustomer('name')}>Name</TableSortLabel></TableCell>
                      <TableCell>Model</TableCell><TableCell>Client</TableCell><TableCell>Last Cal</TableCell><TableCell>Next Due</TableCell><TableCell>Status</TableCell><TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomer.map(eq => (
                      <TableRow key={eq.equipmentId} hover>
                        <TableCell>{eq.equipmentId}</TableCell><TableCell>{eq.name}</TableCell><TableCell>{eq.model}</TableCell>
                        <TableCell>{eq.clientName}</TableCell><TableCell>{eq.lastCalibrationDate}</TableCell><TableCell>{eq.nextDueDate}</TableCell>
                        <TableCell>{getStatusChip(eq.status)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Calibration History"><IconButton size="small" onClick={() => handleViewHistory(eq)}><History fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog('customer', eq)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete('customer', eq.equipmentId)}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCustomer.length === 0 && (<TableRow><TableCell colSpan={8} align="center">No customer equipment found.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Tab 1: Reference Instruments */}
          {tabValue === 1 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField size="small" placeholder="Search by name or model..." value={searchRef} onChange={(e) => setSearchRef(e.target.value)} sx={{ flex: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: searchRef && (<IconButton onClick={() => setSearchRef('')} size="small"><Clear /></IconButton>) }} />
                <TextField select size="small" label="Status" value={statusFilterRef} onChange={(e) => setStatusFilterRef(e.target.value)} sx={{ minWidth: 150 }}>
                  <MenuItem value="all">All Statuses</MenuItem><MenuItem value="Calibrated">Calibrated</MenuItem><MenuItem value="Pending">Pending</MenuItem>
                </TextField>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('reference')}>Add Reference Instrument</Button>
              </Stack>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
                <Table sx={{ minWidth: 1000 }}>
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                    <TableRow>
                      <TableCell sortDirection={orderByRef === 'equipmentId' ? orderRef : false}><TableSortLabel active={orderByRef === 'equipmentId'} direction={orderRef} onClick={() => handleSortRef('equipmentId')}>ID</TableSortLabel></TableCell>
                      <TableCell sortDirection={orderByRef === 'name' ? orderRef : false}><TableSortLabel active={orderByRef === 'name'} direction={orderRef} onClick={() => handleSortRef('name')}>Name</TableSortLabel></TableCell>
                      <TableCell>Model</TableCell><TableCell>Type</TableCell><TableCell>Cref</TableCell><TableCell>Cf</TableCell>
                      <TableCell sortDirection={orderByRef === 'validUntil' ? orderRef : false}><TableSortLabel active={orderByRef === 'validUntil'} direction={orderRef} onClick={() => handleSortRef('validUntil')}>Valid Until</TableSortLabel></TableCell>
                      <TableCell>Status</TableCell><TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRef.map(ref => (
                      <TableRow key={ref.equipmentId} hover>
                        <TableCell>{ref.equipmentId}</TableCell><TableCell>{ref.name}</TableCell><TableCell>{ref.model}</TableCell>
                        <TableCell>{ref.type}</TableCell><TableCell>{ref.cref ?? '-'}</TableCell><TableCell>{ref.cf ?? '-'}</TableCell>
                        <TableCell sx={{ color: isExpiringSoon(ref.validUntil) ? 'warning.main' : 'inherit' }}>{ref.validUntil}</TableCell>
                        <TableCell>{isExpiringSoon(ref.validUntil) ? <Chip label="Expiring Soon" color="warning" size="small" /> : getStatusChip(ref.status)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Calibration History"><IconButton size="small" onClick={() => handleViewHistory(ref)}><History fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog('reference', ref)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete('reference', ref.equipmentId)}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRef.length === 0 && (<TableRow><TableCell colSpan={9} align="center">No reference instruments found.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Card>

      {/* Add/Edit Dialog (no uniqueId field) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>{editingItem ? 'Edit Equipment' : `Add ${dialogType === 'customer' ? 'Customer Equipment' : 'Reference Instrument'}`}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} fullWidth required />
            <TextField label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleFormChange} fullWidth />
            <TextField label="Model" name="model" value={form.model} onChange={handleFormChange} fullWidth />
            <TextField label="Serial Number" name="serialNumber" value={form.serialNumber} onChange={handleFormChange} fullWidth />
            <TextField label="Detector Type" name="detectorType" value={form.detectorType} onChange={handleFormChange} fullWidth />
            <TextField select label="Status" name="status" value={form.status} onChange={handleFormChange} fullWidth>
              <MenuItem value="Pending">Pending</MenuItem><MenuItem value="InProgress">In Progress</MenuItem>
              <MenuItem value="Calibrated">Calibrated</MenuItem><MenuItem value="Overdue">Overdue</MenuItem>
            </TextField>
            <TextField label="Calibration Interval (months)" name="calibrationIntervalMonths" type="number" value={form.calibrationIntervalMonths} onChange={handleFormChange} fullWidth />

            {dialogType === 'customer' && (
              <>
                <TextField select label="Client" name="clientId" value={form.clientId} onChange={handleFormChange} fullWidth required>
                  {mockClients.map(c => <MenuItem key={c.userId} value={c.userId}>{c.companyName}</MenuItem>)}
                </TextField>
                <TextField label="Application Context" name="applicationContext" value={form.applicationContext} onChange={handleFormChange} fullWidth multiline rows={2} />
                <TextField label="Radiation Sources" name="radiationSources" value={form.radiationSources} onChange={handleFormChange} fullWidth />
                <TextField label="Phantom Details" name="phantomDetails" value={form.phantomDetails} onChange={handleFormChange} fullWidth />
              </>
            )}

            {dialogType === 'reference' && (
              <>
                <TextField select label="Instrument Type" name="type" value={form.type} onChange={handleFormChange} fullWidth>
                  <MenuItem value="Electrometer">Electrometer</MenuItem><MenuItem value="Ion Chamber">Ion Chamber</MenuItem>
                </TextField>
                {form.type === 'Ion Chamber' && (
                  <>
                    <TextField label="Cref (µGy/nC)" name="cref" type="number" value={form.cref} onChange={handleFormChange} fullWidth />
                    <TextField label="Cf (Sv/Gy)" name="cf" type="number" value={form.cf} onChange={handleFormChange} fullWidth />
                  </>
                )}
                <TextField label="Certificate Number" name="certificateNumber" value={form.certificateNumber} onChange={handleFormChange} fullWidth />
                <TextField label="Valid Until" name="validUntil" type="date" value={form.validUntil} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true }} />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Calibration History Modal */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Calibration History - {selectedEquipment?.name} (ID: {selectedEquipment?.equipmentId})</DialogTitle>
        <DialogContent>
          {calibrationHistory.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>No calibration records found.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow><TableCell>ID</TableCell><TableCell>Date</TableCell><TableCell>Due Date</TableCell><TableCell>Status</TableCell><TableCell>Staff</TableCell><TableCell>Notes</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {calibrationHistory.map(cal => (
                    <TableRow key={cal.calibrationId}>
                      <TableCell>{cal.calibrationId}</TableCell><TableCell>{cal.date}</TableCell><TableCell>{cal.dueDate}</TableCell>
                      <TableCell><Chip label={cal.status} color={cal.status === 'Approved' ? 'success' : 'warning'} size="small" /></TableCell>
                      <TableCell>{cal.staff}</TableCell><TableCell>{cal.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setHistoryOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

// ----------------------------------------------------------------------
// Stat Card Component
// ----------------------------------------------------------------------
const StatCard = ({ label, value, valueColor = 'text.primary' }) => {
  const theme = useTheme();
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, p: 1.5, textAlign: 'center', borderColor: alpha(theme.palette.divider, 0.08), transition: 'all 0.2s', '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.5), borderColor: alpha(theme.palette.primary.main, 0.2) } }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} color={valueColor}>{value}</Typography>
    </Card>
  );
};

export default AdminEquipmentInventory;