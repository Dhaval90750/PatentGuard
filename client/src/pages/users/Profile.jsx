import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Chip, 
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { 
  Mail, 
  Shield, 
  Clock, 
  Edit3, 
  Camera,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const { user, login, updateUser } = useAuthStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    username: user?.username || '', 
    orgUnit: 'Regulatory Affairs' 
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateProfile = () => {
    // Simulate updating auth store
    updateUser({ username: formData.username });
    setIsEditOpen(false);
    setSuccessMsg('Profile identifiers updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result }); // Store Base64 in Zustand
        setSuccessMsg('Profile image updated and synchronized.');
        setTimeout(() => setSuccessMsg(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h2" gutterBottom>Personnel Profile</Typography>
          <Typography variant="body1" color="text.secondary">Manage your professional identity and security settings.</Typography>
        </Box>
        {successMsg && (
          <Alert severity="success" icon={<CheckCircle2 size={18} />} sx={{ borderRadius: 3, fontWeight: 700 }}>
            {successMsg}
          </Alert>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left: Identity Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar 
                src={user?.avatar}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: '3rem', 
                  fontWeight: 900,
                  background: user?.avatar ? 'none' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
                }}
              >
                {!user?.avatar && (user?.username?.substring(0, 1).toUpperCase() || 'P')}
              </Avatar>
              <input
                type="file"
                id="avatar-upload"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label htmlFor="avatar-upload">
                <IconButton 
                  component="span"
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    bgcolor: 'background.paper', 
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Camera size={16} color="#64748b" />
                </IconButton>
              </label>
            </Box>
            
            <Typography variant="h4" gutterBottom>{user?.username?.split('@')[0] || 'Personnel'}</Typography>
            <Chip 
              icon={<Shield size={14} />} 
              label={user?.role || 'Guest'} 
              color="primary" 
              sx={{ fontWeight: 800, mb: 3 }} 
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Mail size={18} color="#64748b" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.username || 'no-email@vantagepoint.com'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Clock size={18} color="#64748b" />
                <Typography variant="body2">Member since April 2026</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right: Security & Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
                  <Shield size={20} color="#2563eb" /> Security & Access
                </Typography>
                <Button variant="outlined" startIcon={<Lock size={16} />} onClick={() => setIsPasswordOpen(true)}>Change Password</Button>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Two-Factor Auth</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>Enabled</Typography>
                      <CheckCircle2 size={18} color="#10b981" />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Last Login</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>2 hours ago (IP: 192.168.1.1)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
                  <Edit3 size={20} color="#2563eb" /> Departmental Details
                </Typography>
                <Button variant="text" color="primary" onClick={() => setIsEditOpen(true)}>Edit Details</Button>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Org Unit</Typography>
                  <Typography variant="subtitle1" fontWeight={800}>{formData.orgUnit}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Region</Typography>
                  <Typography variant="subtitle1" fontWeight={800}>US / EMEA</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Supervisor</Typography>
                  <Typography variant="subtitle1" fontWeight={800}>Dr. Sarah Miller</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Clearance Level</Typography>
                  <Typography variant="subtitle1" fontWeight={800}>Tier 3 (GxP Validated)</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Update Personnel Details
          <IconButton onClick={() => setIsEditOpen(false)}><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              fullWidth 
              label="Username / Email" 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            />
            <TextField 
              fullWidth 
              label="Organization Unit" 
              value={formData.orgUnit} 
              onChange={(e) => setFormData({ ...formData, orgUnit: e.target.value })} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Reset Master Password</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary', mb: 3 }}>Enter your new password below. Requirements: 12+ chars, special char, case-sensitive.</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Current Password" type="password" />
            <TextField fullWidth label="New Password" type="password" />
            <TextField fullWidth label="Confirm Password" type="password" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => setIsPasswordOpen(false)}>Update Password</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
