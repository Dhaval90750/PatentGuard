import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Select,
  MenuItem,
  FormControl,
  Button,
  Alert,
  Fade
} from '@mui/material';
import {
  Sun,
  Globe,
  Bell,
  Layout,
  ShieldAlert,
  Save,
  Zap,
  CheckCircle2
} from 'lucide-react';
import useSettingsStore from '../../store/settingsStore';

const Preferences = () => {
  const {
    themeMode, setThemeMode,
    compactMode, toggleCompactMode,
    gxpPulseEnabled, setGxpPulse,
    autoSave, setAutoSave,
    resetToDefault
  } = useSettingsStore();

  const [showSaved, setShowSaved] = React.useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h2" gutterBottom>Personal Preferences</Typography>
          <Typography variant="body1" color="text.secondary">Customize your experience within the VantagePoint Global Engine.</Typography>
        </Box>
        <Fade in={showSaved}>
          <Alert icon={<CheckCircle2 size={18} />} severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>
            Settings synchronized successfully
          </Alert>
        </Fade>
      </Box>

      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 4, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Layout size={20} color="#2563eb" /> UI & Interaction
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ py: 3, px: 4 }}>
            <ListItemIcon><Sun size={20} /></ListItemIcon>
            <ListItemText primary="Interface Theme" secondary="Select your preferred color theme for the application." />
            <ListItemSecondaryAction sx={{ right: 32 }}>
              <FormControl size="small" sx={{ width: 160 }}>
                <Select value={themeMode} onChange={(e) => setThemeMode(e.target.value)}>
                  <MenuItem value="light">Light Mode</MenuItem>
                  <MenuItem value="dark">Dark Mode</MenuItem>
                  <MenuItem value="system">System Default</MenuItem>
                </Select>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="middle" />
          <ListItem sx={{ py: 3, px: 4 }}>
            <ListItemIcon><Zap size={20} /></ListItemIcon>
            <ListItemText primary="Compact View" secondary="Denser lists and tighter spacing for more data visibility." />
            <ListItemSecondaryAction sx={{ right: 32 }}>
              <Switch checked={compactMode} onChange={toggleCompactMode} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 4, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Bell size={20} color="#2563eb" /> Notifications & Alerts
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ py: 3, px: 4 }}>
            <ListItemIcon><ShieldAlert size={20} /></ListItemIcon>
            <ListItemText primary="GxP Compliance Pulse" secondary="Real-time alerts for regulatory deadlines and audit events." />
            <ListItemSecondaryAction sx={{ right: 32 }}>
              <Switch checked={gxpPulseEnabled} onChange={() => setGxpPulse(!gxpPulseEnabled)} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="middle" />
          <ListItem sx={{ py: 3, px: 4 }}>
            <ListItemIcon><Globe size={20} /></ListItemIcon>
            <ListItemText primary="State Persistence" secondary="Automatically save temporary form data to local storage." />
            <ListItemSecondaryAction sx={{ right: 32 }}>
              <Switch checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="text" onClick={resetToDefault}>Reset to Default</Button>
        <Button variant="contained" startIcon={<Save size={18} />} onClick={handleSave}>Save Preferences</Button>
      </Box>
    </Container>
  );
};

export default Preferences;
