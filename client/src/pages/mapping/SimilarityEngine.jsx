import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Stack,
  alpha,
  Skeleton,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import {
  Search,
  Zap,
  Target,
  ShieldAlert,
  Dna,
  FlaskConical,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  SearchCheck,
  Radar
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as ReRadar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import api from '../../utils/api';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @desc    AI-Driven Similarity Engine (V2 Intelligence)
 * @purpose Implements semantic IP discovery and infringement risk scoring.
 */
const SimilarityEngine = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState('');
  const [activeMetrics, setActiveMetrics] = useState([
    { subject: 'Structural', A: 0 },
    { subject: 'Functional', A: 0 },
    { subject: 'Jurisdictional', A: 0 },
    { subject: 'Novelty', A: 0 },
    { subject: 'Strength', A: 0 },
  ]);

  useEffect(() => {
    fetchDrugs();
  }, []);

  useEffect(() => {
    if (results.length > 0 && results[0].metrics) {
      setActiveMetrics(results[0].metrics);
    }
  }, [results]);

  const fetchDrugs = async () => {
    try {
      const response = await api.get('/registry/drugs');
      if (response.data.success) {
        setDrugs(response.data.data);
      }
    } catch (err) {
      console.error('Fetch drugs failure:', err);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    try {
      const response = await api.get(`/ai/search?query=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setResults(response.data.data);
        enqueueSnackbar(`Found ${response.data.data.length} semantic matches.`, { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar('Semantic search failure.', { variant: 'error' });
    } finally {
      setSearching(false);
    }
  };

  const handleDrugOverlap = async (id) => {
    setSearching(true);
    try {
      const response = await api.get(`/ai/overlap/${id}`);
      if (response.data.success) {
        setResults(response.data.data);
        enqueueSnackbar('Strategic overlap analysis complete.', { variant: 'info' });
      }
    } catch (err) {
      enqueueSnackbar('Overlap analysis failure.', { variant: 'error' });
    } finally {
      setSearching(false);
    }
  };


  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>ARTIFICIAL INTELLIGENCE LAYER</Typography>
        <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>AI Similarity Engine</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
          Semantic discovery of patent overlaps and infringement risks using NLP-based document vectorization.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* LEFT: SEARCH & CONTROLS */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Strategic Discovery</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Enter scientific claims, chemical descriptions, or patent concepts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#3b82f6" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          variant="contained" 
                          onClick={handleSearch}
                          disabled={searching}
                          sx={{ borderRadius: 2, fontWeight: 800 }}
                        >
                          Semantic Search
                        </Button>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="OR ANALYZE INVENTORY" size="small" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl fullWidth>
                    <InputLabel>Select Clinical Asset for Coverage Analysis</InputLabel>
                    <Select
                      value={selectedDrug}
                      onChange={(e) => {
                        setSelectedDrug(e.target.value);
                        handleDrugOverlap(e.target.value);
                      }}
                      label="Select Clinical Asset for Coverage Analysis"
                    >
                      {drugs.map(drug => (
                        <MenuItem key={drug.id} value={drug.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Dna size={16} /> {drug.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button 
                    variant="outlined" 
                    startIcon={<RefreshCw size={18} />}
                    sx={{ height: 56, borderRadius: 2, fontWeight: 700 }}
                    onClick={() => handleDrugOverlap(selectedDrug)}
                    disabled={searching || !selectedDrug}
                  >
                    Re-Analyze
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* SEARCH RESULTS */}
          <Box sx={{ position: 'relative' }}>
            <AnimatePresence>
              {searching ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ mt: 2, fontWeight: 700 }}>Processing Semantic Vectors...</Typography>
                </Box>
              ) : results.length > 0 ? (
                <Stack spacing={2}>
                  {results.map((res, idx) => (
                    <motion.div 
                      key={res.id || res.patentId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Paper 
                        onClick={() => res.metrics && setActiveMetrics(res.metrics)}
                        sx={{ 
                          p: 3, 
                          borderRadius: 4, 
                          border: '1px solid #e2e8f0', 
                          cursor: 'pointer',
                          '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#3b82f6', 0.01) }, 
                          transition: 'all 0.2s' 
                        }}
                      >
                        <Grid container alignItems="center" spacing={3}>
                          <Grid item xs={12} sm={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                                {res.patentNumber}
                              </Typography>
                              <Chip 
                                label={`${res.similarityScore}% Semantic Match`} 
                                size="small" 
                                color={res.similarityScore > 70 ? "error" : res.similarityScore > 40 ? "warning" : "success"}
                                sx={{ fontWeight: 900, borderRadius: 1.5 }}
                              />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.5 }}>{res.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Cpu size={14} /> Vector Space ID: {res.id?.slice(0, 8) || res.patentId?.slice(0, 8)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                            <Button endIcon={<ArrowRight size={16} />} sx={{ fontWeight: 800 }}>Detailed Radar</Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </motion.div>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ p: 6, textAlign: 'center', bgcolor: alpha('#3b82f6', 0.02), borderRadius: 6, border: '1px dashed #e2e8f0' }}>
                   <SearchCheck size={48} color="#94a3b8" />
                   <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: 'text.secondary' }}>Initiate Discovery</Typography>
                   <Typography variant="body2" color="text.secondary">Enter a query or select an asset to identify intellectual property overlaps.</Typography>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </Grid>

        {/* RIGHT: OVERLAP RADAR & INTEL */}
        <Grid item xs={12} lg={5}>
          <Stack spacing={4}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', minHeight: 450 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Radar size={24} color="#3b82f6" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Semantic Overlap Radar</Typography>
              </Box>
              
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activeMetrics}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                    <ReRadar
                      name="Similarity"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.15}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', px: 2, mt: 2 }}>
                The radar visualization plots multi-dimensional semantic overlap across chemical properties, legal claims, and jurisdictional coverage.
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: alpha('#ef4444', 0.05), borderColor: alpha('#ef4444', 0.2) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <ShieldAlert size={20} color="#ef4444" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ef4444' }}>INTELLECTUAL PROPERTY ADVISORY</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                Multiple high-similarity patents identified for the selected clinical asset. Infringement risk elevated to <span style={{ color: '#ef4444' }}>CRITICAL</span> in jurisdictions: US, EU.
              </Typography>
              <Button size="small" variant="contained" color="error" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>Launch Full Integrity Audit</Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimilarityEngine;
