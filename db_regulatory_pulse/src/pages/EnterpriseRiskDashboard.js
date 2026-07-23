import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Chip, Button, useTheme,
} from '@mui/material';
import { ProgressCard } from '../components/KPICards';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BACKEND_URL = 'http://localhost:8000';

export default function EnterpriseRiskDashboard() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const filterRegulation = location.state?.regulation || null;

  const REGULATION_RISKS_MAP = {
    'EU AI Act': ['Credit Risk', 'Operational Risk', 'Legal&Regulatory Risk'],
    'DORA': ['Market Risk', 'Reputational Risk'],
    'GDPR': ['Compliance Risk'],
    'Basel III': ['Compliance Risk'],
    'Basel III / CRR / CRD': ['Compliance Risk'],
    'EBA Guidelines': ['Compliance Risk']
  };

  const [riskData, setRiskData] = useState(() => {
    try {
      const cached = localStorage.getItem('db_regulatory_pulse_risk_metrics');
      return cached ? JSON.parse(cached) : {
        overall_risk: 8,
        risk_level: 'Low',
        categories: [
          { category: 'Compliance Risk', percentage: 10, color: 'warning' },
          { category: 'Reputational Risk', percentage: 12, color: 'warning' },
          { category: 'Operational Risk', percentage: 8, color: 'warning' },
          { category: 'Market Risk', percentage: 10, color: 'warning' },
          { category: 'Credit Risk', percentage: 3, color: 'success' },
          { category: 'Legal&Regulatory Risk', percentage: 5, color: 'success' }
        ]
      };
    } catch (e) {
      console.error('Failed to load risk metrics cache:', e);
      return {
        overall_risk: 8,
        risk_level: 'Low',
        categories: [
          { category: 'Compliance Risk', percentage: 10, color: 'warning' },
          { category: 'Reputational Risk', percentage: 12, color: 'warning' },
          { category: 'Operational Risk', percentage: 8, color: 'warning' },
          { category: 'Market Risk', percentage: 10, color: 'warning' },
          { category: 'Credit Risk', percentage: 3, color: 'success' },
          { category: 'Legal&Regulatory Risk', percentage: 5, color: 'success' }
        ]
      };
    }
  });

  const getMappedRisks = () => {
    if (!filterRegulation) return null;
    const regUpper = filterRegulation.toUpperCase();
    for (const [key, risks] of Object.entries(REGULATION_RISKS_MAP)) {
      if (regUpper.includes(key.toUpperCase()) || key.toUpperCase().includes(regUpper)) {
        return risks;
      }
    }
    return null;
  };

  const mappedRisks = getMappedRisks();
  const filteredCategories = mappedRisks
    ? riskData.categories.filter(c => mappedRisks.includes(c.category))
    : riskData.categories;

  const overallRiskScore = filteredCategories.length > 0
    ? Math.round(filteredCategories.reduce((acc, curr) => acc + curr.percentage, 0) / filteredCategories.length)
    : 0;

  const getRiskLevelFromScore = (score) => {
    if (score < 8) return 'Low';
    if (score > 15) return 'High';
    return 'Medium';
  };

  const overallRiskLevel = getRiskLevelFromScore(overallRiskScore);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        console.log('EnterpriseRiskDashboard: Fetching risk metrics from:', `${BACKEND_URL}/api/governance/risk-metrics`);
        const response = await fetch(`${BACKEND_URL}/api/governance/risk-metrics`);
        if (response.ok) {
          const data = await response.json();
          console.log('EnterpriseRiskDashboard: Received BQ data:', data);
          setRiskData(data);
          try {
            localStorage.setItem('db_regulatory_pulse_risk_metrics', JSON.stringify(data));
          } catch (storageError) {
            console.warn('Failed to save risk metrics to cache:', storageError);
          }
        } else {
          console.error('EnterpriseRiskDashboard: API response error status:', response.status);
          setRiskData(prev => (prev && prev.categories && prev.categories.length > 0) ? prev : {
            overall_risk: 9,
            risk_level: 'Low',
            categories: [
              { category: 'Compliance Risk', percentage: 10, color: 'warning' },
              { category: 'Reputational Risk', percentage: 12, color: 'warning' },
              { category: 'Operational Risk', percentage: 8, color: 'warning' },
              { category: 'Market Risk', percentage: 10, color: 'warning' },
              { category: 'Credit Risk', percentage: 3, color: 'success' },
              { category: 'Legal&Regulatory Risk', percentage: 5, color: 'success' }
            ]
          });
        }
      } catch (err) {
        console.error('EnterpriseRiskDashboard: Fetch error:', err);
        setRiskData(prev => (prev && prev.categories && prev.categories.length > 0) ? prev : {
          overall_risk: 9,
          risk_level: 'Low',
          categories: [
            { category: 'Compliance Risk', percentage: 10, color: 'warning' },
            { category: 'Reputational Risk', percentage: 12, color: 'warning' },
            { category: 'Operational Risk', percentage: 8, color: 'warning' },
            { category: 'Market Risk', percentage: 10, color: 'warning' },
            { category: 'Credit Risk', percentage: 3, color: 'success' },
            { category: 'Legal&Regulatory Risk', percentage: 5, color: 'success' }
          ]
        });
      }
    };
    fetchRiskData();
  }, []);

  const getRiskColor = (level) => {
    const lvl = (level || '').toLowerCase();
    if (lvl === 'low') return theme.palette.success.main;
    if (lvl === 'high' || lvl === 'severe') return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const getRiskThemeName = (level) => {
    const lvl = (level || '').toLowerCase();
    if (lvl === 'low') return 'success';
    if (lvl === 'high' || lvl === 'severe') return 'error';
    return 'warning';
  };

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
            Enterprise Risk Dashboard
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Overall risk score, compliance and operational risk categories, and specific action-plan tasks
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: 2.5,
          maxWidth: '1060px',
          flexGrow: 1,
          height: 'calc(100% - 60px)',
          minHeight: 0
        }}
      >
        {/* Column 1: Central Gauge + Summary */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          {/* Central Risk Gauge */}
          <Card className="glass-card" sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
              Overall Risk Level
            </Typography>
            <Box
              sx={{
                width: 170,
                height: 170,
                borderRadius: '50%',
                background: `conic-gradient(${getRiskColor(overallRiskLevel)} 0deg ${overallRiskScore * 3.6}deg, rgba(0, 24, 168, 0.08) ${overallRiskScore * 3.6}deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 146,
                  height: 146,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: `${getRiskThemeName(overallRiskLevel)}.main`, fontSize: '1.3rem' }}>
                  {overallRiskScore}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  {overallRiskLevel}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, fontWeight: 500, fontSize: '0.65rem' }}>
              Based on {filteredCategories.length} risk categories
            </Typography>
          </Card>
  
          {/* Detailed Analysis Summary */}
          <Card className="glass-card" sx={{ p: 2, height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1, display: 'block' }}>
              Risk Analysis Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {[
                { title: 'Critical', value: filteredCategories.filter(c => c.color === 'error').length.toString(), color: 'error' },
                { title: 'Medium', value: filteredCategories.filter(c => c.color === 'warning').length.toString(), color: 'warning' },
                { title: 'Low Priority', value: filteredCategories.filter(c => c.color === 'success').length.toString(), color: 'success' },
              ].map((item, i) => (
                <Box key={i} sx={{ p: 1, bgcolor: `${theme.palette[item.color].main}10`, borderRadius: 1.5, textAlign: 'center', border: `1px solid ${theme.palette[item.color].main}20` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette[item.color].main, fontSize: '0.85rem' }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.6rem', display: 'block', mt: 0.2 }}>
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
  
        {/* Column 2: Categories + Trend */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          {/* Risk Categories */}
          <Card className="glass-card" sx={{ p: 2, flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                Risk Category Breakdown {filterRegulation && `(${filterRegulation})`}
              </Typography>
              {filterRegulation && (
                <Chip
                  label="Clear"
                  size="small"
                  onDelete={() => navigate('/risks', { replace: true, state: {} })}
                  color="primary"
                  sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {filteredCategories.map((risk, idx) => (
                <ProgressCard
                  key={idx}
                  title={risk.category}
                  percentage={risk.percentage}
                  color={risk.color}
                />
              ))}
            </Box>
          </Card>

          {/* Trend Analysis */}
          <Card className="glass-card" sx={{ p: 2, flex: 0.9, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
              Trend Analysis (Last 90 Days)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, height: 110, justifyContent: 'space-between', my: 1 }}>
              {[
                { val: 65, label: 'T-80d' },
                { val: 72, label: 'T-70d' },
                { val: 68, label: 'T-60d' },
                { val: 55, label: 'T-50d' },
                { val: 48, label: 'T-40d' },
                { val: 45, label: 'T-30d' },
                { val: 42, label: 'T-20d' },
                { val: 44, label: 'T-10d' },
                { val: overallRiskScore, label: 'Today' }
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  {/* Value label on top */}
                  <Typography variant="caption" sx={{ fontSize: '0.62rem', fontWeight: 700, color: 'text.secondary', mb: 0.3 }}>
                    {item.val}%
                  </Typography>
                  {/* Bar Container */}
                  <Box sx={{ height: 70, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: `${item.val}%`,
                        bgcolor: item.val > 60 ? theme.palette.error.main : item.val > 45 ? theme.palette.warning.main : theme.palette.success.main,
                        borderRadius: '3px 3px 0 0',
                        opacity: 0.85,
                        transition: 'all 0.2s',
                        '&:hover': {
                          opacity: 1,
                          transform: 'scaleY(1.05)',
                          transformOrigin: 'bottom center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        },
                      }}
                    />
                  </Box>
                  {/* Timeline label at bottom */}
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 650, color: 'text.secondary', mt: 0.5 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', fontSize: '0.65rem', fontWeight: 600, mt: 1 }}>
              {overallRiskScore < 65 
                ? `Risk level showing improvement trend: reduced from peak of 72% (T-70d) to current ${overallRiskScore}% (Today) due to active mitigation controls.`
                : `Risk level currently at ${overallRiskScore}% (peak: 72%) with ongoing compliance tracking.`
              }
            </Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
