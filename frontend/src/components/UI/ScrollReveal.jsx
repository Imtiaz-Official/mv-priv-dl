import React, { useEffect, useRef, useState } from 'react';
import { Box, Fade, Slide, Zoom, Grow } from '@mui/material';

const ScrollReveal = ({ 
  children, 
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  triggerOnce = true,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, triggerOnce]);

  const renderAnimation = () => {
    const timeout = delay;

    switch (animation) {
      case 'slide':
        return (
          <Slide direction={direction} in={isVisible} timeout={duration + timeout}>
            <Box {...props}>{children}</Box>
          </Slide>
        );
      case 'zoom':
        return (
          <Zoom in={isVisible} timeout={duration + timeout}>
            <Box {...props}>{children}</Box>
          </Zoom>
        );
      case 'grow':
        return (
          <Grow in={isVisible} timeout={duration + timeout}>
            <Box {...props}>{children}</Box>
          </Grow>
        );
      case 'fade':
      default:
        return (
          <Fade in={isVisible} timeout={duration + timeout}>
            <Box {...props}>{children}</Box>
          </Fade>
        );
    }
  };

  return (
    <Box ref={elementRef} sx={{ width: '100%' }}>
      {renderAnimation()}
    </Box>
  );
};

export default ScrollReveal;