import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, useTheme, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ExecutiveApproval() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filterDepartment = location.state?.department || null;

  const approvalItems = [
    {
      id: 1,
      title: 'EU AI Act Compliance Framework',
      department: 'Loans',
      risk: 'High',
      cost: '€0.8M',
      savings: '€0.4M',
      timeline: '8 weeks',
      carbonReduction: '2.1 Tons CO₂',
      status: 'Pending',
      description: 'Implement comprehensive AI governance framework aligned with EU AI Act requirements.',
      actions: ['Risk Assessment', 'Policy Update', 'Staff Training', 'Audit Compliance'],
    },
    {
      id: 2,
      title: 'Automated Compliance Reporting',
      department: 'Core Banking',
      risk: 'Medium',
      cost: '€0.4M',
      savings: '€0.6M',
      timeline: '6 weeks',
      carbonReduction: '1.8 Tons CO₂',
      status: 'Pending',
      description: 'Deploy automated reporting system to reduce manual compliance tasks.',
      actions: ['System Design', 'Integration', 'Testing', 'Deployment'],
    },
    {
      id: 3,
      title: 'Data Center Energy Optimization',
      department: 'Deposits',
      risk: 'Low',
      cost: '€0.2M',
      savings: '€0.3M',
      timeline: '4 weeks',
      carbonReduction: '3.2 Tons CO₂',
      status: 'Pending',
      description: 'Implement AI-driven optimization of data center operations.',
      actions: ['Assessment', 'Implementation', 'Monitoring'],
    },
    {
      id: 4,
      title: 'Risk-weighted Asset Modeling',
      department: 'Treasury',
      risk: 'High',
      cost: '€0.9M',
      savings: '€0.5M',
      timeline: '10 weeks',
      carbonReduction: '1.2 Tons CO₂',
      status: 'Pending',
      description: 'Optimize treasury capital buffers and risk-weighted asset modeling under Basel III rules.',
      actions: ['Model Development', 'Validation', 'Stress Testing'],
    },
    {
      id: 5,
      title: 'Digital Resiliency (DORA) Framework',
      department: 'Cyber Security',
      risk: 'High',
      cost: '€0.6M',
      savings: '€0.3M',
      timeline: '8 weeks',
      carbonReduction: '0.8 Tons CO₂',
      status: 'Pending',
      description: 'Upgrade network segmentation and ICT operational resilience to comply with DORA rules.',
      actions: ['Vulnerability Scan', 'Resilience Plan', 'Testing'],
    },
    {
      id: 6,
      title: 'AML Transaction Auditing Automation',
      department: 'Payments',
      risk: 'Medium',
      cost: '€0.5M',
      savings: '€0.3M',
      timeline: '6 weeks',
      carbonReduction: '1.0 Tons CO₂',
      status: 'Pending',
      description: 'Automate anti-money laundering auditing workflows for cross-border transaction compliance.',
      actions: ['Audit Integration', 'Compliance Review'],
    }
  ];

  const filteredApprovalItems = filterDepartment
    ? approvalItems.filter(item => item.department.toLowerCase() === filterDepartment.toLowerCase())
    : approvalItems;

  const calculateTotalCost = (items) => {
    const sum = items.reduce((acc, curr) => {
      const num = parseFloat(curr.cost.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    return `€${sum.toFixed(1)}M`;
  };

  const calculateTotalSavings = (items) => {
    const sum = items.reduce((acc, curr) => {
      const num = parseFloat(curr.savings.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    return `€${sum.toFixed(1)}M`;
  };

  const calculateTotalCarbon = (items) => {
    const sum = items.reduce((acc, curr) => {
      const num = parseFloat(curr.carbonReduction.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    return `${sum.toFixed(1)} T`;
  };

  const getRiskColor = (risk) => {
    const colors = {
      High: theme.palette.error.main,
      Medium: theme.palette.warning.main,
      Low: theme.palette.success.main,
    };
    return colors[risk] || theme.palette.primary.main;
  };

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleApprove = () => {
    alert(`✅ ${selectedItem.title} approved!`);
    handleCloseDialog();
  };

  const handleReject = () => {
    alert(`❌ ${selectedItem.title} rejected.`);
    handleCloseDialog();
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
            Executive Regulatory Queue
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Review and approve AI governance frameworks, green recommendations, and compliance investments
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: { xs: 'auto', md: 'auto 1fr' },
          gap: 2.5,
          maxWidth: '1060px',
          flexGrow: 1,
          height: 'calc(100% - 60px)',
          minHeight: 0
        }}
      >
        {/* ROW 1: Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5 }}>
          {[
            { label: 'Pending Approvals', value: filteredApprovalItems.length, color: 'warning.main', bg: 'rgba(245, 158, 11, 0.04)' },
            { label: 'Total Investment', value: calculateTotalCost(filteredApprovalItems), color: 'error.main', bg: 'rgba(239, 68, 68, 0.04)' },
            { label: 'Total Savings', value: calculateTotalSavings(filteredApprovalItems), color: 'success.main', bg: 'rgba(16, 185, 129, 0.04)' },
            { label: 'CO₂ Reduction', value: calculateTotalCarbon(filteredApprovalItems), color: 'secondary.main', bg: 'rgba(0, 24, 168, 0.04)' },
          ].map((item, idx) => (
            <Card key={idx} className="glass-card" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: item.bg }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: item.color, mt: 0.1, lineHeight: 1 }}>
                  {item.value}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        {/* ROW 2: Approval Table in scrollable wrapper */}
        <TableContainer component={Card} className="glass-card" sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filterDepartment && (
            <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(0, 24, 168, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(0, 24, 168, 0.02)' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem' }}>
                Showing recommendations for: <strong>{filterDepartment}</strong> department
              </Typography>
              <Chip
                label="Clear"
                size="small"
                onDelete={() => navigate('/approval', { replace: true, state: {} })}
                color="primary"
                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
              />
            </Box>
          )}
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }}>Action Plan</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }}>Risk</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }} align="right">Cost</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }} align="right">Savings</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }} align="right">Timeline</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', bgcolor: 'rgba(255, 255, 255, 0.9) !important' }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApprovalItems.map((item) => (
                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'rgba(0, 24, 168, 0.02)' } }}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.primary' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.62rem' }}>
                      {item.description}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{item.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.risk}
                      size="small"
                      sx={{
                        bgcolor: getRiskColor(item.risk),
                        color: 'white',
                        fontWeight: 700,
                        height: 14,
                        fontSize: '0.52rem'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{item.cost}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main', fontSize: '0.7rem' }}>{item.savings}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.7rem' }}>{item.timeline}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<InfoIcon sx={{ fontSize: '0.8rem !important' }} />}
                      onClick={() => handleOpenDialog(item)}
                      sx={{ fontSize: '0.62rem', py: 0.1, minHeight: 24 }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.05rem', pb: 1 }}>
              {selectedItem.title}
            </DialogTitle>
            <DialogContent sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{selectedItem.description}</Typography>
                </Box>

                <Box sx={{ bgcolor: 'rgba(0, 24, 168, 0.02)', p: 1.5, borderRadius: 1.5, border: '1px solid rgba(0, 24, 168, 0.05)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, fontSize: '0.65rem' }}>
                    Key Metrics
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                        Investment
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main', fontSize: '0.72rem' }}>
                        {selectedItem.cost}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6' }}>
                        Expected Savings
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main', fontSize: '0.72rem' }}>
                        {selectedItem.savings}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6' }}>
                        Timeline
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>
                        {selectedItem.timeline}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6' }}>
                        CO₂ Reduction
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main', fontSize: '0.72rem' }}>
                        {selectedItem.carbonReduction}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
                    Action Items
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedItem.actions.map((action, i) => (
                      <Chip key={i} label={action} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 16 }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleReject}
                size="small"
                sx={{ fontSize: '0.65rem' }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleApprove}
                size="small"
                sx={{ fontSize: '0.65rem' }}
              >
                Accept
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
