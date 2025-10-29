import React, { useState } from 'react';
import { Card, CardContent, Box, Zoom, Grow } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnimatedCard = styled(Card)(({ theme, hoverEffect }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transformOrigin: 'center',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },

  '&:hover': {
    ...(hoverEffect === 'lift' && {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    }),
    ...(hoverEffect === 'scale' && {
      transform: 'scale(1.05)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
    }),
    ...(hoverEffect === 'rotate' && {
      transform: 'translateY(-4px) rotateY(5deg)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
    }),
    ...(hoverEffect === 'glow' && {
      boxShadow: `0 0 30px ${theme.palette.primary.main}40`,
    }),
    
    '&::before': {
      opacity: 1,
    },
  },
}));

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
});

const HoverCard = ({ 
  children, 
  hoverEffect = 'lift',
  animateContent = false,
  contentAnimation = 'zoom',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const renderContent = () => {
    if (!animateContent) {
      return <ContentWrapper>{children}</ContentWrapper>;
    }

    switch (contentAnimation) {
      case 'grow':
        return (
          <Grow in={isHovered} timeout={300}>
            <ContentWrapper>{children}</ContentWrapper>
          </Grow>
        );
      case 'zoom':
      default:
        return (
          <Zoom in={isHovered} timeout={300}>
            <ContentWrapper>{children}</ContentWrapper>
          </Zoom>
        );
    }
  };

  return (
    <AnimatedCard
      hoverEffect={hoverEffect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {renderContent()}
    </AnimatedCard>
  );
};

export default HoverCard;