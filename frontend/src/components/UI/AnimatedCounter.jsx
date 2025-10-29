import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnimatedNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  transition: 'all 0.3s ease',
}));

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  start = 0, 
  prefix = '', 
  suffix = '', 
  variant = 'h4',
  formatter,
  ...props 
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
        observerRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    const totalChange = endValue - startValue;

    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + totalChange * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible]); // Remove start, end, duration from dependencies to prevent infinite loop

  const formatNumber = (num) => {
    if (formatter) {
      return formatter(num);
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <AnimatedNumber
      ref={elementRef}
      variant={variant}
      {...props}
    >
      {prefix}{formatNumber(count)}{suffix}
    </AnimatedNumber>
  );
};

export default AnimatedCounter;