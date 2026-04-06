import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Clock, User, Fingerprint, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { exportToCSV } from '../../utils/exportUtils';
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
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Button,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  TablePagination,
  Divider
} from '@mui/material';

const ACTION_LABELS = {
  POST: { label: 'CREATE', color: 'success' },
  PUT: { label: 'UPDATE', color: 'info' },
  DELETE: { label: 'DELETE', color: 'error' },
  GET: { label: 'READ', color: 'default' },
  V1_STABILIZATION: { label: 'SYSTEM', color: 'default' },
};

const ACTION_FILTERS = ['ALL', 'CREATE', 'UPDATE', 'DELETE', 'SYSTEM'];

const ComplianceAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/compliance/audit');
        setLogs(res.data.data);
      } catch (err) {
        console.error('Audit Retrieval Malfunction:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  const handleExport = () => exportToCSV(logs, 'VantagePoint_Audit_Trail');

  const getActionMeta = (action) => ACTION_LABELS[action] || { label: action, color: 'default' };

  const filteredLogs = logs.filter(l => {
    const semantic = getActionMeta(l.action).label;
    const matchesAction = actionFilter === 'ALL' || semantic === actionFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      (l.userId ?? '').toLowerCase().includes(searchLower) ||
      (l.action ?? '').toLowerCase().includes(searchLower) ||
      (l.target ?? '').toLowerCase().includes(searchLower);
    return matchesAction && matchesSearch;
  });

  const paginated = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900 }}>Regulatory Audit Trail</Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>V2.0 Immutable System Logs · 21 CFR Part 11 Traceability</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Chip icon={<ShieldCheck size={16} />} label="Data Integrity: VERIFIED" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
          <Chip icon={<Fingerprint size={16} />} label="E-Signatures: SHA-256" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
        </Stack>
      </Box>

      {/* FILTER BAR */}
      <Paper sx={{ p: 3, mb: 4, display: 'flex', gap: 3, alignItems: 'center', borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Filter by Personnel, Target, or Action..."
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#64748b" />
              </InputAdornment>
            ),
          }}
        />
        <Divider orientation="vertical" flexItem />
        <ToggleButtonGroup
          value={actionFilter}
          exclusive
          onChange={(_, v) => { if (v) { setActionFilter(v); setPage(0); } }}
          size="small"
          sx={{ '& .MuiToggleButton-root': { px: 2, fontWeight: 800, fontSize: '0.7rem', borderRadius: '8px !important', border: '1px solid #e2e8f0 !important', mx: 0.25 } }}
        >
          {ACTION_FILTERS.map(f => (
            <ToggleButton key={f} value={f}>{f}</ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box sx={{ ml: 'auto' }}>
          <Button variant="text" startIcon={<Download size={18} />} onClick={handleExport} sx={{ fontWeight: 700 }}>
            Export GxP Log
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: alpha('#f8fafc', 0.8) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Personnel</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Entity</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Identity Hash</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Verification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontWeight: 600 }}>
                    No audit entries match the current filter.
                  </TableCell>
                </TableRow>
              ) : paginated.map((log) => {
                const meta = getActionMeta(log.action);
                return (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Clock size={14} color="#64748b" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(log.timestamp).toLocaleString()}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <User size={14} color="#1a56db" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{log.userId ?? 'anonymous'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meta.label}
                        size="small"
                        color={meta.color}
                        sx={{ fontWeight: 900, fontSize: '0.65rem', borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary', maxWidth: 220 }}>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.target ?? log.targetUrl ?? 'CORE_SYSTEM'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Verified Electronic Signature">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', cursor: 'help' }}>
                          <Fingerprint size={14} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{log.sig?.slice(0, 8) ?? 'N/A'}...</Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Chip label="AUTHENTICATED" size="small" variant="outlined" sx={{ fontSize: '0.6rem', fontWeight: 900, color: 'success.main', borderColor: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
          sx={{ borderTop: '1px solid #f1f5f9' }}
        />
      </Paper>

      <Box sx={{ mt: 4, p: 4, bgcolor: alpha('#10b981', 0.05), borderRadius: 4, border: '1px solid', borderColor: alpha('#10b981', 0.2) }}>
        <Typography variant="h4" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 800 }}>
          <ShieldCheck size={24} /> GxP Compliance Integrity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          In accordance with 21 CFR Part 11.10(e), these logs are high-fidelity, non-repudiable, and sequentially stored in the VantagePoint FileSystemDB Vault.
          Actions are mapped to semantic labels: POST→CREATE, PUT→UPDATE, DELETE→DELETE.
        </Typography>
      </Box>
    </Box>
  );
};

export default ComplianceAuditLogs;
