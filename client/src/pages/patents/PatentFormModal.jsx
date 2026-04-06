import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  MenuItem, 
  Box, 
  Typography, 
  Alert,
  alpha
} from '@mui/material';
import { ShieldAlert } from 'lucide-react';

const jurisdictions = [
  { value: 'USA', label: 'United States (USPTO)' },
  { value: 'EU', label: 'European Union (EPO)' },
  { value: 'IN', label: 'India (IPO)' },
  { value: 'CN', label: 'China (CNIPA)' },
  { value: 'JP', label: 'Japan (JPO)' },
];

const statuses = [
  { value: 'DRAFT', label: 'Drafting' },
  { value: 'FILED', label: 'Filed' },
  { value: 'EXAMINATION', label: 'Under Examination' },
  { value: 'GRANTED', label: 'Granted' },
];

const PatentFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    patentNumber: '',
    title: '',
    jurisdiction: '',
    status: 'DRAFT',
    filingDate: '',
    abstract: ''
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        ...initialData,
        filingDate: initialData.filingDate ? initialData.filingDate.split('T')[0] : ''
      });
    } else if (!initialData && open) {
      setFormData({
        patentNumber: '',
        title: '',
        jurisdiction: '',
        status: 'DRAFT',
        filingDate: '',
        abstract: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: 5, 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        } 
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 900, 
        fontFamily: 'Outfit', 
        fontSize: '1.5rem',
        px: 4, 
        py: 3, 
        borderBottom: '1px solid #f1f5f9',
        bgcolor: '#f8fafc',
        color: 'text.primary'
      }}>
        File New Patent Record
      </DialogTitle>
      <form onSubmit={handleFormSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <Alert 
            icon={<ShieldAlert size={20} />} 
            severity="info" 
            sx={{ 
              mb: 5, 
              borderRadius: 3, 
              fontWeight: 600, 
              color: 'primary.main',
              bgcolor: alpha('#2563eb', 0.05),
              border: '1px solid rgba(37, 99, 235, 0.1)',
              '& .MuiAlert-icon': { color: 'primary.main' }
            }}
          >
            Compliance Note: This action will be recorded in the 21 CFR Part 11 Audit Trail for GxP verification.
          </Alert>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>RECORDS MANAGEMENT</Typography>
              <TextField
                required
                fullWidth
                label="Patent Identifier / Number"
                name="patentNumber"
                placeholder="e.g. US20240001"
                value={formData.patentNumber}
                onChange={handleChange}
                helperText="Unique system or international identifier"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>REGULATORY DOMAIN</Typography>
              <TextField
                required
                select
                fullWidth
                label="Jurisdiction"
                name="jurisdiction"
                value={formData.jurisdiction}
                onChange={handleChange}
              >
                {jurisdictions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontWeight: 600 }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>ASSET IDENTITY</Typography>
              <TextField
                required
                fullWidth
                label="Patent Title"
                name="title"
                placeholder="Formal legal title of the intellectual property"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>LIFECYCLE STATUS</Typography>
              <TextField
                required
                select
                fullWidth
                label="Initial Filing Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontWeight: 600 }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>PRIORITY DATE</Typography>
              <TextField
                required
                fullWidth
                type="date"
                label="Filing Date"
                name="filingDate"
                InputLabelProps={{ shrink: true }}
                value={formData.filingDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>SPECIFICATION ABSTRACT</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Abstract / Technical Description"
                name="abstract"
                placeholder="Summary for internal research and regulatory search optimization"
                value={formData.abstract}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 800, px: 3 }}>Discard Changes</Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              px: 5, 
              py: 1.5, 
              fontWeight: 900, 
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' 
            }}
          >
            Submit for Regulatory Review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatentFormModal;
