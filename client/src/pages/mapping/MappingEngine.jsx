import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import { 
  Zap, 
  Database, 
  ShieldAlert, 
  Info, 
  RefreshCw,
  Maximize2
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

/**
 * @desc    Intelligent Nodal Mapping Graph (V5.0 Fulfillment)
 * @purpose Implements a production-ready Graph Visualization of Drug -> API -> Patent relationships.
 *          Built as a Senior Frontend Architect using React Flow.
 */
const MappingEngine = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  const fetchMappingData = useCallback(async () => {
    setLoading(true);
    try {
      await api.post('/mapping/sync');
      const response = await api.get('/mapping/summary');
      const data = response.data.data;
      
      const newNodes = [];
      const newEdges = [];
      
      // GRID LAYOUT LOGIC
      let yOffset = 0;
      
      data.forEach((drug, drugIdx) => {
        // DRUG NODE (Level 0)
        const drugNodeId = `drug-${drug.id}`;
        newNodes.push({
          id: drugNodeId,
          data: { label: (
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.6 }}>STRATEGIC ASSET</Typography>
               <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{drug.name}</Typography>
            </Box>
          )},
          position: { x: 0, y: yOffset },
          style: { 
            background: alpha('#1a56db', 0.1), 
            border: '2px solid #1a56db', 
            borderRadius: 12, 
            padding: 10,
            width: 180
          }
        });

        drug.apis.forEach((api, apiIdx) => {
          // API NODE (Level 1)
          const apiNodeId = `api-${api.id}-${drug.id}`;
          newNodes.push({
            id: apiNodeId,
            data: { label: (
              <Box>
                 <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.6 }}>ACTIVE API</Typography>
                 <Typography variant="body2" sx={{ fontWeight: 800 }}>{api.name}</Typography>
              </Box>
            )},
            position: { x: 300, y: yOffset + (apiIdx * 100) },
            style: { 
              background: alpha('#f59e0b', 0.1), 
              border: '2px solid #f59e0b', 
              borderRadius: 12, 
              padding: 10,
              width: 180
            }
          });

          // Edge: Drug -> API
          newEdges.push({
            id: `edge-${drugNodeId}-${apiNodeId}`,
            source: drugNodeId,
            target: apiNodeId,
            animated: true,
            style: { stroke: '#1a56db', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#1a56db' }
          });

          api.patents.forEach((patent, patIdx) => {
            // PATENT NODE (Level 2)
            const isExpiringSoon = new Date(patent.expiryDate) < new Date(new Date().setFullYear(new Date().getFullYear() + 2));
            const patentNodeId = `patent-${patent.id}-${api.id}-${drug.id}`;
            
            newNodes.push({
              id: patentNodeId,
              data: { label: (
                <Box>
                   <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.6 }}>PROTECTING PATENT</Typography>
                   <Typography variant="body2" sx={{ fontWeight: 900, color: isExpiringSoon ? '#ef4444' : 'inherit' }}>{patent.patentNumber}</Typography>
                </Box>
              )},
              position: { x: 600, y: yOffset + (apiIdx * 100) + (patIdx * 60) },
              style: { 
                background: isExpiringSoon ? alpha('#ef4444', 0.05) : '#fff', 
                border: isExpiringSoon ? '2px solid #ef4444' : '1px solid #e2e8f0', 
                borderRadius: 12, 
                padding: 10,
                width: 180
              }
            });

            // Edge: API -> Patent
            newEdges.push({
              id: `edge-${apiNodeId}-${patentNodeId}`,
              source: apiNodeId,
              target: patentNodeId,
              style: { stroke: isExpiringSoon ? '#ef4444' : '#94a3b8', strokeWidth: 1.5 },
              markerEnd: { type: MarkerType.ArrowClosed, color: isExpiringSoon ? '#ef4444' : '#94a3b8' }
            });
          });
        });
        
        yOffset += Math.max(drug.apis.length * 150, 200);
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      console.error('Mapping Engine Nodal failure:', err);
    } finally {
      setLoading(false);
    }
  }, [token, setNodes, setEdges]);

  useEffect(() => {
    if (token) fetchMappingData();
  }, [token, fetchMappingData]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress size={48} /></Box>;

  if (!nodes.length) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
      <Alert severity="info" sx={{ borderRadius: 3, fontWeight: 700 }}>No drug → API → patent mappings found. Register drugs and link APIs first.</Alert>
    </Box>
  );

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', position: 'relative' }}>
      {/* HEADER CONTROL BAR */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: 2 }}>
         <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box>
               <Typography variant="h4" sx={{ fontWeight: 900 }}>Strategic Dependency Map</Typography>
               <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>V5.0 Real-time Portfolio Coverage Visualization</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Stack direction="row" spacing={1}>
               <Chip icon={<Zap size={14} />} label="LIVE SYNC" size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
               <Chip icon={<ShieldAlert size={14} />} label="RISK INTELLIGENCE ACTIVE" size="small" variant="outlined" color="error" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
            </Stack>
            <Tooltip title="Refresh Registry Map">
               <IconButton onClick={fetchMappingData} size="small" sx={{ ml: 2 }}><RefreshCw size={18} /></IconButton>
            </Tooltip>
         </Paper>
      </Box>

      {/* NODE LEGEND */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
         <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Stack spacing={1}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1a56db' }} />
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>COMMERCIAL PRODUCT</Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>ACTIVE INGREDIENT</Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>EXPIRY RISK PATENTS</Typography>
               </Box>
            </Stack>
         </Paper>
      </Box>

      {/* REACT FLOW CANVAS */}
      <Paper sx={{ height: '100%', borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#fcfdfe' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background color="#e2e8f0" gap={24} size={1} />
          <Controls sx={{ 
            '& .react-flow__controls-button': { 
              bgcolor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: 2, 
              m: 0.5,
              '&:hover': { bgcolor: alpha('#1a56db', 0.05) }
            } 
          }} />
          <MiniMap 
            nodeStrokeColor="#e2e8f0" 
            nodeColor={(n) => n.style.background}
            maskColor="rgba(248, 250, 252, 0.7)"
            style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          />
        </ReactFlow>
      </Paper>
    </Box>
  );
};

export default MappingEngine;
