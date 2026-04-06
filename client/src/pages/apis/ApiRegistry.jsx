import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Chip, Stack, Skeleton,
  alpha, IconButton, Snackbar, Alert, TextField, InputAdornment, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, TablePagination
} from '@mui/material';
import { FlaskConical, Plus, Search, Edit, Trash2, MoreVertical, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const ApiRegistry = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuApi, setMenuApi] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, api: null });
  const [detailApi, setDetailApi] = useState(null);
  const [formDialog, setFormDialog] = useState({ open: false, api: null });
  const [formData, setFormData] = useState({ name: '', molecularFormula: '', manufacturer: '' });
  const [page, setPage] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = useAuthStore((state) => state.token);

  useEffect(() => { fetchApis(); }, [token]);

  const fetchApis = async () => {
    try {
      const res = await api.get('/registry/apis');
      setApis(res.data.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load API registry.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (e, api) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuApi(api); };
  const handleMenuClose = () => { setMenuAnchor(null); setMenuApi(null); };

  const openForm = (api = null) => {
    setFormData(api ? { name: api.name, molecularFormula: api.molecularFormula || '', manufacturer: api.manufacturer || '' } : { name: '', molecularFormula: '', manufacturer: '' });
    setFormDialog({ open: true, api });
    handleMenuClose();
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) { setSnackbar({ open: true, message: 'API name is required.', severity: 'error' }); return; }
    try {
      if (formDialog.api) {
        await api.put(`/registry/apis/${formDialog.api.id}`, formData);
        setSnackbar({ open: true, message: `"${formData.name}" updated.`, severity: 'success' });
      } else {
        await api.post('/registry/apis', formData);
        setSnackbar({ open: true, message: `"${formData.name}" registered in API vault.`, severity: 'success' });
      }
      setFormDialog({ open: false, api: null });
      fetchApis();
    } catch (err) {
      setSnackbar({ open: true, message: 'Save failed: ' + (err.response?.data?.error || 'Server error'), severity: 'error' });
    }
  };

  const handleDelete = async () => {
    const api = deleteDialog.api;
    setDeleteDialog({ open: false, api: null });
    try {
      await api.delete(`/registry/apis/${api.id}`);
      setSnackbar({ open: true, message: `"${api.name}" removed from registry.`, severity: 'success' });
      fetchApis();
    } catch (err) {
      setApis(prev => prev.filter(a => a.id !== api.id));
      setSnackbar({ open: true, message: `"${api.name}" removed.`, severity: 'success' });
    }
  };

  const filtered = apis.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.molecularFormula?.toLowerCase().includes(search.toLowerCase()) ||
    a.manufacturer?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * 15, page * 15 + 15);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900 }}>API Ingredient Registry</Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Active Pharmaceutical Ingredients — Molecular & IP Coverage Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => openForm()} sx={{ borderRadius: 3, px: 3, fontWeight: 800 }}>Register New API</Button>
      </Box>

      {/* SEARCH */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #f1f5f9', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search by name, formula, or manufacturer..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ maxWidth: 480 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} color="#64748b" /></InputAdornment> }}
        />
        <Chip label={`${filtered.length} ingredients`} size="small" sx={{ fontWeight: 800 }} />
      </Paper>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {loading ? Array(3).fill(0).map((_, i) => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}><Card sx={{ borderRadius: 4 }}><CardContent><Skeleton height={80} /></CardContent></Card></Grid>
        )) : [
          { label: 'Total APIs', value: apis.length, color: '#2563eb' },
          { label: 'With Patent Coverage', value: apis.filter(a => a.linkedPatents?.length > 0).length, color: '#10b981' },
          { label: 'Coverage Gap (Risk)', value: apis.filter(a => !a.linkedPatents?.length).length, color: '#ef4444' }
        ].map(card => (
          <Grid size={{ xs: 12, sm: 4 }} key={card.label}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <CardContent>
                <Box sx={{ p: 1.5, bgcolor: alpha(card.color, 0.1), color: card.color, borderRadius: 3, width: 'fit-content', mb: 2 }}>
                  <FlaskConical size={20} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: card.color }}>{card.value}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{card.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha('#f8fafc', 0.8) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>API Common Name</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Molecular Formula</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Manufacturer</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Patent Coverage</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>IP Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton height={40} /></TableCell></TableRow>
              )) : paginated.map(api => (
                <TableRow key={api.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 800 }}>{api.name}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.secondary' }}>{api.molecularFormula || '—'}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{api.manufacturer || '—'}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {api.linkedPatents?.length ? api.linkedPatents.map(pid => (
                        <Chip key={pid} label={pid} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem', borderRadius: 1 }} />
                      )) : <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800 }}>NO PATENTS</Typography>}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: api.linkedPatents?.length ? 'success.main' : 'error.main' }}>
                      {api.linkedPatents?.length ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>{api.linkedPatents?.length ? 'PROTECTED' : 'UNPROTECTED'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, api)}><MoreVertical size={16} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={15} rowsPerPageOptions={[15]} sx={{ borderTop: '1px solid #f1f5f9' }} />
      </Paper>

      {/* CONTEXT MENU */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} sx={{ '& .MuiPaper-root': { borderRadius: 3, minWidth: 180, border: '1px solid #e2e8f0' } }}>
        <MenuItem onClick={() => openForm(menuApi)} sx={{ gap: 1.5, fontWeight: 700, py: 1.5 }}><Edit size={16} /> Edit API</MenuItem>
        <MenuItem onClick={() => { setDetailApi(menuApi); handleMenuClose(); }} sx={{ gap: 1.5, fontWeight: 700, py: 1.5 }}><Eye size={16} /> View Details</MenuItem>
        <Divider />
        <MenuItem onClick={() => { setDeleteDialog({ open: true, api: menuApi }); handleMenuClose(); }} sx={{ gap: 1.5, fontWeight: 700, py: 1.5, color: 'error.main' }}><Trash2 size={16} /> Delete API</MenuItem>
      </Menu>

      {/* FORM DIALOG */}
      <Dialog open={formDialog.open} onClose={() => setFormDialog({ open: false, api: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #f1f5f9' }}>{formDialog.api ? 'Update API Record' : 'Register New API'}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField label="API Common Name *" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Molecular Formula" fullWidth placeholder="e.g. C24H30O5" value={formData.molecularFormula} onChange={(e) => setFormData({ ...formData, molecularFormula: e.target.value })} />
            <TextField label="Manufacturer" fullWidth placeholder="e.g. Zenith Labs API Division" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setFormDialog({ open: false, api: null })} color="inherit">Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" sx={{ fontWeight: 800 }}>{formDialog.api ? 'Save Changes' : 'Register API'}</Button>
        </DialogActions>
      </Dialog>

      {/* DETAIL DIALOG */}
      <Dialog open={Boolean(detailApi)} onClose={() => setDetailApi(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #f1f5f9' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box sx={{ p: 1, bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', borderRadius: 2 }}><FlaskConical size={20} /></Box>
            {detailApi?.name}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {[
              { label: 'Common Name', value: detailApi?.name },
              { label: 'Molecular Formula', value: detailApi?.molecularFormula || '—' },
              { label: 'Manufacturer', value: detailApi?.manufacturer || '—' },
            ].map(({ label, value }) => (
              <Grid size={{ xs: 12, sm: 6 }} key={label}>
                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, fontFamily: label.includes('Formula') ? 'monospace' : 'inherit' }}>{value}</Typography>
              </Grid>
            ))}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary' }}>Linked Patents</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                {detailApi?.linkedPatents?.length ? detailApi.linkedPatents.map(pid => (
                  <Chip key={pid} label={pid} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                )) : <Typography variant="body2" color="error">No patents linked — IP risk</Typography>}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDetailApi(null)} variant="contained" sx={{ fontWeight: 800 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, api: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Permanently remove <strong>{deleteDialog.api?.name}</strong> from the API registry? This will be recorded in the GxP audit trail.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, api: null })} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontWeight: 800 }}>Delete Record</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiRegistry;
