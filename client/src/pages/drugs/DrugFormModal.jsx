import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, Box, Typography, Alert, Select, MenuItem,
  FormControl, InputLabel, Chip, OutlinedInput, ListItemText,
  Checkbox, CircularProgress, Stack
} from '@mui/material';
import { ShieldAlert, FlaskConical } from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const DOSAGE_FORMS = ['Tablet', 'Capsule', 'Oral Solution', 'Injection / IV', 'Topical Cream', 'Patch', 'Inhaler', 'Suppository'];

const DrugFormModal = ({ open, onClose, onSubmit, initialData, mode = 'DRUG' }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosageForm: '',
    composition: '',
    molecularFormula: '',
    manufacturer: '',
    linkedApis: []
  });
  const [availableApis, setAvailableApis] = useState([]);
  const [loadingApis, setLoadingApis] = useState(false);

  // Fetch real APIs from backend whenever modal opens
  useEffect(() => {
    if (!open) return;
    setLoadingApis(true);
    api.get('/registry/apis')
      .then(res => setAvailableApis(res.data.data || []))
      .catch(() => setAvailableApis([]))
      .finally(() => setLoadingApis(false));
  }, [open]);

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        name: '', dosageForm: '', composition: '',
        molecularFormula: '', manufacturer: '', linkedApis: [],
        ...initialData
      });
    } else if (open) {
      setFormData({ name: '', dosageForm: '', composition: '', molecularFormula: '', manufacturer: '', linkedApis: [] });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApiToggle = (apiId) => {
    setFormData(prev => ({
      ...prev,
      linkedApis: prev.linkedApis.includes(apiId)
        ? prev.linkedApis.filter(id => id !== apiId)
        : [...prev.linkedApis, apiId]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc', py: 3, borderBottom: '1px solid #f1f5f9' }}>
        {initialData ? 'Update' : 'Register New'} {mode === 'DRUG' ? 'Finished Product' : 'Active Ingredient (API)'}
      </DialogTitle>
      <form onSubmit={handleFormSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <Alert icon={<ShieldAlert size={20} />} severity="info" sx={{ mb: 4, borderRadius: 3 }}>
            GxP Audit: This registry mutation is non-repudiable and will be captured in the 21 CFR Part 11 trail.
          </Alert>

          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required fullWidth
                label={mode === 'DRUG' ? 'Generic / Brand Name' : 'API Common Name'}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            {mode === 'DRUG' ? (
              <>
                {/* Dosage Form */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Dosage Form</InputLabel>
                    <Select
                      name="dosageForm"
                      value={formData.dosageForm}
                      label="Dosage Form"
                      onChange={handleChange}
                    >
                      {DOSAGE_FORMS.map(f => (
                        <MenuItem key={f} value={f} sx={{ fontWeight: 600 }}>{f}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Manufacturer */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth label="Manufacturer" name="manufacturer"
                    placeholder="e.g. Zenith Pharma Labs"
                    value={formData.manufacturer} onChange={handleChange}
                  />
                </Grid>

                {/* Composition */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth multiline rows={2}
                    label="Formulation / Composition" name="composition"
                    placeholder="e.g. Onco-Z Derivative 50mg + Excipients"
                    value={formData.composition} onChange={handleChange}
                  />
                </Grid>

                {/* ── LINKED APIs ──────────────────────────────── */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 3, p: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <FlaskConical size={16} color="#1a56db" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Linked Active Pharmaceutical Ingredients
                      </Typography>
                      {formData.linkedApis.length > 0 && (
                        <Chip
                          label={`${formData.linkedApis.length} selected`}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                        />
                      )}
                    </Stack>

                    {loadingApis ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">Loading APIs from registry…</Typography>
                      </Box>
                    ) : availableApis.length === 0 ? (
                      <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 700 }}>
                        No APIs registered yet. Add some via API Ingredient Registry first.
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {availableApis.map(api => {
                          const selected = formData.linkedApis.includes(api.id);
                          return (
                            <Chip
                              key={api.id}
                              label={api.name}
                              clickable
                              onClick={() => handleApiToggle(api.id)}
                              color={selected ? 'primary' : 'default'}
                              variant={selected ? 'filled' : 'outlined'}
                              icon={<FlaskConical size={12} />}
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                borderRadius: 2,
                                transition: 'all 0.15s',
                                '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}

                    {/* Selected summary */}
                    {formData.linkedApis.length > 0 && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          LINKED: {formData.linkedApis.map(id => availableApis.find(a => a.id === id)?.name || id).join(' · ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth label="Molecular Formula" name="molecularFormula"
                    placeholder="e.g. C22H30N6O4S"
                    value={formData.molecularFormula} onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth label="Manufacturer" name="manufacturer"
                    placeholder="e.g. Zenith Labs"
                    value={formData.manufacturer} onChange={handleChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" sx={{ px: 4, fontWeight: 800 }}>
            {initialData ? 'Save Changes' : 'Register in Vault'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DrugFormModal;
