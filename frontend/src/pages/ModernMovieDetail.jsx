import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
  Fade,
  Zoom,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  BookmarkBorder as BookmarkIcon,
  Info as InfoIcon
} from '@mui/icons-material';


// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
    zIndex: 1,
  }
}));

const BackdropImage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.15,
  filter: 'blur(2px)',
  zIndex: 0,
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(8),
}));

const PosterCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1e1e2e, #2d2d44)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
  }
}));

const PosterImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  aspectRatio: '2/3',
  objectFit: 'cover',
  borderRadius: '16px',
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1a1a2e, #25253a)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  '&.primary': {
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    }
  },
  '&.secondary': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    }
  }
}));

const StatsCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2a2a3e, #1f1f2e)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  }
}));

const GenreChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  color: 'white',
  fontWeight: 600,
  margin: theme.spacing(0.5),
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
  }
}));

const ModernMovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Scroll to top when component mounts or movie ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/movies/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMovie(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleDownloadClick = () => {
    navigate(`/download/${id}`);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <HeroSection>
        <ContentWrapper maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={600} sx={{ borderRadius: '20px' }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={40} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px' }} />
            </Grid>
          </Grid>
        </ContentWrapper>
      </HeroSection>
    );
  }

  if (!movie) {
    return (
      <HeroSection>
        <ContentWrapper maxWidth="lg">
          <Typography variant="h4" color="white" textAlign="center">
            Movie not found
          </Typography>
        </ContentWrapper>
      </HeroSection>
    );
  }

  return (
    <HeroSection>
      <BackdropImage
        sx={{
          backgroundImage: `url(${movie.backdrop || movie.poster || '/placeholder-backdrop.svg'})`,
        }}
      />
      
      <ContentWrapper maxWidth="lg">
        <Fade in timeout={800}>
          <Grid container spacing={4}>
            {/* Movie Poster */}
            <Grid item xs={12} md={4}>
              <Zoom in timeout={1000}>
                <PosterCard>
                  <PosterImage
                    src={movie.poster || '/placeholder-movie.svg'}
                    alt={movie.title}
                  />
                </PosterCard>
              </Zoom>
            </Grid>

            {/* Movie Information */}
            <Grid item xs={12} md={8}>
              <Fade in timeout={1200}>
                <Box>
                  {/* Title and Rating */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {movie.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Rating
                        value={movie.rating / 2}
                        precision={0.1}
                        readOnly
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#ffd700',
                          }
                        }}
                      />
                      <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 600 }}>
                        {movie.rating}/10
                      </Typography>
                      <Chip
                        label={movie.year}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Genres */}
                    <Box sx={{ mb: 3 }}>
                      {movie.genre?.split(',').map((genre, index) => (
                        <GenreChip key={index} label={genre.trim()} size="small" />
                      ))}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <ActionButton
                      className="primary"
                      startIcon={<PlayIcon />}
                      size="large"
                    >
                      Watch Trailer
                    </ActionButton>
                    
                    <ActionButton
                      className="secondary"
                      startIcon={<DownloadIcon />}
                      size="large"
                      onClick={handleDownloadClick}
                    >
                      Download
                    </ActionButton>

                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: isFavorite ? '#ff4757' : 'white',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        }
                      }}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>

                    <IconButton
                      onClick={handleBookmarkToggle}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: isBookmarked ? '#3742fa' : 'white',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        }
                      }}
                    >
                      <BookmarkIcon />
                    </IconButton>

                    <IconButton
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        }
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Box>

                  {/* Movie Stats */}
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <TimeIcon sx={{ color: '#667eea', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {movie.duration || '120'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Minutes
                        </Typography>
                      </StatsCard>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <CalendarIcon sx={{ color: '#667eea', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {movie.year}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Release
                        </Typography>
                      </StatsCard>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <LanguageIcon sx={{ color: '#667eea', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {movie.language || 'EN'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Language
                        </Typography>
                      </StatsCard>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <StatsCard>
                        <ViewIcon sx={{ color: '#667eea', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {movie.views || '1.2K'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Views
                        </Typography>
                      </StatsCard>
                    </Grid>
                  </Grid>

                  {/* Movie Description */}
                  <InfoCard sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: 'white', mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <InfoIcon sx={{ color: '#667eea' }} />
                      Synopsis
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                      }}
                    >
                      {movie.description || 'No description available for this movie.'}
                    </Typography>
                  </InfoCard>

                  {/* Movie Details */}
                  <InfoCard>
                    <Typography
                      variant="h6"
                      sx={{ color: 'white', mb: 3, fontWeight: 600 }}
                    >
                      Movie Details
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                            Director
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                            {movie.director || 'Unknown'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                            Cast
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                            {movie.cast || 'Unknown'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                            Country
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                            {movie.country || 'Unknown'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                            Quality
                          </Typography>
                          <Chip
                            label={movie.quality || 'HD'}
                            sx={{
                              background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </InfoCard>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Fade>
      </ContentWrapper>
    </HeroSection>
  );
};

export default ModernMovieDetail;