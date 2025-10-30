import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Paper,
  Stack,
  Badge,
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
  Download as DownloadIcon,
  Bookmark as BookmarkIcon,
  Hd as HdIcon,
  FourK as FourKIcon,
  VideoFile as VideoFileIcon,
  AudioFile as AudioFileIcon,
  Storage as StorageIcon,
  Public as PublicIcon,
  DirectionsRun as DirectionsRunIcon,
  StarBorder as StarBorderIcon,
  Reviews as ReviewsIcon,
  Audiotrack as AudiotrackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../components/UI/Button';
import LazyImage from '../components/UI/LazyImage';
import MovieCard from '../components/UI/MovieCard';
import WatchlistButton from '../components/UI/WatchlistButton';
import { SectionLoader } from '../components/UI/LoadingSpinner';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '60vh',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  color: 'white',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '50vh',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '35vh',
  },
  [theme.breakpoints.down('xs')]: {
    minHeight: '30vh',
  },
}));

const PosterContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '200px',
  height: '300px',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease',
  flexShrink: 0,
  '&:hover': {
    transform: 'scale(1.02)',
  },
  [theme.breakpoints.down('md')]: {
    width: '180px',
    height: '270px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '140px',
    height: '210px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '120px',
    height: '180px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  },
}));

const MobileHeroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.down('xs')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 20,
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    transform: 'translateY(-4px)',
    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.3)',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 4,
    borderRadius: 2,
  },
  '& .MuiTab-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1.1rem',
    minHeight: 60,
    '&.Mui-selected': {
      color: 'white',
    },
  },
}));

const QualityChip = styled(Chip)(({ theme, quality }) => {
  const getGradient = (quality) => {
    switch (quality?.toLowerCase()) {
      case '4k':
      case 'uhd':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'hd':
      case '1080p':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case '720p':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default:
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    }
  };

  return {
    background: getGradient(quality),
    color: 'white',
    fontWeight: 700,
    fontSize: '0.9rem',
    padding: '8px 16px',
    borderRadius: 20,
  };
});

const MovieInfoContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    width: '100%',
  },
}));

const DownloadButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%',
  },
}));

const PrimaryDownloadButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
  color: 'white',
  padding: theme.spacing(1.5, 3),
  borderRadius: '25px',
  fontWeight: 'bold',
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #45a049 30%, #4CAF50 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1.2, 2),
    fontSize: '0.95rem',
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1, 1.5),
    fontSize: '0.9rem',
    borderRadius: '20px',
  },
}));

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle download button click
  const handleDownloadClick = () => {
    navigate(`/download/${id}`);
  };

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
              quality: movieInfo.quality || ['HD'],
              genres: movieInfo.genres || [],
              language: movieInfo.languages?.[0] || 'English',
              languages: movieInfo.languages || ['English'],
              country: movieInfo.countries?.[0] || 'Unknown',
              countries: movieInfo.countries || ['Unknown'],
              director: movieInfo.director || 'Unknown',
              cast: movieInfo.cast || [
                { name: 'Cast Member 1', character: 'Character 1', avatar: '/placeholder-avatar.svg' },
                { name: 'Cast Member 2', character: 'Character 2', avatar: '/placeholder-avatar.svg' },
              ],
              plot: movieInfo.description || movieInfo.plot || 'No description available.',
              trailer: movieInfo.trailer || '',
              downloadLinks: movieInfo.downloadLinks || [
                { quality: 'HD', size: '2.1 GB', format: 'MP4', resolution: '1920x1080', audio: 'AAC 5.1' },
                { quality: '720p', size: '1.5 GB', format: 'MP4', resolution: '1280x720', audio: 'AAC 2.0' },
              ],
              ratings: {
                imdb: movieInfo.imdbRating || movieInfo.rating?.average || 0,
                rotten: movieInfo.rating?.rotten || 0,
                metacritic: movieInfo.rating?.metacritic || 0,
              },
              technicalSpecs: {
                fileSize: movieInfo.size || '2.1 GB',
                format: 'MP4',
                resolution: movieInfo.quality?.includes('4K') ? '3840x2160' : 
                           movieInfo.quality?.includes('HD') ? '1920x1080' : '1280x720',
                audio: 'AAC 5.1',
                subtitles: ['English', 'Spanish', 'French'],
                runtime: movieInfo.duration || 120,
              },
              userStats: {
                likes: Math.floor(Math.random() * 1000) + 500,
                dislikes: Math.floor(Math.random() * 100) + 20,
                downloads: movieInfo.downloads || Math.floor(Math.random() * 10000) + 1000,
                watchlistCount: Math.floor(Math.random() * 5000) + 500,
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
      {/* Hero Section - Hidden on Mobile */}
      <HeroSection
        sx={{
          display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
          minHeight: { xs: 'auto', sm: '50vh', md: '60vh' },
          py: { xs: 2, sm: 4, md: 6 },
          '&::before': {
            backgroundImage: `url(${movie.backdrop})`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Breadcrumb Navigation - Hidden on mobile for cleaner look */}
          <Box sx={{ 
            mb: { xs: 2, sm: 3 }, 
            zIndex: 2, 
            position: 'relative',
            display: { xs: 'none', sm: 'block' }
          }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'white' }}>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                <HomeIcon fontSize="small" />
                Home
              </Link>
              <Link to="/movies" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                Movies
              </Link>
              <Typography color="white">{movie.title}</Typography>
            </Breadcrumbs>
          </Box>

          {/* Mobile-First Layout */}
          <Box sx={{ zIndex: 2, position: 'relative' }}>
            {/* Mobile Layout (xs) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {/* Mobile Header with Poster and Basic Info */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                alignItems: 'flex-start'
              }}>
                {/* Compact Mobile Poster */}
                <Box sx={{ flexShrink: 0 }}>
                  <PosterContainer sx={{ 
                    width: 100, 
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </PosterContainer>
                </Box>

                {/* Mobile Movie Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: '1.3rem',
                      lineHeight: 1.2,
                      color: 'white'
                    }}
                  >
                    {movie.title}
                  </Typography>
                  
                  {movie.tagline && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        opacity: 0.8,
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        color: 'rgba(255,255,255,0.8)'
                      }}
                    >
                      {movie.tagline}
                    </Typography>
                  )}

                  {/* Mobile Rating and Basic Info */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                        {movie.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {movie.year}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {formatDuration(movie.duration)}
                    </Typography>
                  </Box>

                  {/* Mobile Genres */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {movie.genres.slice(0, 3).map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(25, 118, 210, 0.2)',
                          color: '#90caf9',
                          border: '1px solid rgba(25, 118, 210, 0.3)',
                          fontSize: '0.75rem',
                          height: 24,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Mobile Action Buttons */}
              <Box sx={{ mb: 3 }}>
                <PrimaryDownloadButton
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  onClick={handleDownloadClick}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                      boxShadow: '0 6px 25px rgba(25, 118, 210, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                      boxShadow: '0 2px 10px rgba(25, 118, 210, 0.3)',
                    }
                  }}
                >
                  Download Now
                </PrimaryDownloadButton>

                <Stack direction="row" spacing={1}>
                  <WatchlistButton 
                    movieId={movie.id} 
                    variant="button" 
                    size="medium"
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'scale(1.02)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<ShareIcon />}
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'scale(1.02)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      }
                    }}
                  >
                    Share
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* Desktop Layout (md+) - Keep existing */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* Left Column - Movie Poster */}
            <Grid item xs={12} md={4} lg={3} sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'center', md: 'flex-start' } 
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: { xs: 2, sm: 2.5, md: 3 },
                width: { xs: 'auto', md: '100%' },
                maxWidth: { xs: '280px', md: 'none' }
              }}>
                <PosterContainer>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {movie.quality && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap'
                    }}>
                      {Array.isArray(movie.quality) ? 
                        movie.quality.slice(0, 2).map((qual, index) => (
                          <QualityChip key={index} label={qual} quality={qual} size="small" />
                        )) :
                        <QualityChip label={movie.quality} quality={movie.quality} size="small" />
                      }
                    </Box>
                  )}
                </PosterContainer>

                {/* Download Button */}
                <PrimaryDownloadButton
                  size="large"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  onClick={handleDownloadClick}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Download Now
                </PrimaryDownloadButton>

                {/* Secondary Actions */}
                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    width: '100%',
                    justifyContent: { xs: 'center', md: 'flex-start' }
                  }}
                >
                  <WatchlistButton 
                    movieId={movie.id} 
                    variant="button" 
                    size="medium"
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<ShareIcon />}
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Share
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Right Column - Movie Information */}
            <Grid item xs={12} md={8} lg={9}>
              <Box sx={{ 
                color: 'white',
                textAlign: { xs: 'center', md: 'left' },
                px: { xs: 1, sm: 2, md: 0 }
              }}>
                {/* Movie Title */}
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    lineHeight: 1.2
                  }}
                >
                  {movie.title}
                </Typography>

                {/* Tagline */}
                {movie.tagline && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      fontStyle: 'italic',
                      opacity: 0.9,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    "{movie.tagline}"
                  </Typography>
                )}

                {/* Rating and Basic Info */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1.5, sm: 3 }} 
                  sx={{ 
                    mb: 3, 
                    flexWrap: 'wrap', 
                    gap: { xs: 1.5, sm: 2 },
                    alignItems: { xs: 'center', sm: 'flex-start' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#ffd700', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {movie.rating.toFixed(1)}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>/10</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }} />
                    <Typography variant="h6">{movie.year}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClockIcon sx={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }} />
                    <Typography variant="h6">{formatDuration(movie.duration)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ViewIcon sx={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }} />
                    <Typography variant="h6">{formatNumber(movie.views)} views</Typography>
                  </Box>
                </Stack>

                {/* User Stats */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1.5, sm: 3 }} 
                  sx={{ 
                    mb: 3, 
                    flexWrap: 'wrap', 
                    gap: { xs: 1.5, sm: 2 },
                    alignItems: { xs: 'center', sm: 'flex-start' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThumbUpIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                    <Typography>{formatNumber(movie.userStats.likes)} likes</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DownloadIcon sx={{ fontSize: 20, color: '#2196f3' }} />
                    <Typography>{formatNumber(movie.userStats.downloads)} downloads</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon sx={{ fontSize: 20, color: '#e91e63' }} />
                    <Typography>{formatNumber(movie.userStats.watchlistCount)} in watchlists</Typography>
                  </Box>
                </Stack>

                {/* Genres */}
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1.5, 
                  mb: 4,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  {movie.genres.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        fontSize: '1rem',
                        padding: '8px 16px',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    />
                  ))}
                </Box>

                {/* Movie Description */}
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    lineHeight: 1.8,
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: { xs: '100%', md: 700 },
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    fontWeight: 400,
                    textAlign: { xs: 'center', md: 'left' },
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  {movie.plot}
                </Typography>

                {/* Quick Info */}
                <Grid container spacing={3} sx={{ 
                  mb: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <Grid item xs={6} sm={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Language</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {Array.isArray(movie.languages) ? movie.languages.join(', ') : movie.language}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Quality</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {Array.isArray(movie.quality) ? movie.quality.join(', ') : movie.quality}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Size</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {movie.technicalSpecs?.fileSize || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            </Grid>
          </Box>
        </Container>
      </HeroSection>

      {/* Mobile Movie Details Section */}
      {isMobile && (
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          py: 3,
          px: 2,
        }}>
          <Container maxWidth="sm">
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <Box sx={{ p: 3 }}>
                {/* Movie Title */}
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {movie.title}
                </Typography>

                {/* Movie Stats */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  mb: 3,
                  py: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                      <StarIcon sx={{ color: '#ffd700', fontSize: 18 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {movie.rating}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Rating
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                      <CalendarIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 18 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {movie.year}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Year
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                      <ClockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 18 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {formatDuration(movie.duration)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Duration
                    </Typography>
                  </Box>
                </Box>

                {/* Genres */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, justifyContent: 'center' }}>
                  {movie.genres.slice(0, 3).map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                  <Chip
                    label={movie.quality}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  {movie.plot.length > 150 ? `${movie.plot.substring(0, 150)}...` : movie.plot}
                </Typography>

                {/* Green Download Button */}
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="medium"
                    component={Link}
                    to={`/download/${movie.id}`}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white',
                      fontWeight: 600,
                      py: 1,
                      px: 2.5,
                      borderRadius: 2.5,
                      fontSize: '0.875rem',
                      minWidth: 'auto',
                      boxShadow: '0 3px 12px rgba(76, 175, 80, 0.25)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                        boxShadow: '0 4px 16px rgba(76, 175, 80, 0.35)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    startIcon={<PlayIcon sx={{ fontSize: '1rem' }} />}
                  >
                    Download
                  </Button>
                  
                  <WatchlistButton 
                    movieId={movie.id} 
                    variant="button" 
                    size="medium"
                    showText={false}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      py: 1,
                      px: 2.5,
                      borderRadius: 2.5,
                      fontSize: '0.875rem',
                      minWidth: 'auto',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Container>
        </Box>
      )}

      {/* Mobile Content Section */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Container maxWidth="lg" sx={{ px: 2, py: 3 }}>
          {/* Mobile Movie Description */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'white',
                fontSize: '1.1rem'
              }}
            >
              About This Movie
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                textAlign: 'justify'
              }}
            >
              {movie.plot}
            </Typography>
          </Box>

          {/* Mobile Quick Info Cards */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'white',
                fontSize: '1.1rem'
              }}
            >
              Movie Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5, fontSize: '0.8rem' }}>
                    Language
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
                    {Array.isArray(movie.languages) ? movie.languages.join(', ') : movie.language}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5, fontSize: '0.8rem' }}>
                    Quality
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
                    {Array.isArray(movie.quality) ? movie.quality.join(', ') : movie.quality}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5, fontSize: '0.8rem' }}>
                    File Size
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
                    {movie.technicalSpecs?.fileSize || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5, fontSize: '0.8rem' }}>
                    Views
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
                    {formatNumber(movie.views)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Mobile Stats */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'white',
                fontSize: '1.1rem'
              }}
            >
              Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <ThumbUpIcon sx={{ fontSize: 24, color: '#4caf50', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                    {formatNumber(movie.userStats.likes)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                    Likes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ 
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(33, 150, 243, 0.3)'
                }}>
                  <DownloadIcon sx={{ fontSize: 24, color: '#2196f3', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                    {formatNumber(movie.userStats.downloads)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                    Downloads
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ 
                  backgroundColor: 'rgba(233, 30, 99, 0.1)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(233, 30, 99, 0.3)'
                }}>
                  <FavoriteIcon sx={{ fontSize: 24, color: '#e91e63', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                    {formatNumber(movie.userStats.watchlistCount)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                    Watchlist
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Mobile Tabs */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'rgba(255,255,255,0.2)',
              mb: 3
            }}>
              <StyledTabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '0.9rem',
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 500
                  }
                }}
              >
                <Tab label="Overview" />
                <Tab label="Cast & Crew" />
                <Tab label="Reviews" />
              </StyledTabs>
            </Box>

            {/* Mobile Tab Content */}
            <Box>
              {/* Overview Tab */}
              {tabValue === 0 && (
                <Fade in timeout={500}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    >
                      Technical Specifications
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid rgba(76, 175, 80, 0.2)'
                        }}>
                          <StorageIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                            {movie.technicalSpecs.fileSize}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                            File Size
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid rgba(255, 152, 0, 0.2)'
                        }}>
                          <VideoFileIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                            {movie.technicalSpecs.format}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                            Format
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          backgroundColor: 'rgba(156, 39, 176, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid rgba(156, 39, 176, 0.2)'
                        }}>
                          <HdIcon sx={{ fontSize: 32, color: '#9c27b0', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                            {movie.technicalSpecs.resolution}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                            Resolution
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid rgba(244, 67, 54, 0.2)'
                        }}>
                          <AudiotrackIcon sx={{ fontSize: 32, color: '#f44336', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>
                            {movie.technicalSpecs.audioChannels}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                            Audio
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    >
                      Movie Information
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                            Director:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                            {movie.director}
                          </Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                            Countries:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                            {movie.countries ? movie.countries.join(', ') : movie.country}
                          </Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                            Release Year:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                            {movie.year}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* Cast & Crew Tab */}
              {tabValue === 1 && (
                <Fade in timeout={500}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    >
                      Cast & Crew
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid rgba(255,255,255,0.1)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Cast and crew information will be available soon.
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* Reviews Tab */}
              {tabValue === 2 && (
                <Fade in timeout={500}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    >
                      User Reviews
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid rgba(255,255,255,0.1)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No reviews available yet. Be the first to review this movie!
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Desktop Content Section */}
      <Container maxWidth="lg" sx={{ py: 6, display: { xs: 'none', md: 'block' } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Technical Specifications */}
            <StatsCard sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1976d2' }}>
                Technical Specifications
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <StorageIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      File Size
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {movie.technicalSpecs.fileSize}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <VideoFileIcon sx={{ fontSize: 48, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Format
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {movie.technicalSpecs.format}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <HdIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Resolution
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {movie.technicalSpecs.resolution}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AudioFileIcon sx={{ fontSize: 48, color: '#f44336', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Audio
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {movie.technicalSpecs.audio}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <PublicIcon sx={{ fontSize: 48, color: '#607d8b', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Subtitles
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {movie.technicalSpecs.subtitles.join(', ')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <DirectionsRunIcon sx={{ fontSize: 48, color: '#795548', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Runtime
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {formatDuration(movie.technicalSpecs.runtime)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </StatsCard>



            {/* Tabs */}
            <Box sx={{ mb: 4 }}>
              <StyledTabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Cast & Crew" />
                <Tab label="Reviews" />
              </StyledTabs>
            </Box>

            {/* Tabs Content */}
            <Box sx={{ mb: 4 }}>
              {/* Overview Tab */}
              {tabValue === 0 && (
                <Fade in timeout={500}>
                  <InfoCard>
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1976d2' }}>
                            Movie Information
                          </Typography>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>Director:</Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>{movie.director}</Typography>
                            </Box>
                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>Languages:</Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {movie.languages ? movie.languages.join(', ') : movie.language}
                              </Typography>
                            </Box>
                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>Countries:</Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {movie.countries ? movie.countries.join(', ') : movie.country}
                              </Typography>
                            </Box>
                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>Release Year:</Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {movie.year}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1976d2' }}>
                            Ratings & Reviews
                          </Typography>
                          <Stack spacing={3}>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>IMDb</Typography>
                                <Typography sx={{ color: 'white', fontWeight: 600 }}>{movie.ratings.imdb}/10</Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={movie.ratings.imdb * 10}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#f5c518',
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rotten Tomatoes</Typography>
                                <Typography sx={{ color: 'white', fontWeight: 600 }}>{movie.ratings.rotten}%</Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={movie.ratings.rotten}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#fa320a',
                                    borderRadius: 4,
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
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#ffcc33',
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </InfoCard>
                </Fade>
              )}

              {/* Cast & Crew Tab */}
              {tabValue === 1 && (
                <Fade in timeout={500}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, color: '#1976d2' }}>
                        Cast & Crew
                      </Typography>
                      <Grid container spacing={3}>
                        {movie.cast.map((person, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                              sx={{
                                p: 3,
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                },
                              }}
                            >
                              <Avatar
                                src={person.avatar}
                                alt={person.name}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  mx: 'auto',
                                  mb: 2,
                                  border: '3px solid #1976d2',
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 40 }} />
                              </Avatar>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                                {person.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                as {person.character}
                              </Typography>
                              <Chip
                                label="Actor"
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                }}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </InfoCard>
                </Fade>
              )}

              {/* Reviews Tab */}
              {tabValue === 2 && (
                <Fade in timeout={500}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, color: '#1976d2' }}>
                        User Reviews
                      </Typography>
                      <Stack spacing={3}>
                        <Paper
                          sx={{
                            p: 4,
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                          }}
                        >
                          <ReviewsIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.5)', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            No reviews yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Be the first to review this movie!
                          </Typography>
                        </Paper>
                      </Stack>
                    </CardContent>
                  </InfoCard>
                </Fade>
              )}
            </Box>
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