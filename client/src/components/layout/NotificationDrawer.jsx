import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button,
  Chip,
  alpha 
} from '@mui/material';
import { X, Bell, ShieldAlert, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

/**
 * @desc    Quick-Access GxP Notification Drawer
 * @purpose Provides a rapid overview of critical alerts from the Navbar.
 */
const NotificationDrawer = ({ open, onClose }) => {
  const [notifs, setNotifs] = useState([]);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (open) {
      fetchNotifs();
    }
  }, [open, token]);

  const fetchNotifs = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifs(response.data.data.slice(0, 10)); 
    } catch (err) {
      console.error('Drawer Retrieval failure:', err);
    }
  };

  const markAsRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSeeAll = () => {
    onClose();
    navigate('/notifications');
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3, borderLeft: '1px solid', borderColor: 'divider' } }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Audit Alerts</Typography>
            <Typography variant="caption" color="text.secondary">Real-time GxP Pulse</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}><X size={20} /></IconButton>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            size="small" 
            onClick={markAllAsRead} 
            disabled={!notifs.some(n => !n.read)}
            sx={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'none' }}
          >
            Mark all as read
          </Button>
        </Box>

        <List sx={{ mb: 4, bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4), borderRadius: 4 }}>
          {notifs.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
               <Bell size={40} color="#cbd5e1" style={{ marginBottom: 16 }} />
               <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No active GxP alerts.</Typography>
            </Box>
          ) : (
            notifs.map((notif, idx) => (
              <React.Fragment key={notif.id}>
                <ListItem 
                  onClick={() => markAsRead(notif.id)}
                  alignItems="flex-start" 
                  sx={{ 
                    cursor: 'pointer',
                    px: 2, 
                    py: 2.5,
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    mb: 1,
                    bgcolor: !notif.read ? (theme) => alpha(theme.palette.primary.main, 0.04) : 'transparent',
                    border: !notif.read ? '1px solid transparent' : '1px solid transparent',
                    borderColor: !notif.read ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.action.active, 0.05) }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48, mt: 0.5 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: notif.severity === 'CRITICAL' ? alpha('#ef4444', 0.1) : alpha('#3b82f6', 0.1),
                      color: notif.severity === 'CRITICAL' ? '#ef4444' : '#3b82f6'
                    }}>
                      {notif.severity === 'CRITICAL' ? <ShieldAlert size={18} /> : <Info size={18} />}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: !notif.read ? 900 : 700, color: !notif.read ? 'text.primary' : 'text.secondary' }}>{notif.title}</Typography>
                        {!notif.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />}
                      </Box>
                    }
                    secondary={notif.message}
                    secondaryTypographyProps={{ 
                      fontSize: '0.75rem', 
                      sx: { 
                        mt: 0.5,
                        color: 'text.secondary',
                        fontWeight: !notif.read ? 600 : 500,
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical' 
                      } 
                    }}
                  />
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>

        <Button 
          fullWidth 
          variant="contained" 
          endIcon={<ArrowRight size={18} />}
          onClick={handleSeeAll}
          sx={{ borderRadius: 3, py: 1.5, fontWeight: 800 }}
        >
          Open Compliance Center
        </Button>
      </Box>
    </Drawer>
  );
};

export default NotificationDrawer;
