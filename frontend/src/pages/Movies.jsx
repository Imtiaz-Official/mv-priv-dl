import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Rating,
  IconButton,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Pagination,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Fade,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Movie as MovieIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/UI/MovieCard';

// Enhanced Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
}));

const FilterSidebar = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: theme.spacing(3),
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(12),
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderColor: 'rgba(255,255,255,0.2)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.5)',
    },
  },
}));

const ViewToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.05)',
  color: active ? 'white' : 'rgba(255,255,255,0.7)',
  borderRadius: '12px',
  padding: theme.spacing(1.5),
  border: `1px solid ${active ? theme.palette.primary.main : 'rgba(255,255,255,0.1)'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(255,255,255,0.1)',
    transform: 'translateY(-2px)',
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderColor: theme.palette.primary.main,
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiSelect-select': {
    color: 'white',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255,255,255,0.7)',
  },
}));

const MoviesGrid = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.05)',
  padding: theme.spacing(3),
  backdropFilter: 'blur(10px)',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8),
  gap: theme.spacing(2),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8),
  textAlign: 'center',
  gap: theme.spacing(2),
}));

const ActiveFiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '8px',
  '& .MuiChip-deleteIcon': {
    color: 'rgba(255,255,255,0.8)',
    '&:hover': {
      color: 'white',
    },
  },
}));

const Movies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // State management
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const moviesPerPage = 12;

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/movies?limit=100`);
        if (response.ok) {
          const data = await response.json();
          setMovies(data.data?.movies || data.movies || []);
        } else {
          console.error('Failed to fetch movies:', response.statusText);
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter and sort logic
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const movieGenres = Array.isArray(movie.genres) ? movie.genres : (typeof movie.genres === 'string' ? movie.genres.split(' ') : []);
    const matchesGenre = !selectedGenre || movieGenres.includes(selectedGenre);
    const matchesYear = !selectedYear || movie.releaseYear?.toString() === selectedYear;
    // Fix rating filter to use the correct rating field
    const movieRating = movie.rating?.average || movie.imdbRating || 0;
    const matchesRating = movieRating >= ratingRange[0] && movieRating <= ratingRange[1];
    
    return matchesSearch && matchesGenre && matchesYear && matchesRating;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      case 'rating':
        return (b.rating?.average || b.imdbRating || 0) - (a.rating?.average || a.imdbRating || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);
  const paginatedMovies = sortedMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  // Get active filters for display
  const getActiveFilters = () => {
    const filters = [];
    if (searchQuery) filters.push({ type: 'search', value: searchQuery, label: `Search: ${searchQuery}` });
    if (selectedGenre) filters.push({ type: 'genre', value: selectedGenre, label: `Genre: ${selectedGenre}` });
    if (selectedYear) filters.push({ type: 'year', value: selectedYear, label: `Year: ${selectedYear}` });
    if (ratingRange[0] > 0 || ratingRange[1] < 10) {
      filters.push({ type: 'rating', value: ratingRange, label: `Rating: ${ratingRange[0]}-${ratingRange[1]}` });
    }
    return filters;
  };

  const clearFilter = (filterType, filterValue) => {
    switch (filterType) {
      case 'search':
        setSearchQuery('');
        break;
      case 'genre':
        setSelectedGenre('');
        break;
      case 'year':
        setSelectedYear('');
        break;
      case 'rating':
        setRatingRange([0, 10]);
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    setRatingRange([0, 10]);
    setCurrentPage(1);
  };

  // Filter content component
  const FilterContent = () => (
    <Box>
      <FilterTitle variant="h6">
        <TuneIcon />
        Filters
      </FilterTitle>

      {/* Active Filters */}
      {getActiveFilters().length > 0 && (
        <FilterSection>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
            Active Filters
          </Typography>
          <ActiveFiltersContainer>
            {getActiveFilters().map((filter, index) => (
              <FilterChip
                key={index}
                label={filter.label}
                onDelete={() => clearFilter(filter.type, filter.value)}
                deleteIcon={<ClearIcon />}
                size="small"
              />
            ))}
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'none',
                fontSize: '0.75rem',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Clear All
            </Button>
          </ActiveFiltersContainer>
        </FilterSection>
      )}

      {/* Genre Filter */}
      <FilterSection>
        <FilterTitle variant="subtitle1">Genre</FilterTitle>
        <StyledFormControl fullWidth size="small">
          <InputLabel>Select Genre</InputLabel>
          <Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            label="Select Genre"
          >
            <MenuItem value="">All Genres</MenuItem>
            <MenuItem value="Action">Action</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
            <MenuItem value="Horror">Horror</MenuItem>
            <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
            <MenuItem value="Thriller">Thriller</MenuItem>
          </Select>
        </StyledFormControl>
      </FilterSection>

      {/* Year Filter */}
      <FilterSection>
        <FilterTitle variant="subtitle1">Release Year</FilterTitle>
        <StyledFormControl fullWidth size="small">
          <InputLabel>Select Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Select Year"
          >
            <MenuItem value="">All Years</MenuItem>
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(year => (
              <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection>
        <FilterTitle variant="subtitle1">Rating Range</FilterTitle>
        <Box sx={{ px: 1 }}>
          <Slider
            value={ratingRange}
            onChange={(e, newValue) => setRatingRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.5}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiSlider-thumb': {
                backgroundColor: theme.palette.primary.main,
                border: '2px solid white',
                '&:hover': {
                  boxShadow: `0 0 0 8px ${theme.palette.primary.main}20`,
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {ratingRange[0]}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {ratingRange[1]}
            </Typography>
          </Box>
        </Box>
      </FilterSection>

      {/* Sort By */}
      <FilterSection>
        <FilterTitle variant="subtitle1">Sort By</FilterTitle>
        <StyledFormControl fullWidth size="small">
          <InputLabel>Sort Order</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort Order"
          >
            <MenuItem value="title">Title (A-Z)</MenuItem>
            <MenuItem value="year">Year (Newest)</MenuItem>
            <MenuItem value="rating">Rating (Highest)</MenuItem>
          </Select>
        </StyledFormControl>
      </FilterSection>
    </Box>
  );

  return (
    <PageContainer>
      <Container maxWidth="xl">
        {/* Header Section */}
        <HeaderSection>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover Movies
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              fontWeight: 400,
            }}
          >
            Explore our vast collection of movies across all genres
          </Typography>

          {/* Search and View Controls */}
          <SearchContainer>
            <StyledTextField
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 300 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ViewToggleButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <GridViewIcon />
              </ViewToggleButton>
              <ViewToggleButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <ListViewIcon />
              </ViewToggleButton>
            </Box>

            {/* Mobile Filter Button */}
            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setMobileFilterOpen(true)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                Filters
              </Button>
            )}
          </SearchContainer>

          {/* Results Summary */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <MovieIcon sx={{ fontSize: 16 }} />
            {loading ? 'Loading...' : `${sortedMovies.length} movies found`}
          </Typography>
        </HeaderSection>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Filters Sidebar - Desktop only */}
          {!isMobile && (
            <Grid item lg={3}>
              <FilterSidebar elevation={0}>
                <FilterContent />
              </FilterSidebar>
            </Grid>
          )}

          {/* Movies Section */}
          <Grid item xs={12} lg={isMobile ? 12 : 9}>
            <MoviesGrid>
              {loading ? (
                <LoadingContainer>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {[...Array(6)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        width={200}
                        height={300}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                    Loading amazing movies...
                  </Typography>
                </LoadingContainer>
              ) : sortedMovies.length === 0 ? (
                <EmptyState>
                  <MovieIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                  <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
                    No movies found
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Try adjusting your search criteria or filters
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={clearAllFilters}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    Clear All Filters
                  </Button>
                </EmptyState>
              ) : (
                <Box>
                  {viewMode === 'grid' ? (
                    <Box 
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(5, 1fr)', // 5 movies per row on mobile
                          sm: 'repeat(3, 1fr)',  // 3 movies per row on small tablets
                          md: 'repeat(4, 1fr)',  // 4 movies per row on medium screens
                          lg: 'repeat(5, 1fr)'   // 5 movies per row on large screens
                        },
                        gap: { xs: 1, sm: 2, md: 3 }
                      }}
                    >
                      {paginatedMovies.map((movie, index) => (
                        <Fade in timeout={300 + index * 100} key={movie._id || index}>
                          <Box>
                            <MovieCard movie={movie} />
                          </Box>
                        </Fade>
                      ))}
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {paginatedMovies.map((movie, index) => (
                        <Fade in timeout={300 + index * 50} key={movie._id || index}>
                          <Card
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              borderRadius: 3,
                              border: '1px solid rgba(255,255,255,0.1)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                              },
                            }}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                          >
                            <Box sx={{ display: 'flex', p: 2 }}>
                              <CardMedia
                                component="img"
                                sx={{
                                  width: 120,
                                  height: 180,
                                  borderRadius: 2,
                                  objectFit: 'cover',
                                }}
                                image={movie.poster}
                                alt={movie.title}
                              />
                              <CardContent sx={{ flex: 1, pl: 3 }}>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    color: 'white',
                                    fontWeight: 600,
                                    mb: 1,
                                  }}
                                >
                                  {movie.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {movie.plot}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <StarIcon sx={{ fontSize: 18, color: '#ffd700' }} />
                                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                      {movie.imdbRating || 'N/A'}/10
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {movie.releaseYear}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(Array.isArray(movie.genres) ? movie.genres : (typeof movie.genres === 'string' ? movie.genres.split(' ') : []))?.slice(0, 3).map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '0.75rem',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </CardContent>
                            </Box>
                          </Card>
                        </Fade>
                      ))}
                    </Stack>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        color="primary"
                        size="large"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
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
                      />
                    </Box>
                  )}
                </Box>
              )}
            </MoviesGrid>
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="bottom"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(22,33,62,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              color: 'white',
              maxHeight: '80vh',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Filters
              </Typography>
              <IconButton
                onClick={() => setMobileFilterOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <ClearIcon />
              </IconButton>
            </Box>
            <FilterContent />
          </Box>
        </Drawer>
      </Container>
    </PageContainer>
  );
};

export default Movies;