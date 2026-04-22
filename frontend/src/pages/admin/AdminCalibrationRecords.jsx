// src/pages/admin/AdminCalibrationRecords.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Chip, TextField,
  InputAdornment, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Stack, alpha, useTheme, MenuItem,
} from '@mui/material';
import {
  CheckCircle, Cancel, Visibility, Search, Clear, Refresh,
} from '@mui/icons-material';

// Mock data
const mockCalibrationRecords = [
  {
    id: 245,
    equipmentName: 'Dosimeter X',
    clientName: 'ABC Hospital',
    staffName: 'M. Perera',
    calibrationDate: '2026-04-20',
    status: 'Pending',
    type: 'Radiation Survey Meter',
    measurements: [
      { point: 'Q2', reading1: 1.23, reading2: 1.25, reading3: 1.24, avg: 1.24, unit: 'mGy/h' },
      { point: 'Q3', reading1: 2.45, reading2: 2.48, reading3: 2.46, avg: 2.46, unit: 'mGy/h' },
    ],
  },
  {
    id: 246,
    equipmentName: 'Survey Meter Y',
    clientName: 'DEF Medical',
    staffName: 'K. Silva',
    calibrationDate: '2026-04-19',
    status: 'Pending',
    type: 'Radiation Survey Meter',
    measurements: [
      { point: 'Q4', reading1: 3.12, reading2: 3.15, reading3: 3.13, avg: 3.13, unit: 'mGy/h' },
    ],
  },
  {
    id: 247,
    equipmentName: 'Ion Chamber Z',
    clientName: 'GHI Research',
    staffName: 'M. Perera',
    calibrationDate: '2026-04-18',
    status: 'Approved',
    type: 'Ionization Chamber',
    measurements: [],
  },
];

const AdminCalibrationRecords = () => {
  const theme = useTheme();
  const [records, setRecords] = useState(mockCalibrationRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Stats
  const total = records.length;
  const pending = records.filter(r => r.status === 'Pending').length;
  const approved = records.filter(r => r.status === 'Approved').length;

  // Filtered records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleApprove = (id) => {
    if (window.confirm('Approve this calibration record?')) {
      setRecords(records.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
      setOpenDialog(false);
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this calibration record?')) {
      setRecords(records.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Calibration Records
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Total Records</Typography>
                <Typography variant="h4" fontWeight={700}>{total}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Pending Approval</Typography>
                <Typography variant="h4" fontWeight={700} color="#eab308">{pending}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Approved</Typography>
                <Typography variant="h4" fontWeight={700} color="#22c55e">{approved}</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search equipment, client or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                endAdornment: searchTerm && <IconButton onClick={() => setSearchTerm('')} size="small"><Clear /></IconButton>,
              }}
            />
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
            <Button variant="outlined" startIcon={<Refresh />} onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
              Reset
            </Button>
          </Stack>

          {/* Main Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Equipment</strong></TableCell>
                  <TableCell><strong>Client</strong></TableCell>
                  <TableCell><strong>Staff</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map(record => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.equipmentName}</TableCell>
                    <TableCell>{record.clientName}</TableCell>
                    <TableCell>{record.staffName}</TableCell>
                    <TableCell>{record.calibrationDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={record.status === 'Approved' ? 'success' : record.status === 'Pending' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewDetails(record)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {record.status === 'Pending' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton size="small" color="success" onClick={() => handleApprove(record.id)}>
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton size="small" color="error" onClick={() => handleReject(record.id)}>
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>No records found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Calibration Record Details - #{selectedRecord?.id}</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2">Equipment</Typography>
                <Typography>{selectedRecord.equipmentName} — {selectedRecord.clientName}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Measurements</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Point</TableCell>
                        <TableCell>Reading 1</TableCell>
                        <TableCell>Reading 2</TableCell>
                        <TableCell>Reading 3</TableCell>
                        <TableCell>Average</TableCell>
                        <TableCell>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecord.measurements.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell>{m.point}</TableCell>
                          <TableCell>{m.reading1}</TableCell>
                          <TableCell>{m.reading2}</TableCell>
                          <TableCell>{m.reading3}</TableCell>
                          <TableCell><strong>{m.avg}</strong></TableCell>
                          <TableCell>{m.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedRecord?.status === 'Pending' && (
            <>
              <Button color="success" variant="contained" onClick={() => { handleApprove(selectedRecord.id); }}>
                Approve
              </Button>
              <Button color="error" variant="outlined" onClick={() => { handleReject(selectedRecord.id); }}>
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCalibrationRecords;