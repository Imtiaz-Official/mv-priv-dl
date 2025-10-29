import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Rating,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  CardMedia,
  IconButton,
  Skeleton,
  Alert,
  Breadcrumbs,
  Zoom,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Language as LanguageIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  MovieFilter as FilmIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../components/UI/Button';
import LazyImage from '../components/UI/LazyImage';
import MovieCard from '../components/UI/MovieCard';
import WatchlistButton from '../components/UI/WatchlistButton';
import { SectionLoader } from '../components/UI/LoadingSpinner';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.3) blur(2px)',
    zIndex: -1,
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: 2,
  },
  '& .MuiTab-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    '&.Mui-selected': {
      color: 'white',
    },
  },
}));

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Scroll to top when component mounts or movie ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details
        const movieRes = await fetch(`http://localhost:5000/api/movies/${id}`);

        let movieData = null; // Declare movieData in the correct scope

        if (movieRes.ok) {
          movieData = await movieRes.json(); // Assign to the declared variable
          if (movieData.success) {
            const movieInfo = movieData.data.movie; // Fix: Access movie from data.movie
            setMovie({
              id: movieInfo._id,
              title: movieInfo.title,
              poster: movieInfo.poster || '/placeholder-movie.svg',
              backdrop: movieInfo.backdrop || '/placeholder-backdrop.svg',
              rating: movieInfo.rating?.average || 0,
              year: movieInfo.releaseYear,
              duration: movieInfo.duration,
              views: movieInfo.views || 0,
              quality: movieInfo.quality?.[0] || 'HD',
              genres: movieInfo.genres || [],
              language: movieInfo.languages?.[0] || 'English',
              country: movieInfo.countries?.[0] || 'Unknown', // Fix: Use countries array
              director: movieInfo.director || 'Unknown',
              cast: movieInfo.cast || [
                { name: 'Cast Member 1', character: 'Character 1', avatar: '/placeholder-avatar.svg' },
                { name: 'Cast Member 2', character: 'Character 2', avatar: '/placeholder-avatar.svg' },
              ],
              plot: movieInfo.description || movieInfo.plot || 'No description available.',
              trailer: movieInfo.trailer || '',
              downloadLinks: movieInfo.downloadLinks || [
                { quality: 'HD', size: '2.1 GB', format: 'MP4' },
                { quality: '720p', size: '1.5 GB', format: 'MP4' },
              ],
              ratings: {
                imdb: movieInfo.imdbRating || movieInfo.rating?.average || 0, // Fix: Use imdbRating field
                rotten: movieInfo.rating?.rotten || 0,
                metacritic: movieInfo.rating?.metacritic || 0,
              },
            });
            
            // Set related movies from the same API response
            if (movieData.data.relatedMovies) {
              const related = movieData.data.relatedMovies.map(movie => ({
                id: movie._id,
                title: movie.title,
                poster: movie.poster || '/placeholder-movie.svg',
                rating: movie.rating?.average || 0,
                year: movie.releaseYear,
                duration: movie.duration,
                views: movie.views || 0,
                quality: movie.quality?.[0] || 'HD',
                genres: movie.genres || [],
              }));
              setRelatedMovies(related);
            }
          }
        }

        // Fetch related movies only if not already set
        if (!movieData?.data?.relatedMovies) {
          const relatedRes = await fetch(`http://localhost:5000/api/movies/related/${id}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            if (relatedData.success) {
              const related = relatedData.data.movies.map(movie => ({
                id: movie._id,
                title: movie.title,
                poster: movie.poster || '/placeholder-movie.svg',
                rating: movie.rating?.average || 0,
                year: movie.releaseYear,
                duration: movie.duration,
                views: movie.views || 0,
                quality: movie.quality?.[0] || 'HD',
                genres: movie.genres || [],
              }));
              setRelatedMovies(related);
            }
          }
        }

        // Fallback to mock data if API calls fail
        if (!movieRes.ok) {
          // Fallback to mock data if API fails
          const mockMovie = {
            id: parseInt(id),
            title: 'Avengers: Endgame',
            poster: '/placeholder-movie.svg',
            backdrop: '/placeholder-backdrop.svg',
            rating: 8.4,
            year: 2019,
            duration: 181,
            views: 2500000,
            quality: '4K',
            genres: ['Action', 'Adventure', 'Drama'],
            language: 'English',
            country: 'USA',
            director: 'Anthony Russo, Joe Russo',
            cast: [
              { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man', avatar: '/placeholder-avatar.svg' },
              { name: 'Chris Evans', character: 'Steve Rogers / Captain America', avatar: '/placeholder-avatar.svg' },
              { name: 'Mark Ruffalo', character: 'Bruce Banner / Hulk', avatar: '/placeholder-avatar.svg' },
              { name: 'Chris Hemsworth', character: 'Thor', avatar: '/placeholder-avatar.svg' },
            ],
            plot: 'After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos\' actions and restore order to the universe once and for all, no matter what consequences may be in store.',
            trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
            downloadLinks: [
              { quality: '4K', size: '8.5 GB', format: 'MP4' },
              { quality: '1080p', size: '4.2 GB', format: 'MP4' },
              { quality: '720p', size: '2.1 GB', format: 'MP4' },
            ],
            ratings: {
              imdb: 8.4,
              rotten: 94,
              metacritic: 78,
            },
          };

          const mockRelatedMovies = [
            {
              id: 2,
              title: 'Avengers: Infinity War',
              poster: '/placeholder-movie.svg',
              rating: 8.4,
              year: 2018,
              duration: 149,
              views: 2800000,
              quality: '4K',
              genres: ['Action', 'Adventure', 'Sci-Fi'],
            },
            {
              id: 3,
              title: 'Captain America: Civil War',
              poster: '/placeholder-movie.svg',
              rating: 7.8,
              year: 2016,
              duration: 147,
              views: 2100000,
              quality: 'HD',
              genres: ['Action', 'Adventure', 'Sci-Fi'],
            },
          ];

          setMovie(mockMovie);
          setRelatedMovies(mockRelatedMovies);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        // Fallback to mock data on error
        const mockMovie = {
          id: parseInt(id),
          title: 'Avengers: Endgame',
          poster: '/placeholder-movie.svg',
          backdrop: '/placeholder-backdrop.svg',
          rating: 8.4,
          year: 2019,
          duration: 181,
          views: 2500000,
          quality: '4K',
          genres: ['Action', 'Adventure', 'Drama'],
          language: 'English',
          country: 'USA',
          director: 'Anthony Russo, Joe Russo',
          cast: [
            { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man', avatar: '/placeholder-avatar.svg' },
            { name: 'Chris Evans', character: 'Steve Rogers / Captain America', avatar: '/placeholder-avatar.svg' },
            { name: 'Mark Ruffalo', character: 'Bruce Banner / Hulk', avatar: '/placeholder-avatar.svg' },
            { name: 'Chris Hemsworth', character: 'Thor', avatar: '/placeholder-avatar.svg' },
          ],
          plot: 'After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos\' actions and restore order to the universe once and for all, no matter what consequences may be in store.',
          trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
          downloadLinks: [
            { quality: '4K', size: '8.5 GB', format: 'MP4' },
            { quality: '1080p', size: '4.2 GB', format: 'MP4' },
            { quality: '720p', size: '2.1 GB', format: 'MP4' },
          ],
          ratings: {
            imdb: 8.4,
            rotten: 94,
            metacritic: 78,
          },
        };

        const mockRelatedMovies = [
          {
            id: 2,
            title: 'Avengers: Infinity War',
            poster: '/placeholder-movie.svg',
            rating: 8.4,
            year: 2018,
            duration: 149,
            views: 2800000,
            quality: '4K',
            genres: ['Action', 'Adventure', 'Sci-Fi'],
          },
          {
            id: 3,
            title: 'Captain America: Civil War',
            poster: '/placeholder-movie.svg',
            rating: 7.8,
            year: 2016,
            duration: 147,
            views: 2100000,
            quality: 'HD',
            genres: ['Action', 'Adventure', 'Sci-Fi'],
          },
        ];

        setMovie(mockMovie);
        setRelatedMovies(mockRelatedMovies);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return <SectionLoader text="Loading movie details..." />;
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="white">Movie not found</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection
        sx={{
          '&::before': {
            backgroundImage: `url(${movie.backdrop})`,
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <Slide direction="right" in timeout={1200}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </Box>
                </Slide>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Box sx={{ color: 'white' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      fontSize: { xs: '2rem', md: '3rem' },
                    }}
                  >
                    {movie.title}
                  </Typography>

                  {/* Movie Info */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#ffd700', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {movie.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                      <Typography>{movie.year}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ClockIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                      <Typography>{formatDuration(movie.duration)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ViewIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                      <Typography>{formatNumber(movie.views)} views</Typography>
                    </Box>
                    <Chip
                      label={movie.quality}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Genres */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {movie.genres.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        variant="outlined"
                        sx={{
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Plot */}
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.9)',
                      maxWidth: 600,
                    }}
                  >
                    {movie.plot}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<PlayIcon />}
                      component={Link}
                      to={`/download/${movie.id}`}
                    >
                      View Downloads
                    </Button>
                    <WatchlistButton 
                      movieId={movie.id} 
                      variant="button" 
                      size="large"
                    />
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<ShareIcon />}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Share
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </HeroSection>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Tabs */}
            <Box sx={{ mb: 4 }}>
              <StyledTabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Cast & Crew" />
              </StyledTabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && (
              <Fade in>
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <InfoCard>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                            Movie Information
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemText
                                primary="Director"
                                secondary={movie.director}
                                primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                secondaryTypographyProps={{ color: 'white' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemText
                                primary="Language"
                                secondary={movie.language}
                                primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                secondaryTypographyProps={{ color: 'white' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemText
                                primary="Country"
                                secondary={movie.country}
                                primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                secondaryTypographyProps={{ color: 'white' }}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </InfoCard>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoCard>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                            Ratings
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>IMDb</Typography>
                              <Typography sx={{ color: 'white', fontWeight: 600 }}>{movie.ratings.imdb}/10</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={movie.ratings.imdb * 10}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#f5c518',
                                  borderRadius: 3,
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rotten Tomatoes</Typography>
                              <Typography sx={{ color: 'white', fontWeight: 600 }}>{movie.ratings.rotten}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={movie.ratings.rotten}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#fa320a',
                                  borderRadius: 3,
                                },
                              }}
                            />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Metacritic</Typography>
                              <Typography sx={{ color: 'white', fontWeight: 600 }}>{movie.ratings.metacritic}/100</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={movie.ratings.metacritic}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#ffcc33',
                                  borderRadius: 3,
                                },
                              }}
                            />
                          </Box>
                        </CardContent>
                      </InfoCard>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {tabValue === 1 && (
              <Fade in>
                <InfoCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                      Cast & Crew
                    </Typography>
                    <List>
                      {movie.cast.map((person, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar src={person.avatar} sx={{ width: 56, height: 56 }}>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={person.name}
                              secondary={person.character}
                              primaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                              secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                              sx={{ ml: 2 }}
                            />
                          </ListItem>
                          {index < movie.cast.length - 1 && (
                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </InfoCard>
              </Fade>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Related Movies
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {relatedMovies.map((relatedMovie, index) => (
                <Fade in timeout={800 + index * 200} key={relatedMovie.id}>
                  <div>
                    <MovieCard movie={relatedMovie} />
                  </div>
                </Fade>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetail;