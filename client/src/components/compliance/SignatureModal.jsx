import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  alpha,
  Divider,
  CircularProgress
} from '@mui/material';
import { ShieldCheck, Lock, Fingerprint, Info } from 'lucide-react';
import api from '../../utils/api';
import { useSnackbar } from 'notistack';

/**
 * @desc    Electronic Signature Modal (GxP Compliance Layer)
 * @purpose Implements password-verified 21 CFR Part 11 compliant signatures.
 */
const SignatureModal = ({ open, onClose, requestId, onSigned }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('Reviewer Approval');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signatureMeanings = [
    'Authorship',
    'Reviewer Approval',
    'Technical Verification',
    'Quality Assurance Finalization',
    'Strategic IP Confirmation'
  ];

  const handleSign = async () => {
    if (!password) {
      setError('Electronic signature requires password re-entry for non-repudiation.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/approvals/sign', {
        requestId,
        password,
        reason
      });

      if (response.data.success) {
        enqueueSnackbar('Electronic Signature Recorded Successfully.', { variant: 'success' });
        onSigned();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Signature Failure: Credentials invalid.';
      setError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
      setPassword(''); // Always clear password
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 4, width: 450, p: 1 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: '50%', bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}>
            <ShieldCheck size={32} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Electronic Signature</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
          You are about to perform a non-repudiable electronic signature. This action will be logged in the permanent audit trail with your identity and role.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'left', fontWeight: 700 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Meaning of Signature</InputLabel>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              label="Meaning of Signature"
              sx={{ textAlign: 'left' }}
            >
              {signatureMeanings.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="password"
            label="Verify Identity Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: <Lock size={18} style={{ marginRight: 12, opacity: 0.5 }} />
            }}
          />
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Info size={18} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', fontWeight: 700 }}>
            Compliance Reminder: Intentional electronic signature is legally equivalent to a handwritten signature under 21 CFR Part 11.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading} sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleSign}
          disabled={loading}
          fullWidth
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 900 }}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Fingerprint size={18} />}
        >
          Sign Electronically
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignatureModal;
