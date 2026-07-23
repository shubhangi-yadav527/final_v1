import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, Typography, Chip, LinearProgress, Paper
} from '@mui/material';
import axios from 'axios';

// Icons
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderIcon from '@mui/icons-material/Folder';
import SpeedIcon from '@mui/icons-material/Speed';
import Co2Icon from '@mui/icons-material/Co2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';

import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:8000';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const getRiskColor = (level) => {
    const lvl = (level || '').toLowerCase();
    if (lvl === 'low') return '#10B981'; // Green
    if (lvl === 'high' || lvl === 'severe') return '#EF4444'; // Red
    return '#F59E0B'; // Orange
  };
  const getRiskBgColor = (level) => {
    const lvl = (level || '').toLowerCase();
    if (lvl === 'low') return 'rgba(16, 185, 129, 0.12)';
    if (lvl === 'high' || lvl === 'severe') return 'rgba(239, 68, 68, 0.12)';
    return 'rgba(245, 158, 11, 0.12)';
  };
  // 9 Widgets Data State
  const [governanceScore, setGovernanceScore] = useState({ score: 97, status: 'Excellent', trend: '↑ +2% from last month' });
  const [riskData, setRiskData] = useState({ overall_risk: 9, risk_level: 'Low' });
  const [activeRegulations, setActiveRegulations] = useState(18);
  const [alerts, setAlerts] = useState({ total_alerts: 4, high_priority: [] });
  const [carbonImpact, setCarbonImpact] = useState({ current_co2: 31, reduction_percentage: 40 });
  const [aiConfidence] = useState('High');
  const [costRoi, setCostRoi] = useState({ annual_savings: '€1.66 M', current_annual_cost: '€3.34 M', ai_optimized_cost: '€1.70 M' });
  const [systemHealth, setSystemHealth] = useState({ api_response_time: '124ms', data_sync: 'Real-time', model_accuracy: '94.2%', uptime: '99.98%' });
  const [topInsights] = useState([
    '🇪🇺 EU AI Act: High-risk credit scoring AI requires mandatory human oversight by Q3 2026.',
    '🛡️ DORA Resilience: Critical ICT third-party risk management frameworks must be stress-tested.',
    '🌿 ECB Climate Risk: Capital adequacy buffers linked to portfolio ESG carbon intensity.',
    '🔒 GDPR & AI: Automated profiling requires explicit consent & auditability logs.',
    '🏦 Basel III / IV: Risk-weighted asset (RWA) floor calculations impact capital allocations.',
    '💰 AMLA Directive: Real-time cross-border AML transaction monitoring enforced across EU branches.',
    '🪙 MiCA Compliance: Crypto-asset reserve requirements capped at Tier-1 capital ratios.',
    '📊 EBA Pillar 3: Mandatory ESG & climate risk disclosures for large European institutions.',
    '⚡ Cyber Operational Risk: 4-hour incident reporting window to ECB Banking Supervision.',
    '🤖 Model Transparency: Explainable AI (XAI) verification mandatory for automated loan approval.',
  ]);
  const [newsletter] = useState({ 
    title: 'July 2026 Updates', 
    date: 'July 2026', 
    updates: [
      'EBA Crypto-Asset Exposure Risk Limits (MiCA)',
      'DORA Resiliency Compliance Standards', 
      'Corporate ESG Green Computing Initiative',
      'ECB Anti-Money Laundering (AMLA) Directives'
    ] 
  });

  // Fetch data from backend with fallback
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const scoreRes = await axios.get(`${BACKEND_URL}/api/governance/score`);
        setGovernanceScore(scoreRes.data);
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch governance score:", e.message);
      }

      try {
        const riskRes = await axios.get(`${BACKEND_URL}/api/governance/risk-metrics`);
        setRiskData({
          overall_risk: riskRes.data.overall_risk,
          risk_level: riskRes.data.risk_level
        });
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch risk metrics:", e.message);
      }

      try {
        const regRes = await axios.get(`${BACKEND_URL}/api/regulations/count`);
        setActiveRegulations(regRes.data.count);
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch regulations:", e.message);
      }

      try {
        const alertsRes = await axios.get(`${BACKEND_URL}/api/alerts`);
        setAlerts(alertsRes.data);
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch alerts:", e.message);
      }

      try {
        const carbonRes = await axios.get(`${BACKEND_URL}/api/carbon/metrics`);
        setCarbonImpact({
          current_co2: carbonRes.data.current_co2,
          reduction_percentage: carbonRes.data.reduction_percentage
        });
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch carbon metrics:", e.message);
      }

      try {
        const roiRes = await axios.get(`${BACKEND_URL}/api/cost-roi`);
        setCostRoi(roiRes.data);
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch cost ROI:", e.message);
      }

      try {
        const healthRes = await axios.get(`${BACKEND_URL}/health`);
        setSystemHealth({
          api_response_time: healthRes.data.api_response_time,
          data_sync: healthRes.data.data_sync,
          model_accuracy: healthRes.data.model_accuracy,
          uptime: healthRes.data.uptime
        });
      } catch (e) {
        console.warn("HomeDashboard: failed to fetch health status:", e.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, height: '100%', pr: { xs: 0, md: 5 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gridTemplateRows: { xs: 'auto', sm: 'repeat(3, 1fr)' },
          gap: 2.5,
          maxWidth: '1060px',
          height: { xs: 'auto', sm: 'calc(84vh - 120px)' },
          minHeight: { xs: 'auto', sm: '520px' }
        }}
      >
        {/* ROW 1: AI Governance Score, Carbon Impact, AI Confidence */}
        {/* 1. AI Governance Score - Concept 3: Multi-Metric Shield & Bar Breakdown */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card animate-hover" 
            onClick={() => navigate('/governance-score-drill')}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 24px rgba(0, 24, 168, 0.08)',
                borderColor: 'rgba(0, 24, 168, 0.15)'
              }
            }}
          >
            {/* Header with Title and Shield Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  AI Governance Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.3rem', lineHeight: 1 }}>
                    {governanceScore.score}%
                  </Typography>
                  <Chip
                    label={governanceScore.status}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      color: 'success.main',
                      fontWeight: 700,
                      fontSize: '0.62rem',
                      height: 18,
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  />
                </Box>
              </Box>

              {/* Glowing Shield Badge */}
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 24, 168, 0.15) 0%, rgba(45, 212, 191, 0.2) 100%)',
                  border: '1px solid rgba(45, 212, 191, 0.4)',
                  boxShadow: '0 0 12px rgba(45, 212, 191, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SecurityIcon sx={{ color: '#2DD4BF', fontSize: '1.3rem' }} />
              </Box>
            </Box>

            {/* Sub-Metrics Breakdown Bars */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mt: 1 }}>
              {[
                { label: 'Compliance', value: governanceScore.components?.compliance || 95, color: '#2DD4BF' },
                { label: 'Risk Management', value: governanceScore.components?.risk_management || 98, color: '#3B82F6' },
                { label: 'Ethics & ESG', value: governanceScore.components?.sustainability || 96, color: '#10B981' },
              ].map((metric, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 650, fontSize: '0.65rem' }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.65rem' }}>
                      {metric.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 24, 168, 0.06)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: metric.color,
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Box>

        {/* 2. Carbon Impact */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            onClick={() => navigate('/esg')}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'primary.main',
                boxShadow: '0 8px 30px rgba(0, 24, 168, 0.08)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  Carbon Impact
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.3rem', lineHeight: 1 }}>
                    {carbonImpact.current_co2}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem' }}>
                    Tons CO₂
                  </Typography>
                  <Chip
                    label={`↓ ${carbonImpact.reduction_percentage}%`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      color: 'success.main',
                      fontWeight: 700,
                      fontSize: '0.62rem',
                      height: 18,
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  bgcolor: 'rgba(45, 212, 191, 0.12)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Co2Icon sx={{ color: '#2DD4BF', fontSize: '1.5rem' }} />
              </Box>
            </Box>

            {/* Tree Equivalent Chip & Green Auto-Scaling Bar */}
            <Box sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                <Typography variant="caption" sx={{ fontWeight: 650, color: 'text.secondary', fontSize: '0.65rem' }}>
                  🌲 2,054 Trees Saved Eq.
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main', fontSize: '0.65rem' }}>
                  Target: 18.6T
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={carbonImpact.reduction_percentage}
                sx={{
                  height: 5,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(0, 24, 168, 0.06)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#10B981',
                    borderRadius: 2.5,
                  }
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2, fontSize: '0.65rem' }}>
              Green computing auto-scaling active on Loans & Core Banking servers.
            </Typography>
          </Card>
        </Box>

        {/* 3. AI Confidence */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card animate-hover" 
            onClick={() => navigate('/ai-confidence-drill')}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 24px rgba(0, 24, 168, 0.08)',
                borderColor: 'rgba(0, 24, 168, 0.15)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  AI Confidence
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.3rem', lineHeight: 1 }}>
                    {systemHealth.model_accuracy}
                  </Typography>
                  <Chip
                    label="Reliable Model"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      color: 'success.main',
                      fontWeight: 700,
                      fontSize: '0.62rem',
                      height: 18,
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  bgcolor: 'rgba(0, 24, 168, 0.08)',
                  border: '1px solid rgba(0, 24, 168, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SpeedIcon sx={{ color: 'primary.main', fontSize: '1.4rem' }} />
              </Box>
            </Box>
            
            {/* Performance Stats Mini Breakdown */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 0.8, bgcolor: 'rgba(0, 24, 168, 0.02)', borderRadius: '6px', border: '1px solid rgba(0, 24, 168, 0.05)', my: 0.5 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontSize: '0.58rem', color: 'text.secondary', display: 'block', fontWeight: 600 }}>Response</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'primary.main' }}>124ms</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontSize: '0.58rem', color: 'text.secondary', display: 'block', fontWeight: 600 }}>Sync</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'success.main' }}>Real-time</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontSize: '0.58rem', color: 'text.secondary', display: 'block', fontWeight: 600 }}>Uptime</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'primary.main' }}>99.98%</Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={94.2}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(0, 24, 168, 0.06)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#2DD4BF',
                  borderRadius: 2,
                }
              }}
            />
          </Card>
        </Box>

        {/* ROW 2: Active Regulations, High Priority Alerts, Enterprise Risks */}
        {/* 4. Active Regulations */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            onClick={() => navigate('/ai')}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'primary.main',
                boxShadow: '0 8px 30px rgba(0, 24, 168, 0.08)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  Active Regulations
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.3, mb: 0.2, fontSize: '1.3rem', lineHeight: 1 }}>
                  {activeRegulations}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  Active Governance Policies
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  bgcolor: 'rgba(0, 24, 168, 0.08)',
                  border: '1px solid rgba(0, 24, 168, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FolderIcon sx={{ color: 'primary.main', fontSize: '1.3rem' }} />
              </Box>
            </Box>
            
            {/* Status Breakdown Pills */}
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', my: 1 }}>
              <Chip
                label="4 High Priority"
                size="small"
                sx={{
                  bgcolor: 'rgba(239, 68, 68, 0.12)',
                  color: 'error.main',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 18,
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              />
              <Chip
                label="11 Compliant"
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.12)',
                  color: 'success.main',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 18,
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              />
              <Chip
                label="3 Pending"
                size="small"
                sx={{
                  bgcolor: 'rgba(245, 158, 11, 0.12)',
                  color: 'warning.main',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 18,
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              />
            </Box>

            {/* Mini Roadmap Timeline */}
            <Box sx={{ p: 0.8, bgcolor: 'rgba(0, 24, 168, 0.02)', borderRadius: '6px', border: '1px solid rgba(0, 24, 168, 0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'text.secondary' }}>
                  Next Milestone:
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'primary.main' }}>
                  Q3 2026 EU AI Act
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* 5. High Priority Alerts */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            onClick={() => navigate('/ai', { state: { filterSeverity: 'high' } })}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'error.main',
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.12)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  High Priority Alerts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main', mt: 0.3, mb: 0.2, fontSize: '1.3rem', lineHeight: 1 }}>
                  {alerts.total_alerts}
                </Typography>
              </Box>
              <Chip
                label="4 Active"
                size="small"
                sx={{
                  bgcolor: 'rgba(239, 68, 68, 0.15)',
                  color: 'error.main',
                  fontWeight: 700,
                  fontSize: '0.62rem',
                  height: 18,
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  animation: 'pulseAlert 2s infinite',
                  '@keyframes pulseAlert': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 }
                  }
                }}
              />
            </Box>

            {/* Alert List Items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, my: 0.5 }}>
              <Box 
                sx={{ 
                  p: 0.6, 
                  bgcolor: 'rgba(239, 68, 68, 0.04)', 
                  borderLeft: '3px solid #EF4444', 
                  borderRadius: '0 6px 6px 0' 
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'error.main', display: 'block', fontSize: '0.66rem' }}>
                  🚨 Deposits Compliance Gap (85%)
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Action required by 2026-Q3
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  p: 0.6, 
                  bgcolor: 'rgba(245, 158, 11, 0.04)', 
                  borderLeft: '3px solid #F59E0B', 
                  borderRadius: '0 6px 6px 0' 
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main', display: 'block', fontSize: '0.66rem' }}>
                  ⚖️ EU AI Act Enforcement
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Implementation plan pending
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* 6. Enterprise Risk */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            onClick={() => navigate('/risks')}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'primary.main',
                boxShadow: '0 8px 30px rgba(0, 24, 168, 0.08)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  Enterprise Risk
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: getRiskColor(riskData.risk_level), fontSize: '1.3rem', lineHeight: 1 }}>
                    {riskData.overall_risk}%
                  </Typography>
                  <Chip
                    label={`Level: ${riskData.risk_level}`}
                    size="small"
                    sx={{
                      bgcolor: getRiskBgColor(riskData.risk_level),
                      color: getRiskColor(riskData.risk_level),
                      fontWeight: 700,
                      fontSize: '0.62rem',
                      height: 18,
                      border: `1px solid ${getRiskColor(riskData.risk_level)}33`
                    }}
                  />
                </Box>
              </Box>
              <Chip
                label="↓ -5% MoM"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'success.main', borderColor: 'rgba(16, 185, 129, 0.4)', height: 18 }}
              />
            </Box>
            
            {/* Premium Semi-circular Gauge */}
            <Box sx={{ position: 'relative', width: 140, height: 70, mx: 'auto', mt: 1.5, mb: 0.5 }}>
              <Box
                sx={{
                  width: 140,
                  height: 70,
                  background: 'conic-gradient(from 270deg at 50% 100%, #10B981 0deg 60deg, #F59E0B 60deg 120deg, #EF4444 120deg 180deg)',
                  borderRadius: '140px 140px 0 0',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 110,
                    height: 55,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '110px 110px 0 0',
                    bottom: 0,
                    left: 15
                  }
                }}
              />
              {/* Gauge Needle Pivot */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  border: '2px solid white',
                  bottom: -3,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  boxShadow: '0 0 6px rgba(0,0,0,0.2)'
                }}
              />
              {/* Animated Needle */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 3,
                  height: 55,
                  bgcolor: 'primary.main',
                  borderRadius: '2px',
                  bottom: 0,
                  left: '50%',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${((riskData.overall_risk / 100) * 180) - 90}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 1
                }}
              />
            </Box>
          </Card>
        </Box>

        {/* ROW 3: Cost & ROI, Top 10 Insights, Current Newsletter */}
        {/* 7. Cost & ROI - Redesigned */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            onClick={() => navigate('/roi')}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'primary.main',
                boxShadow: '0 8px 30px rgba(0, 24, 168, 0.08)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                  Cost & ROI
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#6D28D9', fontSize: '1.3rem', lineHeight: 1 }}>
                    {costRoi.annual_savings}
                  </Typography>
                  <Chip
                    label="49.7% ROI"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(217, 119, 6, 0.12)',
                      color: '#B45309',
                      fontWeight: 700,
                      fontSize: '0.62rem',
                      height: 18,
                      border: '1px solid rgba(217, 119, 6, 0.3)'
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  bgcolor: 'rgba(109, 40, 217, 0.1)',
                  border: '1px solid rgba(109, 40, 217, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUpIcon sx={{ color: '#6D28D9', fontSize: '1.5rem' }} />
              </Box>
            </Box>

            {/* Budget vs AI Optimized Savings Bar */}
            <Box sx={{ my: 0.8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  Current: <strong>{costRoi.current_annual_cost}</strong>
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6D28D9', fontSize: '0.65rem' }}>
                  AI-Optimized: {costRoi.ai_optimized_cost}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={49.7}
                sx={{
                  height: 5,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(109, 40, 217, 0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6D28D9 0%, #F59E0B 100%)',
                    borderRadius: 2.5,
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip
                label="Infra: €480K"
                size="small"
                sx={{
                  fontSize: '0.58rem',
                  height: 18,
                  fontWeight: 700,
                  bgcolor: 'rgba(59, 130, 246, 0.12)',
                  color: '#1D4ED8',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              />
              <Chip
                label="Compliance: €700K"
                size="small"
                sx={{
                  fontSize: '0.58rem',
                  height: 18,
                  fontWeight: 700,
                  bgcolor: 'rgba(109, 40, 217, 0.12)',
                  color: '#6D28D9',
                  border: '1px solid rgba(109, 40, 217, 0.3)'
                }}
              />
              <Chip
                label="Carbon: €220K"
                size="small"
                sx={{
                  fontSize: '0.58rem',
                  height: 18,
                  fontWeight: 700,
                  bgcolor: 'rgba(217, 119, 6, 0.12)',
                  color: '#B45309',
                  border: '1px solid rgba(217, 119, 6, 0.3)'
                }}
              />
            </Box>
          </Card>
        </Box>

        {/* 8. Top 10 Insights - European Banking Regulatory Theme */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                Top 10 Insights
              </Typography>
              <Chip 
                icon={<CheckCircleIcon sx={{ fontSize: '0.8rem', color: 'white !important' }} />}
                label="EU Banking Rules" 
                color="primary" 
                size="small"
                sx={{ fontWeight: 700, px: 0.3, height: 18, fontSize: '0.62rem' }} 
              />
            </Box>

            {/* Scrollable Feed of Top 10 Insights */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, overflowY: 'auto', maxHeight: '80px', pr: 0.5, my: 0.5 }}>
              {topInsights.map((insight, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.8,
                    p: 0.6,
                    bgcolor: 'rgba(0, 24, 168, 0.02)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 24, 168, 0.04)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(0, 24, 168, 0.05)',
                      borderColor: 'rgba(0, 24, 168, 0.12)'
                    }
                  }}
                >
                  <Chip
                    label={`#${idx + 1}`}
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 800,
                      height: 16,
                      fontSize: '0.55rem',
                      minWidth: 22
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.64rem', lineHeight: 1.25 }}>
                    {insight}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* System Metrics Footer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5, borderTop: '1px solid rgba(0, 24, 168, 0.06)' }}>
              <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 600, color: 'text.secondary' }}>
                Resp: <strong style={{ color: '#0018A8' }}>{systemHealth.api_response_time}</strong>
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 600, color: 'text.secondary' }}>
                Sync: <strong style={{ color: '#059669' }}>{systemHealth.data_sync}</strong>
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 600, color: 'text.secondary' }}>
                Acc: <strong style={{ color: '#0018A8' }}>{systemHealth.model_accuracy}</strong>
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 600, color: 'text.secondary' }}>
                Uptime: <strong style={{ color: '#059669' }}>{systemHealth.uptime}</strong>
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* 9. Current Newsletter */}
        <Box sx={{ height: '100%' }}>
          <Card 
            className="glass-card" 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-start',
              gap: 1.8,
              transition: 'all 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                Newsletter
              </Typography>
              <Chip label={newsletter.date} size="small" variant="outlined" sx={{ fontWeight: 600, color: 'primary.main', borderColor: 'primary.main', height: 16, fontSize: '0.65rem' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden', pr: 0.5 }}>
              {newsletter.updates.slice(0, 3).map((update, idx) => (
                <Box 
                  key={idx}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.8,
                    p: 0.6,
                    bgcolor: 'rgba(0, 24, 168, 0.02)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 24, 168, 0.04)',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0, 24, 168, 0.04)',
                      borderColor: 'rgba(0, 24, 168, 0.1)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <ArticleIcon sx={{ color: 'primary.main', opacity: 0.7, fontSize: '1rem' }} />
                  <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.68rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {update}
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