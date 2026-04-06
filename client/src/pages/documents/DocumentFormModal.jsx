import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Grid, Box, Typography, Alert, Select, MenuItem, 
  FormControl, InputLabel, Stack, alpha, ToggleButton, 
  ToggleButtonGroup, LinearProgress, Divider
} from '@mui/material';
import { 
  ShieldAlert, Upload, FileEdit, FilePlus, ChevronRight, 
  Globe, User as UserIcon, CheckCircle, Info, FolderPlus,
  FolderOpen
} from 'lucide-react';

const JURISDICTIONS = ['USA', 'EU', 'JAPAN', 'INDIA', 'CHINA', 'CANADA', 'AUSTRALIA'];
const JURISDICTION_FLAGS = { USA: '🇺🇸', EU: '🇪🇺', JAPAN: '🇯🇵', INDIA: '🇮🇳', CHINA: '🇨🇳', CANADA: '🇨🇦', AUSTRALIA: '🇦🇺' };
const STATUS_OPTIONS = ['DRAFT', 'EFFECTIVE', 'RETIRED'];

const DocumentFormModal = ({ open, onClose, onSubmit, initialData, existingDocs = [], folderName = '', allFolders = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    jurisdiction: '',
    status: 'DRAFT',
    author: '',
    revisionNote: '',
    selectedExistingId: '',
    targetFolder: '',
    newFolderName: '',
    isCreatingNewFolder: false,
    mode: 'NEW' // NEW | REVISION
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          jurisdiction: initialData.jurisdiction || '',
          status: 'DRAFT',
          author: 'Current User',
          revisionNote: '',
          selectedExistingId: initialData.id,
          targetFolder: folderName,
          newFolderName: '',
          isCreatingNewFolder: false,
          mode: 'REVISION'
        });
      } else {
        setFormData({
          name: '', jurisdiction: '', status: 'DRAFT',
          author: 'Current User', revisionNote: '',
          selectedExistingId: '', targetFolder: folderName,
          newFolderName: '', isCreatingNewFolder: false, 
          mode: 'NEW'
        });
      }
      setSelectedFile(null);
      setUploading(false);
      setProgress(0);
    }
  }, [open, initialData, folderName]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleModeChange = (_, newMode) => {
    if (newMode) setFormData(prev => ({ ...prev, mode: newMode, selectedExistingId: '', name: newMode === 'NEW' ? '' : prev.name }));
  };

  const handleFolderChange = (e) => {
    if (e.target.value === 'ADD_NEW') {
      setFormData(prev => ({ ...prev, targetFolder: '', isCreatingNewFolder: true }));
    } else {
      setFormData(prev => ({ ...prev, targetFolder: e.target.value, isCreatingNewFolder: false }));
    }
  };

  const handleExistingSelect = (e) => {
    const doc = existingDocs.find(d => d.id === e.target.value);
    if (doc) {
      setFormData(prev => ({
        ...prev,
        selectedExistingId: doc.id,
        name: doc.name,
        jurisdiction: doc.jurisdiction || prev.jurisdiction
      }));
    }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files?.[0] || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !initialData) {
      alert("Please select a file.");
      return;
    }
    
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        
        const finalFolder = formData.isCreatingNewFolder ? formData.newFolderName : formData.targetFolder;
        
        onSubmit({ 
          ...formData, 
          finalFolder,
          fileName: selectedFile?.name || 'reversioned_file',
          fileSize: selectedFile?.size || 0
        });
        setUploading(false);
      }
    }, 150);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc', py: 3, borderBottom: '1px solid #f1f5f9' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ p: 1, bgcolor: alpha('#1a56db', 0.1), color: '#1a56db', borderRadius: 2 }}>
            <FolderPlus size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Vault Control Center</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Active Folder Context: {folderName}</Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <Alert icon={<ShieldAlert size={20} />} severity="info" sx={{ mb: 4, borderRadius: 3 }}>
            GxP Ledger: All submissions are logged to the 21 CFR Part 11 vault trail.
          </Alert>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={formData.mode}
              exclusive
              onChange={handleModeChange}
              size="small"
              sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: 3, '& .MuiToggleButton-root': { borderRadius: 2.5, px: 3, fontWeight: 900, border: 'none' } }}
            >
              <ToggleButton value="NEW" sx={{ gap: 1 }}><FilePlus size={16} /> New Asset</ToggleButton>
              <ToggleButton value="REVISION" sx={{ gap: 1 }}><FileEdit size={16} /> Revise Doc</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3}>
            {/* Folder / Tree Selection */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Vault Tree Destination</InputLabel>
                <Select
                  name="targetFolder"
                  value={formData.isCreatingNewFolder ? 'ADD_NEW' : formData.targetFolder}
                  onChange={handleFolderChange}
                  label="Vault Tree Destination"
                  sx={{ borderRadius: 3 }}
                  startAdornment={<FolderOpen size={16} style={{ marginRight: 8, color: '#64748b' }} />}
                >
                  {allFolders.map(f => (
                    <MenuItem key={f} value={f} sx={{ fontWeight: 700 }}>{f}</MenuItem>
                  ))}
                  <Divider />
                  <MenuItem value="ADD_NEW" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    + Add New Folder Tree...
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.isCreatingNewFolder && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  required fullWidth
                  label="New Folder Tree Name"
                  name="newFolderName"
                  value={formData.newFolderName}
                  onChange={handleChange}
                  placeholder="e.g. Clinical Submissions"
                  autoFocus
                />
              </Grid>
            )}

            {formData.mode === 'REVISION' && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel>Select Document to Revise</InputLabel>
                  <Select
                    name="selectedExistingId"
                    value={formData.selectedExistingId}
                    onChange={handleExistingSelect}
                    label="Select Document to Revise"
                    sx={{ borderRadius: 3 }}
                  >
                    {existingDocs.length > 0 ? existingDocs.map(doc => (
                      <MenuItem key={doc.id} value={doc.id} sx={{ fontWeight: 700 }}>
                        {doc.name} (v{doc.version})
                      </MenuItem>
                    )) : <MenuItem disabled>No documents in this folder</MenuItem>}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                required fullWidth
                label="Document Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. SOP-QA-05-Final"
                disabled={formData.mode === 'REVISION' && !!formData.selectedExistingId}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Jurisdiction</InputLabel>
                <Select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  label="Jurisdiction"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value=""><em>Global / General</em></MenuItem>
                  {JURISDICTIONS.map(j => (
                    <MenuItem key={j} value={j} sx={{ fontWeight: 700 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography sx={{ fontSize: '1.2rem' }}>{JURISDICTION_FLAGS[j]}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{j}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Initial Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Initial Status"
                  sx={{ borderRadius: 3 }}
                >
                  {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s} sx={{ fontWeight: 700 }}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth label="Authorship / Owner" name="author"
                value={formData.author} onChange={handleChange}
                placeholder="Name or Department"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                required={formData.mode === 'REVISION'}
                fullWidth multiline rows={2}
                label={formData.mode === 'REVISION' ? "Revision Reason" : "Initial Submission Note"}
                name="revisionNote"
                value={formData.revisionNote}
                onChange={handleChange}
                placeholder={formData.mode === 'REVISION' ? "Describe clinical/legal change reason..." : "What is this document for?"}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 4, border: '2px dashed #e2e8f0', borderRadius: 4, textAlign: 'center', bgcolor: selectedFile ? alpha('#10b981', 0.05) : 'transparent', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#1a56db', 0.02) } }}>
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                <Stack spacing={1} alignItems="center" onClick={() => fileInputRef.current?.click()} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ p: 1.5, bgcolor: selectedFile ? '#d1fae5' : '#f1f5f9', color: selectedFile ? '#10b981' : '#64748b', borderRadius: '50%' }}>
                    {selectedFile ? <CheckCircle size={28} /> : <Upload size={28} />}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>{selectedFile ? selectedFile.name : `Attach Document File`}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB committed` : 'PDF, Word, or Excel'}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {uploading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mb: 1, bgcolor: '#f1f5f9' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>Securing Vault Integrity... {progress}%</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={onClose} color="inherit" disabled={uploading}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={uploading || (formData.mode === 'REVISION' && (!formData.selectedExistingId || !formData.revisionNote)) || (formData.isCreatingNewFolder && !formData.newFolderName)}
            sx={{ px: 4, fontWeight: 900 }}
          >
            {formData.mode === 'NEW' ? 'File New Asset' : 'Commit Revision'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DocumentFormModal;
