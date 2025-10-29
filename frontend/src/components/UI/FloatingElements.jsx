import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
`;

const floatReverse = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(20px) rotate(-180deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const drift = keyframes`
  0% {
    transform: translateX(-100px) translateY(0px);
  }
  100% {
    transform: translateX(calc(100vw + 100px)) translateY(-100px);
  }
`;

const FloatingElement = styled(Box)(({ 
  size = 20, 
  color = 'rgba(255, 255, 255, 0.1)', 
  animation = 'float',
  duration = '6s',
  delay = '0s'
}) => ({
  position: 'absolute',
  width: size,
  height: size,
  backgroundColor: color,
  borderRadius: '50%',
  animation: `${
    animation === 'float' ? float :
    animation === 'floatReverse' ? floatReverse :
    animation === 'pulse' ? pulse :
    animation === 'drift' ? drift : float
  } ${duration} ease-in-out infinite`,
  animationDelay: delay,
  pointerEvents: 'none',
  zIndex: 0,
}));

const FloatingContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
});

const FloatingElements = ({ 
  count = 15, 
  colors = [
    'rgba(102, 126, 234, 0.1)',
    'rgba(118, 75, 162, 0.1)',
    'rgba(240, 147, 251, 0.1)',
    'rgba(245, 87, 108, 0.1)',
    'rgba(69, 183, 209, 0.1)',
  ],
  animations = ['float', 'floatReverse', 'pulse'],
  sizes = [10, 15, 20, 25, 30],
}) => {
  const elements = Array.from({ length: count }, (_, index) => {
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    const duration = `${4 + Math.random() * 8}s`;
    const delay = `${Math.random() * 5}s`;
    
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    return (
      <FloatingElement
        key={index}
        size={size}
        color={color}
        animation={animation}
        duration={duration}
        delay={delay}
        sx={{
          top: `${top}%`,
          left: `${left}%`,
        }}
      />
    );
  });

  return (
    <FloatingContainer>
      {elements}
    </FloatingContainer>
  );
};

// Specialized floating elements for different sections
export const HeroFloatingElements = () => (
  <FloatingElements
    count={20}
    colors={[
      'rgba(102, 126, 234, 0.15)',
      'rgba(118, 75, 162, 0.15)',
      'rgba(240, 147, 251, 0.1)',
    ]}
    animations={['float', 'pulse']}
    sizes={[15, 20, 25, 30]}
  />
);

export const SectionFloatingElements = () => (
  <FloatingElements
    count={10}
    colors={[
      'rgba(255, 255, 255, 0.05)',
      'rgba(102, 126, 234, 0.08)',
      'rgba(240, 147, 251, 0.08)',
    ]}
    animations={['float', 'floatReverse']}
    sizes={[8, 12, 16]}
  />
);

export const DriftingElements = () => {
  const driftElements = Array.from({ length: 5 }, (_, index) => (
    <FloatingElement
      key={index}
      size={Math.random() * 10 + 5}
      color="rgba(255, 255, 255, 0.05)"
      animation="drift"
      duration={`${15 + Math.random() * 10}s`}
      delay={`${Math.random() * 10}s`}
      sx={{
        top: `${Math.random() * 100}%`,
        left: '-100px',
      }}
    />
  ));

  return (
    <FloatingContainer>
      {driftElements}
    </FloatingContainer>
  );
};

export default FloatingElements;