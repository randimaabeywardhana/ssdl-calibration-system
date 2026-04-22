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
  Paper,
  Button,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  InputAdornment,
  Stack,
  Grid,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search,
  Clear,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

// Mock data (includes passwordHash for demonstration, not displayed)
const mockUsers = [
  {
    userId: 1,
    email: 'admin@ssdl.lk',
    firstName: 'Admin',
    lastName: 'User',
    role: 'Admin',
    isActive: true,
    department: 'Quality Assurance',
    position: 'Lab Manager',
    createdAt: '2024-01-15',
    lastLogin: '2026-04-18 09:23:00',
    passwordHash: 'hashed_admin',
  },
  {
    userId: 2,
    email: 'staff1@ssdl.lk',
    firstName: 'M.',
    lastName: 'Perera',
    role: 'Staff',
    isActive: true,
    employeeId: 'STF001',
    department: 'Calibration',
    position: 'Senior Technician',
    createdAt: '2024-02-20',
    lastLogin: '2026-04-17 16:45:00',
    passwordHash: 'hashed_staff1',
  },
  {
    userId: 3,
    email: 'client@hospital.lk',
    firstName: 'ABC',
    lastName: 'Hospital',
    role: 'Client',
    isActive: true,
    companyName: 'ABC Hospital',
    address: 'Colombo',
    contactPerson: 'Dr. Smith',
    phone: '0112345678',
    createdAt: '2024-03-10',
    lastLogin: '2026-04-16 11:20:00',
    passwordHash: 'hashed_client',
  },
  {
    userId: 4,
    email: 'staff2@ssdl.lk',
    firstName: 'K.',
    lastName: 'Silva',
    role: 'Staff',
    isActive: false,
    employeeId: 'STF002',
    department: 'Radiotherapy',
    position: 'Physicist',
    createdAt: '2024-05-05',
    lastLogin: '2026-04-01 08:10:00',
    passwordHash: 'hashed_staff2',
  },
];

const AdminUserList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('userId');
  const [order, setOrder] = useState('asc');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'Staff',
    isActive: true,
    employeeId: '',
    department: '',
    position: '',
    companyName: '',
    address: '',
    contactPerson: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const staffCount = users.filter((u) => u.role === 'Staff').length;
  const clientCount = users.filter((u) => u.role === 'Client').length;

  // Filter & sort
  const filteredUsers = users
    .filter(
      (user) =>
        roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase()
    )
    .filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleOpen = (user = null) => {
    setEditingUser(user);
    if (user) {
      setForm({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        employeeId: user.employeeId || '',
        department: user.department || '',
        position: user.position || '',
        companyName: user.companyName || '',
        address: user.address || '',
        contactPerson: user.contactPerson || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
      });
    } else {
      setForm({
        email: '',
        firstName: '',
        lastName: '',
        role: 'Staff',
        isActive: true,
        employeeId: '',
        department: '',
        position: '',
        companyName: '',
        address: '',
        contactPerson: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    }
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    // Password validation
    if (!editingUser && !form.password) {
      alert('Password is required for new users.');
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    let newUser;
    if (editingUser) {
      const updatedUser = { ...editingUser, ...form };
      if (form.password) {
        updatedUser.passwordHash = `hashed_${form.password}`;
      }
      delete updatedUser.password;
      delete updatedUser.confirmPassword;
      newUser = updatedUser;
      setUsers(users.map((u) => (u.userId === editingUser.userId ? newUser : u)));
    } else {
      const nextId = Math.max(...users.map((u) => u.userId), 0) + 1;
      const { password, confirmPassword, ...rest } = form;
      newUser = {
        ...rest,
        userId: nextId,
        passwordHash: `hashed_${password}`,
      };
      setUsers([...users, newUser]);
    }
    handleClose();
  };

  const handleToggleActive = (userId) => {
    setUsers(
      users.map((u) =>
        u.userId === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const openDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.userId !== userToDelete));
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Staff':
        return 'primary';
      default:
        return 'success';
    }
  };

  const getRoleDetails = (user) => {
    if (user.role === 'Staff') {
      return `${user.department || ''} • ${user.position || ''}`;
    }
    if (user.role === 'Client') {
      return user.companyName || '';
    }
    return `${user.department || ''} • ${user.position || ''}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            User Management
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Add User
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {totalUsers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {activeUsers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Admins
              </Typography>
              <Typography variant="h5" fontWeight={600} color="error.main">
                {adminCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Staff / Clients
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {staffCount + clientCount}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search & Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search users..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </TextField>
        </Box>

        {/* User Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.userId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {user.firstName} {user.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {getRoleDetails(user)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        user.isActive ? (
                          <CheckCircle fontSize="small" />
                        ) : (
                          <Cancel fontSize="small" />
                        )
                      }
                      label={user.isActive ? 'Active' : 'Disabled'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                      variant={user.isActive ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.lastLogin}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton
                        onClick={() => handleOpen(user)}
                        size="small"
                        color="primary"
                        title="Edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleActive(user.userId)}
                        size="small"
                        color={user.isActive ? 'warning' : 'success'}
                        title={user.isActive ? 'Disable' : 'Enable'}
                      >
                        {user.isActive ? (
                          <Cancel fontSize="small" />
                        ) : (
                          <CheckCircle fontSize="small" />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDialog(user.userId)}
                        size="small"
                        color="error"
                        title="Delete"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Box>

            {/* Password fields */}
            <TextField
              fullWidth
              name="password"
              label={editingUser ? "New Password (leave blank to keep unchanged)" : "Password"}
              type="password"
              value={form.password}
              onChange={handleChange}
              required={!editingUser}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required={!editingUser}
            />

            <TextField
              select
              fullWidth
              name="role"
              label="Role"
              value={form.role}
              onChange={handleChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
            </TextField>

            {form.role === 'Staff' && (
              <>
                <TextField
                  fullWidth
                  name="employeeId"
                  label="Employee ID"
                  value={form.employeeId}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="department"
                  label="Department"
                  value={form.department}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="position"
                  label="Position"
                  value={form.position}
                  onChange={handleChange}
                />
              </>
            )}

            {form.role === 'Admin' && (
              <>
                <TextField
                  fullWidth
                  name="department"
                  label="Department"
                  value={form.department}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="position"
                  label="Position"
                  value={form.position}
                  onChange={handleChange}
                />
              </>
            )}

            {form.role === 'Client' && (
              <>
                <TextField
                  fullWidth
                  name="companyName"
                  label="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  value={form.address}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="contactPerson"
                  label="Contact Person"
                  value={form.contactPerson}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserList;