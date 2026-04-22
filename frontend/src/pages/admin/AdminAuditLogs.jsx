// src/components/admin/AdminAuditLogs.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, IconButton, Grid, Card, CardContent, Stack,
  alpha, useTheme, MenuItem, Tooltip, Collapse,
} from '@mui/material';
import {
  Search, Clear, ExpandMore, ExpandLess, Visibility, Receipt, Security, Warning,
} from '@mui/icons-material';

// ----------------------------------------------------------------------
// Mock data (matches AuditLog table)
// ----------------------------------------------------------------------
const mockAuditLogs = [
  { logId: 1, userId: 1, userEmail: 'admin@ssdl.lk', action: 'LOGIN', tableName: 'User', recordId: 1, oldValues: null, newValues: null, ipAddress: '192.168.1.1', timestamp: '2026-04-20 09:23:45' },
  { logId: 2, userId: 2, userEmail: 'staff1@ssdl.lk', action: 'UPDATE', tableName: 'CalibrationRecord', recordId: 245, oldValues: { status: 'Draft' }, newValues: { status: 'Completed' }, ipAddress: '192.168.1.2', timestamp: '2026-04-20 10:15:22' },
  { logId: 3, userId: 1, userEmail: 'admin@ssdl.lk', action: 'APPROVE', tableName: 'CalibrationRecord', recordId: 245, oldValues: { status: 'Completed' }, newValues: { status: 'Approved' }, ipAddress: '192.168.1.1', timestamp: '2026-04-20 11:30:05' },
  { logId: 4, userId: 1, userEmail: 'admin@ssdl.lk', action: 'CREATE', tableName: 'User', recordId: 5, oldValues: null, newValues: { email: 'newstaff@ssdl.lk', firstName: 'New', lastName: 'Staff', role: 'Staff' }, ipAddress: '192.168.1.1', timestamp: '2026-04-19 14:20:10' },
  { logId: 5, userId: 3, userEmail: 'client@hospital.lk', action: 'LOGIN', tableName: 'User', recordId: 3, oldValues: null, newValues: null, ipAddress: '10.0.0.5', timestamp: '2026-04-19 08:45:30' },
  { logId: 6, userId: 2, userEmail: 'staff1@ssdl.lk', action: 'DELETE', tableName: 'MeasurementPoint', recordId: 12, oldValues: { pointId: 12, calibrationId: 245 }, newValues: null, ipAddress: '192.168.1.2', timestamp: '2026-04-18 16:00:00' },
];

// ----------------------------------------------------------------------
// Helper to format JSON for display
// ----------------------------------------------------------------------
const formatJson = (obj) => {
  if (!obj) return '—';
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const AdminAuditLogs = () => {
  const theme = useTheme();
  const [logs, setLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [orderBy, setOrderBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);

  // Stats
  const totalLogs = logs.length;
  const loginCount = logs.filter(l => l.action === 'LOGIN').length;
  const updateCount = logs.filter(l => l.action === 'UPDATE').length;
  const deleteCount = logs.filter(l => l.action === 'DELETE').length;
  const createCount = logs.filter(l => l.action === 'CREATE').length;

  // Filter logs
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.tableName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesTable = tableFilter === 'all' || log.tableName === tableFilter;
      const matchesDate = (!fromDate || log.timestamp >= fromDate) && (!toDate || log.timestamp <= toDate);
      return matchesSearch && matchesAction && matchesTable && matchesDate;
    })
    .sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
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

  const getActionChip = (action) => {
    switch (action) {
      case 'LOGIN': return <Chip label="LOGIN" color="info" size="small" />;
      case 'LOGOUT': return <Chip label="LOGOUT" color="default" size="small" />;
      case 'CREATE': return <Chip label="CREATE" color="success" size="small" />;
      case 'UPDATE': return <Chip label="UPDATE" color="warning" size="small" />;
      case 'DELETE': return <Chip label="DELETE" color="error" size="small" />;
      case 'APPROVE': return <Chip label="APPROVE" color="primary" size="small" />;
      case 'REJECT': return <Chip label="REJECT" color="secondary" size="small" />;
      default: return <Chip label={action} size="small" />;
    }
  };

  // Unique table names for filter dropdown
  const tableNames = ['all', ...new Set(logs.map(l => l.tableName))];

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, overflow: 'hidden' }}>
        {/* Header with stats */}
        <Box sx={{ p: { xs: 2, sm: 3 }, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" /> Audit Logs
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><StatCard label="Total Events" value={totalLogs} /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Logins" value={loginCount} valueColor="info.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Updates" value={updateCount} valueColor="warning.main" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Creations / Deletions" value={createCount + deleteCount} valueColor="error.main" /></Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Filters */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search by user, action, or table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 2, minWidth: 200 }}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
                endAdornment: searchTerm && (<IconButton onClick={() => setSearchTerm('')} size="small"><Clear /></IconButton>),
              }}
            />
            <TextField
              select
              size="small"
              label="Action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="all">All Actions</MenuItem>
              <MenuItem value="LOGIN">LOGIN</MenuItem>
              <MenuItem value="LOGOUT">LOGOUT</MenuItem>
              <MenuItem value="CREATE">CREATE</MenuItem>
              <MenuItem value="UPDATE">UPDATE</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="APPROVE">APPROVE</MenuItem>
              <MenuItem value="REJECT">REJECT</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Table"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {tableNames.map(t => <MenuItem key={t} value={t}>{t === 'all' ? 'All Tables' : t}</MenuItem>)}
            </TextField>
            <TextField
              type="date"
              size="small"
              label="From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              type="date"
              size="small"
              label="To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
          </Stack>

          {/* Audit Log Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3 }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                <TableRow>
                  <TableCell sortDirection={orderBy === 'timestamp' ? order : false}><TableSortLabel active={orderBy === 'timestamp'} direction={order} onClick={() => handleSort('timestamp')}>Timestamp</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'userEmail' ? order : false}><TableSortLabel active={orderBy === 'userEmail'} direction={order} onClick={() => handleSort('userEmail')}>User</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'action' ? order : false}><TableSortLabel active={orderBy === 'action'} direction={order} onClick={() => handleSort('action')}>Action</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'tableName' ? order : false}><TableSortLabel active={orderBy === 'tableName'} direction={order} onClick={() => handleSort('tableName')}>Table</TableSortLabel></TableCell>
                  <TableCell sortDirection={orderBy === 'recordId' ? order : false}><TableSortLabel active={orderBy === 'recordId'} direction={order} onClick={() => handleSort('recordId')}>Record ID</TableSortLabel></TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.logId}>
                    <TableRow hover>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.userEmail}</TableCell>
                      <TableCell>{getActionChip(log.action)}</TableCell>
                      <TableCell>{log.tableName}</TableCell>
                      <TableCell>{log.recordId}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Changes">
                          <IconButton size="small" onClick={() => setExpandedRow(expandedRow === log.logId ? null : log.logId)}>
                            {expandedRow === log.logId ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 0 }}>
                        <Collapse in={expandedRow === log.logId} timeout="auto" unmountOnExit>
                          <Box sx={{ m: 2, p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Old Values</Typography>
                            <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {formatJson(log.oldValues)}
                            </pre>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>New Values</Typography>
                            <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {formatJson(log.newValues)}
                            </pre>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No audit logs found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
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

export default AdminAuditLogs;