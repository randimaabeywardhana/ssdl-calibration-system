// src/components/common/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItem, ListItemText,
  ListItemIcon, Divider, Button, Chip, alpha, useTheme,
} from '@mui/material';
import {
  Notifications as BellIcon,
  CheckCircle, Warning, Pending, Assignment, Security,
} from '@mui/icons-material';

// ----------------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------------
const isExpiringSoon = (dateStr) => {
  const today = new Date();
  const validUntil = new Date(dateStr);
  const daysLeft = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 && daysLeft <= 30;
};

const isOverdue = (dueDateStr) => {
  const today = new Date();
  const dueDate = new Date(dueDateStr);
  return dueDate < today;
};

// ----------------------------------------------------------------------
// Mock data (replace with real API calls later)
// ----------------------------------------------------------------------
const mockPendingApprovals = [
  { id: 'CAL-245', equipment: 'Dosimeter X', staff: 'M. Perera' },
  { id: 'CAL-246', equipment: 'Survey Meter Y', staff: 'K. Silva' },
];

const mockReferenceInstruments = [
  { type: 'Electrometer', serialNumber: '655', validUntil: '2025-12-31' },
  { type: 'Ion Chamber', serialNumber: '303', validUntil: '2025-06-30' },
];

const mockOverdueEquipment = [
  { name: 'Ion Chamber Z', uniqueId: 'E1003', nextDueDate: '2024-10-20' },
];

const mockServiceRequests = [
  { client: 'ABC Hospital', equipment: 'Dosimeter X', status: 'Pending' },
  { client: 'DEF Medical', equipment: 'Survey Meter Y', status: 'Approved' },
];

// ----------------------------------------------------------------------
// Generate notifications from mock data
// ----------------------------------------------------------------------
const generateNotifications = () => {
  const notifications = [];
  let id = 1;

  mockPendingApprovals.forEach((approval) => {
    notifications.push({
      id: id++,
      type: 'approval',
      title: 'Calibration Record Pending Approval',
      message: `${approval.id} (${approval.equipment}) by ${approval.staff}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      link: '/admin/calibrations/pending',
    });
  });

  mockReferenceInstruments
    .filter((inst) => inst.validUntil && isExpiringSoon(inst.validUntil))
    .forEach((inst) => {
      const daysLeft = Math.ceil((new Date(inst.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      notifications.push({
        id: id++,
        type: 'expiry',
        title: 'Reference Instrument Expiring Soon',
        message: `${inst.type} (SN: ${inst.serialNumber}) expires in ${daysLeft} days`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: '/admin/reference',
      });
    });

  mockOverdueEquipment
    .filter((eq) => eq.nextDueDate && isOverdue(eq.nextDueDate))
    .forEach((eq) => {
      const daysOverdue = Math.floor((new Date().getTime() - new Date(eq.nextDueDate).getTime()) / (1000 * 60 * 60 * 24));
      notifications.push({
        id: id++,
        type: 'overdue',
        title: 'Overdue Calibration',
        message: `${eq.name} (${eq.uniqueId}) – overdue by ${daysOverdue} days`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: '/admin/equipment',
      });
    });

  mockServiceRequests
    .filter((req) => req.status === 'Pending')
    .forEach((req) => {
      notifications.push({
        id: id++,
        type: 'service',
        title: 'New Service Request',
        message: `${req.client} requested calibration for ${req.equipment}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: '/admin/requests',
      });
    });

  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const NotificationBell = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(generateNotifications());
  }, []);

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const getIcon = (type) => {
    switch (type) {
      case 'approval': return <Pending sx={{ color: '#eab308' }} />;
      case 'expiry': return <Security sx={{ color: '#f59e0b' }} />;
      case 'overdue': return <Warning sx={{ color: '#ef4444' }} />;
      case 'service': return <Assignment sx={{ color: '#3b82f6' }} />;
      default: return <CheckCircle sx={{ color: '#10b981' }} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev =>
      prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
    );
    handleClose();
    // ACTUAL NAVIGATION to the target page
    navigate(notif.link);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: '#64748b' }}>
        <Badge badgeContent={unreadCount} color="error">
          <BellIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 450,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Box>
        <List sx={{ p: 0, overflowY: 'auto', maxHeight: 380 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" secondary="You're all caught up!" />
            </ListItem>
          ) : (
            notifications.map((notif) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    backgroundColor: notif.isRead ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
                    '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.08) },
                  }}
                >
                  <ListItemIcon>{getIcon(notif.type)}</ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight={notif.isRead ? 400 : 600}>{notif.title}</Typography>}
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary">{notif.message}</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">{formatTimestamp(notif.timestamp)}</Typography>
                      </>
                    }
                  />
                  {!notif.isRead && <Chip label="New" size="small" color="error" sx={{ ml: 1 }} />}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
        <Box sx={{ p: 1.5, borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`, textAlign: 'center' }}>
          <Button size="small" fullWidth onClick={handleClose}>Close</Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;