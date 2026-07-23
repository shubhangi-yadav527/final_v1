import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Button, LinearProgress, Chip, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';

export default function AIConfidenceDrill() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState('Loans');

  const modelMetrics = {
    Loans: {
      name: 'Loans Model (L-v4)',
      accuracy: 94.2,
      f1: 0.92,
      aucRoc: 0.95,
      drift: 'No Drift',
      driftColor: 'success',
      trustScore: 96.5,
      backtesting: [
        { period: 'Q3 2025', expectedDefault: '2.5%', actualDefault: '2.4%', status: 'Within Limits' },
        { period: 'Q4 2025', expectedDefault: '2.5%', actualDefault: '2.6%', status: 'Within Limits' },
        { period: 'Q1 2026', expectedDefault: '2.4%', actualDefault: '2.3%', status: 'Within Limits' },
        { period: 'Q2 2026', expectedDefault: '2.4%', actualDefault: '2.5%', status: 'Within Limits' }
      ],
      features: [
        { name: 'Credit History Length', shapValue: '+0.32', importance: 88 },
        { name: 'Debt-to-Income (DTI) Ratio', shapValue: '-0.24', importance: 82 },
        { name: 'Annual Income', shapValue: '+0.18', importance: 75 },
        { name: 'Outstanding Debt', shapValue: '-0.15', importance: 68 },
      ]
    },
    Deposits: {
      name: 'Deposits Model (D-v2)',
      accuracy: 91.5,
      f1: 0.89,
      aucRoc: 0.92,
      drift: 'No Drift',
      driftColor: 'success',
      trustScore: 93.2,
      backtesting: [
        { period: 'Q3 2025', expectedDefault: '1.2%', actualDefault: '1.3%', status: 'Within Limits' },
        { period: 'Q4 2025', expectedDefault: '1.2%', actualDefault: '1.1%', status: 'Within Limits' },
        { period: 'Q1 2026', expectedDefault: '1.1%', actualDefault: '1.2%', status: 'Within Limits' },
        { period: 'Q2 2026', expectedDefault: '1.1%', actualDefault: '1.3%', status: 'Within Limits' }
      ],
      features: [
        { name: 'Account Balance', shapValue: '+0.41', importance: 92 },
        { name: 'Monthly Transaction Count', shapValue: '+0.28', importance: 79 },
        { name: 'Employment Duration', shapValue: '+0.15', importance: 71 },
        { name: 'Primary Account Flag', shapValue: '+0.09', importance: 58 },
      ]
    },
    Core: {
      name: 'Core Banking Model (CB-v1)',
      accuracy: 95.8,
      f1: 0.94,
      aucRoc: 0.97,
      drift: 'Mild Drift',
      driftColor: 'warning',
      trustScore: 91.8,
      backtesting: [
        { period: 'Q3 2025', expectedDefault: '0.8%', actualDefault: '0.9%', status: 'Within Limits' },
        { period: 'Q4 2025', expectedDefault: '0.8%', actualDefault: '1.1%', status: 'Warning Limits' },
        { period: 'Q1 2026', expectedDefault: '0.7%', actualDefault: '0.8%', status: 'Within Limits' },
        { period: 'Q2 2026', expectedDefault: '0.7%', actualDefault: '0.9%', status: 'Within Limits' }
      ],
      features: [
        { name: 'Average Deposit Volume', shapValue: '+0.38', importance: 85 },
        { name: 'Customer Tenure', shapValue: '+0.25', importance: 78 },
        { name: 'Cross-product Ownership', shapValue: '+0.19', importance: 64 },
        { name: 'Mobile App Login Frequency', shapValue: '+0.12', importance: 52 },
      ]
    },
    Treasury: {
      name: 'Treasury Model (T-v3)',
      accuracy: 93.6,
      f1: 0.91,
      aucRoc: 0.94,
      drift: 'No Drift',
      driftColor: 'success',
      trustScore: 95.1,
      backtesting: [
        { period: 'Q3 2025', expectedDefault: '3.1%', actualDefault: '3.0%', status: 'Within Limits' },
        { period: 'Q4 2025', expectedDefault: '3.1%', actualDefault: '3.2%', status: 'Within Limits' },
        { period: 'Q1 2026', expectedDefault: '3.0%', actualDefault: '2.9%', status: 'Within Limits' },
        { period: 'Q2 2026', expectedDefault: '3.0%', actualDefault: '3.1%', status: 'Within Limits' }
      ],
      features: [
        { name: 'Asset Volatility', shapValue: '-0.35', importance: 89 },
        { name: 'Counterparty Risk Rating', shapValue: '-0.29', importance: 81 },
        { name: 'Financial Stability Rating', shapValue: '+0.15', importance: 67 },
        { name: 'Data Center Region', shapValue: '-0.08', importance: 52 },
      ]
    }
  };

  const activeData = modelMetrics[selectedModel] || modelMetrics.Loans;

  return (
    <Box sx={{ height: { xs: 'auto', md: 'calc(84vh - 80px)' }, display: 'flex', flexDirection: 'column', pr: { xs: 0, md: 5 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexShrink: 0 }}>
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
            AI Confidence Metrics
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Model risk management (MRM) backtesting, concept drift tracking, and explainability audits under ECB rules
          </Typography>
        </Box>
      </Box>

      {/* Model Selection Tabs row */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Object.keys(modelMetrics).map((modelKey) => (
            <Chip
              key={modelKey}
              label={modelMetrics[modelKey].name}
              onClick={() => setSelectedModel(modelKey)}
              color={selectedModel === modelKey ? 'primary' : 'default'}
              variant={selectedModel === modelKey ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700, fontSize: '0.68rem', height: 24 }}
            />
          ))}
        </Box>
      </Box>

      {/* Side-by-side flex layout to guarantee Backtesting/Explainability stays on the right side of the Performance Card */}
      <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, maxWidth: '1060px', flexGrow: 1, height: 'calc(100% - 75px)', minHeight: 0, alignItems: 'stretch' }}>
        {/* Left Column: Model Metrics Summary */}
        <Box sx={{ width: { xs: '100%', sm: '35%' }, flexShrink: 0, height: '100%' }}>
          <Card className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.2, height: '100%', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Performance Metrics
            </Typography>

            <Box sx={{ bgcolor: 'rgba(0, 24, 168, 0.02)', p: 1.2, borderRadius: 1.2, border: '1px solid rgba(0, 24, 168, 0.05)', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 850, color: 'primary.main', fontSize: '1.4rem' }}>
                {activeData.accuracy}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.6rem', textTransform: 'uppercase' }}>
                Global Accuracy
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box sx={{ textAlign: 'center', bgcolor: 'rgba(0, 0, 0, 0.01)', p: 0.8, borderRadius: 1, border: '1px solid rgba(0,0,0,0.03)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1 }}>{activeData.f1}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.55rem', display: 'block', mt: 0.2 }}>F1-Score</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', bgcolor: 'rgba(0, 0, 0, 0.01)', p: 0.8, borderRadius: 1, border: '1px solid rgba(0,0,0,0.03)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1 }}>{activeData.aucRoc}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.55rem', display: 'block', mt: 0.2 }}>AUC-ROC</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" sx={{ fontWeight: 650, color: 'text.secondary', fontSize: '0.65rem' }}>Data Drift Status</Typography>
              <Chip label={activeData.drift} color={activeData.driftColor} size="small" sx={{ fontWeight: 700, height: 16, fontSize: '0.55rem' }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 650, color: 'text.secondary', fontSize: '0.65rem' }}>Model Trust Score</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: 'success.main' }}>{activeData.trustScore}%</Typography>
            </Box>

            <Box sx={{ bgcolor: 'rgba(0, 24, 168, 0.01)', p: 1, borderRadius: 1.2, border: '1px dashed rgba(0, 24, 168, 0.08)' }}>
              <Typography variant="caption" sx={{ fontWeight: 750, color: 'text.secondary', display: 'block', mb: 0.3, fontSize: '0.6rem' }}>
                ECB Supervisor Note:
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.primary', display: 'block', lineHeight: 1.2, fontSize: '0.58rem' }}>
                All validation logs are exported hourly to the ECB Model Inventory Registry. Concept drift thresholds comply with SR 11-7 standards.
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Right Column: Backtesting & Explainability Tab Grid */}
        <Box sx={{ flexGrow: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Backtesting Results Card */}
          <Card className="glass-card" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, flex: '1 1 48%', minHeight: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <BarChartIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.62rem' }}>
                Supervisory Backtesting Results (Actual vs. Expected Defaults)
              </Typography>
            </Box>
            <TableContainer sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflowY: 'auto', flexGrow: 1 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', py: 0.5, bgcolor: '#FFFFFF !important' }}>Reporting Period</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', py: 0.5, bgcolor: '#FFFFFF !important' }} align="right">Expected Default</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', py: 0.5, bgcolor: '#FFFFFF !important' }} align="right">Actual Default</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', py: 0.5, bgcolor: '#FFFFFF !important' }} align="center">Validation Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeData.backtesting.map((row, i) => (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontSize: '0.62rem', py: 0.4 }}>{row.period}</TableCell>
                      <TableCell sx={{ fontSize: '0.62rem', py: 0.4 }} align="right">{row.expectedDefault}</TableCell>
                      <TableCell sx={{ fontSize: '0.62rem', py: 0.4 }} align="right">{row.actualDefault}</TableCell>
                      <TableCell sx={{ py: 0.4 }} align="center">
                        <Chip
                          label={row.status}
                          size="small"
                          color={row.status === 'Within Limits' ? 'success' : 'warning'}
                          variant="outlined"
                          sx={{ height: 14, fontSize: '0.52rem', fontWeight: 650 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Explainability / SHAP Card */}
          <Card className="glass-card" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, flex: '1 1 48%', minHeight: 0, justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, mb: 0.5 }}>
              <InfoIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.62rem' }}>
                Model Explainability Index (SHAP Feature Importance)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, overflowY: 'auto' }}>
              {activeData.features.map((feat, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 650, fontSize: '0.62rem', color: 'text.primary' }}>
                      {feat.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 700, color: feat.shapValue.startsWith('+') ? 'success.main' : 'error.main' }}>
                        SHAP: {feat.shapValue}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 700, color: 'text.secondary' }}>
                        Weight: {feat.importance}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={feat.importance}
                    sx={{
                      height: 3,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(0, 24, 168, 0.04)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: feat.shapValue.startsWith('+') ? 'success.main' : 'warning.main',
                        borderRadius: 1.5,
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
