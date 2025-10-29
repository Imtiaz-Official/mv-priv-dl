import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Fade,
  Slide,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Tv as TvIcon,
  Animation as AnimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

import EnhancedHeroSection from '../components/Home/EnhancedHeroSection';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [platformStats, setPlatformStats] = useState(null);
  const [platformStatsLoading, setPlatformStatsLoading] = useState(false);

  // Intersection observer hook
  const useIntersectionObserver = (options = {}) => {
    const [elementRef, setElementRef] = useState(null);
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
      if (!elementRef) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      }, options);

      observer.observe(elementRef);
      return () => observer.disconnect();
    }, [elementRef, options]);

    return { elementRef: setElementRef, hasIntersected };
  };

  const { elementRef: overviewRef, hasIntersected: overviewInView } = useIntersectionObserver({ threshold: 0.1 });
  const { elementRef: ctaRef, hasIntersected: ctaInView } = useIntersectionObserver({ threshold: 0.1 });

  // Fetch platform statistics (public endpoint)
  const fetchPlatformStats = async () => {
    try {
      setPlatformStatsLoading(true);
      const response = await fetch('http://localhost:5000/api/movies/platform-stats');

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPlatformStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    } finally {
      setPlatformStatsLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setDashboardLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Fetch dashboard data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Fetch platform statistics on component mount (public data)
  useEffect(() => {
    fetchPlatformStats();
  }, []);

  // Fetch hero movie
  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        setLoading(true);
        
        const featuredRes = await fetch('http://localhost:5000/api/movies/featured');
        const featuredData = await featuredRes.json();

        if (featuredData.success && featuredData.data.movies && featuredData.data.movies.length > 0) {
          const movie = featuredData.data.movies[0];
          setHeroMovie({
            id: movie._id,
            title: movie.title,
            poster: movie.poster || '/placeholder-movie.svg',
            rating: movie.rating?.average || 0,
            year: movie.releaseYear,
            duration: movie.duration,
            views: movie.views || 0,
            quality: movie.quality?.[0] || 'HD',
            genres: movie.genres || [],
            language: movie.languages?.[0] || 'English',
            description: movie.description || movie.plot || '',
          });
        } else {
          // Fallback hero movie
          setHeroMovie({
            id: 1,
            title: 'It: Welcome to Derry',
            poster: '/placeholder-movie.svg',
            rating: 8.5,
            year: 2024,
            duration: 180,
            views: 1500000,
            quality: 'WEB-DL',
            genres: ['Horror', 'Drama', 'Thriller'],
            language: 'Dual Audio',
            description: 'In 1962, a couple with their son move to Derry, Maine just as a young boy disappears.',
          });
        }
      } catch (error) {
        console.error('Error fetching hero movie:', error);
        // Set fallback movie on error
        setHeroMovie({
          id: 1,
          title: 'It: Welcome to Derry',
          poster: '/placeholder-movie.svg',
          rating: 8.5,
          year: 2024,
          duration: 180,
          views: 1500000,
          quality: 'WEB-DL',
          genres: ['Horror', 'Drama', 'Thriller'],
          language: 'Dual Audio',
          description: 'In 1962, a couple with their son move to Derry, Maine just as a young boy disappears.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovie();
  }, []);

  const handlePlayTrailer = (movie) => {
    console.log('Playing trailer for:', movie.title);
  };

  const handleMoreInfo = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // User overview data - use real data if available, fallback to placeholder
  const userOverview = dashboardData ? {
    name: dashboardData.user.username,
    avatar: dashboardData.user.avatar || '/placeholder-avatar.svg',
    watchlistCount: dashboardData.statistics.watchlistCount,
    favoriteGenres: dashboardData.statistics.favoriteGenres,
    recentActivity: dashboardData.statistics.recentActivity,
  } : {
    name: user?.username || 'Guest',
    avatar: '/placeholder-avatar.svg',
    watchlistCount: 0,
    favoriteGenres: ['Action', 'Sci-Fi', 'Thriller'],
    recentActivity: 'No recent activity',
  };

  const quickStats = platformStats ? [
    { label: 'Movies', count: platformStats.totalMovies, icon: <MovieIcon />, path: '/movies?type=movies' },
    { label: 'TV Shows', count: platformStats.totalTvShows, icon: <TvIcon />, path: '/movies?type=tv' },
    { label: 'Anime', count: platformStats.totalAnime, icon: <AnimeIcon />, path: '/movies?type=anime' },
  ] : [
    { label: 'Movies', count: '10K+', icon: <MovieIcon />, path: '/movies?type=movies' },
    { label: 'TV Shows', count: '5K+', icon: <TvIcon />, path: '/movies?type=tv' },
    { label: 'Anime', count: '2K+', icon: <AnimeIcon />, path: '/movies?type=anime' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* Hero Section */}
      <EnhancedHeroSection
        movie={heroMovie}
        onPlayTrailer={handlePlayTrailer}
        onMoreInfo={handleMoreInfo}
      />

      {/* User Overview Section */}
      <Box
        ref={overviewRef}
        sx={{
          py: { xs: 6, md: 8 },
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          {overviewInView && (
            <Fade in timeout={600}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    mb: 4,
                    textAlign: 'center',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    letterSpacing: '-0.01em',
                  }}
                >
                  Welcome Back, {userOverview.name}
                </Typography>

                <Grid container spacing={4} alignItems="center">
                  {/* User Info Card */}
                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        p: 3,
                        textAlign: 'center',
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      {dashboardLoading ? (
                        <CircularProgress sx={{ color: '#667eea', mx: 'auto' }} />
                      ) : (
                        <>
                          <Avatar
                            src={userOverview.avatar}
                            sx={{
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 2,
                              border: '3px solid rgba(102, 126, 234, 0.3)',
                            }}
                          >
                            <PersonIcon sx={{ fontSize: 40 }} />
                          </Avatar>
                          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                            {userOverview.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                            {userOverview.recentActivity}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {userOverview.watchlistCount} items in watchlist
                          </Typography>
                        </>
                      )}
                    </Card>
                  </Grid>

                  {/* Quick Access Cards */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                      {quickStats.map((stat, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Card
                            onClick={() => navigate(stat.path)}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 3,
                              p: 3,
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(102, 126, 234, 0.1)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                color: '#667eea',
                                mb: 2,
                                '& svg': { fontSize: 40 },
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography
                              variant="h4"
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 1,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                              }}
                            >
                              {stat.count}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontWeight: 500,
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Favorite Genres */}
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          mb: 2,
                          fontSize: '1.1rem',
                          fontWeight: 500,
                        }}
                      >
                        Your Favorite Genres
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {userOverview.favoriteGenres.map((genre, index) => (
                          <Chip
                            key={index}
                            label={genre}
                            sx={{
                              background: 'rgba(102, 126, 234, 0.2)',
                              color: 'white',
                              border: '1px solid rgba(102, 126, 234, 0.3)',
                              '&:hover': {
                                background: 'rgba(102, 126, 234, 0.3)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        ref={ctaRef}
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {ctaInView && (
            <>
              <Slide direction="up" in timeout={300}>
                <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    Explore Our Collection
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      mb: { xs: 4, md: 6 },
                      maxWidth: 600,
                      mx: 'auto',
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      lineHeight: 1.6,
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                    }}
                  >
                    Discover thousands of movies, TV shows, and anime series. Start your entertainment journey today.
                  </Typography>
                </Box>
              </Slide>

              <Fade in timeout={400}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, md: 3 },
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/movies')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.5, md: 2 },
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    }}
                  >
                    Browse All Content
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/watchlist')}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.5, md: 2 },
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    }}
                  >
                    My Watchlist
                  </Button>
                </Box>
              </Fade>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Home;