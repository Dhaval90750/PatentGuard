import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, List, ListItem, ListItemIcon,
  ListItemButton, ListItemText, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Stack, alpha,
  Divider, IconButton, Card, CardContent, CardActions, Snackbar,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Badge, TextField, InputAdornment, Skeleton
} from '@mui/material';
import {
  Folder, FileText, ShieldCheck, Plus, Search, Download, History,
  Upload, X, Eye, RefreshCw, LayoutGrid, List as ListIcon,
  Clock, CheckCircle, Archive, AlertTriangle, Printer,
  FileSearch
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import DocumentFormModal from './DocumentFormModal';
import useAuthStore from '../../store/authStore';

// ────────────────────────────────────────────────────────────
// MASTER COPY PREVIEW COMPONENT (MOCKPAGE)
// ────────────────────────────────────────────────────────────
const MasterCopyPreview = ({ doc, flags }) => {
  if (!doc) return null;
  return (
    <Paper
      elevation={2}
      sx={{
        p: 6,
        bgcolor: '#fff',
        borderRadius: 4,
        minHeight: 500,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', opacity: 0.03, pointerEvents: 'none', userSelect: 'none', textAlign: 'center', zIndex: 0 }}>
        <Typography variant="h1" sx={{ fontWeight: 900, whiteSpace: 'nowrap' }}>GxP MASTER COPY</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>VALID ENVIRONMENT</Typography>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 6 }}>
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 2 }}>VantagePoint DMS Integrity</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>{doc.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Asset Identifier: {doc.id}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Badge badgeContent={doc.version} color="primary" sx={{ '& .MuiBadge-badge': { fontWeight: 900, height: 28, minWidth: 28, borderRadius: 1.5, fontSize: '0.75rem' } }}>
              <Box sx={{ p: 1.5, bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', borderRadius: 3 }}><FileText size={32} /></Box>
            </Badge>
          </Box>
        </Stack>
        <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary' }}>Regulatory Status</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <CheckCircle size={18} color="#10b981" />
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#065f46' }}>{doc.status} Master</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary' }}>Jurisdiction</Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, mt: 1 }}>{flags[doc.jurisdiction] || '🌐'} {doc.jurisdiction || 'Global'}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ bgcolor: alpha('#f8fafc', 0.8), p: 4, borderRadius: 4, border: '1px solid #f1f5f9', mb: 4 }}>
          <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 2, textTransform: 'uppercase' }}>Revision Purpose / Executive Summary</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
            {doc.history && doc.history[0]?.note || 'Original filing for the GxP Vault. No revision purpose specified.'}
          </Typography>
        </Box>
        <Box sx={{ mt: 'auto', p: 4, border: '2px solid #f1f5f9', borderRadius: 4, bgcolor: alpha('#f1f5f9', 0.3) }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', mb: 2, display: 'block' }}>Digital Compliance Signature</Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box><Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>Digitally Signed by:</Typography><Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main' }}>{doc.author}</Typography></Box>
            <Box sx={{ textAlign: 'right' }}><Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>Certified on:</Typography><Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{doc.date}</Typography></Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>SHA-256 HASH: 8f3e9a4c1b7d5e6f2a0c8b4d9e7f1a3c0b5d9e7f1a3c0b5d9e7f1a3c0b5d9e7f</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const JURISDICTION_FLAGS = { USA: '🇺🇸', EU: '🇪🇺', JAPAN: '🇯🇵', INDIA: '🇮🇳', CHINA: '🇨🇳', CANADA: '🇨🇦', AUSTRALIA: '🇦🇺' };
const statusColor = (s) => s === 'EFFECTIVE' ? 'success' : s === 'RETIRED' ? 'default' : 'warning';

const DocumentVault = () => {
  const [selectedFolder, setSelectedFolder] = useState('SOPs');
  const [viewMode, setViewMode] = useState('GRID');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewDoc, setViewDoc] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = useAuthStore((state) => state.token);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/documents');
      if (response.data.success) {
        setDocuments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setSnackbar({ open: true, message: 'Failed to fetch documents from vault.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  // Grouping logic for the sidebar
  const folders = Array.from(new Set(documents.map(d => d.folder))).map(name => ({
    name,
    count: documents.filter(d => d.folder === name).length
  }));

  // Metadata-aware search logic
  const currentDocs = documents.filter(doc => doc.folder === selectedFolder).filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(searchLower) ||
      doc.author.toLowerCase().includes(searchLower) ||
      doc.status.toLowerCase().includes(searchLower) ||
      (doc.jurisdiction || '').toLowerCase().includes(searchLower) ||
      doc.version.toLowerCase().includes(searchLower)
    );
  });

  const handleFormSubmit = async (data) => {
    try {
      if (data.mode === 'NEW') {
        const response = await api.post('/documents', {
          name: data.name,
          version: 'v1.0',
          status: data.status,
          author: data.author || 'System User',
          jurisdiction: data.jurisdiction,
          folder: data.finalFolder,
          history: [{ v: 'v1.0', date: new Date().toISOString().split('T')[0], note: data.revisionNote || 'Initial Submission' }]
        });

        if (response.data.success) {
          setSnackbar({ open: true, message: `"${data.name}" filed successfully in ${data.finalFolder}.`, severity: 'success' });
          fetchDocuments();
        }
      } else {
        // Revision Mode
        const existingDoc = documents.find(d => d.id === data.selectedExistingId);
        if (!existingDoc) return;

        const vParts = existingDoc.version.replace('v', '').split('.');
        const newVer = `v${vParts[0]}.${parseInt(vParts[1] || '0') + 1}`;

        const response = await api.put(`/documents/${existingDoc.id}`, {
          version: newVer,
          status: data.status,
          author: data.author || existingDoc.author,
          jurisdiction: data.jurisdiction || existingDoc.jurisdiction,
          folder: data.finalFolder,
          date: new Date().toISOString().split('T')[0],
          history: [{ v: newVer, date: new Date().toISOString().split('T')[0], note: data.revisionNote }, ...existingDoc.history]
        });

        if (response.data.success) {
          setSnackbar({ open: true, message: `Revision committed. Version bumped to ${newVer}.`, severity: 'success' });
          fetchDocuments();
          if (viewDoc?.id === existingDoc.id) setViewDoc(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error submitting document:', error);
      setSnackbar({ open: true, message: 'Failed to commit document to vault.', severity: 'error' });
    }
    setFormOpen(false);
    setUpdateData(null);
  };

  const handleDownload = (doc) => {
    setSnackbar({ open: true, message: `Generating GxP-Master download for "${doc.name}"...`, severity: 'info' });
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 6 }}>
      {/* ── SIDEBAR ── */}
      <Box sx={{ width: 280, borderRight: '1px solid #e2e8f0', bgcolor: '#f8fafc', p: 3, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Vault Tree</Typography>
          <IconButton onClick={() => { setUpdateData(null); setFormOpen(true); }} size="small" sx={{ bgcolor: alpha('#1a56db', 0.1), color: '#1a56db' }}>
            <Plus size={18} />
          </IconButton>
        </Box>
        <List sx={{ '& .MuiListItemButton-root': { borderRadius: 3, mb: 0.5 } }}>
          {loading ? (
            [1, 2, 3, 4].map(i => <Box key={i} sx={{ px: 2, py: 1 }}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} /></Box>)
          ) : (
            folders.map((folder) => (
              <ListItem key={folder.name} disablePadding>
                <ListItemButton
                  selected={selectedFolder === folder.name}
                  onClick={() => setSelectedFolder(folder.name)}
                  sx={{ '&.Mui-selected': { bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', '& .MuiListItemIcon-root': { color: '#1a56db' } } }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}><Folder size={18} /></ListItemIcon>
                  <ListItemText primary={folder.name} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
                  <Chip label={folder.count} size="small" sx={{ fontWeight: 900, minWidth: 28, height: 20, fontSize: '0.65rem' }} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', bgcolor: '#f1f5f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>{selectedFolder}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>DMS Strategic Tree · {currentDocs.length} assets</Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search metadata..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: 3, bgcolor: '#fff', width: 220 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Divider orientation="vertical" flexItem />
            <Box sx={{ bgcolor: alpha('#fff', 0.8), p: 0.5, borderRadius: 2, display: 'flex' }}>
              <IconButton size="small" onClick={() => setViewMode('TABLE')} sx={{ bgcolor: viewMode === 'TABLE' ? alpha('#1a56db', 0.1) : 'transparent', color: viewMode === 'TABLE' ? '#1a56db' : 'inherit' }}><ListIcon size={18} /></IconButton>
              <IconButton size="small" onClick={() => setViewMode('GRID')} sx={{ bgcolor: viewMode === 'GRID' ? alpha('#1a56db', 0.1) : 'transparent', color: viewMode === 'GRID' ? '#1a56db' : 'inherit' }}><LayoutGrid size={18} /></IconButton>
            </Box>
            <Button variant="contained" startIcon={<Upload size={18} />} onClick={() => { setUpdateData(null); setFormOpen(true); }} sx={{ borderRadius: 3, fontWeight: 900 }}>
              Commence Filing
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}><Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} /></Grid>)
          ) : currentDocs.map(doc => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
              <Card
                sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' } }}
                onClick={() => setViewDoc(doc)}
              >
                <CardContent sx={{ pb: 1, flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1, bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', borderRadius: 2 }}><FileText size={18} /></Box>
                    <Chip label={doc.version} size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', height: 22 }} />
                  </Stack>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, lineHeight: 1.4 }}>{doc.name}</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                    <Chip label={doc.status} size="small" color={statusColor(doc.status)} variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
                    {doc.jurisdiction && <Chip label={`${JURISDICTION_FLAGS[doc.jurisdiction]} ${doc.jurisdiction}`} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />}
                  </Stack>
                  <Divider sx={{ my: 2, opacity: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{doc.author}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{doc.date}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!loading && currentDocs.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 6, bgcolor: 'transparent', border: '2px dashed #e2e8f0' }}>
                <FileSearch size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>No assets match your search</Typography>
                <Typography variant="body2" color="text.secondary">Try a different name, author, or status identifier.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 6, p: 3, bgcolor: alpha('#1a56db', 0.04), borderRadius: 4, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <ShieldCheck size={32} color="#1a56db" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>DMS Cryptographic Integrity Lock</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>All assets are version-serialized and cross-verified against the master 21 CFR Part 11 audit trail.</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── IMMERSIVE DOCUMENT VIEWER DIALOG ── */}
      <Dialog
        open={Boolean(viewDoc)}
        onClose={() => setViewDoc(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 6, bgcolor: '#f8fafc', height: '90vh' } }}
      >
        <DialogTitle sx={{ py: 3, px: 4, borderBottom: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1.5, bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', borderRadius: 3 }}><FileSearch size={24} /></Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Master Copy Inspection</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Serial Number: {viewDoc?.id}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button startIcon={<Printer size={18} />} variant="outlined" sx={{ borderRadius: 3, fontWeight: 900 }} onClick={() => handleDownload(viewDoc)}>Print Master</Button>
              <IconButton onClick={() => setViewDoc(null)} sx={{ bgcolor: alpha('#f1f5f9', 0.5) }}><X size={20} /></IconButton>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 4, display: 'flex', gap: 4 }}>
          {/* CENTER: MASTER PREVIEW */}
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 2 }}>
            <MasterCopyPreview doc={viewDoc} flags={JURISDICTION_FLAGS} />
          </Box>

          {/* RIGHT: AUDIT SIDEBAR */}
          <Box sx={{ width: 340, borderLeft: '1px solid #e2e8f0', pl: 4, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', mb: 3, display: 'block', letterSpacing: 1 }}>Iteration Ledger</Typography>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <Stack spacing={3}>
                {viewDoc?.history?.map((entry, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: i === 0 ? 'primary.main' : '#cbd5e1', border: '3px solid #f8fafc', boxShadow: i === 0 ? '0 0 0 3px rgba(26, 86, 219, 0.2)' : 'none', zIndex: 1 }} />
                        {i < viewDoc.history.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: '#e2e8f0', my: 0.5 }} />}
                      </Box>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: i === 0 ? 'primary.main' : 'text.primary', fontSize: '0.8rem' }}>Version {entry.v}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Commence: {entry.date}</Typography>
                        <Typography variant="body2" sx={{ mt: 1, fontSize: '0.78rem', color: 'text.secondary', fontWeight: 500, lineHeight: 1.5 }}>{entry.note}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Button
                fullWidth variant="contained"
                startIcon={<RefreshCw size={18} />}
                sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}
                onClick={() => { setUpdateData(viewDoc); setViewDoc(null); setFormOpen(true); }}
                disabled={viewDoc?.status === 'RETIRED'}
              >
                Create Revision
              </Button>
              <Button
                fullWidth variant="outlined"
                startIcon={<History size={18} />}
                sx={{ borderRadius: 3, fontWeight: 800 }}
              >
                Full Audit Trail
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <DocumentFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setUpdateData(null); }}
        onSubmit={handleFormSubmit}
        initialData={updateData}
        existingDocs={currentDocs}
        folderName={selectedFolder}
        allFolders={folders.map(f => f.name)}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentVault;
