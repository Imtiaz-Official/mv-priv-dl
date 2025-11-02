import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Skeleton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Schedule as ClockIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  MovieFilter as FilmIcon,
  Language as LanguageIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import LazyImage from './LazyImage';
import WatchlistButton from './WatchlistButton';
import { generateMovieUrl } from '../../utils/movieUtils';

const MovieCard = React.memo(({ movie, loading = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <Card
        sx={{
          height: { xs: 220, sm: 400, md: 520 },
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: { xs: 2, md: 3 },
        }}
      >
        <Skeleton
          variant="rectangular"
          height={{ xs: 140, sm: 240, md: 300 }}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Skeleton variant="text" height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          <Skeleton variant="text" height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in timeout={300}>
      <Card
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        sx={{
          height: { xs: 220, sm: 400, md: 520 },
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: { xs: 2, md: 3 },
          transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: isMobile ? 'none' : 'translateY(-12px) scale(1.03)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: isMobile ? 'none' : '0px 25px 50px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {/* Movie Poster */}
        <Box sx={{ position: 'relative', height: { xs: 140, sm: 240, md: 300 }, overflow: 'hidden' }}>
          <CardMedia
            component={Link}
            to={generateMovieUrl(movie)}
            sx={{
              height: '100%',
              position: 'relative',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <LazyImage
              src={movie.poster}
              alt={movie.title}
              width="100%"
              height="100%"
              objectFit="cover"
              fallback={
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <FilmIcon sx={{ fontSize: { xs: 32, md: 48 }, color: 'rgba(255, 255, 255, 0.3)' }} />
                  <Typography variant="caption" color="text.secondary">
                    No Image
                  </Typography>
                </Box>
              }
              sx={{
                transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
                transform: isHovered && !isMobile ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          </CardMedia>

          {/* Quality Badge */}
          <Chip
            label={movie.quality || 'HD'}
            size="small"
            sx={{
              position: 'absolute',
              top: { xs: 8, md: 12 },
              left: { xs: 8, md: 12 },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '0.65rem', md: '0.75rem' },
              height: { xs: 24, md: 28 },
              minWidth: { xs: 40, md: 50 },
              zIndex: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          />

          {/* Rating Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 8, md: 12 },
              right: { xs: 8, md: 12 },
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              px: { xs: 0.5, md: 1 },
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              zIndex: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <StarIcon sx={{ fontSize: { xs: 14, md: 16 }, color: '#ffd700' }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              {movie.rating?.average?.toFixed(1) || movie.imdbRating || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Movie Info */}
        <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 2, p: { xs: 1, md: 2 } }}>
          <Typography
            component={Link}
            to={generateMovieUrl(movie)}
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              textDecoration: 'none',
              fontWeight: 600,
              mb: { xs: 0.5, md: 1.5 },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              lineHeight: 1.4,
              fontSize: { xs: '0.8rem', md: '1.1rem' },
              letterSpacing: '-0.01em',
              '&:hover': {
                color: theme.palette.primary.main,
                transform: 'translateY(-1px)',
              },
            }}
          >
            {movie.title}
          </Typography>

          {/* Movie Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.5, md: 1 }, mb: { xs: 1, md: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: { xs: 14, md: 16 }, color: 'rgba(255, 255, 255, 0.6)' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontWeight: 500, 
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    letterSpacing: '0.02em',
                  }}
                >
                  {movie.releaseYear}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ClockIcon sx={{ fontSize: { xs: 14, md: 16 }, color: 'rgba(255, 255, 255, 0.6)' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontWeight: 500, 
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    letterSpacing: '0.02em',
                  }}
                >
                  {formatDuration(movie.duration)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewIcon sx={{ fontSize: { xs: 14, md: 16 }, color: 'rgba(255, 255, 255, 0.6)' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontWeight: 500, 
                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                  letterSpacing: '0.02em',
                }}
              >
                {formatNumber(movie.views)} views
              </Typography>
            </Box>
          </Box>

          {/* Genres */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {(Array.isArray(movie.genres) ? movie.genres : (typeof movie.genres === 'string' ? movie.genres.split(' ') : []))?.slice(0, isMobile ? 2 : 3).map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: { xs: '0.65rem', md: '0.7rem' },
                  height: { xs: 24, md: 28 },
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.18)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                }}
              />
            ))}
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ p: 2, pt: 0 }}>
          <WatchlistButton 
            movieId={movie.id} 
            variant="icon" 
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Tooltip title="View Details">
              <IconButton
                component={Link}
                to={generateMovieUrl(movie)}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <ViewIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton
                component={Link}
                to={`/download/${generateMovieUrl(movie).split('/').pop()}`}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <DownloadIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    </Fade>
  );
});

export default MovieCard;