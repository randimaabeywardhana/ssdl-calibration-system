// src/components/admin/AdminPriceList.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, IconButton, Grid, Card, CardContent, Stack,
  alpha, useTheme, MenuItem, Tooltip,
} from '@mui/material';
import {
  Add, Edit, Delete, Search, Clear, CheckCircle, Cancel, Warning, Schedule, AttachMoney,
} from '@mui/icons-material';

// ----------------------------------------------------------------------
// Mock data (matches database schema)
// ----------------------------------------------------------------------

// Calibration Types (CalibrationType table)
const mockCalibrationTypes = [
  { typeId: 1, name: 'Radiation Survey Meter', description: 'Portable radiation monitors', defaultTolerancePercent: 5.0 },
  { typeId: 2, name: 'Personal Dosimeter', description: 'Electronic personal dosimeters', defaultTolerancePercent: 5.0 },
  { typeId: 3, name: 'Ionization Chamber', description: 'Reference ionization chambers', defaultTolerancePercent: 3.0 },
  { typeId: 4, name: 'Electrometer', description: 'Reference electrometers', defaultTolerancePercent: 2.0 },
];

// Price List (PriceList table)
const mockPriceList = [
  { priceId: 1, calibrationTypeId: 1, instrumentCategory: 'DRM', basePriceLKR: 14000, taxRate: 0.0, validFrom: '2022-07-01', validTo: null },
  { priceId: 2, calibrationTypeId: 1, instrumentCategory: 'ARM', basePriceLKR: 14000, taxRate: 0.0, validFrom: '2022-07-01', validTo: null },
  { priceId: 3, calibrationTypeId: 2, instrumentCategory: 'EPD', basePriceLKR: 14000, taxRate: 0.0, validFrom: '2022-07-01', validTo: null },
  { priceId: 4, calibrationTypeId: 3, instrumentCategory: '0.6cc', basePriceLKR: 30500, taxRate: 0.0, validFrom: '2022-07-01', validTo: null },
  { priceId: 5, calibrationTypeId: 4, instrumentCategory: 'Electrometer', basePriceLKR: 30500, taxRate: 0.0, validFrom: '2022-07-01', validTo: '2023-12-31' }, // expired example
  { priceId: 6, calibrationTypeId: 1, instrumentCategory: 'Contamination Monitor', basePriceLKR: 14000, taxRate: 0.0, validFrom: '2024-01-01', validTo: null }, // newer
];

// ----------------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------------
const getPriceStatus = (validFrom, validTo) => {
  const today = new Date().toISOString().slice(0,10);
  if (validTo && validTo < today) return 'Expired';
  if (validFrom > today) return 'Upcoming';
  return 'Active';
};

const getStatusChip = (status) => {
  switch (status) {
    case 'Active': return <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />;
    case 'Expired': return <Chip label="Expired" color="error" size="small" icon={<Cancel />} />;
    default: return <Chip label="Upcoming" color="warning" size="small" icon={<Warning />} />;
  }
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const AdminPriceList = () => {
  const theme = useTheme();
  const [priceList, setPriceList] = useState(mockPriceList);
  const [calibrationTypes] = useState(mockCalibrationTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('priceId');
  const [order, setOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    calibrationTypeId: '', instrumentCategory: '', basePriceLKR: '', taxRate: 0, validFrom: '', validTo: '',
  });

  // Stats
  const totalEntries = priceList.length;
  const activeEntries = priceList.filter(p => getPriceStatus(p.validFrom, p.validTo) === 'Active').length;
  const expiredEntries = priceList.filter(p => getPriceStatus(p.validFrom, p.validTo) === 'Expired').length;

  // Filter & sort
  const filteredList = priceList
    .filter(p => {
      const type = calibrationTypes.find(t => t.typeId === p.calibrationTypeId)?.name || '';
      const matchesSearch = type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.instrumentCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const status = getPriceStatus(p.validFrom, p.validTo);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];
      if (orderBy === 'calibrationType') {
        aVal = calibrationTypes.find(t => t.typeId === a.calibrationTypeId)?.name || '';
        bVal = calibrationTypes.find(t => t.typeId === b.calibrationTypeId)?.name || '';
      }
      if (orderBy === 'status') {
        aVal = getPriceStatus(a.validFrom, a.validTo);
        bVal = getPriceStatus(b.validFrom, b.validTo);
      }
      if (typeof aVal === 'string') {
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (prop) => {
    const isAsc = orderBy === prop && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(prop);
  };

  const handleOpen = (item = null) => {
    setEditingItem(item);
    if (item) {
      setForm({
        calibrationTypeId: item.calibrationTypeId,
        instrumentCategory: item.instrumentCategory,
        basePriceLKR: item.basePriceLKR,
        taxRate: item.taxRate,
        validFrom: item.validFrom,
        validTo: item.validTo || '',
      });
    } else {
      setForm({ calibrationTypeId: '', instrumentCategory: '', basePriceLKR: '', taxRate: 0, validFrom: '', validTo: '' });
    }
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    const typeName = calibrationTypes.find(t => t.typeId === parseInt(form.calibrationTypeId))?.name || '';
    if (editingItem) {
      setPriceList(priceList.map(p => p.priceId === editingItem.priceId ? { ...form, priceId: p.priceId, calibrationTypeId: parseInt(form.calibrationTypeId) } : p));
    } else {
      const newId = Math.max(...priceList.map(p => p.priceId), 0) + 1;
      setPriceList([...priceList, { ...form, priceId: newId, calibrationTypeId: parseInt(form.calibrationTypeId) }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this price entry? This action cannot be undone.')) {
      setPriceList(priceList.filter(p => p.priceId !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, overflow: 'hidden' }}>
        {/* Header with stats */}
        <Box sx={{ p: { xs: 2, sm: 3 }, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="primary" /> Price List Management
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><StatCard label="Total Entries" value={totalEntries} /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Active Prices" value={activeEntries} valueColor="success.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Expired" value={expiredEntries} valueColor="error.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Tax Rate" value="0% (NBT/VAT exempt)" valueColor="text.secondary" /></Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Search & Filter Bar */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search by calibration type or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
                endAdornment: searchTerm && (<IconButton onClick={() => setSearchTerm('')} size="small"><Clear /></IconButton>),
              }}
            />
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
            </TextField>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Price</Button>
          </Stack>

          {/* Price Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                <TableRow>
                  <TableCell sortDirection={orderBy === 'priceId' ? order : false}><TableSortLabel active={orderBy === 'priceId'} direction={order} onClick={() => handleSort('priceId')}>ID</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'calibrationType' ? order : false}><TableSortLabel active={orderBy === 'calibrationType'} direction={order} onClick={() => handleSort('calibrationType')}>Calibration Type</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'instrumentCategory' ? order : false}><TableSortLabel active={orderBy === 'instrumentCategory'} direction={order} onClick={() => handleSort('instrumentCategory')}>Category</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'basePriceLKR' ? order : false}><TableSortLabel active={orderBy === 'basePriceLKR'} direction={order} onClick={() => handleSort('basePriceLKR')}>Price (LKR)</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'validFrom' ? order : false}><TableSortLabel active={orderBy === 'validFrom'} direction={order} onClick={() => handleSort('validFrom')}>Valid From</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'validTo' ? order : false}><TableSortLabel active={orderBy === 'validTo'} direction={order} onClick={() => handleSort('validTo')}>Valid To</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'status' ? order : false}><TableSortLabel active={orderBy === 'status'} direction={order} onClick={() => handleSort('status')}>Status</TableSortLabel></TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.map(item => {
                  const typeName = calibrationTypes.find(t => t.typeId === item.calibrationTypeId)?.name || '';
                  const status = getPriceStatus(item.validFrom, item.validTo);
                  return (
                    <TableRow key={item.priceId} hover>
                      <TableCell>{item.priceId}</TableCell>
                      <TableCell>{typeName}</TableCell>
                      <TableCell>{item.instrumentCategory}</TableCell>
                      <TableCell>{item.basePriceLKR.toLocaleString()}</TableCell>
                      <TableCell>{item.validFrom}</TableCell>
                      <TableCell>{item.validTo || 'Present'}</TableCell>
                      <TableCell>{getStatusChip(status)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(item)}><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(item.priceId)}><Delete fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredList.length === 0 && (<TableRow><TableCell colSpan={8} align="center">No price entries found.</TableCell></TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>{editingItem ? 'Edit Price Entry' : 'Add Price Entry'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Calibration Type" name="calibrationTypeId" value={form.calibrationTypeId} onChange={handleChange} fullWidth required>
              {calibrationTypes.map(type => <MenuItem key={type.typeId} value={type.typeId}>{type.name}</MenuItem>)}
            </TextField>
            <TextField label="Instrument Category" name="instrumentCategory" value={form.instrumentCategory} onChange={handleChange} fullWidth required />
            <TextField label="Base Price (LKR)" name="basePriceLKR" type="number" value={form.basePriceLKR} onChange={handleChange} fullWidth required />
            <TextField label="Tax Rate (%)" name="taxRate" type="number" value={form.taxRate} onChange={handleChange} fullWidth helperText="Currently 0% for SSDL (NBT/VAT exempt)" />
            <TextField label="Valid From (YYYY-MM-DD)" name="validFrom" type="date" value={form.validFrom} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
            <TextField label="Valid To (YYYY-MM-DD)" name="validTo" type="date" value={form.validTo} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} helperText="Leave empty if currently active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
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

export default AdminPriceList;