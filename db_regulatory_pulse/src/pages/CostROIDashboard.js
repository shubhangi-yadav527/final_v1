import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Button, useTheme,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CostROIDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  const comparisonData = [
    { category: 'Infrastructure', current: 1200, optimized: 720 },
    { category: 'Compliance', current: 1500, optimized: 800 },
    { category: 'Carbon', current: 400, optimized: 180 },
    { category: 'Other', current: 240, optimized: 120 },
  ];

  const roiTimeline = [
    { month: 'Q1 24', roi: 0 },
    { month: 'Q2 24', roi: 15 },
    { month: 'Q3 24', roi: 35 },
    { month: 'Q4 24', roi: 55 },
    { month: 'Q1 25', roi: 80 },
    { month: 'Q2 25', roi: 120 },
  ];

  return (
    <Box sx={{ height: { xs: 'auto', md: 'calc(84vh - 80px)' }, display: 'flex', flexDirection: 'column', pr: { xs: 0, md: 5 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(-1)}
          sx={{ minWidth: 40, width: 40, height: 40, borderRadius: '50%', p: 0 }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Cost & ROI Analysis
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Current baseline expenditures vs. AI-optimized projections, annual savings, and payback timeline
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: { xs: 'auto', md: 'auto 1.2fr 1fr' },
          gap: 2,
          maxWidth: '1060px',
          flexGrow: 1,
          height: 'calc(100% - 60px)',
          minHeight: 0
        }}
      >
        {/* ROW 1: Key Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {[
            { label: 'Current Annual Cost', value: '€3.34 M', desc: 'Baseline', color: 'error.main', bg: 'rgba(239, 68, 68, 0.04)' },
            { label: 'AI Optimized Cost', value: '€1.70 M', desc: 'Projected', color: 'warning.main', bg: 'rgba(245, 158, 11, 0.04)' },
            { label: 'Annual Savings', value: '€1.66 M', desc: '49.7% reduction', color: 'success.main', bg: 'rgba(16, 185, 129, 0.04)' },
            { label: 'Payback Period', value: '8 months', desc: 'Break-even', color: 'primary.main', bg: 'rgba(0, 24, 168, 0.04)' },
          ].map((item, idx) => (
            <Card key={idx} className="glass-card" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: item.bg }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: item.color, mt: 0.5, mb: 0.2, fontSize: '1.1rem' }}>
                {item.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                {item.desc}
              </Typography>
            </Card>
          ))}
        </Box>

        {/* ROW 2: Charts Side by Side */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, minHeight: 0 }}>
          {/* Cost Breakdown */}
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1 }}>
              Cost Breakdown: Current vs Optimized
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="current" fill={theme.palette.error.main} name="Current (€K)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="optimized" fill={theme.palette.success.main} name="Optimized (€K)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* ROI Timeline */}
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1 }}>
              ROI Timeline Projection
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiTimeline} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="roi" fill={theme.palette.success.main} name="ROI (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>

        {/* ROW 3: Details & Roadmap Side by Side */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, minHeight: 0 }}>
          {/* Savings Breakdown */}
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1 }}>
              Savings Breakdown
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, flexGrow: 1 }}>
              {[
                { title: 'Infrastructure', amount: '€480K', color: 'primary' },
                { title: 'Compliance', amount: '€700K', color: 'success' },
                { title: 'Carbon Offset', amount: '€220K', color: 'secondary' },
              ].map((item, i) => (
                <Box key={i} sx={{ p: 1, bgcolor: `${theme.palette[item.color].main}10`, borderRadius: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', border: `1px solid ${theme.palette[item.color].main}20` }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.6rem', display: 'block', mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: theme.palette[item.color].main, fontSize: '0.85rem' }}>
                    {item.amount}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Implementation Roadmap */}
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1 }}>
              Implementation Roadmap
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase, i) => (
                <Box key={i} sx={{ flex: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      height: 12,
                      borderRadius: 1.5,
                      bgcolor: i <= 1 ? theme.palette.success.main : theme.palette.primary.main,
                      mb: 0.5,
                      opacity: i > 1 ? 0.35 : 1,
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.6rem', display: 'block' }}>
                    {phase}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.55rem' }}>
                    {i <= 1 ? 'Complete' : 'Planned'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
