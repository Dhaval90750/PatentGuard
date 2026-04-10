import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  alpha,
  Tooltip
} from '@mui/material';
import {
  LayoutDashboard,
  Dna,
  ShieldCheck,
  FolderOpen,
  BarChart3,
  Settings,
  Landmark,
  LogOut,
  Users,
  Bell,
  FlaskConical,
  Network,
  TriangleAlert,
  Globe,
  Zap,
  Target,
  Fingerprint
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import logo from '../../assets/logo.png';

const menuGroups = [
  {
    title: 'Strategic Portfolio',
    items: [
      { text: 'Executive Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
      { text: 'Patent Registry', icon: <Landmark size={20} />, path: '/patents' },
      { text: 'Global Risk Heatmap', icon: <Globe size={20} />, path: '/mapping/heatmap' },
      { text: 'Strategy Simulator', icon: <Zap size={20} />, path: '/strategy/simulator' },
      { text: 'Regulatory Reports', icon: <BarChart3 size={20} />, path: '/reports' },
    ]
  },
  {
    title: 'Asset Management',
    items: [
      { text: 'Drug Registry', icon: <Dna size={20} />, path: '/drugs' },
      { text: 'API Ingredient Registry', icon: <FlaskConical size={20} />, path: '/apis' },
      { text: 'Document Vault', icon: <FolderOpen size={20} />, path: '/documents' },
      { text: 'AI Similarity Engine', icon: <Target size={20} />, path: '/mapping/similarity' },
      { text: 'Strategic Dependency Map', icon: <Network size={20} />, path: '/mapping' },
    ]
  },
  {
    title: 'Compliance & Audit',
    items: [
      { text: 'Compliance Approval Hub', icon: <Fingerprint size={20} />, path: '/compliance/approvals' },
      { text: 'GxP Audit Trail', icon: <ShieldCheck size={20} />, path: '/compliance' },
      { text: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    ]
  },
  {
    title: 'System Administration',
    items: [
      { text: 'Personnel RBAC', icon: <Users size={20} />, path: '/users' },
      { text: 'SMTP Configuration', icon: <Bell size={20} />, path: '/settings/smtp' },
      { text: 'System Settings', icon: <Settings size={20} />, path: '/settings' },
    ]
  }
];

/**
 * @desc    Collapsible Sidebar Navigation (V5.0 Fulfillment)
 * @purpose Implements a senior-level navigation hierarchy with micro-interactions and tooltip-only collapsed state.
 */
const Sidebar = ({ collapsed, sidebarWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '4px 0 24px 0 rgba(0,0,0,0.2)',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          zIndex: 1300
        },
      }}
    >
      {/* BRANDING HEADER */}
      <Box sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 2,
        minHeight: 88,
        borderBottom: '1px solid rgba(255,255,255,0.03)'
      }}>
        <Box sx={{
          p: 0.75,
          bgcolor: 'white',
          borderRadius: 3,
          display: 'flex',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <img src={logo} alt="PG" style={{ height: 24, width: 24, objectFit: 'contain' }} />
        </Box>
        {!collapsed && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.04em',
              fontFamily: 'Outfit',
              color: '#fff'
            }}
          >
            Vantage<span style={{ color: '#3b82f6' }}>Point</span>
          </Typography>
        )}
      </Box>

      {/* NAVIGATION GROUPS */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1, px: collapsed ? 1.5 : 2, py: 2 }}>
        {menuGroups.map((group, idx) => (
          <Box key={group.title} sx={{ mb: 4 }}>
            {!collapsed && (
              <Typography
                variant="overline"
                sx={{
                  px: 2,
                  mb: 1.5,
                  display: 'block',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 900,
                  fontFamily: 'Outfit'
                }}
              >
                {group.title}
              </Typography>
            )}
            <List sx={{ p: 0 }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const buttonContent = (
                  <ListItemButton
                    key={item.text}
                    component={NavLink}
                    to={item.path}
                    sx={{
                      mb: 0.75,
                      py: 1.25,
                      px: collapsed ? 2.5 : 2,
                      borderRadius: 3,
                      transition: 'all 0.2s',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      backgroundColor: isActive ? alpha('#3b82f6', 0.15) : 'transparent',
                      border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                      color: isActive ? '#fff' : 'rgba(248, 250, 252, 0.65)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        '& .MuiListItemIcon-root': { color: '#3b82f6' }
                      },
                      '& .MuiListItemIcon-root': {
                        color: isActive ? '#3b82f6' : 'rgba(248, 250, 252, 0.4)',
                        minWidth: collapsed ? 0 : 40,
                        transition: 'color 0.2s'
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {!collapsed && <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 800 : 500 }}
                    />}
                  </ListItemButton>
                );

                return collapsed ? (
                  <Tooltip key={item.text} title={item.text} placement="right" arrow>
                    {buttonContent}
                  </Tooltip>
                ) : buttonContent;
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* SECURE LOGOUT FOOTER */}
      <Box sx={{ px: 2, py: 3, borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            py: 1.5,
            px: collapsed ? 2.5 : 2,
            color: '#f43f5e',
            justifyContent: collapsed ? 'center' : 'flex-start',
            '&:hover': {
              backgroundColor: alpha('#f43f5e', 0.1),
              '& .MuiListItemIcon-root': { color: '#f43f5e' }
            },
            '& .MuiListItemIcon-root': { color: 'inherit', minWidth: collapsed ? 0 : 40 }
          }}
        >
          <ListItemIcon><LogOut size={20} /></ListItemIcon>
          {!collapsed && <ListItemText primary="Secure Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 800 }} />}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
