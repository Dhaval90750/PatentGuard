import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  HelpCircle,
  FileText,
  PhoneCall,
  MessageSquare,
  Globe,
  ExternalLink,
  ShieldCheck,
  LifeBuoy,
  Search as SearchIcon,
  X,
  Send,
  Download
} from 'lucide-react';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [activeHelp, setActiveHelp] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const resources = [
    {
      id: 1,
      title: 'VantagePoint Standard Operating Procedures (SOP-001-A)',
      sub: 'Last updated: 2 days ago • Regulatory Affairs',
      type: 'SOP',
      icon: <FileText size={24} color="#2563eb" />,
      content: 'This document outlines the standard operating procedures for the VantagePoint IP Management system. It covers user onboarding, patent data entry, and GxP validation protocols. All Tier 1-3 personnel must adhere to these guidelines to ensure 21 CFR Part 11 compliance.'
    },
    {
      id: 2,
      title: '21 CFR Part 11 Compliance Guide',
      sub: 'Electronic Records; Electronic Signatures Overview',
      type: 'Regulation',
      icon: <ShieldCheck size={24} color="#10b981" />,
      content: 'FDA Regulation 21 CFR Part 11 establishes the criteria under which electronic records and electronic signatures are considered trustworthy, reliable, and equivalent to paper records. Key focus areas: Audit trails, authority checks, and device checks.'
    },
    {
      id: 3,
      title: 'EMA Regulatory Filing Guidelines (2026)',
      sub: 'European Medicines Agency Standards',
      type: 'Guide',
      icon: <Globe size={24} color="#f59e0b" />,
      content: 'Guidelines for the electronic submission of regulatory information for medicinal products in the European Union. Focuses on the use of eCTD (Electronic Common Technical Document) format for centralized and decentralized procedures.'
    },
    {
      id: 4,
      title: 'Drug-Patent Mapping Methodology',
      sub: 'Technical whitepaper on v2.0 mapping engine',
      type: 'Technical',
      icon: <HelpCircle size={24} color="#6366f1" />,
      content: 'Explains the proprietary algorithm used by the VantagePoint Mapping Engine to associate active pharmaceutical ingredients (APIs) with matching patent claims across multiple global jurisdictions.'
    },
  ];

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h2" gutterBottom>GxP Support Hub</Typography>
          <Typography variant="body1" color="text.secondary">Access regulatory documentation, FAQs, and expert help.</Typography>
        </Box>
        <Button variant="contained" startIcon={<LifeBuoy size={18} />} onClick={() => setActiveHelp('Expert Support')}>Contact Expert</Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left: Quick Resources */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 0, overflow: 'hidden', mb: 4 }}>
            <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search Knowledge Base (SOPs, Guides, Regulatory Docs)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon size={20} style={{ marginRight: 12, color: '#64748b' }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc' } }}
              />
            </Box>
            <List sx={{ p: 0 }}>
              {filteredResources.length > 0 ? filteredResources.map((res, i) => (
                <React.Fragment key={res.id}>
                  <ListItem sx={{ py: 3, px: 4 }}>
                    <ListItemIcon>{res.icon}</ListItemIcon>
                    <ListItemText
                      primary={res.title}
                      secondary={res.sub}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ExternalLink size={14} />}
                      onClick={() => setViewingDoc(res)}
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      Open
                    </Button>
                  </ListItem>
                  {i < filteredResources.length - 1 && <Divider variant="middle" />}
                </React.Fragment>
              )) : (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography color="text.secondary" fontWeight={600}>No matching regulatory resources found.</Typography>
                </Box>
              )}
            </List>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                onClick={() => setActiveHelp('Frequently Asked Questions')}
                sx={{ cursor: 'pointer', p: 4, height: '100%', border: '1px solid transparent', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(37, 99, 235, 0.02)' } }}
              >
                <HelpCircle size={32} color="#2563eb" style={{ marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>Browse FAQs</Typography>
                <Typography variant="body2" color="text.secondary">Common questions about patent mapping and drug registration.</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                onClick={() => setChatOpen(true)}
                sx={{ cursor: 'pointer', p: 4, height: '100%', border: '1px solid transparent', '&:hover': { borderColor: 'secondary.main', bgcolor: 'rgba(16, 185, 129, 0.02)' } }}
              >
                <MessageSquare size={32} color="#10b981" style={{ marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>Live Chat</Typography>
                <Typography variant="body2" color="text.secondary">Connect with our support team in real-time (Available 24/7).</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right: Emergency Support */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, bgcolor: '#0f172a', color: '#fff', textAlign: 'center', borderRadius: 6 }}>
            <PhoneCall size={48} color="#ef4444" style={{ marginBottom: 24 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 900 }}>Priority Hotline</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>Available for Tier 3 personnel and critical compliance failures.</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: 1, mb: 4 }}>+1 (800) GXP-HELP</Typography>
            <Button variant="contained" color="error" fullWidth sx={{ py: 1.5, borderRadius: 3, fontWeight: 800 }}>Request Emergency Audit</Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Document Viewer Dialog */}
      <Dialog
        open={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {viewingDoc?.icon}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{viewingDoc?.title}</Typography>
              <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>TYPE: {viewingDoc?.type}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setViewingDoc(null)}><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {viewingDoc?.content}
            </Typography>
          </Box>
          <Box sx={{ mt: 4, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              Audit Notice: This document is a controlled copy retrieval. Access has been logged in your personnel activity history for 21 CFR Part 11 consistency.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setViewingDoc(null)} color="inherit" sx={{ fontWeight: 700 }}>Close Viewer</Button>
          <Button variant="contained" startIcon={<Download size={18} />} sx={{ borderRadius: 3, px: 3, fontWeight: 800 }}>Download Validated PDF</Button>
        </DialogActions>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={Boolean(activeHelp)} onClose={() => setActiveHelp(null)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>{activeHelp}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This module is being routed to the Global Regulatory Affairs helpdesk.
            A specialist will respond to this ticket identifier (TRK-552-XP) within 24 hours.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="contained" onClick={() => setActiveHelp(null)}>Acknowledge</Button>
        </DialogActions>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} PaperProps={{ sx: { borderRadius: 4, width: 400, height: 500, display: 'flex', flexDirection: 'column' } }}>
        <DialogTitle sx={{ fontWeight: 900, bgcolor: 'primary.main', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          GxP Live Support
          <IconButton onClick={() => setChatOpen(false)} sx={{ color: '#fff' }}><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3 }}>
          <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 3, mb: 2, alignSelf: 'flex-start', maxWidth: '80%' }}>
            <Typography variant="body2" fontWeight={700}>VantagePoint AI</Typography>
            <Typography variant="body2">Hello! How can I assist with your regulatory filing today?</Typography>
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
          <TextField fullWidth placeholder="Type message..." size="small" variant="standard" InputProps={{ disableUnderline: true }} />
          <IconButton color="primary"><Send size={20} /></IconButton>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Support;
