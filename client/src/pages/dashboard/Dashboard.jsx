import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Stack, 
  Skeleton, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Paper,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Globe, 
  ShieldCheck,
  Clock,
  History,
  Dna,
  FlaskConical,
  FileText
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const KPICard = ({ title, value, icon, color, trend, loading, onClick, subtitle }) => (
  <Card 
    onClick={onClick}
    sx={{ 
      height: '100%', 
      borderRadius: 4, 
      border: '1px solid #e2e8f0', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? { transform: 'translateY(-4px)', borderColor: 'primary.main', boxShadow: '0 10px 20px rgba(0,0,0,0.08)' } : {}
    }}
  >
    <CardContent>
      {loading ? (
        <Stack spacing={1}>
           <Skeleton variant="text" width="60%" />
           <Skeleton variant="rectangular" height={40} width="40%" />
           <Skeleton variant="text" width="80%" sx={{ mt: 2 }} />
        </Stack>
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</Typography>
              <Typography variant="h2" sx={{ mt: 1, fontWeight: 900 }}>{value}</Typography>
              {subtitle && <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{subtitle}</Typography>}
            </Box>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(color === 'error' ? '#ef4444' : color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : '#10b981', 0.1), color: color === 'error' ? '#ef4444' : color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : '#10b981' }}>
              {icon}
            </Box>
          </Stack>
          {trend && (
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'success.main', fontWeight: 800 }}>
              <TrendingUp size={14} style={{ marginRight: 4 }} /> {trend}
            </Typography>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState({ patents: [], drugs: [], apis: [], documents: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, aRes, dRes, apiRes, docRes] = await Promise.all([
          api.get('/patents'),
          api.get('/compliance/audit'),
          api.get('/registry/drugs'),
          api.get('/registry/apis'),
          api.get('/documents')
        ]);
        setData({ 
          patents: pRes.data.data, 
          logs: aRes.data.data.slice(0, 8),
          drugs: dRes.data.data,
          apis: apiRes.data.data,
          documents: docRes.data.data
        });
      } catch (err) {
        console.error('Strategic Retrieval failure:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  // KPI Calculations
  const today = new Date();
  const in12Months = new Date(today); in12Months.setFullYear(today.getFullYear() + 1);
  const expiringPatents = data.patents.filter(p => new Date(p.expiryDate) <= in12Months && new Date(p.expiryDate) > today);
  const grantedCount = data.patents.filter(p => p.status === 'GRANTED').length;
  const drugsWithCoverage = data.drugs.filter(d => d.linkedApis?.length > 0).length;
  const coveragePct = data.drugs.length > 0 ? Math.round((drugsWithCoverage / data.drugs.length) * 100) : 0;

  // Jurisdiction chart data
  const jurisData = Object.entries(
    data.patents.reduce((acc, p) => { acc[p.jurisdiction] = (acc[p.jurisdiction] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  // Expiry timeline — patents per year
  const expiryByYear = data.patents.reduce((acc, p) => {
    const yr = new Date(p.expiryDate).getFullYear();
    if (!isNaN(yr)) acc[yr] = (acc[yr] || 0) + 1;
    return acc;
  }, {});
  const expiryTimeline = Object.entries(expiryByYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, count]) => ({ year, count }));

  // 10-Color Categorical Palette (High Contrast)
  const COLORS = [
    '#2563eb', // Blue (USA)
    '#10b981', // Emerald (EU)
    '#f59e0b', // Amber (India)
    '#ef4444', // Red (China)
    '#6366f1', // Indigo (Japan)
    '#0d9488', // Teal (Australia)
    '#8b5cf6', // Violet (Canada)
    '#ec4899', // Pink
    '#f97316', // Orange
    '#06b6d4'  // Cyan
  ];

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 6 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>STRATEGIC OVERVIEW</Typography>
        <Typography variant="h1" sx={{ mb: 1 }}>Enterprise Intelligence</Typography>
        <Typography color="text.secondary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          V2.0 Strategic Intellectual Property & Regulatory Compliance Suite
        </Typography>
      </Box>
      
      {/* KPI LAYER — 6 cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KPICard loading={loading} title="Active Patents" value={grantedCount} icon={<Database size={22} />} color="primary" trend={`${data.patents.length} total`} onClick={() => navigate('/patents')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KPICard loading={loading} title="Expiry Risk (12mo)" value={expiringPatents.length} icon={<AlertTriangle size={22} />} color="error" trend="Action required" onClick={() => navigate('/patents')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KPICard loading={loading} title="Drug Coverage" value={`${coveragePct}%`} icon={<ShieldCheck size={22} />} color="success" subtitle={`${drugsWithCoverage}/${data.drugs.length} drugs protected`} onClick={() => navigate('/drugs')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KPICard loading={loading} title="Vault Assets" value={data.documents.length} icon={<FileText size={22} />} color="primary" trend="Secure storage" onClick={() => navigate('/documents')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KPICard loading={loading} title="Drugs Registered" value={data.drugs.length} icon={<Dna size={22} />} color="success" onClick={() => navigate('/drugs')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KPICard loading={loading} title="API Ingredients" value={data.apis.length} icon={<FlaskConical size={22} />} color="warning" onClick={() => navigate('/apis')} />
        </Grid>
      </Grid>

      {/* ANALYTICS LAYER */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 4, borderRadius: 6, minHeight: 380, border: '1px solid #f1f5f9' }}>
             <Box sx={{ mb: 4 }}>
               <Typography variant="h3" sx={{ fontWeight: 900 }}>Patent Expiry Timeline</Typography>
               <Typography variant="body2" color="text.secondary">Number of patents expiring per year</Typography>
             </Box>
             <Box sx={{ width: '100%', height: 280 }}>
                {loading ? <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 4 }} /> : (
                  <ResponsiveContainer width="100%" height={280} minHeight={0}>
                    <BarChart data={expiryTimeline}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                        {expiryTimeline.map((entry, i) => (
                           <Cell key={i} fill={Number(entry.year) <= today.getFullYear() + 2 ? '#ef4444' : '#2563eb'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
             </Box>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 4, borderRadius: 6, minHeight: 380, border: '1px solid #f1f5f9' }}>
             <Typography variant="h3" sx={{ mb: 1, fontWeight: 900 }}>Portfolio Share</Typography>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Strategic distribution by jurisdiction</Typography>
             <Box sx={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? <Skeleton variant="circular" height={220} width={220} /> : (
                  <ResponsiveContainer width="100%" height={280} minHeight={0}>
                    <PieChart>
                      <Pie data={jurisData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                        {jurisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
             </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ACTIVITY LAYER */}
      <Paper sx={{ p: 0, borderRadius: 6, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>Recent GxP Audit Traceability</Typography>
          <Typography variant="body2" color="text.secondary">System-wide immutable personnel action history (21 CFR Part 11)</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PERSONNEL IDENTIFIER</TableCell>
                <TableCell>REGULATORY ACTION</TableCell>
                <TableCell>TARGET ENTITY</TableCell>
                <TableCell align="right">RECORDED TIMESTAMP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={4}><Skeleton height={50} /></TableCell></TableRow>
              )) : data.logs.map((log) => (
                <TableRow key={log.id} hover sx={{ transition: 'all 0.2s' }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 900, bgcolor: alpha('#2563eb', 0.1), color: '#2563eb' }}>
                        {(log.userId ?? 'U').split('@')[0]?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{log.userId ?? 'anonymous'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.action} 
                      size="small" 
                      color={log.action === 'POST' ? 'success' : log.action === 'DELETE' ? 'error' : log.action === 'PUT' ? 'info' : 'default'}
                      sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.65rem' }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{log.target ?? log.targetUrl ?? 'CORE_SYSTEM'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                      <Clock size={14} color="#64748b" />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
