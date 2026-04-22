// src/components/admin/AdminReferenceSystem.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, IconButton, Grid, Card, CardContent, Stack,
  alpha, useTheme, MenuItem, Tabs, Tab, Tooltip, Divider,
} from '@mui/material';
import {
  Add, Edit, Delete, Search, Clear, CheckCircle, Cancel, Warning,
  Security, Science, Visibility, Receipt, TrendingUp,
} from '@mui/icons-material';

// ----------------------------------------------------------------------
// Mock data (matches database schema and EWS files)
// ----------------------------------------------------------------------

// Reference Instruments (from ReferenceInstrument table)
const mockRefInstruments = [
  { id: 1, type: 'Electrometer', model: '2570A', serial: '655', cref: null, cf: null, lastCalibrationDate: '2024-12-31', certificateNumber: 'CERT-001', validUntil: '2025-12-31' },
  { id: 2, type: 'Ion Chamber', model: '2575', serial: '303', cref: 50.8, cf: 1.0, lastCalibrationDate: '2024-06-30', certificateNumber: 'CERT-002', validUntil: '2025-06-30' },
];

// Stability Tests (EWS-04) – added temperature, pressure, Ktp, etc.
const mockStabilityTests = [
  { id: 1, testDate: '2025-04-01', sourceType: 'Sr-90', temperatureC: 21.2, pressureKPa: 100.8, ktp: 1.002, referenceValue: 0.0133829, measuredValue: 0.0133829, deviationPercent: 0.0, status: 'Pass', equipmentId: 2 },
  { id: 2, testDate: '2025-03-01', sourceType: 'Sr-90', temperatureC: 21.5, pressureKPa: 100.7, ktp: 1.001, referenceValue: 0.0133829, measuredValue: 0.01345, deviationPercent: 0.5, status: 'Pass', equipmentId: 2 },
];

// Gamma Field Standardization (EWS-03) – added uncertainty
const mockGammaFields = [
  { id: 1, measurementDate: '2025-04-02', distance_m: 1.0, attenuator_mm: 0, sourceActivity_GBq: 27.4, sourceReferenceDate: '1987-05-13', measuredAirKermaRate_mGyh: 35.13, expectedAirKermaRate_mGyh: 35.0, deviationPercent: 0.37, uncertainty: 0.5, status: 'InSpec', performedBy: 1 },
];

// Reference Instrument Calibration (EWS-05) – now includes detailed measurement points
const mockRefCalibrations = [
  {
    id: 1,
    calibrationDate: '2024-12-31',
    dueDate: '2025-12-31',
    status: 'Approved',
    staffName: 'M. Perera',
    notes: 'Annual calibration',
    equipmentId: 1,
    calibrationType: 'Electrometer',
    measurementPoints: [
      {
        pointId: 1,
        sourceType: 'Cs137',
        energyKeV: 662,
        referenceDoseRate: 30,
        temperatureC: 21.1,
        pressureKPa: 100.84,
        humidityPercent: 40,
        leakageBefore_pC: -1,
        leakageAfter_pC: -1,
        averageLeakageRate_nCps: -0.00001,
        ktp: 1.0012,
        avgInstrumentReading: 3.16,
        correctedReading: 3.165,
        calibrationFactor: 9.49,
        errorPercent: 89.5,
        uncertaintyExpanded: 2.5,
        readings: [3.2, 3.4, 3.2, 3.4, 3.2, 2.8, 3.2, 2.8, 3.2, 3.2],
      },
      {
        pointId: 2,
        sourceType: 'Cs137',
        energyKeV: 662,
        referenceDoseRate: 50,
        temperatureC: 21.0,
        pressureKPa: 100.85,
        humidityPercent: 41,
        leakageBefore_pC: -1,
        leakageAfter_pC: -1,
        averageLeakageRate_nCps: -0.00001,
        ktp: 1.001,
        avgInstrumentReading: 5.0,
        correctedReading: 5.01,
        calibrationFactor: 10.0,
        errorPercent: 90.0,
        uncertaintyExpanded: 2.2,
        readings: [5.0, 5.5, 5.5, 4.5, 4.5, 5.0, 5.0, 4.5, 5.0, 5.5],
      },
    ],
  },
];

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const AdminReferenceSystem = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const [instruments, setInstruments] = useState(mockRefInstruments);
  const [stabilityTests, setStabilityTests] = useState(mockStabilityTests);
  const [gammaFields, setGammaFields] = useState(mockGammaFields);
  const [refCalibrations, setRefCalibrations] = useState(mockRefCalibrations);

  // Search states
  const [searchInst, setSearchInst] = useState('');
  const [searchStab, setSearchStab] = useState('');
  const [searchGamma, setSearchGamma] = useState('');
  const [searchCal, setSearchCal] = useState('');

  // Sort states
  const [orderByInst, setOrderByInst] = useState('type');
  const [orderInst, setOrderInst] = useState('asc');
  const [orderByStab, setOrderByStab] = useState('testDate');
  const [orderStab, setOrderStab] = useState('desc');
  const [orderByGamma, setOrderByGamma] = useState('measurementDate');
  const [orderGamma, setOrderGamma] = useState('desc');

  // Dialog states
  const [openInstDialog, setOpenInstDialog] = useState(false);
  const [editingInst, setEditingInst] = useState(null);
  const [instForm, setInstForm] = useState({ type: '', model: '', serial: '', cref: '', cf: '', lastCalibrationDate: '', certificateNumber: '', validUntil: '' });

  const [openStabDialog, setOpenStabDialog] = useState(false);
  const [stabForm, setStabForm] = useState({ testDate: '', sourceType: 'Sr-90', temperatureC: '', pressureKPa: '', referenceValue: '', measuredValue: '', equipmentId: 2 });

  const [openGammaDialog, setOpenGammaDialog] = useState(false);
  const [gammaForm, setGammaForm] = useState({ measurementDate: '', distance_m: 1.0, attenuator_mm: 0, sourceActivity_GBq: '', sourceReferenceDate: '', measuredAirKermaRate_mGyh: '', expectedAirKermaRate_mGyh: '', uncertainty: '', status: 'InSpec' });

  const [viewCalibrationDialog, setViewCalibrationDialog] = useState(false);
  const [selectedCalibration, setSelectedCalibration] = useState(null);

  // Stats
  const expiringInstruments = instruments.filter(inst => {
    const daysLeft = Math.ceil((new Date(inst.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  }).length;
  const stabilityPassRate = stabilityTests.length ? (stabilityTests.filter(t => t.status === 'Pass').length / stabilityTests.length * 100).toFixed(0) : 0;
  const gammaInSpec = gammaFields.filter(g => g.status === 'InSpec').length;

  // Handlers (sorting, filtering, CRUD)
  const handleSortInst = (prop) => {
    const isAsc = orderByInst === prop && orderInst === 'asc';
    setOrderInst(isAsc ? 'desc' : 'asc');
    setOrderByInst(prop);
  };
  const handleSortStab = (prop) => {
    const isAsc = orderByStab === prop && orderStab === 'asc';
    setOrderStab(isAsc ? 'desc' : 'asc');
    setOrderByStab(prop);
  };
  const handleSortGamma = (prop) => {
    const isAsc = orderByGamma === prop && orderGamma === 'asc';
    setOrderGamma(isAsc ? 'desc' : 'asc');
    setOrderByGamma(prop);
  };

  const filteredInstruments = instruments
    .filter(inst => inst.type.toLowerCase().includes(searchInst.toLowerCase()) || inst.model.toLowerCase().includes(searchInst.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[orderByInst];
      const bVal = b[orderByInst];
      if (typeof aVal === 'string') return orderInst === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return orderInst === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const filteredStability = stabilityTests
    .filter(t => t.testDate.includes(searchStab) || t.status.toLowerCase().includes(searchStab.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[orderByStab];
      const bVal = b[orderByStab];
      if (typeof aVal === 'string') return orderStab === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return orderStab === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const filteredGamma = gammaFields
    .filter(g => g.measurementDate.includes(searchGamma) || g.status.toLowerCase().includes(searchGamma.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[orderByGamma];
      const bVal = b[orderByGamma];
      if (typeof aVal === 'string') return orderGamma === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return orderGamma === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleSaveInstrument = () => {
    if (editingInst) {
      setInstruments(instruments.map(i => i.id === editingInst.id ? { ...instForm, id: i.id } : i));
    } else {
      const newId = Math.max(...instruments.map(i => i.id), 0) + 1;
      setInstruments([...instruments, { ...instForm, id: newId }]);
    }
    setOpenInstDialog(false);
    setEditingInst(null);
    setInstForm({ type: '', model: '', serial: '', cref: '', cf: '', lastCalibrationDate: '', certificateNumber: '', validUntil: '' });
  };

  const handleDeleteInstrument = (id) => {
    if (window.confirm('Delete this reference instrument?')) {
      setInstruments(instruments.filter(i => i.id !== id));
    }
  };

  const handleSaveStability = () => {
    const deviation = ((stabForm.measuredValue - stabForm.referenceValue) / stabForm.referenceValue * 100).toFixed(2);
    const ktp = ((273.15 + parseFloat(stabForm.temperatureC)) / 293.15) * (101.3 / parseFloat(stabForm.pressureKPa));
    const newTest = {
      ...stabForm,
      id: stabilityTests.length + 1,
      ktp: parseFloat(ktp.toFixed(6)),
      deviationPercent: parseFloat(deviation),
      status: Math.abs(deviation) <= 1 ? 'Pass' : 'Fail',
    };
    setStabilityTests([newTest, ...stabilityTests]);
    setOpenStabDialog(false);
    setStabForm({ testDate: '', sourceType: 'Sr-90', temperatureC: '', pressureKPa: '', referenceValue: '', measuredValue: '', equipmentId: 2 });
  };

  const handleSaveGamma = () => {
    const deviation = ((gammaForm.measuredAirKermaRate_mGyh - gammaForm.expectedAirKermaRate_mGyh) / gammaForm.expectedAirKermaRate_mGyh * 100).toFixed(2);
    const newField = {
      ...gammaForm,
      id: gammaFields.length + 1,
      deviationPercent: parseFloat(deviation),
      status: Math.abs(deviation) <= 2 ? 'InSpec' : 'OutOfSpec',
    };
    setGammaFields([newField, ...gammaFields]);
    setOpenGammaDialog(false);
    setGammaForm({ measurementDate: '', distance_m: 1.0, attenuator_mm: 0, sourceActivity_GBq: '', sourceReferenceDate: '', measuredAirKermaRate_mGyh: '', expectedAirKermaRate_mGyh: '', uncertainty: '', status: 'InSpec' });
  };

  const isExpiringSoon = (validUntil) => {
    const daysLeft = Math.ceil((new Date(validUntil) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  };

  const handleViewCalibrationDetails = (cal) => {
    setSelectedCalibration(cal);
    setViewCalibrationDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, overflow: 'hidden' }}>
        {/* Header with stats */}
        <Box sx={{ p: { xs: 2, sm: 3 }, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" /> Reference System Management
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><StatCard label="Reference Instruments" value={instruments.length} /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Expiring Soon (≤30d)" value={expiringInstruments} valueColor="warning.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Stability Pass Rate" value={`${stabilityPassRate}%`} valueColor={stabilityPassRate >= 90 ? 'success.main' : 'error.main'} /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Gamma Field In Spec" value={`${gammaInSpec}/${gammaFields.length}`} valueColor={gammaInSpec === gammaFields.length ? 'success.main' : 'error.main'} /></Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 3, pt: 2 }}>
          <Tab label="Reference Instruments" icon={<Science />} iconPosition="start" />
          <Tab label="Stability Tests (EWS-04)" icon={<CheckCircle />} iconPosition="start" />
          <Tab label="Gamma Field (EWS-03)" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Ref. Instrument Calibration (EWS-05)" icon={<Receipt />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 0: Reference Instruments */}
          {tabValue === 0 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField size="small" placeholder="Search by type or model..." value={searchInst} onChange={(e) => setSearchInst(e.target.value)} sx={{ flex: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: searchInst && (<IconButton onClick={() => setSearchInst('')} size="small"><Clear /></IconButton>) }} />
                <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingInst(null); setInstForm({ type: '', model: '', serial: '', cref: '', cf: '', lastCalibrationDate: '', certificateNumber: '', validUntil: '' }); setOpenInstDialog(true); }}>Add Instrument</Button>
              </Stack>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                    <TableRow>
                      <TableCell sortDirection={orderByInst === 'type' ? orderInst : false}><TableSortLabel active={orderByInst === 'type'} direction={orderInst} onClick={() => handleSortInst('type')}>Type</TableSortLabel></TableCell>
                      <TableCell sortDirection={orderByInst === 'model' ? orderInst : false}><TableSortLabel active={orderByInst === 'model'} direction={orderInst} onClick={() => handleSortInst('model')}>Model</TableSortLabel></TableCell>
                      <TableCell>Serial</TableCell><TableCell>Cref</TableCell><TableCell>Cf</TableCell>
                      <TableCell sortDirection={orderByInst === 'validUntil' ? orderInst : false}><TableSortLabel active={orderByInst === 'validUntil'} direction={orderInst} onClick={() => handleSortInst('validUntil')}>Valid Until</TableSortLabel></TableCell>
                      <TableCell>Status</TableCell><TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInstruments.map(inst => (
                      <TableRow key={inst.id} hover>
                        <TableCell>{inst.type}</TableCell><TableCell>{inst.model}</TableCell><TableCell>{inst.serial}</TableCell>
                        <TableCell>{inst.cref ?? '-'}</TableCell><TableCell>{inst.cf ?? '-'}</TableCell>
                        <TableCell>{inst.validUntil}</TableCell>
                        <TableCell>{isExpiringSoon(inst.validUntil) ? <Chip label="Expiring Soon" color="warning" size="small" /> : <Chip label="Valid" color="success" size="small" />}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => { setEditingInst(inst); setInstForm(inst); setOpenInstDialog(true); }}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteInstrument(inst.id)}><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInstruments.length === 0 && (<TableRow><TableCell colSpan={8} align="center">No instruments found.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Tab 1: Stability Tests (EWS-04) – with T, P, Ktp */}
          {tabValue === 1 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField size="small" placeholder="Search by date or status..." value={searchStab} onChange={(e) => setSearchStab(e.target.value)} sx={{ flex: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: searchStab && (<IconButton onClick={() => setSearchStab('')} size="small"><Clear /></IconButton>) }} />
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenStabDialog(true)}>Add Stability Test</Button>
              </Stack>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                    <TableRow>
                      <TableCell sortDirection={orderByStab === 'testDate' ? orderStab : false}><TableSortLabel active={orderByStab === 'testDate'} direction={orderStab} onClick={() => handleSortStab('testDate')}>Date</TableSortLabel></TableCell>
                      <TableCell>Source</TableCell><TableCell>T (°C)</TableCell><TableCell>P (kPa)</TableCell><TableCell>Ktp</TableCell>
                      <TableCell>Reference</TableCell><TableCell>Measured</TableCell>
                      <TableCell sortDirection={orderByStab === 'deviationPercent' ? orderStab : false}><TableSortLabel active={orderByStab === 'deviationPercent'} direction={orderStab} onClick={() => handleSortStab('deviationPercent')}>Dev (%)</TableSortLabel></TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStability.map(test => (
                      <TableRow key={test.id} hover>
                        <TableCell>{test.testDate}</TableCell><TableCell>{test.sourceType}</TableCell>
                        <TableCell>{test.temperatureC}</TableCell><TableCell>{test.pressureKPa}</TableCell>
                        <TableCell>{test.ktp}</TableCell>
                        <TableCell>{test.referenceValue}</TableCell><TableCell>{test.measuredValue}</TableCell>
                        <TableCell sx={{ color: Math.abs(test.deviationPercent) > 1 ? 'error.main' : 'inherit' }}>{test.deviationPercent}%</TableCell>
                        <TableCell><Chip label={test.status} color={test.status === 'Pass' ? 'success' : 'error'} size="small" /></TableCell>
                      </TableRow>
                    ))}
                    {filteredStability.length === 0 && (<TableRow><TableCell colSpan={9} align="center">No stability tests found.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Tab 2: Gamma Field Standardization (EWS-03) – with uncertainty */}
          {tabValue === 2 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField size="small" placeholder="Search by date or status..." value={searchGamma} onChange={(e) => setSearchGamma(e.target.value)} sx={{ flex: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: searchGamma && (<IconButton onClick={() => setSearchGamma('')} size="small"><Clear /></IconButton>) }} />
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenGammaDialog(true)}>Add Standardization</Button>
              </Stack>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                    <TableRow>
                      <TableCell sortDirection={orderByGamma === 'measurementDate' ? orderGamma : false}><TableSortLabel active={orderByGamma === 'measurementDate'} direction={orderGamma} onClick={() => handleSortGamma('measurementDate')}>Date</TableSortLabel></TableCell>
                      <TableCell>Dist (m)</TableCell><TableCell>Atten (mm)</TableCell><TableCell>Measured (mGy/h)</TableCell><TableCell>Expected (mGy/h)</TableCell><TableCell>Dev (%)</TableCell><TableCell>Unc (%)</TableCell><TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGamma.map(field => (
                      <TableRow key={field.id} hover>
                        <TableCell>{field.measurementDate}</TableCell><TableCell>{field.distance_m}</TableCell><TableCell>{field.attenuator_mm}</TableCell>
                        <TableCell>{field.measuredAirKermaRate_mGyh}</TableCell><TableCell>{field.expectedAirKermaRate_mGyh}</TableCell>
                        <TableCell sx={{ color: Math.abs(field.deviationPercent) > 2 ? 'error.main' : 'inherit' }}>{field.deviationPercent}%</TableCell>
                        <TableCell>{field.uncertainty ?? '-'}</TableCell>
                        <TableCell><Chip label={field.status === 'InSpec' ? 'In Spec' : 'Out of Spec'} color={field.status === 'InSpec' ? 'success' : 'error'} size="small" /></TableCell>
                      </TableRow>
                    ))}
                    {filteredGamma.length === 0 && (<TableRow><TableCell colSpan={8} align="center">No gamma field records found.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Tab 3: Reference Instrument Calibration (EWS-05) – with detailed view */}
          {tabValue === 3 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField size="small" placeholder="Search by date or instrument..." value={searchCal} onChange={(e) => setSearchCal(e.target.value)} sx={{ flex: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), endAdornment: searchCal && (<IconButton onClick={() => setSearchCal('')} size="small"><Clear /></IconButton>) }} />
                <Button variant="contained" startIcon={<Add />} disabled>Add Calibration (mock)</Button>
              </Stack>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                    <TableRow>
                      <TableCell>Date</TableCell><TableCell>Instrument</TableCell><TableCell>Due Date</TableCell><TableCell>Staff</TableCell><TableCell>Status</TableCell><TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {refCalibrations.map(cal => (
                      <TableRow key={cal.id} hover>
                        <TableCell>{cal.calibrationDate}</TableCell><TableCell>{cal.calibrationType}</TableCell><TableCell>{cal.dueDate}</TableCell>
                        <TableCell>{cal.staffName}</TableCell>
                        <TableCell><Chip label={cal.status} color={cal.status === 'Approved' ? 'success' : 'warning'} size="small" /></TableCell>
                        <TableCell align="center">
                          <Button size="small" startIcon={<Visibility />} onClick={() => handleViewCalibrationDetails(cal)}>View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {refCalibrations.length === 0 && (<TableRow><TableCell colSpan={6} align="center">No reference instrument calibrations found.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Card>

      {/* Dialogs for Add/Edit (same as before, but with extra fields) */}
      {/* Reference Instrument Dialog */}
      <Dialog open={openInstDialog} onClose={() => setOpenInstDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingInst ? 'Edit Reference Instrument' : 'Add Reference Instrument'}</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <TextField select label="Type" name="type" value={instForm.type} onChange={(e) => setInstForm({ ...instForm, type: e.target.value })} fullWidth>
            <MenuItem value="Electrometer">Electrometer</MenuItem><MenuItem value="Ion Chamber">Ion Chamber</MenuItem>
          </TextField>
          <TextField label="Model" name="model" value={instForm.model} onChange={(e) => setInstForm({ ...instForm, model: e.target.value })} fullWidth />
          <TextField label="Serial Number" name="serial" value={instForm.serial} onChange={(e) => setInstForm({ ...instForm, serial: e.target.value })} fullWidth />
          {instForm.type === 'Ion Chamber' && (
            <><TextField label="Cref (µGy/nC)" name="cref" type="number" value={instForm.cref} onChange={(e) => setInstForm({ ...instForm, cref: e.target.value })} fullWidth />
            <TextField label="Cf (Sv/Gy)" name="cf" type="number" value={instForm.cf} onChange={(e) => setInstForm({ ...instForm, cf: e.target.value })} fullWidth /></>
          )}
          <TextField label="Last Calibration Date" type="date" name="lastCalibrationDate" value={instForm.lastCalibrationDate} onChange={(e) => setInstForm({ ...instForm, lastCalibrationDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Certificate Number" name="certificateNumber" value={instForm.certificateNumber} onChange={(e) => setInstForm({ ...instForm, certificateNumber: e.target.value })} fullWidth />
          <TextField label="Valid Until" type="date" name="validUntil" value={instForm.validUntil} onChange={(e) => setInstForm({ ...instForm, validUntil: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
        </Stack></DialogContent>
        <DialogActions><Button onClick={() => setOpenInstDialog(false)}>Cancel</Button><Button variant="contained" onClick={handleSaveInstrument}>Save</Button></DialogActions>
      </Dialog>

      {/* Stability Test Dialog */}
      <Dialog open={openStabDialog} onClose={() => setOpenStabDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Stability Test (EWS-04)</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Test Date" type="date" name="testDate" value={stabForm.testDate} onChange={(e) => setStabForm({ ...stabForm, testDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} required />
          <TextField select label="Source" name="sourceType" value={stabForm.sourceType} onChange={(e) => setStabForm({ ...stabForm, sourceType: e.target.value })} fullWidth><MenuItem value="Sr-90">Sr-90</MenuItem></TextField>
          <TextField label="Temperature (°C)" type="number" name="temperatureC" value={stabForm.temperatureC} onChange={(e) => setStabForm({ ...stabForm, temperatureC: e.target.value })} fullWidth required />
          <TextField label="Pressure (kPa)" type="number" name="pressureKPa" value={stabForm.pressureKPa} onChange={(e) => setStabForm({ ...stabForm, pressureKPa: e.target.value })} fullWidth required />
          <TextField label="Reference Value (nC/s)" type="number" name="referenceValue" value={stabForm.referenceValue} onChange={(e) => setStabForm({ ...stabForm, referenceValue: e.target.value })} fullWidth required />
          <TextField label="Measured Value (nC/s)" type="number" name="measuredValue" value={stabForm.measuredValue} onChange={(e) => setStabForm({ ...stabForm, measuredValue: e.target.value })} fullWidth required />
        </Stack></DialogContent>
        <DialogActions><Button onClick={() => setOpenStabDialog(false)}>Cancel</Button><Button variant="contained" onClick={handleSaveStability}>Save & Calculate</Button></DialogActions>
      </Dialog>

      {/* Gamma Field Dialog */}
      <Dialog open={openGammaDialog} onClose={() => setOpenGammaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Gamma Field Standardization (EWS-03)</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Measurement Date" type="date" name="measurementDate" value={gammaForm.measurementDate} onChange={(e) => setGammaForm({ ...gammaForm, measurementDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} required />
          <TextField label="Distance (m)" type="number" name="distance_m" value={gammaForm.distance_m} onChange={(e) => setGammaForm({ ...gammaForm, distance_m: e.target.value })} fullWidth />
          <TextField label="Attenuator (mm)" type="number" name="attenuator_mm" value={gammaForm.attenuator_mm} onChange={(e) => setGammaForm({ ...gammaForm, attenuator_mm: e.target.value })} fullWidth />
          <TextField label="Source Activity (GBq)" type="number" name="sourceActivity_GBq" value={gammaForm.sourceActivity_GBq} onChange={(e) => setGammaForm({ ...gammaForm, sourceActivity_GBq: e.target.value })} fullWidth />
          <TextField label="Source Reference Date" type="date" name="sourceReferenceDate" value={gammaForm.sourceReferenceDate} onChange={(e) => setGammaForm({ ...gammaForm, sourceReferenceDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Measured Air Kerma Rate (mGy/h)" type="number" name="measuredAirKermaRate_mGyh" value={gammaForm.measuredAirKermaRate_mGyh} onChange={(e) => setGammaForm({ ...gammaForm, measuredAirKermaRate_mGyh: e.target.value })} fullWidth required />
          <TextField label="Expected Air Kerma Rate (mGy/h)" type="number" name="expectedAirKermaRate_mGyh" value={gammaForm.expectedAirKermaRate_mGyh} onChange={(e) => setGammaForm({ ...gammaForm, expectedAirKermaRate_mGyh: e.target.value })} fullWidth required />
          <TextField label="Uncertainty (%)" type="number" name="uncertainty" value={gammaForm.uncertainty} onChange={(e) => setGammaForm({ ...gammaForm, uncertainty: e.target.value })} fullWidth />
        </Stack></DialogContent>
        <DialogActions><Button onClick={() => setOpenGammaDialog(false)}>Cancel</Button><Button variant="contained" onClick={handleSaveGamma}>Save & Calculate</Button></DialogActions>
      </Dialog>

      {/* View Calibration Details Dialog – shows measurement points and readings (EWS-05) */}
      <Dialog open={viewCalibrationDialog} onClose={() => setViewCalibrationDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Reference Instrument Calibration Details (EWS-05)</DialogTitle>
        <DialogContent>
          {selectedCalibration && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Calibration Record #{selectedCalibration.id}</Typography>
              <Typography variant="body2" color="text.secondary">Date: {selectedCalibration.calibrationDate} | Due: {selectedCalibration.dueDate} | Staff: {selectedCalibration.staffName}</Typography>
              <Divider sx={{ my: 2 }} />
              {selectedCalibration.measurementPoints.map((point, idx) => (
                <Card key={point.pointId} sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.light, 0.02) }}>
                  <Typography variant="h6" fontWeight={600}>Measurement Point {idx + 1}</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Source:</strong> {point.sourceType} ({point.energyKeV} keV)</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Reference Dose Rate:</strong> {point.referenceDoseRate} µSv/h</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Temperature:</strong> {point.temperatureC} °C</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Pressure:</strong> {point.pressureKPa} kPa</Typography></Grid>
                    <Grid item xs={12}><Typography variant="body2"><strong>Leakage:</strong> {point.leakageBefore_pC} pC (before) / {point.leakageAfter_pC} pC (after) → {point.averageLeakageRate_nCps} nC/s</Typography></Grid>
                    <Grid item xs={12}><Typography variant="body2"><strong>Ktp:</strong> {point.ktp}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="body2"><strong>Replicate Readings (µSv/h):</strong> {point.readings.join(', ')}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Average:</strong> {point.avgInstrumentReading}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Corrected Reading:</strong> {point.correctedReading}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Calibration Factor (C):</strong> {point.calibrationFactor}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Error %:</strong> {point.errorPercent}%</Typography></Grid>
                    <Grid item xs={12}><Typography variant="body2"><strong>Expanded Uncertainty (k=2):</strong> {point.uncertaintyExpanded}%</Typography></Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setViewCalibrationDialog(false)}>Close</Button></DialogActions>
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

export default AdminReferenceSystem;