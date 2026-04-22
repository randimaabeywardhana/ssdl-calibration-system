// src/components/admin/AdminServiceRequests.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Clear,
  Visibility,
  CheckCircle,
  Cancel,
  Pending,
  Assignment,
} from '@mui/icons-material';

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------
const mockRequests = [
  {
    id: 1,
    client: 'ABC Hospital',
    equipment: 'Dosimeter X',
    equipmentId: 'E1001',
    urgency: 'Urgent',
    status: 'Pending',
    date: '2025-04-10',
    details: 'Need calibration urgently. Device showing inconsistent readings.',
    contactPerson: 'Dr. Smith',
    phone: '0112345678',
    adminNotes: '',
  },
  {
    id: 2,
    client: 'DEF Medical',
    equipment: 'Survey Meter Y',
    equipmentId: 'E1002',
    urgency: 'Normal',
    status: 'Pending',
    date: '2025-04-09',
    details: 'Routine annual calibration.',
    contactPerson: 'Ms. Johnson',
    phone: '0118765432',
    adminNotes: '',
  },
  {
    id: 3,
    client: 'GHI Research',
    equipment: 'Ion Chamber Z',
    equipmentId: 'E1003',
    urgency: 'Normal',
    status: 'Approved',
    date: '2025-04-08',
    details: 'Calibration for research project.',
    contactPerson: 'Dr. Lee',
    phone: '0119988776',
    adminNotes: 'Approved – schedule for next week.',
  },
];

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const AdminServiceRequests = () => {
  const theme = useTheme();
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [adminNotes, setAdminNotes] = useState('');

  // Stats
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  // Filtering & sorting
  const filteredRequests = requests
    .filter(
      (req) =>
        statusFilter === 'all' || req.status.toLowerCase() === statusFilter.toLowerCase()
    )
    .filter(
      (req) =>
        req.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (typeof aVal === 'string') {
        return order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

  // Handlers
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setViewDialogOpen(true);
  };

  const openActionDialog = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setAdminNotes(req.adminNotes || '');
    setActionDialogOpen(true);
  };

  const handleActionConfirm = () => {
    if (!selectedRequest) return;

    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id
        ? {
            ...req,
            status: actionType === 'approve' ? 'Approved' : 'Rejected',
            adminNotes: adminNotes,
          }
        : req
    );
    setRequests(updatedRequests);
    setActionDialogOpen(false);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <Chip label="Approved" color="success" size="small" icon={<CheckCircle />} />;
      case 'Rejected':
        return <Chip label="Rejected" color="error" size="small" icon={<Cancel />} />;
      default:
        return <Chip label="Pending" color="warning" size="small" icon={<Pending />} />;
    }
  };

  const getUrgencyChip = (urgency) => {
    return urgency === 'Urgent' ? (
      <Chip label="Urgent" color="error" size="small" />
    ) : (
      <Chip label="Normal" color="default" size="small" />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background: theme.palette.background.paper,
          overflow: 'hidden',
        }}
      >
        {/* Header with stats */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: alpha(theme.palette.primary.main, 0.02),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Assignment color="primary" /> Service Requests
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <StatCard label="Total Requests" value={totalRequests} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard label="Pending" value={pendingCount} valueColor="warning.main" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard label="Approved" value={approvedCount} valueColor="success.main" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard label="Rejected" value={rejectedCount} valueColor="error.main" />
            </Grid>
          </Grid>
        </Box>

        {/* Search & Filter Bar */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search by client, equipment or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Stack>

          {/* Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 3,
              overflow: 'auto',
            }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.04) }}>
                <TableRow>
                  <TableCell sortDirection={orderBy === 'id' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'client' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'client'}
                      direction={orderBy === 'client' ? order : 'asc'}
                      onClick={() => handleSort('client')}
                    >
                      Client
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Urgency</TableCell>
                  <TableCell sortDirection={orderBy === 'status' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'date' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? order : 'asc'}
                      onClick={() => handleSort('date')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.client}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {req.equipment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {req.equipmentId}
                      </Typography>
                    </TableCell>
                    <TableCell>{getUrgencyChip(req.urgency)}</TableCell>
                    <TableCell>{getStatusChip(req.status)}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(req)}
                        >
                          View
                        </Button>
                        {req.status === 'Pending' && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => openActionDialog(req, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => openActionDialog(req, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No service requests found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>Service Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography><strong>Request ID:</strong> {selectedRequest.id}</Typography>
              <Typography><strong>Client:</strong> {selectedRequest.client}</Typography>
              <Typography><strong>Contact Person:</strong> {selectedRequest.contactPerson}</Typography>
              <Typography><strong>Phone:</strong> {selectedRequest.phone}</Typography>
              <Typography><strong>Equipment:</strong> {selectedRequest.equipment} (ID: {selectedRequest.equipmentId})</Typography>
              <Typography><strong>Urgency:</strong> {selectedRequest.urgency}</Typography>
              <Typography><strong>Date Submitted:</strong> {selectedRequest.date}</Typography>
              <Typography><strong>Details:</strong> {selectedRequest.details}</Typography>
              {selectedRequest.adminNotes && (
                <Typography><strong>Admin Notes:</strong> {selectedRequest.adminNotes}</Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>{actionType === 'approve' ? 'Approve Request' : 'Reject Request'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {actionType === 'approve'
              ? 'Are you sure you want to approve this service request?'
              : 'Are you sure you want to reject this service request?'}
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Notes (optional)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
          >
            Confirm {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ----------------------------------------------------------------------
// Stat Card Subcomponent
// ----------------------------------------------------------------------
const StatCard = ({ label, value, valueColor = 'text.primary' }) => {
  const theme = useTheme();
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 1.5,
        textAlign: 'center',
        borderColor: alpha(theme.palette.divider, 0.08),
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: alpha(theme.palette.action.hover, 0.5),
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} color={valueColor}>
        {value}
      </Typography>
    </Card>
  );
};

export default AdminServiceRequests;