import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  IconButton,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  VolumeOff as MuteIcon,
  VolumeUp as UnmuteIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../UI/Button';
import { HeroFloatingElements } from '../UI/FloatingElements';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)',
}));

const BackgroundVideo = styled('video')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -2,
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: -2,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%)',
  },
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  color: 'white',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const MovieTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  lineHeight: 1.1,
  marginBottom: theme.spacing(2),
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const MovieDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
  maxWidth: '600px',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
  opacity: 0.9,
}));

const MetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.9rem',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap',
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 2,
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const GenreChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(3),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const EnhancedHeroSection = ({ movie, onPlayTrailer, onMoreInfo }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Auto-play video after 3 seconds if not mobile
    if (!isMobile) {
      const timer = setTimeout(() => {
        setShowVideo(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  if (!movie) return null;

  const handlePlayClick = () => {
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    }
  };

  const handleMoreInfoClick = () => {
    if (onMoreInfo) {
      onMoreInfo(movie);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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

  return (
    <HeroContainer>
      <HeroFloatingElements />
      
      {/* Background Media */}
      {showVideo && movie.trailerUrl && !isMobile ? (
        <BackgroundVideo
          autoPlay
          muted={isMuted}
          loop
          playsInline
        >
          <source src={movie.trailerUrl} type="video/mp4" />
        </BackgroundVideo>
      ) : (
        <BackgroundImage
          sx={{
            backgroundImage: `url(${movie.backdrop || movie.poster || '/placeholder-backdrop.svg'})`,
          }}
        />
      )}

      {/* Video Controls */}
      {showVideo && movie.trailerUrl && !isMobile && (
        <VideoControls>
          <ControlButton onClick={toggleMute} size="small">
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
          </ControlButton>
          <ControlButton onClick={() => setShowVideo(false)} size="small">
            <FullscreenIcon />
          </ControlButton>
        </VideoControls>
      )}

      <HeroContent maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Fade in timeout={1000}>
              <Box>
                <Slide direction="up" in timeout={1200}>
                  <MovieTitle variant="h1">
                    {movie.title}
                  </MovieTitle>
                </Slide>

                <Slide direction="up" in timeout={1400}>
                  <MetaInfo>
                    <MetaItem>
                      <StarIcon sx={{ fontSize: '1rem', color: '#ffd700' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {movie.rating}/10
                      </Typography>
                    </MetaItem>
                    <MetaItem>
                      <TimeIcon sx={{ fontSize: '1rem' }} />
                      <Typography variant="body2">
                        {formatDuration(movie.duration)}
                      </Typography>
                    </MetaItem>
                    <MetaItem>
                      <ViewIcon sx={{ fontSize: '1rem' }} />
                      <Typography variant="body2">
                        {formatViews(movie.views)} views
                      </Typography>
                    </MetaItem>
                    <MetaItem>
                      <Typography variant="body2" sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}>
                        {movie.quality}
                      </Typography>
                    </MetaItem>
                    <MetaItem>
                      <Typography variant="body2">
                        {movie.year}
                      </Typography>
                    </MetaItem>
                  </MetaInfo>
                </Slide>

                <Slide direction="up" in timeout={1600}>
                  <GenreChips>
                    {movie.genres?.slice(0, 4).map((genre, index) => (
                      <StyledChip
                        key={index}
                        label={genre}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </GenreChips>
                </Slide>

                <Slide direction="up" in timeout={1800}>
                  <MovieDescription variant="body1">
                    {movie.description}
                  </MovieDescription>
                </Slide>

                <Slide direction="up" in timeout={2000}>
                  <ActionButtons>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayIcon />}
                      onClick={handlePlayClick}
                      sx={{
                        backgroundColor: '#e50914',
                        '&:hover': {
                          backgroundColor: '#b8070f',
                        },
                        padding: '12px 32px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      Download Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<InfoIcon />}
                      onClick={handleMoreInfoClick}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        padding: '12px 32px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      More Info
                    </Button>
                  </ActionButtons>
                </Slide>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </HeroContent>
    </HeroContainer>
  );
};

export default EnhancedHeroSection;