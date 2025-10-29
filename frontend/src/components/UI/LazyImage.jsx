import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const LazyImage = ({
  src,
  alt,
  placeholder,
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  fallback = null,
  onLoad,
  onError,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  const handleImageLoad = (e) => {
    setImageLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    setImageError(true);
    if (onError) onError(e);
  };

  return (
    <Box
      ref={elementRef}
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        ...props.sx,
      }}
      {...props}
    >
      {!hasIntersected && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius,
          }}
        />
      )}

      {hasIntersected && !imageError && (
        <>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius,
              }}
            />
          )}
          <Box
            component="img"
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit,
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              borderRadius,
            }}
          />
        </>
      )}

      {hasIntersected && imageError && fallback && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius,
          }}
        >
          {fallback}
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;