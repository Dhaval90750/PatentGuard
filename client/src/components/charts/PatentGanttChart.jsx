import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { Box, Typography, Paper, alpha } from '@mui/material';

/**
 * @desc    Patent Portfolio Timeline (Gantt-Style)
 * @purpose Visualizes patent protection periods across the portfolio.
 */
const PatentGanttChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Transform data for Gantt visualization
  // Recharts doesn't have a native Gantt, so we use a stacked bar with a transparent filler.
  const chartData = data.map(patent => {
    const start = new Date(patent.filingDate).getTime();
    const end = new Date(patent.expiryDate).getTime();
    const duration = end - start;
    
    return {
      name: patent.patentNumber,
      title: patent.title,
      startOffset: start,
      duration: duration,
      days: Math.floor(duration / (1000 * 60 * 60 * 24)),
      jurisdiction: patent.jurisdiction
    };
  }).sort((a, b) => a.startOffset - b.startOffset);

  // Find the absolute minimum start time to use as the X-axis baseline
  const minStart = Math.min(...chartData.map(d => d.startOffset));

  const normalizedData = chartData.map(d => ({
    ...d,
    baseline: d.startOffset - minStart,
    activeRange: d.duration
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, boxShadow: 3, border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" color="primary">{data.name}</Typography>
          <Typography variant="body2">{data.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            Coverage: {Math.floor(data.days / 365)} years ({data.jurisdiction})
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 400, mt: 2 }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={normalizedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{ fontSize: 11, fontWeight: 700 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: alpha('#f1f5f9', 0.5) }} />
          
          {/* Transparent filler bar to push the active range to the correct start date */}
          <Bar dataKey="baseline" stackId="a" fill="transparent" />
          
          {/* The actual Gantt bar */}
          <Bar dataKey="activeRange" stackId="a" radius={[0, 4, 4, 0]}>
            {normalizedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.jurisdiction === 'USA' ? '#1a56db' : '#10b981'} 
              />
            ))}
            <LabelList 
              dataKey="jurisdiction" 
              position="right" 
              style={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PatentGanttChart;
