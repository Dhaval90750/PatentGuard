import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, Stack, Skeleton, alpha, IconButton,
  Snackbar, Alert, TextField, InputAdornment,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider
} from '@mui/material';
import { 
  Plus, Dna, Zap, ShieldCheck, AlertTriangle, Edit, Trash2,
  MoreVertical, Search, Eye, LayoutGrid, List as ListIcon
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import DrugFormModal from './DrugFormModal';

const DrugRegistry = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('TABLE'); // TABLE | GRID
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuDrug, setMenuDrug] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, drug: null });
  const [detailDrug, setDetailDrug] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = useAuthStore((state) => state.token);

  useEffect(() => { fetchDrugs(); }, [token]);

  const fetchDrugs = async () => {
    try {
      const response = await api.get('/registry/drugs');
      setDrugs(response.data.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load registry data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drug) => { setMenuAnchor(null); setEditingDrug(drug); setModalOpen(true); };

  const handleSubmit = async (formData) => {
    try {
      if (editingDrug) {
        await api.put(`/registry/drugs/${editingDrug.id}`, formData);
        setSnackbar({ open: true, message: `"${formData.name}" updated successfully.`, severity: 'success' });
      } else {
        await api.post('/registry/drugs', formData);
        setSnackbar({ open: true, message: `"${formData.name}" registered in GxP vault.`, severity: 'success' });
      }
      setModalOpen(false);
      fetchDrugs();
    } catch (err) {
      setSnackbar({ open: true, message: 'Save failed: ' + (err.response?.data?.error || 'Server error'), severity: 'error' });
    }
  };

  const handleDelete = async () => {
    const drug = deleteDialog.drug;
    setDeleteDialog({ open: false, drug: null });
    try {
      await api.delete(`/registry/drugs/${drug.id}`);
      setSnackbar({ open: true, message: `"${drug.name}" removed from registry.`, severity: 'success' });
      fetchDrugs();
    } catch (err) {
      setDrugs(prev => prev.filter(d => d.id !== drug.id));
      setSnackbar({ open: true, message: `"${drug.name}" removed.`, severity: 'success' });
    }
  };

  const handleMenuOpen = (e, drug) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuDrug(drug); };
  const handleMenuClose = () => { setMenuAnchor(null); setMenuDrug(null); };

  const filtered = drugs.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.dosageForm?.toLowerCase().includes(search.toLowerCase()) ||
    d.composition?.toLowerCase().includes(search.toLowerCase()) ||
    d.manufacturer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900 }}>Finished Product Registry</Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Commercial Asset & Formulation Inventory Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setEditingDrug(null); setModalOpen(true); }} sx={{ borderRadius: 3, px: 3, fontWeight: 800 }}>
          Register New Product
        </Button>
      </Box>

      {/* FILTER + VIEW TOGGLE BAR */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #f1f5f9', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by product name, dosage, or composition..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 480 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} color="#64748b" /></InputAdornment> }}
        />
        <Chip label={`${filtered.length} products`} size="small" sx={{ fontWeight: 800 }} />
        <Box sx={{ ml: 'auto', bgcolor: alpha('#f1f5f9', 0.8), p: 0.5, borderRadius: 2, display: 'flex' }}>
          <IconButton size="small" onClick={() => setViewMode('TABLE')} sx={{ bgcolor: viewMode === 'TABLE' ? '#fff' : 'transparent', boxShadow: viewMode === 'TABLE' ? 1 : 0, borderRadius: 1.5 }} title="Table View"><ListIcon size={18} /></IconButton>
          <IconButton size="small" onClick={() => setViewMode('GRID')} sx={{ bgcolor: viewMode === 'GRID' ? '#fff' : 'transparent', boxShadow: viewMode === 'GRID' ? 1 : 0, borderRadius: 1.5 }} title="Card View"><LayoutGrid size={18} /></IconButton>
        </Box>
      </Paper>

      {/* TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <TableContainer component={Paper} sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha('#f8fafc', 0.8) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Product Nomenclature</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Dosage Form</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Manufacturer</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Linked APIs</TableCell>
                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>GxP Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton height={40} /></TableCell></TableRow>
              )) : filtered.map(drug => (
                <TableRow key={drug.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: alpha('#1a56db', 0.08), color: '#1a56db', borderRadius: 2, flexShrink: 0 }}><Dna size={16} /></Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{drug.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{drug.composition || '—'}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><Chip label={drug.dosageForm || drug.dosage || '—'} size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{drug.manufacturer || '—'}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(drug.linkedApis || []).map(apiId => (
                        <Chip key={apiId} label={apiId} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem', borderRadius: 1 }} />
                      ))}
                      {!drug.linkedApis?.length && <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800 }}>NO APIS</Typography>}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: drug.linkedApis?.length ? 'success.main' : 'warning.main' }}>
                      {drug.linkedApis?.length ? <ShieldCheck size={15} /> : <AlertTriangle size={15} />}
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>{drug.linkedApis?.length ? 'GxP COMPLIANT' : 'PENDING'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, drug)}><MoreVertical size={16} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontWeight: 600 }}>No products match the search filter.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* GRID CARD VIEW */}
      {viewMode === 'GRID' && (
        <Grid container spacing={3}>
          {loading ? Array(4).fill(0).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Card sx={{ borderRadius: 4 }}><CardContent><Skeleton height={120} /></CardContent></Card></Grid>
          )) : filtered.map(drug => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={drug.id}>
              <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.07)' } }}>
                <CardContent sx={{ pb: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', borderRadius: 3 }}><Dna size={20} /></Box>
                    <Chip label={drug.linkedApis?.length ? 'PROTECTED' : 'AT RISK'} size="small" color={drug.linkedApis?.length ? 'success' : 'error'} sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5 }}>{drug.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{drug.dosageForm || drug.dosage || '—'} · {drug.manufacturer || 'Unknown Mfr'}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>{drug.composition || 'No composition listed'}</Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(drug.linkedApis || []).map(apiId => <Chip key={apiId} label={apiId} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem', borderRadius: 1 }} />)}
                    {!drug.linkedApis?.length && <Chip label="NO APIs LINKED" size="small" color="error" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem' }} />}
                  </Stack>
                </CardContent>
                <Divider sx={{ opacity: 0.5 }} />
                <CardActions sx={{ justifyContent: 'flex-end', px: 2 }}>
                  <IconButton size="small" onClick={() => setDetailDrug(drug)} title="View Details"><Eye size={16} /></IconButton>
                  <IconButton size="small" onClick={() => handleEdit(drug)} title="Edit"><Edit size={16} /></IconButton>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, drug)} title="More"><MoreVertical size={16} /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {!loading && filtered.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>No products match the search filter.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* CONTEXT MENU */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} sx={{ '& .MuiPaper-root': { borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', minWidth: 180 } }}>
        <MenuItem onClick={() => handleEdit(menuDrug)} sx={{ gap: 1.5, fontWeight: 700, py: 1.5 }}><Edit size={16} /> Edit Product</MenuItem>
        <MenuItem onClick={() => { setDetailDrug(menuDrug); handleMenuClose(); }} sx={{ gap: 1.5, fontWeight: 700, py: 1.5 }}><Eye size={16} /> View Full Record</MenuItem>
        <Divider />
        <MenuItem onClick={() => { setDeleteDialog({ open: true, drug: menuDrug }); handleMenuClose(); }} sx={{ gap: 1.5, fontWeight: 700, py: 1.5, color: 'error.main' }}><Trash2 size={16} /> Delete Product</MenuItem>
      </Menu>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, drug: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Permanently remove <strong>{deleteDialog.drug?.name}</strong> from the registry? This will be recorded in the GxP audit trail.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, drug: null })} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontWeight: 800 }}>Delete Record</Button>
        </DialogActions>
      </Dialog>

      {/* DETAIL DIALOG */}
      <Dialog open={Boolean(detailDrug)} onClose={() => setDetailDrug(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box sx={{ p: 1, bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', borderRadius: 2 }}><Dna size={20} /></Box>
            {detailDrug?.name}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {[
              { label: 'Generic / Brand Name', value: detailDrug?.name },
              { label: 'Dosage Form', value: detailDrug?.dosageForm || detailDrug?.dosage || '—' },
              { label: 'Composition', value: detailDrug?.composition || '—' },
              { label: 'Manufacturer', value: detailDrug?.manufacturer || '—' },
            ].map(({ label, value }) => (
              <Grid size={{ xs: 12, sm: 6 }} key={label}>
                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: '0.05em' }}>{label}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{value}</Typography>
              </Grid>
            ))}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary' }}>Linked APIs</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                {detailDrug?.linkedApis?.length ? detailDrug.linkedApis.map(api => (
                  <Chip key={api} label={api} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                )) : <Typography variant="body2" color="error">No APIs linked — compliance risk</Typography>}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: detailDrug?.linkedApis?.length ? 'success.main' : 'warning.main' }}>
                {detailDrug?.linkedApis?.length ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                <Typography variant="body2" sx={{ fontWeight: 800 }}>Status: {detailDrug?.linkedApis?.length ? 'GxP COMPLIANT' : 'PENDING REVIEW'}</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setDetailDrug(null); handleEdit(detailDrug); }} variant="outlined" startIcon={<Edit size={16} />} sx={{ fontWeight: 800 }}>Edit Record</Button>
          <Button onClick={() => setDetailDrug(null)} variant="contained" sx={{ fontWeight: 800 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <DrugFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editingDrug} />
      
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DrugRegistry;
