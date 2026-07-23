import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Button, useTheme,
} from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CarbonDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  const monthlyData = [
    { month: 'Jan', co2: 38 },
    { month: 'Feb', co2: 36 },
    { month: 'Mar', co2: 34 },
    { month: 'Apr', co2: 32 },
    { month: 'May', co2: 30 },
    { month: 'Jun', co2: 31 },
  ];

  const departmentEmissions = [
    { name: 'Core Banking', value: 42 },
    { name: 'Loans', value: 35 },
    { name: 'Deposits', value: 23 },
  ];

  const COLORS = [theme.palette.success.main, theme.palette.secondary.main, theme.palette.success.light];

  return (
    <Box sx={{ height: { xs: 'auto', md: 'calc(84vh - 80px)' }, display: 'flex', flexDirection: 'column', pr: { xs: 0, md: 5 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/')}
          sx={{ minWidth: 40, width: 40, height: 40, borderRadius: '50%', p: 0 }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Carbon Impact & ESG Metrics
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Real-time monitoring of carbon footprint, AI-driven energy optimization, and offset metrics
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: { xs: 'auto', md: 'auto 1fr 1fr' },
          gap: 2,
          maxWidth: '1060px',
          flexGrow: 1,
          height: 'calc(100% - 60px)',
          minHeight: 0
        }}
      >
        {/* ROW 1: KPI Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {[
            { icon: <VerifiedIcon sx={{ fontSize: '1.2rem', color: 'success.main' }} />, title: 'Current CO₂', value: '31 Tons', desc: 'Monthly baseline', color: 'text.primary' },
            { icon: <WarningAmberIcon sx={{ fontSize: '1.2rem', color: 'secondary.main' }} />, title: 'AI Optimized', value: '18.6 Tons', desc: '40% reduction', color: 'success.main' },
            { icon: <VerifiedIcon sx={{ fontSize: '1.2rem', color: 'success.light' }} />, title: 'Carbon Saved', value: '12.4 Tons', desc: 'Annual impact', color: 'success.main' },
            { icon: <VerifiedIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />, title: 'Tree Equivalent', value: '2,054', desc: 'Trees to offset', color: 'primary.main' },
          ].map((kpi, idx) => (
            <Card key={idx} className="glass-card" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {kpi.icon}
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {kpi.title}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: kpi.color, mt: 0.5, mb: 0.2, fontSize: '1.1rem' }}>
                {kpi.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                {kpi.desc}
              </Typography>
            </Card>
          ))}
        </Box>

        {/* ROW 2: Charts */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, minHeight: 0 }}>
          {/* Monthly Trend Chart */}
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1 }}>
              Monthly CO₂ Trend
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke={theme.palette.success.main}
                    strokeWidth={2.5}
                    dot={{ fill: theme.palette.success.main, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* Department Emissions Pie */}
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1, textAlign: 'left' }}>
              Emissions by Department
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentEmissions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius="75%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentEmissions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>

        {/* ROW 3: AI Recommendations */}
        <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1 }}>
            🤖 Green Recommendations
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, flexGrow: 1, overflowY: 'hidden' }}>
            {[
              { title: 'Optimize Data Center Operations', impact: '~4.2 Tons CO₂/year', status: 'High Impact' },
              { title: 'Implement Cloud Auto-Scaling', impact: '~3.8 Tons CO₂/year', status: 'Medium Impact' },
              { title: 'Reduce Compliance Report Frequency', impact: '~2.1 Tons CO₂/year', status: 'Quick Win' },
              { title: 'Adopt Sustainable Vendors', impact: '~2.3 Tons CO₂/year', status: 'Strategic' },
            ].map((rec, i) => (
              <Box key={i} sx={{ p: 1, bgcolor: 'rgba(45, 212, 191, 0.04)', borderLeft: `3px solid ${theme.palette.success.main}`, borderRadius: '0 6px 6px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.2, color: 'text.primary', fontSize: '0.7rem' }}>
                  {rec.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.62rem' }}>
                    Potential: {rec.impact}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      px: 0.8,
                      py: 0.2,
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.55rem'
                    }}
                  >
                    {rec.status}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
