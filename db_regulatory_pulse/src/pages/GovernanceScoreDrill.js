import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Button, LinearProgress, Chip, useTheme, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';

export default function GovernanceScoreDrill() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [govData, setGovData] = useState({
    score: 97,
    status: 'Excellent',
    trend: '↑ +2% from last month',
    components: {
      compliance: 95,
      risk_management: 98,
      sustainability: 96
    }
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/governance/score')
      .then(res => res.json())
      .then(data => {
        if (data && data.score) {
          setGovData(data);
        }
      })
      .catch(err => console.error('Error fetching score:', err));
  }, []);

  const scoreComponents = [
    {
      title: 'Human Agency & Oversight (Article 14)',
      score: govData.score,
      status: 'Compliant',
      desc: 'Controls ensuring human intervention, override capabilities, and real-time oversight of credit decisioning models.',
      icon: <VerifiedUserIcon sx={{ color: 'primary.main' }} />,
      requirements: ['Independent Risk Committee Override active', 'Dual-authorization model for threshold updates', 'Human-in-the-loop audit logs'],
    },
    {
      title: 'Technical Robustness & Safety (Article 15)',
      score: Math.max(0, govData.score - 4),
      status: 'Compliant',
      desc: 'Supervisory resilience metrics protecting models against adversarial attacks, feedback loops, and data poisoning.',
      icon: <SecurityIcon sx={{ color: 'error.main' }} />,
      requirements: ['Adversarial robustness testing completed Q2', 'Out-of-distribution (OOD) detection active', 'Fail-safe fallback system certified'],
    },
    {
      title: 'Privacy & Data Governance (Article 10)',
      score: govData.components.compliance,
      status: 'Compliant',
      desc: 'Verification of data lineage, bias checks, and GDPR compliance validation on loan applicant datasets.',
      icon: <StorageIcon sx={{ color: 'success.main' }} />,
      requirements: ['Data lineage registry mapped in BigQuery', 'Weekly automated gender/age bias testing', 'Data Protection Impact Assessment (DPIA) active'],
    },
    {
      title: 'Transparency & Information (Article 13)',
      score: Math.max(0, govData.score - 3),
      status: 'Compliant',
      desc: 'Traceability and provision of information to ECB/EBA regulators, and technical documentation of model parameters.',
      icon: <VisibilityIcon sx={{ color: 'warning.main' }} />,
      requirements: ['Automatic Model Card generation', 'EBA Article 13 technical spec manual compiled', 'Right-to-explanation portal online'],
    },
    {
      title: 'Record-Keeping & Logging (Article 12)',
      score: Math.max(0, govData.components.risk_management - 2),
      status: 'Compliant',
      desc: 'Immutability of logs documenting system logs, audit trails, and data processing sequences.',
      icon: <AssignmentIcon sx={{ color: 'secondary.main' }} />,
      requirements: ['Immutable audit logging active in Cloud Logging', 'Trace logs verified by third-party auditors', 'ECB compliance report export tool ready'],
    }
  ];

  return (
    <Box sx={{ height: '100%', pr: { xs: 0, md: 5 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
            AI Governance Score Drilldown
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Compliance validation aligned with EU AI Act, ECB Model Risk, and European Banking Authority (EBA) standards
          </Typography>
        </Box>
      </Box>

      {/* Side-by-side flex layout to guarantee Checklist stays on the right side of the Shield Card */}
      <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, maxWidth: '1060px', alignItems: 'stretch' }}>
        {/* Left Column: Overall Stats Card */}
        <Box sx={{ width: { xs: '100%', sm: '35%' }, flexShrink: 0 }}>
          <Card className="glass-card" sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', mb: 2 }}>
              EU AI Act Shield
            </Typography>
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: `conic-gradient(${theme.palette.success.main} 0deg calc(${govData.score} * 3.6deg), rgba(0, 24, 168, 0.08) calc(${govData.score} * 3.6deg) 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Box
                sx={{
                  width: 128,
                  height: 128,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 850, color: 'success.main', fontSize: '1.8rem' }}>
                  {govData.score}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>
                  OVERALL COMPLIANCE
                </Typography>
              </Box>
            </Box>
            <Chip
              label="EBA Certified"
              color="success"
              size="small"
              sx={{ fontWeight: 700, px: 1, mb: 3 }}
            />
            <Box sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, fontSize: '0.8rem' }}>
                Standards Reference:
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.8, lineHeight: 1.3 }}>
                • <strong>EU AI Act (Chapters 2 & 3)</strong>: Harmonised rules on Artificial Intelligence for high-risk credit scoring systems.
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.8, lineHeight: 1.3 }}>
                • <strong>EBA Guidelines (EBA/GL/2019/04)</strong>: Outsourcing arrangements and cloud service provider risk governance.
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.8, lineHeight: 1.3 }}>
                • <strong>ECB Guide to Internal Models</strong>: Supervisory requirements for credit and counterparty credit risk.
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Right Column: Breakdown List */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '68vh', overflowY: 'auto', pr: 0.5 }}>
            {scoreComponents.map((comp, idx) => (
              <Card key={idx} className="glass-card" sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(0, 24, 168, 0.05)', borderRadius: 1.5 }}>
                      {comp.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                        {comp.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
                        {comp.desc}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 850, color: 'primary.main', fontSize: '0.95rem', lineHeight: 1 }}>
                      {comp.score}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.6rem', display: 'block', mt: 0.2 }}>
                      {comp.status}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={comp.score}
                  sx={{
                    height: 5,
                    borderRadius: 2.5,
                    mb: 2,
                    bgcolor: 'rgba(0, 24, 168, 0.06)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'primary.main',
                      borderRadius: 2.5,
                    }
                  }}
                />
                <Box sx={{ pl: 5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                    Supervisory Audit Checks:
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    {comp.requirements.map((req, rIdx) => (
                      <ListItem key={rIdx} sx={{ p: 0, pb: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <CheckCircleIcon sx={{ color: 'success.main', fontSize: '0.85rem' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={req}
                          primaryTypographyProps={{ fontSize: '0.68rem', fontWeight: 600, color: 'text.primary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
