import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
  Stack,
  alpha
} from '@mui/material';
import { Lock, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import logo from '../../assets/logo.png';
import background from '../../assets/pharma_background.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/');
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Compliance Engine Unreachable. Verify Status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 1000,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slightly lighter overlay for clarity
          zIndex: 0
        }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          width: '90%',
          maxWidth: 450,
          borderRadius: 8,
          zIndex: 1,
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ mb: 1 }}>
            <img
              src={logo}
              alt="VantagePoint Logo"
              style={{ height: 100, width: 'auto', marginBottom: 8, objectFit: 'contain' }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.7rem' }}
            >
              Enterprise Compliance Suite
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ borderRadius: 2, fontWeight: 600, bgcolor: alpha('#ef4444', 0.9) }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Personnel Identifier"
                variant="outlined"
                placeholder="e.g. admin@vantagepoint.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} color="#1a56db" strokeWidth={2.5} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#f8fafc', 0.5),
                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Security Access Key"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color="#1a56db" strokeWidth={2.5} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#f8fafc', 0.5),
                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 2,
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  borderRadius: 3,
                  boxShadow: '0 10px 15px -3px rgba(26, 86, 219, 0.4)',
                  '&:hover': {
                    boxShadow: '0 20px 25px -5px rgba(26, 86, 219, 0.5)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'AUTHENTICATE PERSONNEL'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ pt: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>
              SECURED BY 21 CFR PART 11 RULE ENGINE
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
              © 2026 VantagePoint. Strictly Confidential.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
