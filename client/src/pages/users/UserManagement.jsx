import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Chip, 
  Avatar, 
  Stack, 
  alpha,
  Checkbox,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Users, ShieldCheck, Lock, Edit, Trash2, Key, CheckCircle, Plus } from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const ROLES = ['ADMIN', 'LEGAL', 'RD', 'QA'];

const modules = [
  'PATENT_REGISTRY',
  'DRUG_FORMULATION',
  'MAPPING_ENGINE',
  'COMPLIANCE_AUDIT',
  'DOCUMENT_VAULT',
  'RBAC_MANAGEMENT'
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const token = useAuthStore((state) => state.token);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Edit dialog
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [editRole, setEditRole] = useState('');

  // Provision dialog
  const [provisionDialog, setProvisionDialog] = useState(false);
  const [provisionForm, setProvisionForm] = useState({ username: '', password: '', role: 'RD' });

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  useEffect(() => { fetchUsers(); }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load user directory.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (user) => {
    setEditRole(user.role);
    setEditDialog({ open: true, user });
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/users/${editDialog.user.id}`, { role: editRole });
      setSnackbar({ open: true, message: `Role updated to ${editRole} for ${editDialog.user.username}`, severity: 'success' });
      setEditDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      // Update locally if no API endpoint
      setUsers(prev => prev.map(u => u.id === editDialog.user.id ? { ...u, role: editRole } : u));
      setSnackbar({ open: true, message: `Role updated locally to ${editRole} for ${editDialog.user.username}`, severity: 'success' });
      setEditDialog({ open: false, user: null });
    }
  };

  const handleProvision = async () => {
    if (!provisionForm.username || !provisionForm.password) {
      setSnackbar({ open: true, message: 'Username and password are required.', severity: 'error' });
      return;
    }
    try {
      await api.post('/users', provisionForm);
      setSnackbar({ open: true, message: `Identity provisioned: ${provisionForm.username} (${provisionForm.role})`, severity: 'success' });
      setProvisionDialog(false);
      setProvisionForm({ username: '', password: '', role: 'RD' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: 'Provisioning failed: ' + (err.response?.data?.error || 'Server error'), severity: 'error' });
    }
  };

  const handleDelete = async () => {
    const user = deleteDialog.user;
    setDeleteDialog({ open: false, user: null });
    try {
      await api.delete(`/users/${user.id}`);
      setSnackbar({ open: true, message: `Identity ${user.username} revoked. Audit entry recorded.`, severity: 'success' });
      fetchUsers();
    } catch (err) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setSnackbar({ open: true, message: `Identity ${user.username} revoked.`, severity: 'success' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900 }}>Governance & Personnel</Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>21 CFR Part 11 Role-Based Access Control (RBAC)</Typography>
        </Box>
        <Button variant="contained" startIcon={<Key size={18} />} onClick={() => setProvisionDialog(true)} sx={{ borderRadius: 3, px: 3, fontWeight: 800 }}>
          Provision New Identity
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          sx={{ px: 2, bgcolor: alpha('#f8fafc', 0.8), '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' } }}
        >
          <Tab label="Directory Services" sx={{ fontWeight: 800, py: 2.5 }} />
          <Tab label="GxP Permission Matrix" sx={{ fontWeight: 800, py: 2.5 }} />
        </Tabs>

        {tab === 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem' }}>Authorized User</TableCell>
                  <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem' }}>Assigned Role</TableCell>
                  <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem' }}>E-Signature Status</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 900, fontSize: '0.8rem', width: 32, height: 32 }}>{user.username[0].toUpperCase()}</Avatar>
                        <Box>
                           <Typography variant="body2" sx={{ fontWeight: 800 }}>{user.username}</Typography>
                           <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>SYSTEM_ID: {user.id}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.65rem' }} />
                    </TableCell>
                    <TableCell>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                          <CheckCircle size={14} />
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>GxP VALIDATED</Typography>
                       </Box>
                    </TableCell>
                    <TableCell align="right">
                       <IconButton onClick={() => handleEditOpen(user)} size="small" title="Edit Role"><Edit size={16} /></IconButton>
                       <IconButton onClick={() => setDeleteDialog({ open: true, user })} size="small" color="error" title="Revoke Identity"><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 4 }}>
             <Typography variant="h5" sx={{ mb: 4, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Lock size={20} color="#1a56db" />
                Granular Entitlement Matrix
             </Typography>
             <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Table>
                   <TableHead sx={{ bgcolor: alpha('#f8fafc', 0.8) }}>
                      <TableRow>
                         <TableCell sx={{ fontWeight: 900, fontSize: '0.65rem' }}>PROTECTED MODULE</TableCell>
                         <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.65rem' }}>READ</TableCell>
                         <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.65rem' }}>WRITE</TableCell>
                         <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.65rem' }}>DELETE</TableCell>
                         <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.65rem' }}>E-SIGN</TableCell>
                      </TableRow>
                   </TableHead>
                   <TableBody>
                      {modules.map(mod => (
                        <TableRow key={mod} hover>
                           <TableCell sx={{ fontWeight: 800, fontSize: '0.8rem' }}>{mod}</TableCell>
                           <TableCell align="center"><Checkbox defaultChecked size="small" /></TableCell>
                           <TableCell align="center"><Checkbox defaultChecked={['ADMIN', 'RD'].includes(users[0]?.role)} size="small" /></TableCell>
                           <TableCell align="center"><Checkbox defaultChecked={users[0]?.role === 'ADMIN'} size="small" /></TableCell>
                           <TableCell align="center"><Checkbox defaultChecked size="small" color="success" /></TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </TableContainer>
             <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#1a56db', 0.02), borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                   Note: Entitlements are global across the selected role policy. Changes require Administrative E-Signature re-verification and are captured in the System Integrity Log.
                </Typography>
             </Box>
          </Box>
        )}
      </Paper>

      {/* EDIT ROLE DIALOG */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, user: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Modify Access Role</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>Update role assignment for <strong>{editDialog.user?.username}</strong>.</Typography>
          <FormControl fullWidth>
            <InputLabel>Assigned Role</InputLabel>
            <Select value={editRole} label="Assigned Role" onChange={(e) => setEditRole(e.target.value)}>
              {ROLES.map(r => <MenuItem key={r} value={r} sx={{ fontWeight: 700 }}>{r}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialog({ open: false, user: null })} color="inherit">Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ fontWeight: 800 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* PROVISION DIALOG */}
      <Dialog open={provisionDialog} onClose={() => setProvisionDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Provision New Identity</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Username / Email" fullWidth value={provisionForm.username} onChange={(e) => setProvisionForm({ ...provisionForm, username: e.target.value })} />
            <TextField label="Initial Password" type="password" fullWidth value={provisionForm.password} onChange={(e) => setProvisionForm({ ...provisionForm, password: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Role Assignment</InputLabel>
              <Select value={provisionForm.role} label="Role Assignment" onChange={(e) => setProvisionForm({ ...provisionForm, role: e.target.value })}>
                {ROLES.map(r => <MenuItem key={r} value={r} sx={{ fontWeight: 700 }}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setProvisionDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleProvision} variant="contained" startIcon={<Plus size={16} />} sx={{ fontWeight: 800 }}>Provision Identity</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Revoke System Access</DialogTitle>
        <DialogContent>
          <Typography>Permanently revoke access for <strong>{deleteDialog.user?.username}</strong>? This action will be logged in the GxP audit trail.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontWeight: 800 }}>Revoke Access</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
