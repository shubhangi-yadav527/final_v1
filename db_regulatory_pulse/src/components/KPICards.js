import React from 'react';
import { Card, Box, Typography, LinearProgress, CircularProgress, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const KPICard = ({ title, value, unit, icon: Icon, color = 'primary', trend = null }) => {
  const theme = useTheme();
  const colorValue = theme.palette[color]?.main || color;

  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {title}
        </Typography>
        {Icon && (
          <Icon sx={{ fontSize: '1.5rem', color: colorValue, opacity: 0.7 }} />
        )}
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
      >
        {value}
        <Typography component="span" variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
          {unit}
        </Typography>
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main', mt: 1 }}>
          <TrendingUpIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {trend}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export const CircularGaugeCard = ({ title, value, max = 100, color = 'success', icon: Icon }) => {
  const theme = useTheme();
  const colorValue = theme.palette[color]?.main || color;
  const percentage = (value / max) * 100;

  return (
    <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>
        {title}
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={120}
          sx={{
            color: colorValue,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: colorValue }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        Current Score
      </Typography>
    </Card>
  );
};

export const SemiCircularGaugeCard = ({ title, value, max = 100, status = 'medium', icon: Icon }) => {
  const theme = useTheme();
  const statusColor = {
    low: theme.palette.success.main,
    medium: theme.palette.warning.main,
    high: theme.palette.error.main,
  };

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>
        {title}
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 140,
            height: 70,
            m: '0 auto',
            background: `conic-gradient(${statusColor[status]} 0deg ${(value / max) * 180}deg, #E5E7EB ${(value / max) * 180}deg 180deg)`,
            borderRadius: '140px 140px 0 0',
            position: 'relative',
            mb: 1,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, color: statusColor[status] }}>
          {value}%
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {status} Risk
        </Typography>
      </Box>
    </Card>
  );
};

export const ProgressCard = ({ title, percentage, color = 'primary' }) => {
  const theme = useTheme();
  const colorValue = theme.palette[color]?.main || color;

  return (
    <Card sx={{ p: 1.2 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(0, 24, 168, 0.06)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: colorValue,
            borderRadius: 3,
          },
        }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontWeight: 705, fontSize: '0.68rem' }}>
        {percentage}%
      </Typography>
    </Card>
  );
};
