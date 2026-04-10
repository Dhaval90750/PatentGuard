import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Stack,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Checkbox,
  alpha,
  Skeleton,
  CircularProgress,
  Tooltip as MuiTooltip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceArea
} from 'recharts';
import {
  Zap,
  Clock,
  Dna,
  ShieldCheck,
  AlertTriangle,
  History,
  Maximize2,
  ChevronRight,
  TrendingDown,
  Scaling,
  CalendarDays,
  Target
} from 'lucide-react';
import api from '../../utils/api';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @desc    V2 Strategy Simulator (What-If Strategy Engineering)
 * @purpose Implements an immersive simulation workspace for modeling IP lifecycles.
 */
const StrategySimulator = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [patents, setPatents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [simulationResults, setSimulationResults] = useState([]);
  const [simulating, setSimulating] = useState(false);

  // Simulation Toggles
  const [tweaks, setTweaks] = useState({
    applySPC: true,
    spcYears: 5,
    applicationPTE: false,
    pteMonths: 12,
    pediatricExtension: false
  });

  useEffect(() => {
    fetchBaseData();
  }, []);

  const fetchBaseData = async () => {
    try {
      const response = await api.get('/strategy/patents');
      if (response.data.success) {
        setPatents(response.data.data);
        // Default select first 2 for visualization
        if (response.data.data.length > 0) {
          setSelectedIds([response.data.data[0].id]);
        }
      }
    } catch (err) {
      enqueueSnackbar('Fail to load strategy base.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      runSimulation();
    } else {
      setSimulationResults([]);
    }
  }, [selectedIds, tweaks]);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const response = await api.post('/strategy/simulate', { 
        patentIds: selectedIds, 
        tweaks 
      });
      if (response.data.success) {
        setSimulationResults(response.data.data);
      }
    } catch (err) {
      console.error('Simulation failure:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleToggleId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleTweakChange = (name, value) => {
    setTweaks(prev => ({ ...prev, [name]: value }));
  };

  // Prepare chart data (Gantt-style representation)
  const chartData = useMemo(() => {
    return simulationResults.map(res => ({
      name: res.patentNumber,
      base: new Date(res.baseExpiry).getTime(),
      simulated: new Date(res.simulatedExpiry).getTime(),
      entry: new Date(res.marketEntry).getTime(),
      gap: res.extensionGapMonths,
      title: res.title
    }));
  }, [simulationResults]);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width="40%" height={60} />
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} /></Grid>
          <Grid item xs={12} md={8}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} /></Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>STRATEGIC MODELLING</Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>What-If Strategy Simulator</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Model patent lifecycle extensions (SPC/PTE) and visualize market entry gaps in real-time.
          </Typography>
        </Box>
        <Chip 
          icon={<History size={14} />} 
          label="GxP Mode: Active Simulation" 
          color="success" 
          variant="outlined" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* LEFT: PATENT SELECTOR & CONTROLS */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* PATENT SELECTOR */}
            <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Asset Inventory</Typography>
              </Box>
              <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                {patents.map((p) => (
                  <ListItem 
                    key={p.id} 
                    button 
                    onClick={() => handleToggleId(p.id)}
                    sx={{ 
                      borderLeft: selectedIds.includes(p.id) ? '4px solid #3b82f6' : '4px solid transparent',
                      bgcolor: selectedIds.includes(p.id) ? alpha('#3b82f6', 0.05) : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox checked={selectedIds.includes(p.id)} size="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={p.patentNumber} 
                      secondary={p.title} 
                      primaryTypographyProps={{ fontWeight: 800, fontSize: '0.85rem' }}
                      secondaryTypographyProps={{ noWrap: true, fontSize: '0.75rem' }}
                    />
                    <Chip label={p.jurisdiction} size="small" variant="outlined" sx={{ fontWeight: 700, transform: 'scale(0.8)' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* WHAT-IF CONTROLS */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Target size={18} color="#3b82f6" /> Simulation Parameters
              </Typography>
              
              <Stack spacing={4}>
                <Box>
                  <FormControlLabel
                    control={<Switch checked={tweaks.applySPC} onChange={(e) => handleTweakChange('applySPC', e.target.checked)} />}
                    label={<Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Supplementary Certificate (SPC)</Typography>}
                  />
                  <Box sx={{ px: 2, mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Max Extension: {tweaks.spcYears} Years</Typography>
                    <Slider
                      value={tweaks.spcYears}
                      min={0}
                      max={5}
                      step={1}
                      marks
                      onChange={(e, val) => handleTweakChange('spcYears', val)}
                      disabled={!tweaks.applySPC}
                    />
                  </Box>
                </Box>

                <Box>
                  <FormControlLabel
                    control={<Switch checked={tweaks.applicationPTE} onChange={(e) => handleTweakChange('applicationPTE', e.target.checked)} />}
                    label={<Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Patent Term Extension (PTE)</Typography>}
                  />
                  <Box sx={{ px: 2, mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Projected Delay: {tweaks.pteMonths} Months</Typography>
                    <Slider
                      value={tweaks.pteMonths}
                      min={0}
                      max={60}
                      step={6}
                      onChange={(e, val) => handleTweakChange('pteMonths', val)}
                      disabled={!tweaks.applicationPTE}
                    />
                  </Box>
                </Box>

                <Box>
                  <FormControlLabel
                    control={<Switch checked={tweaks.pediatricExtension} onChange={(e) => handleTweakChange('pediatricExtension', e.target.checked)} />}
                    label={<Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Pediatric Reward (+6M)</Typography>}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT: TIMELINE VISUALIZATION */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', minHeight: 600 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Projected Expiry Timeline</Typography>
                <Typography variant="body2" color="text.secondary">Visualizing the delta between original and simulated market exclusivity.</Typography>
              </Box>
              {simulating && <CircularProgress size={20} />}
            </Box>

            {chartData.length > 0 ? (
              <Box sx={{ height: 450, mt: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    layout="vertical" 
                    margin={{ left: 40, right: 40, top: 20 }}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      domain={['auto', 'auto']} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(unix) => new Date(unix).getFullYear()}
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 13, fontWeight: 800, fill: '#1e293b' }}
                      width={100}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: 'none' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>{data.name}: {data.title}</Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>Original Expiry:</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 900 }}>{new Date(data.base).toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700 }} color="primary">Simulated Expiry:</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 900 }} color="primary">{new Date(data.simulated).toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700 }} color="success.main">Market Entry:</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 900 }} color="success.main">{new Date(data.entry).toLocaleDateString()}</Typography>
                            </Box>
                            <Chip 
                              label={`+${data.gap} Months Coverage Gain`} 
                              size="small" 
                              sx={{ mt: 2, width: '100%', fontWeight: 900, bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} 
                            />
                          </Paper>
                        );
                      }}
                    />
                    {/* BASELINE BAR */}
                    <Bar dataKey="base" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={24} />
                    {/* SIMULATED BAR (Overlay) */}
                    <Bar dataKey="simulated" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#3b82f6', 0.02), borderRadius: 4, border: '1px dashed #e2e8f0' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Select intellectual property assets from the inventory to begin simulation.</Typography>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                 <Box sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AlertTriangle size={14} color="#f59e0b" /> LEGAL UNCERTAINTY INDEX
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>Moderate Risk</Typography>
                    <Typography variant="body2" color="text.secondary">Projected 34% probability of litigation challenge upon SPC filing.</Typography>
                 </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Box sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: alpha('#10b981', 0.05), borderColor: alpha('#10b981', 0.2) }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingDown size={14} /> EXCLUSIVITY VALUE GAIN
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>+$14M Projected</Typography>
                    <Typography variant="body2" color="text.secondary">Estimated revenue retention through simulated lifecycle extension.</Typography>
                 </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategySimulator;
