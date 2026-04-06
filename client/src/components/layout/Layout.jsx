import React, { useState, useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider, Toolbar, GlobalStyles } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getTheme } from '../../theme';
import useSettingsStore from '../../store/settingsStore';

const sidebarWidth = 280;
const collapsedWidth = 88;

/**
 * @desc    Production-Ready Layout Architecture (V5.0 Fulfillment)
 * @purpose Implements collapsible navigation and responsive content areas for enterprise scale.
 */
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { themeMode, compactMode } = useSettingsStore();

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Resolve "system" mode to actual light/dark
  const resolvedMode = useMemo(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode]);

  // Memoize theme calculation for performance
  const theme = useMemo(() => getTheme(resolvedMode, compactMode), [resolvedMode, compactMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        '*': {
          transition: 'background-color 0.2s ease-in-out, border-color 0s ease-in-out',
        },
        'body': {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }
      }} />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
      }}>
        <Navbar 
          collapsed={collapsed} 
          toggleSidebar={toggleSidebar} 
          sidebarWidth={collapsed ? collapsedWidth : sidebarWidth} 
        />

        <Sidebar 
          collapsed={collapsed} 
          sidebarWidth={collapsed ? collapsedWidth : sidebarWidth} 
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 3, md: 5 },
            transition: (theme) => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            backgroundColor: 'background.default'
          }}
        >
          <Toolbar sx={{ mb: 4, minHeight: 88 }} />

          <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
