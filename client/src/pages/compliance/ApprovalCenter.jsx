import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  alpha,
  Skeleton,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSignature,
  Maximize2,
  ChevronRight,
  Fingerprint,
  History,
  FileSearch,
  Users
} from 'lucide-react';
import api from '../../utils/api';
import SignatureModal from '../../components/compliance/SignatureModal';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @desc    Compliance Approval Center (GxP Gatekeeping Hub)
 * @purpose Centralized management of regulatory workflows and electronic signatures.
 */
const ApprovalCenter = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await api.get('/approvals/pending');
      if (response.data.success) {
        setPending(response.data.data);
      }
    } catch (err) {
      enqueueSnackbar('Failed to retrieve compliance task list.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSignModal = (id) => {
    setSelectedRequestId(id);
    setSignModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width="40%" height={60} />
        <Stack spacing={2} sx={{ mt: 4 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 4 }} />)}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>GxP COMPLIANCE LAYER</Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>Approval Center</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Centralized hub for managing non-repudiable electronic signatures and stage-gate regulatory workflows.
          </Typography>
        </Box>
        <Chip 
          icon={<ShieldCheck size={14} />} 
          label="21 CFR Part 11 Certified Workflow" 
          color="success" 
          variant="outlined" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* LEFT: PENDING SIGNATURES */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', minHeight: 600 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Awaiting My Signature</Typography>
              <Chip label={`${pending.length} Tasks`} size="small" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
            </Box>

            <AnimatePresence>
              {pending.length > 0 ? (
                <Stack spacing={2}>
                  {pending.map((req, idx) => (
                    <motion.div 
                      key={req.id} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: alpha('#3b82f6', 0.01), '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.2s' }}>
                        <Grid container alignItems="center">
                          <Grid item xs={12} sm={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                                WORKFLOW ID: {req.id.slice(0, 8)}
                              </Typography>
                              <Chip 
                                label={req.workflowType} 
                                size="small" 
                                variant="outlined" 
                                sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }} 
                              />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{req.description || 'Regulatory Strategic Review'}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Users size={14} /> Stage {req.currentStep} of {req.totalSteps} In-Progress
                            </Typography>
                            <Box sx={{ mt: 2, width: '80%' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={(req.currentStep / req.totalSteps) * 100} 
                                sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                            <Button 
                              variant="contained" 
                              startIcon={<Fingerprint size={18} />}
                              onClick={() => handleOpenSignModal(req.id)}
                              sx={{ py: 1, px: 3, borderRadius: 3, fontWeight: 900 }}
                            >
                              Sign Strategically
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </motion.div>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ p: 8, textAlign: 'center', bgcolor: alpha('#3b82f6', 0.02), borderRadius: 6, border: '1px dashed #e2e8f0' }}>
                  <CheckCircle2 size={48} color="#10b981" />
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: 'text.secondary' }}>Zero Pending Signatures</Typography>
                  <Typography variant="body2" color="text.secondary">All stage-gate approvals assigned to your account are reconciled.</Typography>
                </Box>
              )}
            </AnimatePresence>
          </Paper>
        </Grid>

        {/* RIGHT: COMPLIANCE STATS & HISTORY */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History size={20} color="#3b82f6" /> System Statistics
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>AVERAGE CYCLE TIME</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>4.2 Hours</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>GxP INTEGRITY FAILURES</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>0.00%</Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', minHeight: 300 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Recent Activity Audit</Typography>
              <List sx={{ p: 0 }}>
                {[1, 2, 3].map((item) => (
                  <ListItem key={item} sx={{ px: 0, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FileSignature size={20} color="#64748b" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Workflow Signed: US-PAT-00${item}`} 
                      secondary="Signature reconciled by IP Counsel"
                      primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button fullWidth endIcon={<ChevronRight size={16} />} sx={{ mt: 2, fontWeight: 800 }}>View Full Audit Trail</Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* ELECTRONIC SIGNATURE MODAL */}
      <SignatureModal 
        open={signModalOpen} 
        onClose={() => setSignModalOpen(false)}
        requestId={selectedRequestId}
        onSigned={() => {
          fetchPendingApprovals();
          enqueueSnackbar('Strategically signed electronic record and advanced workflow.', { variant: 'success' });
        }}
      />
    </Box>
  );
};

export default ApprovalCenter;
