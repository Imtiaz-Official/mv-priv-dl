import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  Fade,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Rating,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Schedule as ClockIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Tv as TvIcon,
  Animation as AnimeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MovieCard from '../components/UI/MovieCard';
import SearchBar from '../components/UI/SearchBar';
import Button from '../components/UI/Button';
import { SectionLoader } from '../components/UI/LoadingSpinner';

const FilterCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 20,
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  border: 'none',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    padding: theme.spacing(2),
    minHeight: 'auto',
    borderRadius: 16,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.05)',
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&.Mui-expanded': {
        transform: 'rotate(180deg)',
      },
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(0, 3, 3),
  },
}));

const Movies = () => {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // New state for view mode - default to list
  const [contentType, setContentType] = useState('all'); // New state for content type
  const [filters, setFilters] = useState({
    genre: '',
    year: [2000, 2024],
    rating: [5, 10],
    quality: '',
    sortBy: 'popularity',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const moviesPerPage = 12;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];
  const qualities = ['HD', '4K', 'CAM', 'TS'];
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' },
    { value: 'year', label: 'Year' },
    { value: 'title', label: 'Title' },
  ];

  // Content type tabs
  const contentTypes = [
    { value: 'all', label: 'All Content', icon: <CategoryIcon /> },
    { value: 'movies', label: 'Movies', icon: <MovieIcon /> },
    { value: 'tv', label: 'TV Shows', icon: <TvIcon /> },
    { value: 'anime', label: 'Anime', icon: <AnimeIcon /> },
  ];

  // Helper functions
  const getPageTitle = () => {
    switch (contentType) {
      case 'movies':
        return 'Discover Movies';
      case 'tv':
        return 'Discover TV Shows';
      case 'anime':
        return 'Discover Anime';
      default:
        return 'Discover Content';
    }
  };

  const getPageSubtitle = () => {
    switch (contentType) {
      case 'movies':
        return 'Explore our vast collection of movies from all genres and eras';
      case 'tv':
        return 'Binge-watch the best TV series and shows';
      case 'anime':
        return 'Dive into the world of anime and animated series';
      default:
        return 'Explore our vast collection of movies, TV shows, and anime';
    }
  };

  // Handle URL search parameters from navbar and home page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromUrl = searchParams.get('search');
    const typeFromUrl = searchParams.get('type');
    const genreFromUrl = searchParams.get('genre');
    const qualityFromUrl = searchParams.get('quality');
    
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
    if (typeFromUrl && ['movies', 'tv', 'anime'].includes(typeFromUrl)) {
      setContentType(typeFromUrl);
    }
    if (genreFromUrl) {
      setFilters(prev => ({ ...prev, genre: genreFromUrl.charAt(0).toUpperCase() + genreFromUrl.slice(1) }));
    }
    if (qualityFromUrl) {
      // Map quality URL parameters to filter values
      const qualityMap = {
        '720p': 'HD',
        '1080p': 'HD',
        '4k': '4K',
        'bluray': 'HD'
      };
      const mappedQuality = qualityMap[qualityFromUrl.toLowerCase()] || qualityFromUrl.toUpperCase();
      setFilters(prev => ({ ...prev, quality: mappedQuality }));
    }
  }, [location.search]);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/movies?limit=50');
        const data = await response.json();
        
        if (data.success) {
          const moviesData = data.data.movies.map(movie => ({
            id: movie._id,
            title: movie.title,
            poster: movie.poster || '/placeholder-movie.svg',
            rating: movie.imdbRating || movie.rating?.average || 0,
            year: movie.releaseYear,
            duration: movie.duration,
            views: movie.views || 0,
            quality: (movie.quality && typeof movie.quality === 'string') ? movie.quality.split(' ')[0] : 'HD', // Take first quality from string
            genres: typeof movie.genres === 'string' ? movie.genres.split(' ') : (movie.genres || []),
            description: movie.description || movie.plot || '',
          }));
          setMovies(moviesData);
        } else {
          // Fallback to mock data if API fails
          const mockMovies = Array.from({ length: 50 }, (_, index) => ({
            id: index + 1,
            title: `Movie ${index + 1}`,
            poster: `/placeholder-movie.svg`,
            rating: Math.round((Math.random() * 5 + 5) * 10) / 10, // 5.0 to 10.0 with 1 decimal
            year: Math.floor(Math.random() * 25) + 2000, // 2000 to 2024
            duration: Math.floor(Math.random() * 60) + 90,
            views: Math.floor(Math.random() * 1000000) + 100000,
            quality: qualities[Math.floor(Math.random() * qualities.length)],
            genres: [genres[Math.floor(Math.random() * genres.length)]],
            description: `This is the description for Movie ${index + 1}. It's an amazing film with great storyline and excellent performances.`,
          }));
          setMovies(mockMovies);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Fallback to mock data on error
        const mockMovies = Array.from({ length: 50 }, (_, index) => ({
          id: index + 1,
          title: `Movie ${index + 1}`,
          poster: `/placeholder-movie.svg`,
          rating: Math.round((Math.random() * 5 + 5) * 10) / 10, // 5.0 to 10.0 with 1 decimal
          year: Math.floor(Math.random() * 25) + 2000, // 2000 to 2024
          duration: Math.floor(Math.random() * 60) + 90,
          views: Math.floor(Math.random() * 1000000) + 100000,
          quality: qualities[Math.floor(Math.random() * qualities.length)],
          genres: [genres[Math.floor(Math.random() * genres.length)]],
          description: `This is the description for Movie ${index + 1}. It's an amazing film with great storyline and excellent performances.`,
        }));
        setMovies(mockMovies);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch suggestions for autocomplete
  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/movies/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('movieSearchHistory');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (query) => {
    if (!query || query.trim().length < 2) return;
    
    const trimmedQuery = query.trim();
    const newHistory = [trimmedQuery, ...recentSearches.filter(item => item !== trimmedQuery)].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('movieSearchHistory', JSON.stringify(newHistory));
  };

  // Filter and search logic with useMemo for better performance
  const filteredMovies = useMemo(() => {
    let filtered = movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !filters.genre || movie.genres.includes(filters.genre);
      const matchesYear = movie.year >= filters.year[0] && movie.year <= filters.year[1];
      const matchesRating = movie.rating >= filters.rating[0] && movie.rating <= filters.rating[1];
      const matchesQuality = !filters.quality || movie.quality === filters.quality;
      
      // Content type filtering
      let matchesContentType = true;
      if (contentType !== 'all') {
        if (contentType === 'movies') {
          matchesContentType = !movie.genres.includes('Animation') && movie.duration > 60;
        } else if (contentType === 'tv') {
          matchesContentType = movie.duration <= 60 && !movie.genres.includes('Animation');
        } else if (contentType === 'anime') {
          matchesContentType = movie.genres.includes('Animation');
        }
      }

      return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesQuality && matchesContentType;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.views - a.views;
      }
    });

    return filtered;
  }, [movies, searchQuery, filters, contentType]);

  // Update current page when filtered movies change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredMovies]);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Debounced filter change for sliders to improve performance
  const handleSliderChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: [2000, 2024],
      rating: [5, 10],
      quality: '',
      sortBy: 'popularity',
    });
    setSearchQuery('');
  };

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const FilterContent = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}
        >
          Filters
        </Typography>
        {isMobile && (
          <IconButton 
            onClick={() => setMobileFilterOpen(false)} 
            sx={{ 
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <FilterCard>
        <StyledAccordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CategoryIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
              </Box>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Genre</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#667eea'
                }
              }}>Select Genre</InputLabel>
              <Select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                sx={{
                  color: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: '1px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-icon': {
                    color: '#667eea',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(30, 30, 30, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.2)',
                        },
                        '&.Mui-selected': {
                          background: 'rgba(102, 126, 234, 0.3)',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map(genre => (
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </StyledAccordion>
      </FilterCard>

      <FilterCard>
        <StyledAccordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
              </Box>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Release Year</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                mb: 2,
                textAlign: 'center',
                fontWeight: 500
              }}>
                {filters.year[0]} - {filters.year[1]}
              </Typography>
              <Slider
                value={filters.year}
                onChange={(e, value) => handleSliderChange('year', value)}
                valueLabelDisplay="auto"
                min={2000}
                max={2024}
                sx={{
                  color: '#667eea',
                  height: 6,
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#667eea',
                    border: '3px solid white',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '& .MuiSlider-valueLabel': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </AccordionDetails>
        </StyledAccordion>
      </FilterCard>

      <FilterCard>
        <StyledAccordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <StarIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
              </Box>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Rating</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                mb: 2,
                textAlign: 'center',
                fontWeight: 500
              }}>
                {filters.rating[0]} - {filters.rating[1]} stars
              </Typography>
              <Slider
                value={filters.rating}
                onChange={(e, value) => handleSliderChange('rating', value)}
                valueLabelDisplay="auto"
                min={5}
                max={10}
                step={0.1}
                sx={{
                  color: '#667eea',
                  height: 6,
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#667eea',
                    border: '3px solid white',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '& .MuiSlider-valueLabel': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </AccordionDetails>
        </StyledAccordion>
      </FilterCard>

      <FilterCard>
        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MovieIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
              </Box>
              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>Quality</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Chip
                label="All"
                onClick={() => handleFilterChange('quality', '')}
                variant={filters.quality === '' ? 'filled' : 'outlined'}
                sx={{
                  color: filters.quality === '' ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  background: filters.quality === '' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  borderColor: filters.quality === '' ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 36,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    background: filters.quality === '' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                  },
                }}
              />
              {qualities.map(quality => (
                <Chip
                  key={quality}
                  label={quality}
                  onClick={() => handleFilterChange('quality', quality)}
                  variant={filters.quality === quality ? 'filled' : 'outlined'}
                  sx={{
                    color: filters.quality === quality ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    background: filters.quality === quality 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderColor: filters.quality === quality ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 36,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      background: filters.quality === quality 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'rgba(102, 126, 234, 0.2)',
                      borderColor: '#667eea',
                    },
                  }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </StyledAccordion>
      </FilterCard>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={clearFilters}
          sx={{ 
            mt: 2,
            borderRadius: 3,
            height: 48,
            fontSize: '1rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255, 69, 58, 0.1)',
              borderColor: '#ff453a',
              color: '#ff453a',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 69, 58, 0.2)',
            }
          }}
        >
          Clear All Filters
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return <SectionLoader text="Loading movies..." />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            <CategoryIcon sx={{ color: theme.palette.primary.main }} />
            {getPageTitle()}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {getPageSubtitle()}
          </Typography>

          {/* Content Type Tabs */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={contentType}
              onChange={(e, newValue) => setContentType(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: 3,
                },
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  minWidth: 120,
                  '&.Mui-selected': {
                    color: 'white',
                  },
                },
              }}
            >
              {contentTypes.map((type) => (
                <Tab
                  key={type.value}
                  value={type.value}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Search Bar */}
           <SearchBar
             value={searchQuery}
             onChange={setSearchQuery}
             placeholder={`Search ${contentType === 'all' ? 'content' : contentType}...`}
             suggestions={suggestions}
             recentSearches={recentSearches}
             onSuggestionClick={(suggestion) => setSearchQuery(suggestion)}
             onRecentSearchClick={(search) => setSearchQuery(search)}
             trendingSearches={contentType === 'anime' ? ['Naruto', 'Attack on Titan', 'One Piece'] : 
                              contentType === 'tv' ? ['Breaking Bad', 'Game of Thrones', 'Stranger Things'] :
                              ['Action Movies', 'Comedy Films', 'Sci-Fi Adventures']}
           />
         </Box>

         {/* Controls Section */}
         <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
           {/* View Mode Toggle */}
           <ToggleButtonGroup
             value={viewMode}
             exclusive
             onChange={(e, newView) => newView && setViewMode(newView)}
             sx={{
               '& .MuiToggleButton-root': {
                 color: 'rgba(255, 255, 255, 0.7)',
                 borderColor: 'rgba(255, 255, 255, 0.2)',
                 '&:hover': {
                   backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 },
                 '&.Mui-selected': {
                   backgroundColor: theme.palette.primary.main,
                   color: 'white',
                   '&:hover': {
                     backgroundColor: theme.palette.primary.dark,
                   },
                 },
               },
             }}
           >
             <ToggleButton value="grid" aria-label="grid view">
               <GridViewIcon />
             </ToggleButton>
             <ToggleButton value="list" aria-label="list view">
               <ListViewIcon />
             </ToggleButton>
           </ToggleButtonGroup>
           
           <FormControl sx={{ minWidth: 150 }}>
             <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sort By</InputLabel>
             <Select
               value={filters.sortBy}
               onChange={(e) => handleFilterChange('sortBy', e.target.value)}
               sx={{
                 color: 'white',
                 '& .MuiOutlinedInput-notchedOutline': {
                   borderColor: 'rgba(255, 255, 255, 0.2)',
                 },
                 '&:hover .MuiOutlinedInput-notchedOutline': {
                   borderColor: 'rgba(255, 255, 255, 0.4)',
                 },
                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                   borderColor: theme.palette.primary.main,
                 },
               }}
             >
               {sortOptions.map(option => (
                 <MenuItem key={option.value} value={option.value}>
                   {option.label}
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
           {isMobile && (
             <Button
               variant="outlined"
               startIcon={<FilterIcon />}
               onClick={() => setMobileFilterOpen(true)}
             >
               Filters
             </Button>
           )}

           {/* Results Info */}
           <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', ml: 'auto' }}>
             Showing {filteredMovies.length} {contentType === 'all' ? 'items' : contentType}
           </Typography>
         </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          {!isMobile && (
            <Grid item md={3}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <FilterContent />
              </Box>
            </Grid>
          )}

          {/* Movies Grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {viewMode === 'grid' ? (
              // Grid View - Enhanced with better spacing and responsiveness
              <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{
                  '& .MuiGrid-item': {
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
                {paginatedMovies.map((movie, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    xl={2.4}
                    key={movie.id}
                    sx={{
                      minHeight: { xs: 400, sm: 450, md: 520 },
                      display: 'flex',
                    }}
                  >
                    <Fade in timeout={300 + index * 50}>
                      <Box sx={{ height: '100%', display: 'flex' }}>
                        <MovieCard movie={movie} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // List View
              <List sx={{ width: '100%' }}>
                {paginatedMovies.map((movie, index) => (
                  <Fade in timeout={300 + index * 50} key={movie.id}>
                    <Box>
                      <ListItem
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          mb: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => window.location.href = `/movie/${movie.id}`}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={movie.poster}
                            variant="rounded"
                            sx={{
                              width: 80,
                              height: 120,
                              mr: 2,
                              border: '2px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <MovieIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primaryTypographyProps={{ component: 'div' }}
                          secondaryTypographyProps={{ component: 'div' }}
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: { xs: '1rem', md: '1.25rem' },
                                }}
                              >
                                {movie.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Rating
                                  value={movie.rating / 2}
                                  precision={0.1}
                                  size="small"
                                  readOnly
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: '#ffd700',
                                    },
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  {movie.rating}/10
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {movie.year}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ClockIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {movie.duration}
                                  </Typography>
                                </Box>
                                {movie.quality && (
                                  <Chip
                                    label={movie.quality}
                                    size="small"
                                    sx={{
                                      backgroundColor: theme.palette.primary.main,
                                      color: 'white',
                                      fontSize: '0.75rem',
                                    }}
                                  />
                                )}
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                {movie.genres?.slice(0, 3).map((genre) => (
                                  <Chip
                                    key={genre}
                                    label={genre}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      color: 'rgba(255, 255, 255, 0.8)',
                                      borderColor: 'rgba(255, 255, 255, 0.3)',
                                      fontSize: '0.7rem',
                                    }}
                                  />
                                ))}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.4,
                                }}
                              >
                                {movie.plot || 'No description available.'}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                          <IconButton
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: theme.palette.primary.main,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: theme.palette.secondary.main,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < paginatedMovies.length - 1 && (
                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                      )}
                    </Box>
                  </Fade>
                ))}
              </List>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => {
                    setCurrentPage(page);
                    // Scroll to top when page changes
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="right"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          PaperProps={{
            sx: {
              width: 320,
              background: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <FilterContent />
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Movies;