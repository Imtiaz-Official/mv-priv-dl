import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../UI/Button';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 0),
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const CarouselWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 16,
}));

const CarouselTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
  gap: theme.spacing(2),
}));

const MovieCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  maxWidth: 300,
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.3)',
    '& .movie-overlay': {
      opacity: 1,
    },
    '& .movie-poster': {
      transform: 'scale(1.1)',
    },
  },
}));

const MoviePoster = styled(CardMedia)(({ theme }) => ({
  height: 400,
  position: 'relative',
  transition: 'transform 0.3s ease',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const MovieOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const MovieInfo = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
}));

const MovieTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const MovieMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  flexWrap: 'wrap',
}));

const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.8rem',
  color: 'rgba(255, 255, 255, 0.8)',
}));

const GenreChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  flexWrap: 'wrap',
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  zIndex: 2,
  width: 48,
  height: 48,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  '&.prev': {
    left: theme.spacing(1),
  },
  '&.next': {
    right: theme.spacing(1),
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const QualityBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: '#e50914',
  color: 'white',
  fontSize: '0.7rem',
  height: 24,
  zIndex: 1,
}));

const FeaturedCarousel = ({ movies, title = "Featured Movies", icon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchlist, setWatchlist] = useState(new Set());
  const carouselRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const itemsPerView = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, movies.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const toggleWatchlist = (movieId) => {
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]);

  if (!movies || movies.length === 0) return null;

  return (
    <CarouselContainer>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <SectionTitle variant="h4">
            {icon}
            {title}
          </SectionTitle>
        </Fade>

        <CarouselWrapper ref={carouselRef}>
          {movies.length > itemsPerView && (
            <>
              <NavigationButton className="prev" onClick={prevSlide}>
                <ArrowBackIcon />
              </NavigationButton>
              <NavigationButton className="next" onClick={nextSlide}>
                <ArrowForwardIcon />
              </NavigationButton>
            </>
          )}

          <Slide direction="left" in timeout={1000}>
            <CarouselTrack
              sx={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {movies.map((movie, index) => (
                <MovieCard key={movie.id || index}>
                  <Box sx={{ position: 'relative' }}>
                    <QualityBadge label={movie.quality} size="small" />
                    <MoviePoster
                      className="movie-poster"
                      image={movie.poster || '/placeholder-movie.svg'}
                      title={movie.title}
                    />
                    <MovieOverlay className="movie-overlay">
                      <ActionButtons>
                        <ActionButton
                          component={Link}
                          to={`/movie/${movie.id}`}
                          size="small"
                        >
                          <PlayIcon />
                        </ActionButton>
                        <ActionButton
                          onClick={() => toggleWatchlist(movie.id)}
                          size="small"
                        >
                          {watchlist.has(movie.id) ? <CheckIcon /> : <AddIcon />}
                        </ActionButton>
                      </ActionButtons>
                    </MovieOverlay>
                  </Box>

                  <MovieInfo>
                    <MovieTitle variant="h6">
                      {movie.title}
                    </MovieTitle>

                    <MovieMeta>
                      <MetaItem>
                        <StarIcon sx={{ fontSize: '0.9rem', color: '#ffd700' }} />
                        <Typography variant="caption">
                          {movie.rating}/10
                        </Typography>
                      </MetaItem>
                      <MetaItem>
                        <TimeIcon sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption">
                          {formatDuration(movie.duration)}
                        </Typography>
                      </MetaItem>
                      <MetaItem>
                        <ViewIcon sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption">
                          {formatViews(movie.views)}
                        </Typography>
                      </MetaItem>
                    </MovieMeta>

                    <GenreChips>
                      {movie.genres?.slice(0, 2).map((genre, genreIndex) => (
                        <Chip
                          key={genreIndex}
                          label={genre}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      ))}
                    </GenreChips>

                    <Typography
                      variant="caption"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        opacity: 0.8,
                        lineHeight: 1.3,
                      }}
                    >
                      {movie.description}
                    </Typography>
                  </MovieInfo>
                </MovieCard>
              ))}
            </CarouselTrack>
          </Slide>
        </CarouselWrapper>
      </Container>
    </CarouselContainer>
  );
};

export default FeaturedCarousel;