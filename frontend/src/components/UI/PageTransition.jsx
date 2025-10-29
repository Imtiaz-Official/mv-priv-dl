import React from 'react';
import { Box, Fade, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';

const TransitionContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
}));

const PageTransition = ({ 
  children, 
  type = 'fade',
  direction = 'up',
  duration = 500,
  delay = 0,
  ...props 
}) => {
  const renderTransition = () => {
    switch (type) {
      case 'slide':
        return (
          <Slide 
            direction={direction} 
            in={true} 
            timeout={{ enter: duration, exit: duration }}
            style={{ transitionDelay: `${delay}ms` }}
          >
            <TransitionContainer {...props}>
              {children}
            </TransitionContainer>
          </Slide>
        );
      case 'fade':
      default:
        return (
          <Fade 
            in={true} 
            timeout={{ enter: duration, exit: duration }}
            style={{ transitionDelay: `${delay}ms` }}
          >
            <TransitionContainer {...props}>
              {children}
            </TransitionContainer>
          </Fade>
        );
    }
  };

  return renderTransition();
};

export default PageTransition;