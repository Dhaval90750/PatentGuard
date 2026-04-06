import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, IconButton, TextField, InputAdornment, 
  Skeleton, Snackbar, Alert, Collapse, Stack, alpha, Grid, Card, CardContent,
  TablePagination, TableSortLabel, LinearProgress, Divider
} from '@mui/material';
import { 
  Plus, Search, Download, ChevronDown, ChevronUp, FileText, Calendar,
  User as UserIcon, ShieldCheck, Zap, Edit, Trash2, AlertTriangle,
  List as ListIcon, Clock, Globe
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import PatentFormModal from './PatentFormModal';
import SignatureModal from '../../components/common/SignatureModal';
import { exportToCSV } from '../../utils/exportUtils';
import { useSearchParams } from 'react-router-dom';

// ─── Expandable Row ───────────────────────────────────────────────────────────
const PatentRow = ({ row, onEdit, onDelete, getStatusColor }) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const expiry = new Date(row.expiryDate);
  const filing = new Date(row.filingDate);
  const totalLife = (expiry - filing) / (1000 * 60 * 60 * 24 * 365);
  const elapsed = (today - filing) / (1000 * 60 * 60 * 24 * 365);
  const progress = Math.min(100, Math.max(0, (elapsed / totalLife) * 100));
  const yearsLeft = Math.max(0, (expiry - today) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
  const isExpiringSoon = expiry > today && expiry <= new Date(today.setMonth(today.getMonth() + 18));

  return (
    <React.Fragment>
      <TableRow 
        hover 
        sx={{ 
          '& > *': { borderBottom: 'unset !important' },
          bgcolor: open ? alpha('#1a56db', 0.02) : 'transparent',
          transition: 'background 0.2s'
        }}
      >
        <TableCell sx={{ width: 50 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: 'primary.main' }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {isExpiringSoon && <AlertTriangle size={14} color="#f59e0b" />}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{row.patentNumber}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{row.title}</Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Globe size={13} color="#64748b" />
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.jurisdiction}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Chip label={row.status} color={getStatusColor(row.status)} size="small" sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.65rem' }} />
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 800, color: isExpiringSoon ? 'warning.main' : 'error.main' }}>
            {new Date(row.expiryDate).toLocaleDateString()}
          </Typography>
          {row.status !== 'EXPIRED' && <Typography variant="caption" sx={{ color: isExpiringSoon ? 'warning.main' : 'text.secondary', fontWeight: 700 }}>{yearsLeft} yrs left</Typography>}
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton size="small" onClick={() => onEdit(row)} sx={{ color: '#64748b' }}><Edit size={16} /></IconButton>
            <IconButton size="small" onClick={() => onDelete(row)} sx={{ color: '#ef4444' }}><Trash2 size={16} /></IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* EXPANDED DETAIL ROW */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, bgcolor: alpha('#1a56db', 0.02), borderRadius: 2, m: 1 }}>
              <Grid container spacing={4} alignItems="flex-start">
                {/* Life Span Progress Bar */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main' }}>IP Lifecycle Progress</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>Filing: {new Date(row.filingDate).toLocaleDateString()}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>Expiry: {new Date(row.expiryDate).toLocaleDateString()}</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ 
                        height: 10, borderRadius: 5,
                        bgcolor: alpha('#e2e8f0', 0.8),
                        '& .MuiLinearProgress-bar': { 
                          bgcolor: row.status === 'EXPIRED' ? '#ef4444' : isExpiringSoon ? '#f59e0b' : '#10b981',
                          borderRadius: 5
                        }
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{progress.toFixed(1)}% elapsed</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: isExpiringSoon ? 'warning.main' : 'text.secondary' }}>
                        {row.status === 'EXPIRED' ? 'EXPIRED' : `${yearsLeft} years remaining`}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>

                {/* Inventors */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main' }}>Inventorship</Typography>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {(row.inventors || []).map((inv, i) => (
                      <Stack key={i} direction="row" spacing={1} alignItems="center">
                        <UserIcon size={14} color="#94a3b8" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{inv}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Grid>

                {/* Strategy Score */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main' }}>Strategy Score</Typography>
                  <Card sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 3 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: alpha(isExpiringSoon ? '#f59e0b' : '#10b981', 0.1), color: isExpiringSoon ? '#f59e0b' : '#10b981', borderRadius: 2 }}>
                          {isExpiringSoon ? <AlertTriangle size={18} /> : <Zap size={18} />}
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>
                            {isExpiringSoon ? 'ACTION REQUIRED' : 'REMAINING LIFE'}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: isExpiringSoon ? 'warning.main' : 'inherit' }}>
                            {row.status === 'EXPIRED' ? 'EXPIRED' : `${yearsLeft} Yrs`}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

// ─── Timeline Card ─────────────────────────────────────────────────────────────
const TimelineCard = ({ patent, getStatusColor }) => {
  const today = new Date();
  const expiry = new Date(patent.expiryDate);
  const filing = new Date(patent.filingDate);
  const totalLife = (expiry - filing) / (1000 * 60 * 60 * 24 * 365);
  const elapsed = (today - filing) / (1000 * 60 * 60 * 24 * 365);
  const progress = Math.min(100, Math.max(0, (elapsed / totalLife) * 100));
  const yearsLeft = Math.max(0, (expiry - today) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
  const isExpiringSoon = expiry > today && (expiry - today) / (1000 * 60 * 60 * 24 * 365) < 1.5;
  const isExpired = patent.status === 'EXPIRED' || expiry < today;

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${isExpired ? '#fee2e2' : isExpiringSoon ? '#fef3c7' : '#e2e8f0'}`, boxShadow: 'none', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Chip label={patent.patentNumber} size="small" color="primary" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.65rem', fontFamily: 'monospace' }} />
            <Chip label={patent.jurisdiction} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem', bgcolor: '#f1f5f9' }} />
          </Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>{patent.title}</Typography>
        </Box>
        <Chip label={patent.status} color={getStatusColor(patent.status)} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', ml: 1, flexShrink: 0 }} />
      </Stack>

      {/* Timeline Bar */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Calendar size={11} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>Filed {new Date(patent.filingDate).getFullYear()}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Clock size={11} color={isExpiringSoon ? '#f59e0b' : '#94a3b8'} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: isExpiringSoon ? 'warning.main' : isExpired ? 'error.main' : 'text.secondary', fontSize: '0.65rem' }}>
              {isExpired ? 'EXPIRED' : `${yearsLeft} yrs left`}  · {new Date(patent.expiryDate).getFullYear()}
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ position: 'relative', height: 8, bgcolor: '#f1f5f9', borderRadius: 4 }}>
          <Box sx={{ 
            position: 'absolute', left: 0, top: 0, bottom: 0, 
            width: `${progress}%`, borderRadius: 4,
            bgcolor: isExpired ? '#ef4444' : isExpiringSoon ? '#f59e0b' : '#10b981',
            transition: 'width 0.5s ease'
          }} />
          {!isExpired && (
            <Box sx={{ 
              position: 'absolute', left: `${Math.min(progress, 96)}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12, height: 12, borderRadius: '50%',
              bgcolor: isExpiringSoon ? '#f59e0b' : '#10b981',
              border: '2px solid #fff', boxShadow: '0 0 0 2px ' + (isExpiringSoon ? '#f59e0b' : '#10b981')
            }} />
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={0.75} alignItems="center">
          <UserIcon size={12} color="#94a3b8" />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>{(patent.inventors || []).join(', ')}</Typography>
        </Stack>
        {isExpiringSoon && !isExpired && (
          <Chip icon={<AlertTriangle size={10} />} label="EXPIRING SOON" size="small" color="warning" sx={{ fontWeight: 900, fontSize: '0.55rem', height: 20 }} />
        )}
      </Stack>
    </Paper>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const PatentList = () => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expiryFilter, setExpiryFilter] = useState(false); // "About to Expire" toggle
  const [viewMode, setViewMode] = useState('TABLE'); // TABLE | TIMELINE
  const [sortBy, setSortBy] = useState('patentNumber');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatent, setEditingPatent] = useState(null);
  const [signatureModal, setSignatureModal] = useState({ open: false, targetId: null, action: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const searchStr = searchParams.get('search');
    if (searchStr) setSearch(searchStr);
    fetchPatents();
  }, [token, searchParams]);

  const fetchPatents = async () => {
    try {
      const response = await api.get('/patents');
      setPatents(response.data.data);
    } catch (err) {
      console.error('Portfolio Retrieval Sync Failure:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingPatent ? `/patents/${editingPatent.id}` : '/patents';
      const method = editingPatent ? 'put' : 'post';
      await api[method](url, formData);
      setSnackbar({ open: true, message: 'Patent Registry Updated', severity: 'success' });
      setModalOpen(false);
      fetchPatents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Registry Error: ' + (err.response?.data?.error || 'Server error'), severity: 'error' });
    }
  };

  const handleDelete = async (id, reason) => {
    try {
      await api.delete(`/patents/${id}`, { data: { reason } });
      setSnackbar({ open: true, message: 'Patent Successfully Retired (Audit Recorded)', severity: 'success' });
      fetchPatents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Retirement Error: ' + (err.response?.data?.error || 'Server error'), severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GRANTED': return 'success';
      case 'FILED': return 'primary';
      case 'EXAMINATION': return 'warning';
      case 'EXPIRED': return 'error';
      default: return 'default';
    }
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
    setPage(0);
  };

  const today = new Date();
  const in18Months = new Date(); in18Months.setMonth(in18Months.getMonth() + 18);

  const STATUS_OPTIONS = ['ALL', 'GRANTED', 'FILED', 'EXAMINATION', 'EXPIRED'];

  const filtered = patents
    .filter(p => statusFilter === 'ALL' || p.status === statusFilter)
    .filter(p => !expiryFilter || (new Date(p.expiryDate) <= in18Months && new Date(p.expiryDate) > today))
    .filter(p =>
      (p.patentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.jurisdiction || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let av = a[sortBy] ?? ''; let bv = b[sortBy] ?? '';
      if (sortBy === 'expiryDate') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const expiringCount = patents.filter(p => new Date(p.expiryDate) <= in18Months && new Date(p.expiryDate) > today).length;

  return (
    <Box className="fade-in">
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>INTELLECTUAL PROPERTY ASSETS</Typography>
          <Typography variant="h1" sx={{ mb: 1 }}>Pharma IPC Portfolio</Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Global Intellectual Property Protection Registry & GxP Compliance Ledger
          </Typography>
        </Box>
        <Stack direction="row" spacing={2.5}>
          <Button variant="outlined" startIcon={<Download size={18} />} onClick={() => exportToCSV(patents, 'IPC_Portfolio')} sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}>Export Portfolio</Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setEditingPatent(null); setModalOpen(true); }} sx={{ borderRadius: 3, px: 4, fontWeight: 900, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>File New Patent</Button>
        </Stack>
      </Box>

      {/* FILTER BAR */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 3, bgcolor: alpha('#f8fafc', 0.5), backdropFilter: 'blur(8px)', flexWrap: 'wrap' }}>
        <TextField
          variant="outlined" size="small"
          placeholder="Search by Patent ID, Title, or Jurisdiction..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 3 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} color="#64748b" /></InputAdornment> }}
        />

        {/* Status chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {STATUS_OPTIONS.map(s => (
            <Chip
              key={s} label={s}
              onClick={() => { setStatusFilter(s); setExpiryFilter(false); setPage(0); }}
              color={statusFilter === s && !expiryFilter ? getStatusColor(s === 'ALL' ? 'GRANTED' : s) : 'default'}
              variant={statusFilter === s && !expiryFilter ? 'filled' : 'outlined'}
              size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', cursor: 'pointer' }}
            />
          ))}
          {/* Expiry special filter */}
          <Chip
            label={`⚠ Expiring Soon (${expiringCount})`}
            onClick={() => { setExpiryFilter(f => !f); setStatusFilter('ALL'); setPage(0); }}
            color={expiryFilter ? 'warning' : 'default'}
            variant={expiryFilter ? 'filled' : 'outlined'}
            size="small"
            sx={{ fontWeight: 900, fontSize: '0.65rem', cursor: 'pointer' }}
          />
        </Stack>

        <Chip label={`${filtered.length} results`} size="small" sx={{ fontWeight: 800 }} />

        {/* View mode toggle */}
        <Box sx={{ ml: 'auto', bgcolor: alpha('#f1f5f9', 0.8), p: 0.5, borderRadius: 2, display: 'flex' }}>
          <IconButton size="small" onClick={() => setViewMode('TABLE')} title="Table View" sx={{ bgcolor: viewMode === 'TABLE' ? '#fff' : 'transparent', boxShadow: viewMode === 'TABLE' ? 1 : 0, borderRadius: 1.5 }}><ListIcon size={18} /></IconButton>
          <IconButton size="small" onClick={() => setViewMode('TIMELINE')} title="Timeline View" sx={{ bgcolor: viewMode === 'TIMELINE' ? '#fff' : 'transparent', boxShadow: viewMode === 'TIMELINE' ? 1 : 0, borderRadius: 1.5 }}><Calendar size={18} /></IconButton>
        </Box>
      </Paper>

      {/* TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <Paper sx={{ borderRadius: 6, border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 64 }} />
                  <TableCell>
                    <TableSortLabel active={sortBy === 'patentNumber'} direction={sortBy === 'patentNumber' ? sortDir : 'asc'} onClick={() => handleSort('patentNumber')} sx={{ fontWeight: 900, fontSize: '0.75rem' }}>PATENT IDENTIFIER / ASSET TITLE</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === 'jurisdiction'} direction={sortBy === 'jurisdiction' ? sortDir : 'asc'} onClick={() => handleSort('jurisdiction')} sx={{ fontWeight: 900, fontSize: '0.75rem' }}>JURISDICTION</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>STATUS</TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === 'expiryDate'} direction={sortBy === 'expiryDate' ? sortDir : 'asc'} onClick={() => handleSort('expiryDate')} sx={{ fontWeight: 900, fontSize: '0.75rem' }}>EXPIRY HORIZON</TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.75rem' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? Array(6).fill(0).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={6}><Skeleton height={65} sx={{ my: 1 }} /></TableCell></TableRow>
                )) : paginated.map((row) => (
                  <PatentRow
                    key={row.id} row={row}
                    onEdit={(p) => { setEditingPatent(p); setModalOpen(true); }}
                    onDelete={(p) => setSignatureModal({ open: true, targetId: p.id, action: 'DELETE' })}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontWeight: 600 }}>No patents match the current filter.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div" count={filtered.length} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[15]} sx={{ borderTop: '1px solid #f1f5f9' }}
          />
        </Paper>
      )}

      {/* TIMELINE VIEW */}
      {viewMode === 'TIMELINE' && (
        <Box>
          {expiryFilter || filtered.some(p => {
            const e = new Date(p.expiryDate);
            return e > today && (e - today) / (1000 * 60 * 60 * 24 * 365) < 1.5;
          }) ? (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 4, bgcolor: alpha('#f59e0b', 0.05), border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 2 }}>
              <AlertTriangle size={20} color="#f59e0b" />
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#92400e' }}>
                {expiringCount} patent{expiringCount !== 1 ? 's' : ''} expiring within 18 months — review extension strategy immediately.
              </Typography>
            </Paper>
          ) : null}

          {loading ? (
            <Grid container spacing={3}>
              {Array(6).fill(0).map((_, i) => <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}><Skeleton height={140} sx={{ borderRadius: 4 }} /></Grid>)}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {filtered.map(patent => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={patent.id}>
                  <TimelineCard patent={patent} getStatusColor={getStatusColor} />
                </Grid>
              ))}
              {filtered.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9' }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 600 }}>No patents match the current filter.</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      )}

      <PatentFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editingPatent} />
      <SignatureModal
        open={signatureModal.open}
        onClose={() => setSignatureModal({ ...signatureModal, open: false })}
        onConfirm={(sigData) => { if (signatureModal.action === 'DELETE') handleDelete(signatureModal.targetId, sigData.reason); }}
        actionType={signatureModal.action}
      />
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PatentList;
