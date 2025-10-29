import React from 'react';
import { Button as MuiButton, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme, variant, color }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: '12px 28px',
  letterSpacing: '0.02em',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // Ripple effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    transform: 'scale(0)',
    transition: 'transform 0.6s ease',
    pointerEvents: 'none',
  },
  
  '&:active::before': {
    transform: 'scale(4)',
  },

  // Primary variant
  ...(variant === 'contained' && color === 'primary' && {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0px 4px 15px rgba(102, 126, 234, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      boxShadow: '0px 6px 20px rgba(102, 126, 234, 0.6)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
  }),

  // Secondary variant
  ...(variant === 'contained' && color === 'secondary' && {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    boxShadow: '0px 4px 15px rgba(240, 147, 251, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #ee82f0 0%, #f34560 100%)',
      boxShadow: '0px 6px 20px rgba(240, 147, 251, 0.6)',
      transform: 'translateY(-2px)',
    },
  }),

  // Success variant
  ...(variant === 'contained' && color === 'success' && {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0px 4px 15px rgba(79, 172, 254, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #3d9bfe 0%, #00e0fe 100%)',
      boxShadow: '0px 6px 20px rgba(79, 172, 254, 0.6)',
      transform: 'translateY(-2px)',
    },
  }),

  // Outlined variant
  ...(variant === 'outlined' && {
    border: '2px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    '&:hover': {
      border: '2px solid rgba(255, 255, 255, 0.4)',
      background: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
    },
  }),

  // Text variant
  ...(variant === 'text' && {
    color: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
    },
  }),

  // Size variants
  '&.MuiButton-sizeSmall': {
    padding: '8px 16px',
    fontSize: '0.85rem',
  },
  
  '&.MuiButton-sizeLarge': {
    padding: '16px 32px',
    fontSize: '1.1rem',
  },

  // Disabled state
  '&.Mui-disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
    boxShadow: 'none',
    transform: 'none',
  },
}));

const Button = ({
  children,
  loading = false,
  loadingText = 'Loading...',
  startIcon,
  endIcon,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton
      {...props}
      fullWidth={fullWidth}
      disabled={loading || props.disabled}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress
            size={16}
            sx={{
              color: 'currentColor',
            }}
          />
          {loadingText}
        </Box>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;