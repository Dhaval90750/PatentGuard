import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  IconButton, 
  alpha,
  Divider,
  Alert
} from '@mui/material';
import { ShieldCheck, X, Lock, FileSignature, AlertCircle } from 'lucide-react';

/**
 * @desc    Electronic Signature Modal (21 CFR Part 11 Compliant)
 * @purpose Provides a secure, auditable confirmation layer for critical GxP actions.
 */
const SignatureModal = ({ open, onClose, onConfirm, actionType = 'AUTHENTICATION' }) => {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password) {
      setError('Password is required for identity verification.');
      return;
    }
    if (!reason) {
      setError('A reason for this action must be provided for audit traceability.');
      return;
    }
    
    // In a real GxP system, we would verify the password against the backend here.
    // For this simulation, we'll proceed if both fields are filled.
    onConfirm({ password, reason, timestamp: new Date().toISOString() });
    
    // Reset and close
    setPassword('');
    setReason('');
    setError('');
    onClose();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 6,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: 0,
    outline: 'none',
    overflow: 'hidden',
    border: '1px solid',
    borderColor: alpha('#1a56db', 0.1)
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ p: 3, bgcolor: alpha('#1a56db', 0.03), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1, bgcolor: alpha('#1a56db', 0.1), color: 'primary.main', borderRadius: 2 }}>
              <ShieldCheck size={24} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>Electronic Signature</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>21 CFR Part 11 Compliance Verification</Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Divider />

        {/* Body */}
        <Box sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            You are performing a critical action: <Typography component="span" variant="body2" sx={{ fontWeight: 900, color: 'error.main' }}>{actionType}</Typography>. 
            Verification of your identity and a reason for this action are required to maintain the audit trail.
          </Typography>

          {error && (
            <Alert severity="error" icon={<AlertCircle size={18} />} sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Identity Verification (Password)"
              type="password"
              variant="outlined"
              size="medium"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              InputProps={{
                startAdornment: <Lock size={18} style={{ marginRight: 8, color: '#64748b' }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              label="Reason for Action"
              multiline
              rows={3}
              variant="outlined"
              placeholder="e.g., Error correction, Administrative update, Regulatory requirement..."
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              InputProps={{
                startAdornment: <FileSignature size={18} style={{ marginRight: 8, marginTop: -45, color: '#64748b' }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, bgcolor: alpha('#f8fafc', 0.8), borderTop: '1px solid #f1f5f9' }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              onClick={onClose} 
              sx={{ fontWeight: 800, color: 'text.secondary', px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleConfirm}
              sx={{ 
                fontWeight: 900, 
                px: 4, 
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(26, 86, 219, 0.4)'
              }}
            >
              Sign & Confirm
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignatureModal;
