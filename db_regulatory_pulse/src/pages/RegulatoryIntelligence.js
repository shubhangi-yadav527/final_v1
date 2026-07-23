import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Card, Typography, Chip, Button, useTheme,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

export default function RegulatoryIntelligence() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const filterSeverity = location.state?.filterSeverity || null;

  const [regulations, setRegulations] = useState(() => {
    try {
      const cached = localStorage.getItem('db_regulatory_pulse_regulations');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      console.error('Failed to load regulations cache:', e);
      return [];
    }
  });
  const [totalRegulations, setTotalRegulations] = useState(() => {
    try {
      const cached = localStorage.getItem('db_regulatory_pulse_regulations_count');
      return cached ? parseInt(cached, 10) : 0;
    } catch (e) {
      console.error('Failed to load regulations count cache:', e);
      return 0;
    }
  });

  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/regulations`);
        setRegulations(res.data.regulations);
        try {
          localStorage.setItem('db_regulatory_pulse_regulations', JSON.stringify(res.data.regulations));
        } catch (storageError) {
          console.warn('Failed to save regulations to cache:', storageError);
        }
      } catch (error) {
        console.error('Failed to fetch regulations:', error);
      }
    };

    const fetchRegulationsCount = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/regulations/count`);
        setTotalRegulations(res.data.count);
        try {
          localStorage.setItem('db_regulatory_pulse_regulations_count', res.data.count.toString());
        } catch (storageError) {
          console.warn('Failed to save regulations count to cache:', storageError);
        }
      } catch (error) {
        console.error('Failed to fetch regulations count:', error);
      }
    };

    fetchRegulations();
    fetchRegulationsCount();
  }, []);

  const filteredRegulations = (filterSeverity
    ? regulations.filter(r => r.severity.toLowerCase() === filterSeverity.toLowerCase())
    : regulations
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  // De-duplicate regulations by name and calculate the correct count of impacted departments
  const uniqueRegulations = [];
  const regulationMap = new Map();

  for (const reg of filteredRegulations) {
    const dept = reg.department || reg.department_impacted;
    if (!regulationMap.has(reg.name)) {
      regulationMap.set(reg.name, {
        ...reg,
        departmentsList: new Set(dept ? [dept] : [])
      });
    } else {
      const existing = regulationMap.get(reg.name);
      if (dept) {
        existing.departmentsList.add(dept);
      }
    }
  }

  for (const reg of regulationMap.values()) {
    uniqueRegulations.push({
      ...reg,
      departments: reg.departmentsList.size || 1
    });
  }

  const getSeverityColor = (severity) => {
    const colors = {
      high: theme.palette.error.main,
      medium: theme.palette.warning.main,
      compliant: theme.palette.success.main,
      neutral: '#9CA3AF',
    };
    return colors[severity] || theme.palette.primary.main;
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      high: 'High',
      medium: 'Medium',
      compliant: 'Compliant',
      neutral: 'Neutral',
    };
    return labels[severity] || 'Unknown';
  };

  return (
    <Box sx={{ height: { xs: 'auto', md: 'calc(84vh - 80px)' }, display: 'flex', flexDirection: 'column', pr: { xs: 0, md: 5 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            minWidth: 36,
            width: 36,
            height: 36,
            borderRadius: '50%',
            p: 0,
            color: 'primary.main',
            borderColor: 'primary.main',
            borderWidth: '1.5px',
            bgcolor: 'rgba(0, 24, 168, 0.03)',
            '&:hover': {
              borderWidth: '1.5px',
              bgcolor: 'rgba(0, 24, 168, 0.08)',
            }
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Regulatory Intelligence ({totalRegulations})
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Tracking upcoming global banking standards, directives, and digital operational frameworks
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
          gap: 3,
          maxWidth: '1060px',
          flexGrow: 1,
          height: 'calc(100% - 60px)',
          minHeight: 0
        }}
      >
        {/* Column 1: Timeline Card with internal scrolling */}
        <Card className="glass-card" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: '#ffffff', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
              Upcoming Regulations Timeline {filterSeverity && `(${getSeverityLabel(filterSeverity)})`}
            </Typography>
            {filterSeverity && (
              <Chip
                label="Clear"
                size="small"
                onDelete={() => navigate('/ai', { replace: true, state: {} })}
                color="primary"
                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
              />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1.5 }}>
            <Timeline position="alternate" sx={{ p: 0, m: 0 }}>
              {uniqueRegulations.map((reg, idx) => (
                <TimelineItem key={idx} position={idx % 2 === 0 ? 'left' : 'right'}>
                  <TimelineOppositeContent color="textSecondary" sx={{ py: 1.5, px: 2, mt: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary' }}>
                      {reg.date}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        bgcolor: getSeverityColor(reg.severity),
                        width: 12,
                        height: 12,
                        boxShadow: 'none',
                        my: 1.2
                      }}
                    />
                    {idx < uniqueRegulations.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: 1.5, px: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#ffffff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                          borderColor: '#D1D5DB'
                        }
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', mb: 0.8, color: 'text.primary', lineHeight: 1.3 }}>
                        {reg.name}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', display: 'block', fontSize: '0.72rem', mb: 1.5, lineHeight: 1.4 }}>
                        {reg.impact}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.72rem' }}>
                          Cost: {reg.cost}
                        </Typography>
                        <Chip
                          label={getSeverityLabel(reg.severity)}
                          size="small"
                          sx={{
                            bgcolor: getSeverityColor(reg.severity),
                            color: 'white',
                            fontWeight: 700,
                            height: 18,
                            fontSize: '0.62rem',
                            borderRadius: '12px',
                            px: 0.5
                          }}
                        />
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        </Card>

        {/* Column 2: Score and Summaries */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%', minHeight: 0 }}>
          {/* Compliance Score */}
          <Card sx={{ p: 2.5, bgcolor: 'rgba(0, 24, 168, 0.03)', border: '1px solid rgba(0, 24, 168, 0.08)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px' }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                📊 COMPLIANCE SCORE
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem', mt: 0.5 }}>
                Across all active regulations
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.8rem' }}>
              82%
            </Typography>
          </Card>

          {/* All Summary Cards list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, overflowY: 'auto', pr: 0.5, minHeight: 0 }}>
            {uniqueRegulations.map((reg, idx) => (
              <Card
                key={idx}
                sx={{
                  p: 2.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                    borderColor: '#D1D5DB'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.3 }}>
                    {reg.name}
                  </Typography>
                  <Chip
                    label={getSeverityLabel(reg.severity)}
                    size="small"
                    sx={{
                      bgcolor: getSeverityColor(reg.severity),
                      color: 'white',
                      fontWeight: 700,
                      height: 18,
                      fontSize: '0.62rem',
                      borderRadius: '12px',
                      px: 0.5,
                      flexShrink: 0
                    }}
                  />
                </Box>
                <Typography sx={{ color: 'text.secondary', display: 'block', mb: 1.5, fontSize: '0.72rem', lineHeight: 1.4 }}>
                  {reg.impact}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  <Chip
                    label={`${reg.departments} Impacted Depts`}
                    size="small"
                    sx={{
                      fontSize: '0.62rem',
                      height: 18,
                      fontWeight: 700,
                      bgcolor: 'rgba(0, 24, 168, 0.06)',
                      color: 'primary.main',
                      borderRadius: '4px',
                      px: 0.5
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/risks', { state: { regulation: reg.name } })}
                    sx={{
                      py: 0.5,
                      fontSize: '0.7rem',
                      minHeight: 28,
                      fontWeight: 700,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      borderRadius: '6px',
                      '&:hover': {
                        bgcolor: 'rgba(0, 24, 168, 0.04)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    Review Risk
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/departments', { state: { framework: reg.name, regulation: reg.name, departments: Array.from(reg.departmentsList) } })}
                    sx={{
                      py: 0.5,
                      fontSize: '0.7rem',
                      minHeight: 28,
                      fontWeight: 700,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      borderRadius: '6px',
                      '&:hover': {
                        bgcolor: 'rgba(0, 24, 168, 0.04)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    View Department Impact
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}