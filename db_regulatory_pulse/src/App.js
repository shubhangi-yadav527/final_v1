import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box, Typography, Avatar, IconButton, Badge, Drawer,
  TextField, Paper, Tooltip, Zoom
} from '@mui/material';
import { dbTheme } from './theme/dbTheme';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ForestIcon from '@mui/icons-material/Forest';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// Pages
import HomeDashboard from './pages/HomeDashboard';
import RegulatoryIntelligence from './pages/RegulatoryIntelligence';
import DepartmentImpact from './pages/DepartmentImpact';
import EnterpriseRiskDashboard from './pages/EnterpriseRiskDashboard';
import CarbonDashboard from './pages/CarbonDashboard';
import CostROIDashboard from './pages/CostROIDashboard';
import ExecutiveApproval from './pages/ExecutiveApproval';
import GovernanceScoreDrill from './pages/GovernanceScoreDrill';
import AIConfidenceDrill from './pages/AIConfidenceDrill';

import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function ZehnBotAvatar({ size = 40 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.85) 50%, rgba(200,220,245,0.7) 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: size * 0.75,
          height: size * 0.5,
          borderRadius: `${size * 0.2}px`,
          bgcolor: '#121420',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, mb: 0.2 }}>
          <Box sx={{ width: size * 0.1, height: size * 0.07, bgcolor: '#2DD4BF', borderRadius: '50%', boxShadow: '0 0 3px #2DD4BF' }} />
          <Box sx={{ width: size * 0.1, height: size * 0.07, bgcolor: '#2DD4BF', borderRadius: '50%', boxShadow: '0 0 3px #2DD4BF' }} />
        </Box>
        <Box
          sx={{
            width: size * 0.25,
            height: size * 0.1,
            borderBottom: '1px solid #2DD4BF',
            borderRadius: '0 0 3px 3px',
          }}
        />
      </Box>
    </Box>
  );
}

function ZehnBotCharacter({ floating = true }) {
  return (
    <Box
      sx={{
        width: 110,
        height: 120,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 10px 20px rgba(0, 168, 168, 0.25))',
        animation: floating ? 'botHover 4s ease-in-out infinite' : 'none',
        '@keyframes botHover': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }}
    >
      {/* Glow effect behind robot */}
      <Box
        sx={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 240, 0.4) 0%, transparent 70%)',
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />

      {/* Head Group */}
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Head Shape: Horizontal pill with glossy glass style */}
        <Box
          sx={{
            width: 72,
            height: 48,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.85) 50%, rgba(200,220,245,0.7) 100%)',
            border: '1.5px solid rgba(255,255,255,0.9)',
            boxShadow: 'inset 0 3px 5px rgba(255,255,255,1), 0 4px 10px rgba(0,0,0,0.06)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Black Digital Screen Faceplate */}
          <Box
            sx={{
              width: 54,
              height: 32,
              borderRadius: '16px',
              bgcolor: '#121420',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Eyes & Smile */}
            <Box sx={{ display: 'flex', gap: 1.2, mb: 0.2 }}>
              {/* Left Eye */}
              <Box 
                sx={{ 
                  width: 8, 
                  height: 5, 
                  bgcolor: '#2DD4BF', 
                  borderRadius: '50%', 
                  boxShadow: '0 0 6px #2DD4BF' 
                }} 
              />
              {/* Right Eye */}
              <Box 
                sx={{ 
                  width: 8, 
                  height: 5, 
                  bgcolor: '#2DD4BF', 
                  borderRadius: '50%', 
                  boxShadow: '0 0 6px #2DD4BF' 
                }} 
              />
            </Box>
            {/* Smile (curved arc) */}
            <Box
              sx={{
                width: 14,
                height: 6,
                borderBottom: '2.5px solid #2DD4BF',
                borderRadius: '0 0 7px 7px',
                boxShadow: '0 1.5px 3px rgba(45, 212, 191, 0.4)',
              }}
            />
          </Box>
        </Box>

        {/* Headphones (Ears) on left/right of head */}
        {/* Left Ear */}
        <Box
          sx={{
            position: 'absolute',
            left: -6,
            top: 10,
            width: 14,
            height: 28,
            borderRadius: '8px 4px 4px 8px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(220,230,245,0.9))',
            border: '1.2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::after': {
              content: '""',
              width: 4,
              height: 12,
              borderRadius: '2px',
              bgcolor: '#2DD4BF',
              boxShadow: '0 0 4px #2DD4BF'
            }
          }}
        />
        {/* Right Ear */}
        <Box
          sx={{
            position: 'absolute',
            right: -6,
            top: 10,
            width: 14,
            height: 28,
            borderRadius: '4px 8px 8px 4px',
            background: 'linear-gradient(to left, rgba(255,255,255,0.95), rgba(220,230,245,0.9))',
            border: '1.2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::after': {
              content: '""',
              width: 4,
              height: 12,
              borderRadius: '2px',
              bgcolor: '#2DD4BF',
              boxShadow: '0 0 4px #2DD4BF'
            }
          }}
        />
      </Box>

      {/* Neck connector */}
      <Box
        sx={{
          width: 12,
          height: 6,
          bgcolor: 'rgba(200,215,235,0.8)',
          borderRadius: '2px',
          zIndex: 1,
          mt: -0.5,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
      />

      {/* Torso (Body) with glossy sphere/teardrop design */}
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50% 50% 45% 45%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(235,242,255,0.85) 45%, rgba(200,215,245,0.6) 80%, rgba(255,182,193,0.15) 100%)',
          border: '1.5px solid rgba(255,255,255,0.9)',
          boxShadow: 'inset 0 3px 5px rgba(255,255,255,1), 0 4px 10px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: -0.5,
        }}
      >
        {/* Glowing chest power core */}
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFF 0%, #2DD4BF 50%, #00A8A8 100%)',
            boxShadow: '0 0 10px #2DD4BF, 0 0 20px rgba(45,212,191,0.5)',
            animation: 'pulseCore 2s ease-in-out infinite',
            '@keyframes pulseCore': {
              '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.15)' },
            }
          }}
        />
      </Box>

      {/* Left Floating Arm */}
      <Box
        sx={{
          position: 'absolute',
          left: 12,
          top: 54,
          width: 12,
          height: 24,
          borderRadius: '6px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(210,225,245,0.8))',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transformOrigin: 'top center',
          animation: floating ? 'armSwingLeft 4s ease-in-out infinite' : 'none',
          '@keyframes armSwingLeft': {
            '0%, 100%': { transform: 'rotate(5deg)' },
            '50%': { transform: 'rotate(-5deg) translateY(-2px)' },
          }
        }}
      />

      {/* Right Floating Arm */}
      <Box
        sx={{
          position: 'absolute',
          right: 12,
          top: 54,
          width: 12,
          height: 24,
          borderRadius: '6px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(210,225,245,0.8))',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transformOrigin: 'top center',
          animation: floating ? 'armSwingRight 4s ease-in-out infinite' : 'none',
          '@keyframes armSwingRight': {
            '0%, 100%': { transform: 'rotate(-5deg)' },
            '50%': { transform: 'rotate(5deg) translateY(-2px)' },
          }
        }}
      />
    </Box>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBubbleVisible, setChatBubbleVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      sender: 'bot',
      text: "Hello, I'm ZehnBot. How can I assist you?",
    }
  ]);

  const currentPath = location.pathname;

  const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Carbon Footprint', path: '/esg', icon: ForestIcon },
    { label: 'Regulations', path: '/ai', icon: FolderIcon },
    { label: 'Risks', path: '/risks', icon: GridViewIcon },
    { label: 'Departments', path: '/departments', icon: BusinessIcon },
    { label: 'Recommendations', path: '/approval', icon: CheckCircleIcon },
    { label: 'Cost & ROI', path: '/roi', icon: MonetizationOnIcon },
  ];

  const getPageTitle = () => {
    switch (currentPath) {
      case '/':
        return 'DB Regulatory Pulse';
      case '/risks':
        return 'Enterprise Risk Dashboard';
      case '/esg':
        return 'Carbon & Sustainability Dashboard';
      case '/ai':
        return 'Regulatory Intelligence Hub';
      case '/approval':
        return 'Governance Recommendations';
      case '/departments':
        return 'Department Compliance Metrics';
      case '/roi':
        return 'Cost & ROI Analysis';
      case '/ai-confidence-drill':
        return 'AI Confidence Matrics';
      default:
        return 'AI Governance Metrics';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMsg = { sender: 'user', text: message };
    setChat(prev => [...prev, userMsg]);
    const currentInput = message;
    setMessage('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/chat`, { message: currentInput });
      setChat(prev => [...prev, {
        sender: 'bot',
        text: response.data.response,
        metadata: response.data.metadata
      }]);
    } catch (error) {
      console.error("Error communicating with ZehnBot:", error);
      setChat(prev => [...prev, {
        sender: 'bot',
        text: "I'm having trouble connecting to the governance engine, but we are keeping your systems secure."
      }]);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 1, md: 2 }, px: { xs: 0.5, md: 1.5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Frosted Glass Container Board */}
      <Box 
        className="glass-container"
        sx={{ 
          width: '100%', 
          maxWidth: '1560px', 
          minHeight: '88vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Left Sidebar Navigation */}
        <Box
          className="glass-sidebar"
          sx={{
            width: { xs: '100%', md: '210px' },
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 1.5, md: 2.5 },
            px: 0,
            borderBottom: { xs: '1px solid rgba(255, 255, 255, 0.3)', md: 'none' }
          }}
        >
          {/* Logo & Navigation Stack Grouped Together */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              alignItems: 'center',
              width: '100%',
              gap: { xs: 2, md: 2 }
            }}
          >
            {/* Top Logo Container: Centered on desktop with reduced vertical spacing */}
            <Box 
              sx={{
                width: '100%',
                height: { xs: 'auto', md: '90px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box 
                onClick={() => navigate('/')}
                sx={{ 
                  width: 52, 
                  height: 52, 
                  bgcolor: 'primary.main', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2.5px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 12px rgba(0, 24, 168, 0.25)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {/* DB Diagonal Line Logo */}
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    border: '2.5px solid white',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '135%',
                      height: 2.5,
                      bgcolor: 'white',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-45deg)'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Navigation Item Stack */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'row', md: 'column' }, 
                gap: 0.8,
                width: '100%',
                alignItems: { xs: 'center', md: 'stretch' },
                px: { xs: 0, md: 2 }
              }}
            >
              {navItems.map((item) => {
                const active = currentPath === item.path;
                const Icon = item.icon;
                return (
                  <Tooltip key={item.path} title={item.label} placement="right" transitionComponent={Zoom}>
                    <Box
                      onClick={() => navigate(item.path)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        height: 38,
                        px: 2,
                        borderRadius: '8px',
                        bgcolor: active ? 'primary.main' : 'transparent',
                        color: active ? 'white' : 'text.secondary',
                        border: active ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: active ? 'primary.main' : 'rgba(0, 24, 168, 0.08)',
                          color: active ? 'white' : 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon sx={{ fontSize: '1.2rem' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 650,
                          fontSize: '0.8rem',
                          display: { xs: 'none', md: 'block' },
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>

          {/* Spacer to push Settings/Logout to bottom on desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

          {/* Bottom Settings & Logout */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, justifyContent: 'center', width: '100%', mb: { xs: 0, md: 2 } }}>
            <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <SettingsIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
              <ExitToAppIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Right Area: TopBar & Page Routing Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header inside glass container */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Box>
              <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.022em' }}>
                {getPageTitle()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
                Empowering Compliance. Driving AI Innovation.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <Badge badgeContent={1} color="error" variant="dot">
                  <NotificationsIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
                </Badge>
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                <Avatar 
                  alt="Sarah Chen"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                    Sarah Chen
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Welcome, DB User
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Main Routing Screen */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/risks" element={<EnterpriseRiskDashboard />} />
              <Route path="/esg" element={<CarbonDashboard />} />
              <Route path="/ai" element={<RegulatoryIntelligence />} />
              <Route path="/approval" element={<ExecutiveApproval />} />
              <Route path="/departments" element={<DepartmentImpact />} />
              <Route path="/roi" element={<CostROIDashboard />} />
              <Route path="/governance-score-drill" element={<GovernanceScoreDrill />} />
              <Route path="/ai-confidence-drill" element={<AIConfidenceDrill />} />
            </Routes>
          </Box>
        </Box>
      </Box>

      {/* Floating ZehnBot Assistant (Bottom Right) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 30,
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          onClick={() => setChatOpen(!chatOpen)}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { 
              transform: 'scale(1.08) translateY(-4px)',
            },
          }}
        >
          <ZehnBotCharacter />
        </Box>

        {/* Chat bubble prompt below avatar */}
        {chatBubbleVisible && !chatOpen && (
          <Paper
            className="glass-card"
            sx={{
              p: 1.5,
              borderRadius: '12px',
              maxWidth: 200,
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              animation: 'bubbleFloat 3s ease-in-out infinite',
              '@keyframes bubbleFloat': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-4px)' },
              },
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setChatBubbleVisible(false);
              }}
              sx={{ position: 'absolute', top: 4, right: 4, p: 0.2, color: 'text.secondary' }}
            >
              <CloseIcon sx={{ fontSize: '0.8rem' }} />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.8rem', pr: 1.5, pl: 0.5 }}>
              Hello, I'm ZehnBot. How can I help you?
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Floating Glassmorphic Chat Pane */}
      {chatOpen && (
        <Paper
          className="glass-card"
          sx={{
            position: 'fixed',
            width: { xs: 'calc(100% - 40px)', sm: 310 },
            height: '50vh',
            bottom: 85,
            right: { xs: 20, sm: 30 },
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 12px 40px rgba(0, 24, 168, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            zIndex: 1300,
            animation: 'slideUpChat 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideUpChat': {
              from: { transform: 'translateY(20px)', opacity: 0 },
              to: { transform: 'translateY(0)', opacity: 1 }
            }
          }}
        >
          {/* Chat Pane Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ZehnBotAvatar size={36} floating={false} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2, fontSize: '0.95rem' }}>
                  ZehnBot
                </Typography>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, fontSize: '0.65rem' }}>
                  ● Active Governance Agent
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setChatOpen(false)} sx={{ bgcolor: 'rgba(255,255,255,0.6)', p: 0.5 }}>
              <CloseIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Box>

          {/* Chat Log */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              mb: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              pr: 1
            }}
          >
            {chat.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    width: '100%' 
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      borderRadius: isUser ? '14px 14px 0 14px' : '14px 14px 14px 0',
                      bgcolor: isUser ? 'primary.main' : 'rgba(255,255,255,0.85)',
                      color: isUser ? 'white' : 'text.primary',
                      border: isUser ? 'none' : '1px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      maxWidth: '85%'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.35, fontSize: '0.75rem' }}>
                      {msg.text}
                    </Typography>

                    {/* Recommendation action chips in bot messages */}
                    {msg.metadata && msg.metadata.actions && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                        {msg.metadata.actions.map((act, i) => (
                          <Box
                            key={i}
                            sx={{
                              px: 0.8,
                              py: 0.3,
                              borderRadius: '4px',
                              border: isUser ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(0, 24, 168, 0.4)',
                              fontSize: '0.62rem',
                              fontWeight: 600,
                              color: isUser ? 'white' : 'primary.main',
                              bgcolor: isUser ? 'transparent' : 'rgba(0, 24, 168, 0.04)'
                            }}
                          >
                            {act}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>

          {/* Input Bar */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask ZehnBot..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem'
                }
              }}
            />
            <IconButton 
              color="primary"
              onClick={handleSendMessage}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 36,
                height: 36,
                borderRadius: '10px'
              }}
            >
              <SendIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={dbTheme}>
      <CssBaseline />
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

