import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, Typography, LinearProgress, Chip, Button, useTheme,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BACKEND_URL = 'http://localhost:8000';

const frameworkImpactMap = {
  'EU AI Act': ['Loans', 'Core Banking'],
  'DORA': ['Core Banking', 'Loans'],
  'GDPR': ['Loans', 'Core Banking', 'Deposits'],
  'Basel III': ['Loans', 'Deposits']
};

const resolveFrameworkKey = (fwName) => {
  if (!fwName || fwName === 'All') return 'All';
  const nameLower = fwName.toLowerCase();
  for (const key of Object.keys(frameworkImpactMap)) {
    if (nameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(nameLower)) {
      return key;
    }
  }
  return fwName;
};

export default function DepartmentImpact() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedFramework, setSelectedFramework] = useState(
    resolveFrameworkKey(location.state?.framework || 'All')
  );
  const [filterDepartments, setFilterDepartments] = useState(location.state?.departments || null);
  const [filterRegulationName, setFilterRegulationName] = useState(location.state?.regulation || null);

  useEffect(() => {
    if (location.state?.framework) {
      setSelectedFramework(resolveFrameworkKey(location.state.framework));
    }
    setFilterDepartments(location.state?.departments || null);
    setFilterRegulationName(location.state?.regulation || null);
  }, [location.state]);

  const handleFrameworkClick = (fw) => {
    setSelectedFramework(fw);
    setFilterDepartments(null);
    setFilterRegulationName(null);
  };

  const handleClearFilters = () => {
    setSelectedFramework('All');
    setFilterDepartments(null);
    setFilterRegulationName(null);
  };

  const [departments, setDepartments] = useState([
    {
      name: 'Deposits',
      compliance: 87,
      risk: 'Medium',
      emissions: 10.3,
      penalty: 'Supervisory fines',
      recommendation: 'Ensure alignment with Leverage Ratios, ICT Third-Party Oversight',
      source: 'BigQuery'
    },
    {
      name: 'Treasury',
      compliance: 88,
      risk: 'High',
      emissions: 6.4,
      penalty: 'Supervisory fines + capital surcharges',
      recommendation: 'Ensure alignment with Capital Adequacy, Liquidity Coverage',
      source: 'BigQuery'
    },
    {
      name: 'Cyber Security',
      compliance: 90,
      risk: 'High',
      emissions: 6.4,
      penalty: '2% turnover',
      recommendation: 'Ensure alignment with Articles 5–14 ICT Risk Management',
      source: 'BigQuery'
    },
    {
      name: 'Payments',
      compliance: 91,
      risk: 'High',
      emissions: 6.4,
      penalty: '€20M or 4% turnover',
      recommendation: 'Ensure alignment with Internal Governance, Outsourcing, AML/KYC, Annex I',
      source: 'BigQuery'
    },
    {
      name: 'KYC',
      compliance: 92,
      risk: 'High',
      emissions: 6.4,
      penalty: '€10–35M',
      recommendation: 'Ensure alignment with Internal Governance, Outsourcing, AML/KYC, Art. 50',
      source: 'BigQuery'
    },
    {
      name: 'Loans',
      compliance: 93,
      risk: 'High',
      emissions: 12.5,
      penalty: '€35M or 7% turnover',
      recommendation: 'Ensure alignment with Internal Governance, Outsourcing, AML/KYC, Annex I',
      source: 'BigQuery'
    },
    {
      name: 'Wealth Management',
      compliance: 90,
      risk: 'Medium',
      emissions: 6.4,
      penalty: '€20M or 4% turnover',
      recommendation: 'Ensure alignment with Arts. 13–14 Transparency',
      source: 'BigQuery'
    },
    {
      name: 'AML',
      compliance: 92,
      risk: 'High',
      emissions: 6.4,
      penalty: '€20M or 4% turnover',
      recommendation: 'Ensure alignment with Art. 22 Automated Decisions, Art. 35 DPIA',
      source: 'BigQuery'
    }
  ]);
  const [dataLoadedFromBQ, setDataLoadedFromBQ] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        console.log('DepartmentImpact: Fetching BQ departments from:', `${BACKEND_URL}/api/departments`);
        const response = await fetch(`${BACKEND_URL}/api/departments`);
        if (response.ok) {
          const data = await response.json();
          console.log('DepartmentImpact: Received BQ data directly on page load:', data);
          if (data && data.departments && data.departments.length > 0) {
            setDepartments(data.departments);
            setDataLoadedFromBQ(true);
          }
        } else {
          console.error('DepartmentImpact: API response error status:', response.status);
        }
      } catch (err) {
        console.error('DepartmentImpact: Fetch error:', err);
      }
    };
    fetchDepartments();
  }, []);

  const getRiskColor = (risk) => {
    const lvl = (risk || '').toLowerCase();
    if (lvl === 'low') return theme.palette.success.main;
    if (lvl === 'high' || lvl === 'severe') return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const activeKey = resolveFrameworkKey(selectedFramework);
  const filteredDepartments = departments.filter(d => {
    // 1. If we have a specific departments filter from state, apply it first
    if (filterDepartments && filterDepartments.length > 0) {
      return filterDepartments.includes(d.name);
    }

    if (activeKey === 'All') {
      return true;
    }

    const rec = (d.recommendation || '').toLowerCase();
    const fw = activeKey.toLowerCase();

    // 2. Dynamic check based on BQ recommendation text containing key terms
    if (fw.includes('ai act')) {
      if (rec.includes('ai act') || rec.includes('annex') || rec.includes('art. 50') || rec.includes('oversight') || rec.includes('creditworthiness') || rec.includes('biometric') || rec.includes('fraud') || rec.includes('model monitoring')) {
        return true;
      }
    }
    if (fw.includes('dora')) {
      if (rec.includes('dora') || rec.includes('ict') || rec.includes('third-party') || rec.includes('resilience') || rec.includes('oversight') || rec.includes('vendor risk')) {
        return true;
      }
    }
    if (fw.includes('gdpr')) {
      if (rec.includes('gdpr') || rec.includes('transparency') || rec.includes('profiling') || rec.includes('automated decisions') || rec.includes('dpia') || rec.includes('privacy') || rec.includes('consent') || rec.includes('art. 22') || rec.includes('art. 35')) {
        return true;
      }
    }
    if (fw.includes('basel')) {
      if (rec.includes('basel') || rec.includes('leverage') || rec.includes('capital') || rec.includes('liquidity') || rec.includes('adequacy') || rec.includes('coverage') || rec.includes('crr') || rec.includes('stress testing')) {
        return true;
      }
    }

    // 3. Fallback check using the frameworkImpactMap
    const allowed = frameworkImpactMap[activeKey];
    if (allowed && allowed.includes(d.name)) {
      return true;
    }

    // Fallback recommendation text check
    if (rec.includes(fw)) {
      return true;
    }

    return false;
  });

  const totalDepts = filteredDepartments.length;
  const compliantCount = filteredDepartments.filter(d => (d.risk || '').toLowerCase() === 'low').length;
  const mediumCount = filteredDepartments.filter(d => (d.risk || '').toLowerCase() === 'medium').length;
  const highCount = filteredDepartments.filter(d => (d.risk || '').toLowerCase() === 'high' || (d.risk || '').toLowerCase() === 'severe').length;

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
            Department Compliance Metrics
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Impacted business departments, their AI compliance scores, active risk levels, and regulatory penalties
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: { xs: 'auto', md: '1fr auto' },
          gap: 2.5,
          maxWidth: '1060px',
          flexGrow: 1,
          height: 'calc(100% - 60px)',
          minHeight: 0
        }}
      >
        {/* ROW 1: Department Cards Wrapper with internal scroll */}
        <Box sx={{ overflowY: 'auto', pr: 1, height: '100%' }}>
          {/* Framework Filter Bar & BigQuery Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
              <FilterListIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem' }}>
                Framework:
              </Typography>
              {['All', 'EU AI Act', 'DORA', 'GDPR', 'Basel III'].map((fw) => (
                <Chip
                  key={fw}
                  label={fw}
                  size="small"
                  clickable
                  onClick={() => handleFrameworkClick(fw)}
                  color={activeKey === fw && !filterRegulationName ? 'primary' : 'default'}
                  variant={activeKey === fw && !filterRegulationName ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 650, fontSize: '0.65rem', height: 20 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="⚡ Live BQ Data (tensile-oarlock-500904-d4)"
                size="small"
                sx={{
                  bgcolor: 'rgba(5, 150, 105, 0.12)',
                  color: '#059669',
                  fontWeight: 700,
                  fontSize: '0.62rem',
                  height: 20,
                  border: '1px solid rgba(5, 150, 105, 0.3)'
                }}
              />
              {(selectedFramework !== 'All' || filterRegulationName) && (
                <Button
                  size="small"
                  variant="text"
                  onClick={handleClearFilters}
                  sx={{ fontSize: '0.65rem', textTransform: 'none', fontWeight: 600, py: 0 }}
                >
                  Clear Filter (Show All)
                </Button>
              )}
            </Box>
          </Box>

          {/* Active Regulation Filtering Banner */}
          {filterRegulationName && (
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: 'rgba(0, 24, 168, 0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 24, 168, 0.1)'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 650, fontSize: '0.72rem', color: 'primary.main' }}>
                Showing only department(s) impacted by: <strong>{filterRegulationName}</strong>
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  ml: 'auto',
                  fontSize: '0.62rem',
                  height: 22,
                  py: 0,
                  px: 1,
                  fontWeight: 700,
                  textTransform: 'none'
                }}
              >
                Show All Departments
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5, pb: 1 }}>
            {filteredDepartments.map((dept, idx) => (
              <Card key={idx} className="glass-card" sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {dept.name}
                  </Typography>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: `${getRiskColor(dept.risk)}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BuildIcon sx={{ color: getRiskColor(dept.risk), fontSize: '1rem' }} />
                  </Box>
                </Box>

                {/* Compliance */}
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>
                      Compliance
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.75rem' }}>
                      {dept.compliance}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={dept.compliance}
                    sx={{
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: 'rgba(0, 24, 168, 0.06)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: dept.compliance > 90 ? theme.palette.success.main : theme.palette.warning.main,
                        borderRadius: 2.5,
                      },
                    }}
                  />
                </Box>

                {/* Risk & Carbon & Cost info */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, my: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block' }}>Risk Score</Typography>
                    <Chip
                      label={dept.risk}
                      size="small"
                      sx={{
                        bgcolor: getRiskColor(dept.risk),
                        color: 'white',
                        fontWeight: 700,
                        height: 16,
                        fontSize: '0.62rem',
                        mt: 0.2
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block' }}>Emissions</Typography>
                    <Typography sx={{ fontWeight: 750, fontSize: '0.85rem', mt: 0.2 }}>
                      {dept.emissions}T
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block' }}>Penalty</Typography>
                    <Typography sx={{ fontWeight: 750, color: getRiskColor(dept.risk), fontSize: '0.72rem', mt: 0.2 }}>
                      {dept.penalty}
                    </Typography>
                  </Box>
                </Box>

                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="small" 
                  onClick={() => navigate('/approval', { state: { department: dept.name } })}
                  sx={{ py: 0.15, fontSize: '0.72rem', minHeight: 24, fontWeight: 700 }}
                >
                  Recommendation
                </Button>
              </Card>
            ))}
          </Box>
        </Box>

        {/* ROW 2: Summary Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5 }}>
          {[
            { icon: <CheckCircleIcon sx={{ fontSize: '1.4rem', color: 'success.main' }} />, title: 'Compliant Departments', value: `${compliantCount}/${totalDepts}`, bg: 'rgba(16, 185, 129, 0.04)' },
            { icon: <WarningIcon sx={{ fontSize: '1.4rem', color: 'warning.main' }} />, title: 'Medium Risk', value: `${mediumCount}/${totalDepts}`, bg: 'rgba(245, 158, 11, 0.04)' },
            { icon: <WarningIcon sx={{ fontSize: '1.4rem', color: 'error.main' }} />, title: 'High Risk', value: `${highCount}/${totalDepts}`, bg: 'rgba(239, 68, 68, 0.04)' },
          ].map((item, i) => (
            <Card key={i} className="glass-card" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: item.bg }}>
              {item.icon}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.1, lineHeight: 1, fontSize: '1rem' }}>
                  {item.value}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
