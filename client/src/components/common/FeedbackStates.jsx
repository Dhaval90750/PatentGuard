import React from 'react';
import { Box, Paper, Stack, Typography, Button, alpha } from '@mui/material';
import { SearchX, AlertCircle, RefreshCw, FileQuestion } from 'lucide-react';

/**
 * @desc    Enterprise Empty State (V5.1 Fulfillment)
 * @purpose Senior interaction pattern for "No Data Found" scenarios.
 */
export const EmptyState = ({ 
  title = "No Records Provisioned", 
  message = "System integrity is nominal, but no data matches your strategic filter.",
  actionLabel,
  onAction,
  icon: Icon = FileQuestion
}) => (
  <Paper sx={{ 
    p: 8, 
    textAlign: 'center', 
    borderRadius: 6, 
    border: '1px dashed #cbd5e1', 
    bgcolor: 'transparent',
    boxShadow: 'none'
  }}>
    <Box sx={{ p: 3, bgcolor: alpha('#94a3b8', 0.1), borderRadius: '50%', display: 'inline-flex', color: '#64748b', mb: 3 }}>
       <Icon size={48} />
    </Box>
    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', fontWeight: 600 }}>{message}</Typography>
    {actionLabel && (
      <Button 
        variant="contained" 
        onClick={onAction} 
        sx={{ borderRadius: 3, fontWeight: 800, px: 4 }}
      >
        {actionLabel}
      </Button>
    )}
  </Paper>
);

/**
 * @desc    Standardized GxP Error Boundary / State
 */
export const ErrorState = ({ 
  error = "Regulatory Pulse Interrupted", 
  onRetry 
}) => (
  <Paper sx={{ 
    p: 8, 
    textAlign: 'center', 
    borderRadius: 6, 
    border: '1px solid #fee2e2', 
    bgcolor: alpha('#ef4444', 0.02),
    boxShadow: 'none'
  }}>
     <Box sx={{ p: 3, bgcolor: alpha('#ef4444', 0.1), borderRadius: '50%', display: 'inline-flex', color: '#ef4444', mb: 3 }}>
        <AlertCircle size={48} />
     </Box>
     <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#ef4444' }}>System Error Detected</Typography>
     <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600 }}>{error}</Typography>
     <Button 
       variant="outlined" 
       color="error"
       startIcon={<RefreshCw size={18} />}
       onClick={onRetry}
       sx={{ borderRadius: 3, fontWeight: 800, px: 4 }}
     >
       Retry GxP Sync
     </Button>
  </Paper>
);
