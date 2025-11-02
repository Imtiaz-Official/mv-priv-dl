import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Whatshot as FireIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  PlayArrow as PlayIcon,
  Add as AddIcon,
  Check as CheckIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../UI/Button';
import { generateMovieUrl } from '../../utils/movieUtils';

const TrendingContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6, 0),
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FilterTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: 3,
    borderRadius: 2,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#667eea',
    },
  },
}));

const MovieCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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
  height: 300,
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
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const TrendingBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  backgroundColor: '#ff6b35',
  color: 'white',
  fontSize: '0.7rem',
  height: 24,
  zIndex: 1,
  '& .MuiChip-icon': {
    color: 'white',
    fontSize: '0.9rem',
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

const MovieInfo = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
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

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignSelf: 'flex-end',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const TrendingSection = ({ movies, title = "Trending Now" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [watchlist, setWatchlist] = useState(new Set());
  const [filteredMovies, setFilteredMovies] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Movies', value: 'movie' },
    { label: 'TV Shows', value: 'tv' },
    { label: 'Anime', value: 'anime' },
  ];

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    let filtered = [...movies];

    // Apply filter based on active tab
    switch (activeTab) {
      case 1: // Movies
        filtered = filtered.filter(movie => 
          !movie.genres?.some(genre => 
            ['Animation', 'Anime'].includes(genre)
          ) && movie.duration > 60
        );
        break;
      case 2: // TV Shows
        filtered = filtered.filter(movie => 
          movie.duration <= 60 || 
          movie.genres?.some(genre => 
            ['Drama', 'Comedy', 'Crime'].includes(genre)
          )
        );
        break;
      case 3: // Anime
        filtered = filtered.filter(movie => 
          movie.genres?.some(genre => 
            ['Animation', 'Anime'].includes(genre)
          )
        );
        break;
      default: // All
        break;
    }

    // Sort by trending score (views + rating)
    filtered.sort((a, b) => {
      const scoreA = (a.views || 0) + (a.rating || 0) * 100000;
      const scoreB = (b.views || 0) + (b.rating || 0) * 100000;
      return scoreB - scoreA;
    });

    setFilteredMovies(filtered);
  }, [movies, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    return views?.toString() || '0';
  };

  const getTrendingRank = (index) => {
    return index + 1;
  };

  if (!movies || movies.length === 0) return null;

  return (
    <TrendingContainer>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <SectionHeader>
            <SectionTitle variant="h4">
              <TrendingIcon />
              {title}
            </SectionTitle>
            <FilterTabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
            >
              {filterOptions.map((option, index) => (
                <Tab key={index} label={option.label} />
              ))}
            </FilterTabs>
          </SectionHeader>
        </Fade>

        <Grid container spacing={3}>
          {filteredMovies.slice(0, 8).map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id || index}>
              <Slide
                direction="up"
                in
                timeout={800 + index * 100}
              >
                <MovieCard>
                  <Box sx={{ position: 'relative' }}>
                    <TrendingBadge
                      icon={<FireIcon />}
                      label={`#${getTrendingRank(index)}`}
                      size="small"
                    />
                    <QualityBadge label={movie.quality} size="small" />
                    <MoviePoster
                      className="movie-poster"
                      image={movie.poster || '/placeholder-movie.svg'}
                      title={movie.title}
                    />
                    <MovieOverlay className="movie-overlay">
                      <Box />
                      <ActionButtons>
                        <ActionButton
                          component={Link}
                          to={generateMovieUrl(movie)}
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
                        marginTop: 'auto',
                      }}
                    >
                      {movie.description}
                    </Typography>
                  </MovieInfo>
                </MovieCard>
              </Slide>
            </Grid>
          ))}
        </Grid>

        {filteredMovies.length > 8 && (
          <Fade in timeout={1200}>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                View All Trending
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
    </TrendingContainer>
  );
};

export default TrendingSection;