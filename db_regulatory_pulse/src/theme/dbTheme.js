import { createTheme } from '@mui/material/styles';

export const dbTheme = createTheme({
  palette: {
    primary: {
      main: '#0018A8', // Deutsche Bank deep blue
      light: '#3B82F6',
      dark: '#0A136B',
    },
    secondary: {
      main: '#0D9488', // Rich Vivid Teal
      light: '#14B8A6',
      dark: '#0F766E',
    },
    success: {
      main: '#059669', // Deep Emerald Green for high compliance contrast
      light: '#10B981',
      dark: '#047857',
    },
    warning: {
      main: '#D97706', // Rich Vivid Amber for risk contrast
      light: '#F59E0B',
      dark: '#B45309',
    },
    error: {
      main: '#DC2626', // Deep Crimson Red for high risk contrast
      light: '#EF4444',
      dark: '#991B1B',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Ultra crisp Slate 900 dark text
      secondary: '#475569', // Clear Slate 600 secondary text
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.022em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.021em',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.375rem',
      fontWeight: 600,
      letterSpacing: '-0.018em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '0.95rem',
      fontWeight: 600,
      letterSpacing: '-0.012em',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.9rem',
      fontWeight: 400,
      letterSpacing: '-0.011em',
      lineHeight: 1.45,
    },
    body2: {
      fontSize: '0.8rem',
      fontWeight: 400,
      letterSpacing: '-0.011em',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '-0.008em',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(24).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});
