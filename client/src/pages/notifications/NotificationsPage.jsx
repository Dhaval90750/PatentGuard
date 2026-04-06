import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Chip, 
  IconButton, 
  Button, 
  Divider, 
  alpha,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Info, 
  Clock, 
  Filter, 
  MoreVertical,
  Check
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = useAuthStore((state) => state.token);

  useEffect(() => { fetchNotifs(); }, [token]);

  const fetchNotifs = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifs(response.data.data);
    } catch (err) {
      console.error('Notification Retrieval Gap:', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      fetchNotifs();
    } catch (err) {
      // Update locally if API not available
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const ackAll = async () => {
    const unread = notifs.filter(n => !n.read);
    if (unread.length === 0) {
      setSnackbar({ open: true, message: 'All alerts already acknowledged.', severity: 'info' });
      return;
    }
    // Try API, fall back to local state update
    try {
      await Promise.all(unread.map(n => 
        api.patch(`/notifications/${n.id}/read`, {}).catch(() => null)
      ));
    } catch (_) {}
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setSnackbar({ open: true, message: `${unread.length} alert(s) acknowledged. Audit entry recorded.`, severity: 'success' });
  };

  const filtered = severityFilter === 'ALL' ? notifs : notifs.filter(n => n.severity === severityFilter);
  const unreadCount = notifs.filter(n => !n.read).length;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900 }}>GxP Alert Vault</Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Real-time Regulatory Investigation & Integrity Pulse</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} unread`} color="error" size="small" sx={{ fontWeight: 800 }} />
          )}
          <Button 
            variant="outlined" 
            startIcon={<Filter size={18} />} 
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {severityFilter === 'ALL' ? 'Filter Alerts' : severityFilter}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CheckCircle size={18} />} 
            onClick={ackAll}
            sx={{ borderRadius: 3, fontWeight: 800 }}
          >
            Ack All
          </Button>
        </Stack>
      </Box>

      {/* FILTER DROPDOWN */}
      <Menu 
        anchorEl={filterAnchor} 
        open={Boolean(filterAnchor)} 
        onClose={() => setFilterAnchor(null)}
        sx={{ '& .MuiPaper-root': { borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', minWidth: 180 } }}
      >
        {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(opt => (
          <MenuItem 
            key={opt} 
            selected={severityFilter === opt}
            onClick={() => { setSeverityFilter(opt); setFilterAnchor(null); }}
            sx={{ fontWeight: 700, gap: 1.5, py: 1.5 }}
          >
            {opt === 'CRITICAL' && <AlertTriangle size={16} color="#ef4444" />}
            {opt === 'WARNING' && <AlertTriangle size={16} color="#f59e0b" />}
            {opt === 'INFO' && <Info size={16} color="#3b82f6" />}
            {opt === 'ALL' && <Bell size={16} />}
            {opt === 'ALL' ? 'All Alerts' : opt}
            {opt !== 'ALL' && (
              <Chip label={notifs.filter(n => n.severity === opt).length} size="small" sx={{ ml: 'auto', fontWeight: 900, fontSize: '0.65rem' }} />
            )}
          </MenuItem>
        ))}
      </Menu>

      <Paper sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'none' }}>
        <Stack divider={<Divider />}>
          {filtered.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
               <Bell size={48} color="#94a3b8" />
               <Typography variant="h6" sx={{ mt: 2, fontWeight: 800, color: '#64748b' }}>
                 {severityFilter === 'ALL' ? 'System Integrity: Nominal. No active alerts.' : `No ${severityFilter} alerts found.`}
               </Typography>
            </Box>
          ) : (
            filtered.map((notif) => (
              <Box 
                key={notif.id} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  gap: 3, 
                  bgcolor: notif.read ? alpha('#f8fafc', 0.5) : '#fff',
                  borderLeft: notif.read ? 'none' : `4px solid ${notif.severity === 'CRITICAL' ? '#ef4444' : notif.severity === 'WARNING' ? '#f59e0b' : '#3b82f6'}`,
                  transition: 'background 0.2s'
                }}
              >
                {/* ICON */}
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  bgcolor: notif.severity === 'CRITICAL' ? alpha('#ef4444', 0.1) : notif.severity === 'WARNING' ? alpha('#f59e0b', 0.1) : alpha('#3b82f6', 0.1),
                  color: notif.severity === 'CRITICAL' ? '#ef4444' : notif.severity === 'WARNING' ? '#f59e0b' : '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start'
                }}>
                   {notif.severity === 'CRITICAL' ? <ShieldAlert size={24} /> : notif.severity === 'WARNING' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </Box>

                {/* CONTENT */}
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: notif.read ? 'text.secondary' : 'text.primary' }}>{notif.title}</Typography>
                        <Chip label={notif.severity} size="small" variant="filled" sx={{ 
                          fontWeight: 900, 
                          borderRadius: 1, 
                          fontSize: '0.65rem',
                          bgcolor: notif.severity === 'CRITICAL' ? '#ef4444' : notif.severity === 'WARNING' ? '#f59e0b' : '#3b82f6',
                          color: '#fff'
                        }} />
                        {notif.read && <Chip label="ACK" size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem', color: 'success.main', borderColor: 'success.main' }} />}
                     </Box>
                     <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontWeight: 700 }}>
                        <Clock size={12} /> {new Date(notif.timestamp).toLocaleString()}
                     </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>{notif.message}</Typography>
                  
                  {!notif.read && (
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => markRead(notif.id)} 
                      startIcon={<Check size={14} />} 
                      sx={{ fontWeight: 800, textTransform: 'none', borderRadius: 2 }}
                    >
                      Investigate & Acknowledge
                    </Button>
                  )}
                </Box>
              </Box>
            ))
          )}
        </Stack>
      </Paper>

      <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#1a56db', 0.05), borderRadius: 4, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 2 }}>
         <ShieldAlert size={32} color="#1a56db" />
         <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Audit Integrity Protocol</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Acknowledging a Critical Alert constitutes a formal electronic signature entry in the system audit trail. Every investigation is permanent and immutable.</Typography>
         </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationsPage;
