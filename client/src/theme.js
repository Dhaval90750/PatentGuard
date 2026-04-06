import { createTheme } from '@mui/material/styles';

/**
 * @desc    Enterprise Theme Factory (V5.0 Fulfillment)
 * @purpose Generates a dynamic MUI theme based on user preferences (Light/Dark/Compact).
 * @param   {string} mode - Must be 'light' or 'dark'. (System resolution happens in Layout.jsx)
 */
export const getTheme = (mode = 'light', isCompact = false) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#3b82f6' : '#2563eb', // Modern Blue
        dark: isDark ? '#2563eb' : '#1e40af',
        light: isDark ? '#60a5fa' : '#60a5fa',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#10b981', // Professional Green
        dark: '#059669',
        light: '#34d399',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444', 
      },
      warning: {
        main: '#f59e0b',
      },
      info: {
        main: '#3b82f6',
      },
      success: {
        main: '#10b981',
      },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc', 
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a', 
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      action: {
        active: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
        hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
        disabledBackground: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      divider: isDark ? 'rgba(241, 245, 249, 0.08)' : '#f1f5f9',
    },
    typography: {
      fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', fontFamily: 'Outfit' },
      h2: { fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', fontFamily: 'Outfit' },
      h3: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'Outfit' },
      h4: { fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'Outfit' },
      h5: { fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit' },
      h6: { fontSize: '1rem', fontWeight: 700, fontFamily: 'Outfit' },
      body1: { fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 },
      body2: { fontSize: '0.875rem', lineHeight: 1.57, fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.02em' },
      caption: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' },
      overline: { fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            padding: isCompact ? '6px 16px' : '10px 24px',
            borderRadius: 12,
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isDark ? 'none' : '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            background: isDark 
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            border: isDark ? '1px solid rgba(241, 245, 249, 0.05)' : '1px solid #f1f5f9',
            borderRadius: 20,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isDark ? '0 20px 25px -5px rgba(0, 0, 0, 0.4)' : '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              borderColor: isDark ? 'primary.main' : '#e2e8f0',
            }
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(241, 245, 249, 0.05)' : 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
              },
              '&.Mui-focused': {
                 backgroundColor: isDark ? '#1e293b' : '#ffffff',
                 boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
              }
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: isCompact ? '8px 16px' : '16px 24px',
            borderColor: isDark ? 'rgba(241, 245, 249, 0.08)' : '#f1f5f9',
          },
          head: {
            fontWeight: 800,
            backgroundColor: isDark ? '#0f172a' : '#f8fafc',
            color: isDark ? '#94a3b8' : '#64748b',
          }
        }
      }
    },
  });
};

const defaultTheme = getTheme('light', false);
export default defaultTheme;
