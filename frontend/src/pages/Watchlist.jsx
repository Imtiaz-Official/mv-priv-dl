import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Alert,
  Fade,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  BookmarkBorder as EmptyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MovieCard from '../components/UI/MovieCard';
import { SectionLoader } from '../components/UI/LoadingSpinner';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 16,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 400,
  textAlign: 'center',
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const Watchlist = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchWatchlistMovies();
  }, []);

  const fetchWatchlistMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get watchlist IDs from localStorage
      const watchlistIds = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
      
      if (watchlistIds.length === 0) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }

      // Fetch movie details for each ID
      // For now, we'll use mock data. Later replace with actual API calls
      const mockMovies = [
        {
          id: 1,
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          duration: 152,
          genres: ["Action", "Crime", "Drama"],
          poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
          views: 2500000,
          quality: "4K",
          language: "English"
        },
        {
          id: 2,
          title: "Inception",
          year: 2010,
          rating: 8.8,
          duration: 148,
          genres: ["Action", "Sci-Fi", "Thriller"],
          poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          description: "A thief who steals corporate secrets through dream-sharing technology...",
          views: 2200000,
          quality: "4K",
          language: "English"
        },
        {
          id: 3,
          title: "Interstellar",
          year: 2014,
          rating: 8.6,
          duration: 169,
          genres: ["Adventure", "Drama", "Sci-Fi"],
          poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
          description: "A team of explorers travel through a wormhole in space...",
          views: 1800000,
          quality: "4K",
          language: "English"
        }
      ];

      // Filter movies that are in the watchlist
      const filteredMovies = mockMovies.filter(movie => 
        watchlistIds.includes(movie.id)
      );

      setWatchlistMovies(filteredMovies);

      // TODO: Replace with actual API call
      // const moviePromises = watchlistIds.map(id => 
      //   fetch(`/api/movies/${id}`).then(res => res.json())
      // );
      // const movies = await Promise.all(moviePromises);
      // setWatchlistMovies(movies);

    } catch (error) {
      console.error('Error fetching watchlist movies:', error);
      setError('Failed to load watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (movieId) => {
    try {
      const watchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
      const updatedWatchlist = watchlist.filter(id => id !== movieId);
      localStorage.setItem('movieWatchlist', JSON.stringify(updatedWatchlist));
      
      // Update local state
      setWatchlistMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const clearWatchlist = () => {
    try {
      localStorage.setItem('movieWatchlist', JSON.stringify([]));
      setWatchlistMovies([]);
    } catch (error) {
      console.error('Error clearing watchlist:', error);
    }
  };

  const handleWatchlistChange = (movieId, isAdded) => {
    if (!isAdded) {
      // Movie was removed from watchlist
      removeFromWatchlist(movieId);
    }
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <HeaderSection>
          <Skeleton variant="text" width="40%" height={60} />
          <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
        </HeaderSection>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Fade in timeout={800}>
        <HeaderSection>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Watchlist
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 3,
                maxWidth: 600,
              }}
            >
              Movies you've saved for later download
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${watchlistMovies.length} Movies`}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              {watchlistMovies.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchWatchlistMovies}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearWatchlist}
                    sx={{
                      color: '#ff6b6b',
                      borderColor: 'rgba(255, 107, 107, 0.3)',
                      '&:hover': {
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    Clear All
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </HeaderSection>
      </Fade>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchWatchlistMovies}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {watchlistMovies.length === 0 ? (
        <Fade in timeout={1000}>
          <EmptyState>
            <EmptyIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2,
                fontWeight: 600,
              }}
            >
              Your watchlist is empty
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                mb: 3,
                maxWidth: 400,
              }}
            >
              Start adding movies to your watchlist to keep track of what you want to download later.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/"
              sx={{ borderRadius: 2 }}
            >
              Browse Movies
            </Button>
          </EmptyState>
        </Fade>
      ) : (
        <Fade in timeout={1000}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {watchlistMovies.map((movie, index) => (
              <Grid item xs={4} sm={6} md={4} lg={3} key={movie.id}>
                <Fade in timeout={800 + index * 100}>
                  <Box>
                    <MovieCard 
                      movie={movie} 
                      onWatchlistChange={handleWatchlistChange}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </StyledContainer>
  );
};

export default Watchlist;