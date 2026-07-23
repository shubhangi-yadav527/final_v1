import React from 'react';
import { Box, AppBar, Toolbar, Typography, Avatar, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function TopBar({ userName = 'Sarah' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'ESG', path: '/esg' },
    { label: 'AI', path: '/ai' },
    { label: 'Risks', path: '/risks' },
    { label: 'Approval', path: '/approval' },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            🏦 Deutsche Bank Regulatory Pulse
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: isActive(item.path) ? '#FFF' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  borderBottom: isActive(item.path) ? '2px solid #FFF' : 'none',
                  pb: 0.5,
                  '&:hover': { color: '#FFF' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Good morning, {userName}
          </Typography>
          <Button
            onClick={handleMenuOpen}
            sx={{ minWidth: 'auto', p: 0, color: '#FFF' }}
          >
            <AccountCircleIcon sx={{ fontSize: '1.8rem' }} />
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
