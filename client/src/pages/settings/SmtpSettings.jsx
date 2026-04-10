import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Breadcrumbs,
  Link,
  Tooltip
} from '@mui/material';
import {
  Mail,
  Server,
  ShieldCheck,
  Send,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import api from '../../utils/api';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';

/**
 * @desc    Enterprise SMTP Configuration Page (V2)
 * @purpose Provides a secure, administrative interface for managing global email delivery settings.
 */
const SmtpSettings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    from: ''
  });

  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/settings/smtp');
      if (response.data.success && response.data.data) {
        // Map backend data to local state
        const { id, updated_at, created_at, ...rest } = response.data.data;
        setConfig(rest);
      }
    } catch (err) {
      console.error('Fetch Config Error:', err);
      enqueueSnackbar('Failed to retrieve SMTP configuration.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Reset test result on change
    setTestResult(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post('/settings/smtp', config);
      if (response.data.success) {
        enqueueSnackbar('SMTP configuration saved successfully.', { variant: 'success' });
        // Refresh to get the masked password if it was updated
        fetchConfig();
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.error || 'Failed to save configuration.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await api.post('/settings/smtp/test', config);
      if (response.data.success) {
        setTestResult({ success: true, message: response.data.message });
        enqueueSnackbar('SMTP Connection Verified.', { variant: 'success' });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.response?.data?.error || 'Connection Failed' });
      enqueueSnackbar('SMTP Verification Failed.', { variant: 'error' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* BREADCRUMBS */}
      <Breadcrumbs 
        separator={<ChevronRight size={14} />} 
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          SMTP Configuration
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontFamily: 'Outfit' }}>
        Email Delivery Engine
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Configure the global SMTP settings for GxP notifications, automated alerts, and scheduled delivery reports.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Server size={24} color="#3b82f6" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Server Configuration</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="SMTP Host"
                  name="host"
                  value={config.host}
                  onChange={handleInputChange}
                  placeholder="e.g. smtp.gmail.com"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Port"
                  name="port"
                  type="number"
                  value={config.port}
                  onChange={handleInputChange}
                  placeholder="587"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="secure"
                      checked={config.secure}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Use SSL/TLS (Implicit Secure)"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, mt: 1 }}>
                  <ShieldCheck size={20} color="#3b82f6" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Authentication</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP User"
                  name="user"
                  value={config.user}
                  onChange={handleInputChange}
                  placeholder="user@domain.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Password"
                  name="pass"
                  type={showPassword ? 'text' : 'password'}
                  value={config.pass}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, mt: 1 }}>
                  <Mail size={20} color="#3b82f6" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Sender Identity</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="From Email Address"
                  name="from"
                  value={config.from}
                  onChange={handleInputChange}
                  placeholder="VantagePoint Notifications <no-reply@vantagepoint.io>"
                  helperText="The email address that will appear in the 'From' field."
                />
              </Grid>
            </Grid>

            {testResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Alert 
                  severity={testResult.success ? "success" : "error"} 
                  sx={{ mt: 3, borderRadius: 2 }}
                  icon={testResult.success ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                >
                  {testResult.message}
                </Alert>
              </motion.div>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={testing ? <CircularProgress size={20} /> : <Send size={18} />}
                onClick={handleTestConnection}
                disabled={testing || saving || !config.host}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Test Connection
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save size={18} />}
                onClick={handleSave}
                disabled={saving || testing}
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 800,
                  px: 4,
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                }}
              >
                Save Configuration
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(59, 130, 246, 0.03)', border: '1px dashed rgba(59, 130, 246, 0.2)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Implementation Guide</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The SMTP Configuration is used globally across the environment to deliver mission-critical intelligence.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Standard Ports</Typography>
              <ul>
                <li><Typography variant="body2"><b>587</b>: TLS (Recommended)</Typography></li>
                <li><Typography variant="body2"><b>465</b>: SSL (Implicit)</Typography></li>
                <li><Typography variant="body2"><b>25</b>: Non-secure</Typography></li>
              </ul>
            </Box>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                For GxP compliance, ensure you use a dedicated relay service (e.g. SendGrid, AWS SES) to maintain high deliverability and audit logs.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmtpSettings;
