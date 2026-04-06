import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Badge, 
  Avatar, 
  Typography, 
  Tooltip, 
  InputBase, 
  alpha,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Bell, 
  Search, 
  Globe, 
  Menu as MenuIcon, 
  ChevronRight,
  LogOut,
  User,
  Settings,
  HelpCircle,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import NotificationDrawer from './NotificationDrawer';

/**
 * @desc    Enterprise Global Navbar (V5.0 Fulfillment)
 * @purpose Implements high-fidelity global search, layout toggles, and GxP pulse notifications.
 */
const Navbar = ({ collapsed, toggleSidebar, sidebarWidth }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const { themeMode, setThemeMode } = useSettingsStore();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.startsWith('us') || q.startsWith('ep') || q.includes('patent')) {
        navigate(`/patents?search=${searchQuery}`);
      } else {
        navigate(`/drugs?search=${searchQuery}`);
      }
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await api.get('/notifications');
        const unread = response.data.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.debug('Navbar Pulse Failure (Silenced): endpoints resolving...');
      }
    };
    if (token) fetchUnread();
    const interval = setInterval(fetchUnread, 60000); 
    return () => clearInterval(interval);
  }, [token]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { logout(); navigate('/login'); handleMenuClose(); };

  return (
    <>
    <AppBar 
      position="fixed" 
      sx={{ 
        width: `calc(100% - ${sidebarWidth}px)`, 
        ml: `${sidebarWidth}px`, 
        boxShadow: 'none', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        zIndex: 1200,
        transition: (theme) => theme.transitions.create(['width', 'margin', 'background-color'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: 88 }}>
        {/* LEFT: LAYOUT TOGGLE & SEARCH */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ 
              color: 'text.secondary',
              bgcolor: (theme) => alpha(theme.palette.action.active, 0.05),
              borderRadius: 3,
              '&:hover': { bgcolor: alpha('#2563eb', 0.1), color: 'primary.main' }
            }}
          >
            <MenuIcon size={20} />
          </IconButton>
          
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              backgroundColor: (theme) => alpha(theme.palette.action.active, 0.05), 
              px: 2.5, 
              py: 1, 
              borderRadius: 4,
              width: { md: '100%', lg: 500 },
              maxWidth: 500,
              border: '1px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:focus-within': {
                backgroundColor: 'background.paper',
                borderColor: 'primary.main',
                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)'
              }
            }}
          >
            <Search size={18} color="#64748b" />
            <InputBase 
              placeholder="Search Patents, Drugs, or Personnel..." 
              sx={{ ml: 1.5, flex: 1, fontSize: '0.9rem', fontWeight: 600 }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Chip 
              label="⌘ K" 
              size="small" 
              variant="outlined" 
              sx={{ 
                height: 24, 
                fontSize: '0.7rem', 
                fontWeight: 900, 
                color: 'text.secondary', 
                borderRadius: 1.5,
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }} 
            />
          </Box>
        </Box>

        {/* RIGHT: ACTION UTILITIES */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <Tooltip title="Regulatory Compliance: ACTIVE">
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              gap: 1, 
              px: 2, 
              py: 0.75, 
              bgcolor: alpha('#10b981', 0.1), 
              borderRadius: 3,
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
               <ShieldCheck size={16} color="#059669" />
               <Typography variant="overline" sx={{ fontWeight: 900, color: '#059669', lineHeight: 1.5 }}>GxP VALIDATED</Typography>
            </Box>
          </Tooltip>
          
          <IconButton size="small" sx={{ p: 1, borderRadius: 3, color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
            <Globe size={20} />
          </IconButton>

          <Tooltip title={themeMode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleTheme} sx={{ p: 1, borderRadius: 3, color: 'text.secondary' }}>
              {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Tooltip>
          
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ p: 1, borderRadius: 3, color: 'text.secondary' }}>
            <Badge 
              badgeContent={unreadCount} 
              color="error" 
              sx={{ '& .MuiBadge-badge': { fontWeight: 900, fontSize: '0.65rem' } }}
            >
              <Bell size={20} />
            </Badge>
          </IconButton>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 32, my: 'auto', display: { xs: 'none', md: 'block' } }} />
          
          <Box 
            onClick={handleMenuOpen}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              p: 0.5,
              pr: { lg: 2 },
              borderRadius: 4,
              transition: 'all 0.2s',
              border: '1px solid transparent',
              '&:hover': { 
                bgcolor: 'background.paper',
                borderColor: 'divider',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }
            }}
          >
            <Avatar 
              src={user?.avatar}
              sx={{ 
                background: user?.avatar ? 'none' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
                width: 40, 
                height: 40, 
                fontSize: '1rem',
                fontWeight: 900,
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
              }}
            >
              {!user?.avatar && (user?.username?.substring(0, 1).toUpperCase() || 'A')}
            </Avatar>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>{user?.username?.split('@')[0] || 'Personnel'}</Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.65rem' }}>{user?.role}</Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: { 
          mt: 1.5, 
          borderRadius: '24px', 
          width: 280, 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          p: 1.5
        }
      }}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }} sx={{ py: 1.5, px: 2, borderRadius: '16px', mb: 0.5 }}>
        <ListItemIcon sx={{ color: 'text.secondary', minWidth: '44px !important' }}><User size={20} strokeWidth={1.8} /></ListItemIcon>
        <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', fontFamily: 'Outfit' }} />
      </MenuItem>
      <MenuItem onClick={() => { navigate('/preferences'); handleMenuClose(); }} sx={{ py: 1.5, px: 2, borderRadius: '16px', mb: 0.5 }}>
        <ListItemIcon sx={{ color: 'text.secondary', minWidth: '44px !important' }}><Settings size={20} strokeWidth={1.8} /></ListItemIcon>
        <ListItemText primary="Preferences" primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', fontFamily: 'Outfit' }} />
      </MenuItem>
      <MenuItem onClick={() => { navigate('/support'); handleMenuClose(); }} sx={{ py: 1.5, px: 2, borderRadius: '16px', mb: 0.5 }}>
        <ListItemIcon sx={{ color: 'text.secondary', minWidth: '44px !important' }}><HelpCircle size={20} strokeWidth={1.8} /></ListItemIcon>
        <ListItemText primary="GxP Support" primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', fontFamily: 'Outfit' }} />
      </MenuItem>
      <Divider sx={{ my: 1.5, opacity: 0.5 }} />
      <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, borderRadius: '16px', color: 'error.main', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}>
        <ListItemIcon sx={{ color: 'error.main', minWidth: '44px !important' }}><LogOut size={20} strokeWidth={2.2} /></ListItemIcon>
        <ListItemText primary="Secure Logout" primaryTypographyProps={{ fontWeight: 800, fontSize: '1rem', color: 'error.main', fontFamily: 'Outfit' }} />
      </MenuItem>
    </Menu>

    <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
