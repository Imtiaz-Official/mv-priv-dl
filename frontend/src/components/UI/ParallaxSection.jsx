import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ParallaxContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  willChange: 'transform',
}));

const ParallaxBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '120%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  willChange: 'transform',
  zIndex: -1,
}));

const ParallaxContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const ParallaxSection = ({ 
  children, 
  backgroundImage, 
  height = '100vh', 
  speed = 0.5,
  overlay = true,
  overlayOpacity = 0.6,
  ...props 
}) => {
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !backgroundRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      // Only apply parallax when element is in viewport
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        setOffset(rate);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [speed]);

  return (
    <ParallaxContainer
      ref={containerRef}
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.sx,
      }}
      {...props}
    >
      {backgroundImage && (
        <ParallaxBackground
          ref={backgroundRef}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            transform: `translate3d(0, ${offset}px, 0)`,
          }}
        />
      )}
      
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
            zIndex: 0,
          }}
        />
      )}
      
      <ParallaxContent sx={{ width: '100%', height: '100%' }}>
        {children}
      </ParallaxContent>
    </ParallaxContainer>
  );
};

export default ParallaxSection;