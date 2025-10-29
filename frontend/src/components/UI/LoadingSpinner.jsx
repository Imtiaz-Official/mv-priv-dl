import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Custom pulse animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Custom rotate animation
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Custom gradient spin
const gradientSpin = keyframes`
  0% {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
  25% {
    background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
  }
  50% {
    background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  }
  75% {
    background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%);
  }
  100% {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
`;

const StyledSpinnerContainer = styled(Box)(({ theme, variant, size }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  
  ...(variant === 'page' && {
    minHeight: '50vh',
    width: '100%',
  }),
  
  ...(variant === 'section' && {
    padding: theme.spacing(4),
    width: '100%',
  }),
  
  ...(variant === 'inline' && {
    padding: theme.spacing(1),
  }),
}));

const CustomSpinner = styled(Box)(({ theme, spinnerType, size }) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };
  
  const spinnerSize = sizeMap[size] || sizeMap.medium;
  
  return {
    width: spinnerSize,
    height: spinnerSize,
    position: 'relative',
    
    ...(spinnerType === 'gradient' && {
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      animation: `${gradientSpin} 2s ease-in-out infinite, ${rotate} 1s linear infinite`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 2,
        left: 2,
        right: 2,
        bottom: 2,
        background: theme.palette.background.default,
        borderRadius: '50%',
      },
    }),
    
    ...(spinnerType === 'dots' && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      '& .dot': {
        width: spinnerSize / 6,
        height: spinnerSize / 6,
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        animation: `${pulse} 1.4s ease-in-out infinite both`,
        '&:nth-of-type(1)': { animationDelay: '-0.32s' },
        '&:nth-of-type(2)': { animationDelay: '-0.16s' },
        '&:nth-of-type(3)': { animationDelay: '0s' },
      },
    }),
    
    ...(spinnerType === 'ripple' && {
      '& .ripple': {
        position: 'absolute',
        border: '2px solid #667eea',
        borderRadius: '50%',
        animation: `${pulse} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
        '&:nth-of-type(2)': {
          animationDelay: '-0.5s',
        },
      },
    }),
  };
});

const LoadingSpinner = ({
  variant = 'inline', // 'page', 'section', 'inline'
  size = 'medium', // 'small', 'medium', 'large'
  type = 'circular', // 'circular', 'gradient', 'dots', 'ripple'
  text = '',
  color = 'primary',
  fullScreen = false,
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'gradient':
        return <CustomSpinner spinnerType="gradient" size={size} />;
      
      case 'dots':
        return (
          <CustomSpinner spinnerType="dots" size={size}>
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </CustomSpinner>
        );
      
      case 'ripple':
        return (
          <CustomSpinner spinnerType="ripple" size={size}>
            <div className="ripple" style={{ width: '100%', height: '100%' }} />
            <div className="ripple" style={{ width: '100%', height: '100%' }} />
          </CustomSpinner>
        );
      
      default:
        return (
          <CircularProgress
            size={size === 'small' ? 32 : size === 'large' ? 64 : 48}
            thickness={4}
            sx={{
              color: color === 'primary' ? '#667eea' : color,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        );
    }
  };

  const content = (
    <StyledSpinnerContainer variant={variant} size={size}>
      <Fade in timeout={300}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {renderSpinner()}
          {text && (
            <Typography
              variant={size === 'small' ? 'caption' : 'body2'}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                fontWeight: 500,
                animation: `${pulse} 2s ease-in-out infinite`,
              }}
            >
              {text}
            </Typography>
          )}
        </Box>
      </Fade>
    </StyledSpinnerContainer>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

// Preset loading components for common use cases
export const PageLoader = ({ text = 'Loading...' }) => (
  <LoadingSpinner variant="page" size="large" type="gradient" text={text} />
);

export const SectionLoader = ({ text = 'Loading content...' }) => (
  <LoadingSpinner variant="section" size="medium" type="circular" text={text} />
);

export const ButtonLoader = ({ text = '' }) => (
  <LoadingSpinner variant="inline" size="small" type="circular" text={text} />
);

export const FullScreenLoader = ({ text = 'Please wait...' }) => (
  <LoadingSpinner fullScreen size="large" type="gradient" text={text} />
);

export default LoadingSpinner;