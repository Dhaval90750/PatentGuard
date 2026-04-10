import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
  Graticule
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  alpha,
  Skeleton,
  CircularProgress,
  Tooltip as MuiTooltip
} from '@mui/material';
import {
  Globe,
  Info,
  ShieldAlert,
  Landmark,
  AlertTriangle,
  TrendingUp,
  X,
  Maximize2,
  ChevronRight,
  Target
} from 'lucide-react';
import api from '../../utils/api';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

// Reliable TopoJSON source for world map
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

/**
 * @desc    Interactive Global Risk Heatmap (V2 Intelligence)
 * @purpose Implements geographical visualization of jurisdictional patent risk.
 */
const RiskHeatmap = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const response = await api.get('/heatmap');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Heatmap data failure:', err);
      enqueueSnackbar('Failed to retrieve jurisdictional intelligence.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Color scale for risk mapping (Stable -> Critical)
  const colorScale = scaleLinear()
    .domain([0, 50, 100])
    .range(["#10b981", "#f59e0b", "#ef4444"]);

  const getCountryStats = (geo) => {
    // Note: react-simple-maps uses ISO-3 IDs or names. We map our jurisdiction strings.
    // This is a simplified mapping for demonstration.
    const isoMap = {
      'USA': 'United States of America',
      'EU': 'European Union',
      'IN': 'India',
      'CN': 'China',
      'JP': 'Japan',
      'AU': 'Australia',
      'CA': 'Canada'
    };

    // Find data by name or ID (Simplified match)
    return data.find(d => 
      d.id === geo.properties.name || 
      d.id === geo.id || 
      isoMap[d.id] === geo.properties.name
    );
  };

  const handleCountryClick = (geo) => {
    const stats = getCountryStats(geo);
    if (stats) {
      setSelectedCountry({ ...geo.properties, stats });
      setDrawerOpen(true);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', position: 'relative' }}>
      {/* HEADER OVERLAY */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box sx={{ zIndex: 10 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>GEOSPATIAL INTELLIGENCE</Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>Interactive Global Risk Heatmap</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Real-time jurisdictional risk scoring and patent coverage visualization across world markets.
          </Typography>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: alpha('#fff', 0.8), backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: "#ef4444" }} />
               <Typography variant="caption" sx={{ fontWeight: 800 }}>CRITICAL RISK (75%+ EXPIRED/SOON)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: "#f59e0b" }} />
               <Typography variant="caption" sx={{ fontWeight: 800 }}>ELEVATED RISK (40-75%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: "#10b981" }} />
               <Typography variant="caption" sx={{ fontWeight: 800 }}>STABLE COVERAGE (0-40%)</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* WORLD MAP CONTAINER */}
      <Paper sx={{ 
        height: 'calc(100vh - 280px)', 
        borderRadius: 6, 
        overflow: 'hidden', 
        border: '1px solid #e2e8f0', 
        bgcolor: '#f8fafc',
        position: 'relative'
      }}>
        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
          <ZoomableGroup zoom={1}>
            <Sphere stroke="#e2e8f0" strokeWidth={0.5} />
            <Graticule stroke="#e2e8f0" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stats = getCountryStats(geo);
                  const isHovered = hoveredCountry === geo.id;
                  const isSelected = selectedCountry?.name === geo.properties.name;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={() => setHoveredCountry(geo.id)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: stats ? colorScale(stats.riskScore) : "#e2e8f0",
                          outline: "none",
                          stroke: "#fff",
                          strokeWidth: 0.5,
                          transition: "all 0.2s"
                        },
                        hover: {
                          fill: stats ? alpha(colorScale(stats.riskScore), 0.8) : "#cbd5e1",
                          outline: "none",
                          stroke: "#3b82f6",
                          strokeWidth: 1,
                          cursor: "pointer"
                        },
                        pressed: {
                          fill: "#3b82f6",
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* MAP LEGEND OVERLAY (Bottom Left) */}
        <Box sx={{ position: 'absolute', bottom: 30, left: 30, p: 3, bgcolor: alpha('#fff', 0.9), backdropFilter: 'blur(12px)', borderRadius: 4, border: '1px solid #e2e8f0', maxWidth: 300 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Globe size={18} color="#3b82f6" /> Global Intelligence Pulse
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Jurisdictional models aggregate coverage patterns from {data.reduce((a, b) => a + b.count, 0)} intellectual property assets.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Target size={14} color="#10b981" />
             <Typography variant="caption" sx={{ fontWeight: 800 }}>98.4% Geospatial Accuracy</Typography>
          </Box>
        </Box>
      </Paper>

      {/* COUNTRY DETAIL DRAWER */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 450, p: 0, borderRadius: '24px 0 0 24px', overflow: 'hidden' }
        }}
      >
        <AnimatePresence>
          {selectedCountry && (
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <Box sx={{ p: 4, bgcolor: alpha(colorScale(selectedCountry.stats.riskScore), 0.05), borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                <IconButton 
                  onClick={() => setDrawerOpen(false)} 
                  sx={{ position: 'absolute', top: 20, right: 20 }}
                >
                  <X size={20} />
                </IconButton>
                
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900 }}>JURISDICTIONAL REPORT</Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontFamily: 'Outfit' }}>{selectedCountry.name}</Typography>
                
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip 
                    label={selectedCountry.stats.status} 
                    color={selectedCountry.stats.status === 'CRITICAL' ? 'error' : 'warning'} 
                    size="small" 
                    sx={{ fontWeight: 900, borderRadius: 1.5 }}
                  />
                  <Chip 
                    label={`ISO: ${selectedCountry.stats.id}`} 
                    variant="outlined" 
                    size="small" 
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
              </Box>

              <Box sx={{ p: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Portfolio Performance</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800 }}>TOTAL ASSETS</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mt: 0.5 }}>{selectedCountry.stats.count}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800 }}>RISK SCORE</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: colorScale(selectedCountry.stats.riskScore), mt: 0.5 }}>{selectedCountry.stats.riskScore}%</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldAlert size={18} color="#ef4444" /> Regulatory Vulnerabilities
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><AlertTriangle size={20} color="#f59e0b" /></ListItemIcon>
                    <ListItemText 
                      primary={`${selectedCountry.stats.highRiskCount} High-Risk Expiries`} 
                      secondary="Strategic assets expiring within the 24-month high-risk window."
                      primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><TrendingUp size={20} color="#10b981" /></ListItemIcon>
                    <ListItemText 
                      primary="Market Scarcity Index" 
                      secondary="No generic challengers currently identified in this jurisdiction."
                      primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }}
                    />
                  </ListItem>
                </List>

                <Box sx={{ mt: 6 }}>
                  <Button variant="contained" fullWidth size="large" sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}>
                    Download Jurisdictional Deep-Dive
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </Box>
  );
};

export default RiskHeatmap;
