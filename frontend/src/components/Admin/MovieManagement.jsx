import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
  LinearProgress,
  Pagination,
  Rating,
  FormControlLabel,
  Switch,
  Autocomplete,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Category as CategoryIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MovieDownloadManager from './MovieDownloadManager';

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    background: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
}));

const MovieCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'rgba(255, 255, 255, 0.08)',
  },
}));

const DataTable = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  '& .MuiTableCell-root': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontWeight: 600,
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movie-tabpanel-${index}`}
      aria-labelledby={`movie-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterQuality, setFilterQuality] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showDownloadManager, setShowDownloadManager] = useState(false);
  const [downloadManagerMovie, setDownloadManagerMovie] = useState(null);
  
  const [movieStats, setMovieStats] = useState({
    totalMovies: 0,
    activeMovies: 0,
    totalDownloads: 0,
    averageRating: 0,
    newMoviesThisMonth: 0,
    topGenre: '',
  });

  const [formData, setFormData] = useState({
    _id: null, // Add ID field for edit operations
    title: '',
    description: '',
    year: new Date().getFullYear(),
    genre: [],
    director: '',
    cast: [],
    duration: '',
    language: '',
    country: '',
    poster: '',
    trailer: '',
    imdbRating: 0,
    quality: '1080p',
    size: '',
    downloadLinks: [],
    isActive: true,
  });

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
    'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const qualities = ['CAM', 'HDCAM', 'HDTS', 'DVDSCR', 'DVDRIP', 'HDTV', 'WEBRIP', 'WEBDL', 'BLURAY', 'REMUX'];
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchMovies();
    fetchMovieStats();
  }, [page, sortBy, sortOrder, filterGenre, filterQuality, filterYear, searchTerm]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(filterGenre !== 'all' && { genre: filterGenre }),
        ...(filterQuality !== 'all' && { quality: filterQuality }),
        ...(filterYear !== 'all' && { year: filterYear }),
      });

      const response = await fetch(`http://localhost:5000/api/movies?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMovies(data.data.movies || []);
          setTotalPages(data.data.totalPages || 1);
        }
      } else {
        // Fallback to mock data
        const mockMovies = [
          {
            _id: '1',
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...',
            year: 2008,
            genre: ['Action', 'Crime', 'Drama'],
            director: 'Christopher Nolan',
            cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
            duration: '152 min',
            language: 'English',
            country: 'USA',
            poster: null, // Will use fallback image
            trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
            rating: { average: 9.0, count: 2500000 },
            imdbRating: 9.0,
            quality: '1080p',
            size: '2.1 GB',
            downloadCount: 1250000,
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            _id: '2',
            title: 'Inception',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
            year: 2010,
            genre: ['Action', 'Sci-Fi', 'Thriller'],
            director: 'Christopher Nolan',
            cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
            duration: '148 min',
            language: 'English',
            country: 'USA',
            poster: null, // Will use fallback image
            trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
            rating: { average: 8.8, count: 2200000 },
            imdbRating: 8.8,
            quality: '4K',
            size: '4.5 GB',
            downloadCount: 980000,
            isActive: true,
            createdAt: '2024-01-10T14:20:00Z',
          },
          {
            _id: '3',
            title: 'Parasite',
            description: 'A poor family schemes to become employed by a wealthy family...',
            year: 2019,
            genre: ['Comedy', 'Drama', 'Thriller'],
            director: 'Bong Joon Ho',
            cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
            duration: '132 min',
            language: 'Korean',
            country: 'South Korea',
            poster: null, // Will use fallback image
            trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
            rating: { average: 8.6, count: 750000 },
            imdbRating: 8.6,
            quality: '1080p',
            size: '1.8 GB',
            downloadCount: 650000,
            isActive: false,
            createdAt: '2024-01-05T09:15:00Z',
          },
        ];
        setMovies(mockMovies);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/movies/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMovieStats(data.data);
        }
      } else {
        // Fallback to mock stats
        const mockStats = {
          totalMovies: 15420,
          activeMovies: 14890,
          totalDownloads: 45678900,
          averageRating: 7.2,
          newMoviesThisMonth: 234,
          topGenre: 'Action',
        };
        setMovieStats(mockStats);
      }
    } catch (error) {
      console.error('Error fetching movie stats:', error);
      setMovieStats({
        totalMovies: 0,
        activeMovies: 0,
        totalDownloads: 0,
        averageRating: 0,
        newMoviesThisMonth: 0,
        topGenre: '',
      });
    }
  };

  const handleMenuClick = (event, movie) => {
    setAnchorEl(event.currentTarget);
    setSelectedMovie(movie);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMovie(null);
  };

  const handleEdit = () => {
    setDialogType('edit');
    setFormData({
      _id: selectedMovie._id, // Store the movie ID in form data
      title: selectedMovie.title || '',
      description: selectedMovie.description || '',
      year: selectedMovie.releaseYear || selectedMovie.year || new Date().getFullYear(),
      genre: Array.isArray(selectedMovie.genres) ? selectedMovie.genres : (selectedMovie.genre || []),
      director: selectedMovie.director || '',
      cast: Array.isArray(selectedMovie.cast) ? selectedMovie.cast.map(c => c.name || c) : [],
      duration: selectedMovie.duration || '',
      language: Array.isArray(selectedMovie.languages) ? selectedMovie.languages[0] : (selectedMovie.language || 'English'),
      country: Array.isArray(selectedMovie.countries) ? selectedMovie.countries[0] : (selectedMovie.country || 'USA'),
      poster: selectedMovie.poster || '',
      trailer: selectedMovie.trailer || '',
      imdbRating: selectedMovie.imdbRating || 0,
      quality: selectedMovie.quality || 'HD',
      size: selectedMovie.size || '',
      downloadLinks: selectedMovie.downloadLinks || [],
      isActive: selectedMovie.isActive !== undefined ? selectedMovie.isActive : true,
    });
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDialogType('delete');
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/movies/${selectedMovie._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMovies(movies.map(movie => 
          movie._id === selectedMovie._id 
            ? { ...movie, isActive: !movie.isActive }
            : movie
        ));
        showSnackbar(`Movie ${selectedMovie.isActive ? 'hidden' : 'shown'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling movie status:', error);
      showSnackbar('Error updating movie status', 'error');
    }
    handleMenuClose();
  };

  const handleManageDownloads = () => {
    setDownloadManagerMovie(selectedMovie);
    setShowDownloadManager(true);
    handleMenuClose();
  };

  const handleCloseDownloadManager = () => {
    setShowDownloadManager(false);
    setDownloadManagerMovie(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedMovie(null);
    setFormData({
      _id: null, // Reset the ID field
      title: '',
      description: '',
      year: new Date().getFullYear(),
      genre: [],
      director: '',
      cast: [],
      duration: '120',
      language: 'English',
      country: 'USA',
      poster: '',
      trailer: '',
      imdbRating: 0,
      quality: 'BLURAY',
      size: '',
      downloadLinks: [],
      isActive: true,
    });
  };

  const handleSaveMovie = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = dialogType === 'edit' 
        ? `http://localhost:5000/api/movies/${formData._id}`
        : 'http://localhost:5000/api/movies';
      
      const method = dialogType === 'edit' ? 'PUT' : 'POST';
      
      // Transform form data to match backend validation requirements
      const movieData = {
        title: formData.title || '',
        description: formData.description || 'No description available',
        releaseYear: parseInt(formData.year) || new Date().getFullYear(),
        duration: parseInt(formData.duration) || 120,
        genres: Array.isArray(formData.genre) && formData.genre.length > 0 ? formData.genre : ['Drama'],
        languages: Array.isArray(formData.language) ? formData.language : [formData.language || 'English'],
        countries: Array.isArray(formData.country) ? formData.country : [formData.country || 'USA'],
        director: formData.director || 'Unknown Director',
        cast: Array.isArray(formData.cast) ? formData.cast.map(actor => typeof actor === 'string' ? { name: actor } : actor) : [],
        poster: formData.poster || '',
        trailer: formData.trailer || '',
        imdbRating: parseFloat(formData.imdbRating) || 0,
        quality: Array.isArray(formData.quality) ? formData.quality : [formData.quality || 'HD'],
        size: formData.size || '',
        status: 'published'
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
      });

      if (response.ok) {
        await fetchMovies();
        await fetchMovieStats();
        setSnackbar({
          open: true,
          message: `Movie ${dialogType === 'edit' ? 'updated' : 'created'} successfully`,
          severity: 'success'
        });
        handleDialogClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${dialogType} movie`);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error ${dialogType === 'edit' ? 'updating' : 'creating'} movie: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteMovie = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/movies/${selectedMovie._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMovies(movies.filter(movie => movie._id !== selectedMovie._id));
        await fetchMovieStats();
        setSnackbar({
          open: true,
          message: 'Movie deleted successfully',
          severity: 'success'
        });
        handleDialogClose();
      } else {
        throw new Error('Failed to delete movie');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting movie',
        severity: 'error'
      });
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case '4K': return 'error';
      case '1440p': return 'warning';
      case '1080p': return 'success';
      case '720p': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Loading Movies...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Movie Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <MovieIcon sx={{ color: '#667eea', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {movieStats?.totalMovies?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Movies
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <VisibilityIcon sx={{ color: '#4ade80', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {movieStats?.activeMovies?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Active Movies
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <DownloadIcon sx={{ color: '#8b5cf6', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {movieStats.totalDownloads ? (movieStats.totalDownloads / 1000000).toFixed(1) : '0.0'}M
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Downloads
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <StarIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {movieStats.averageRating ? movieStats.averageRating.toFixed(1) : '0.0'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg Rating
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <ScheduleIcon sx={{ color: '#06b6d4', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {movieStats.newMoviesThisMonth}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                New This Month
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <CategoryIcon sx={{ color: '#f87171', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {movieStats.topGenre}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Top Genre
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          Movie Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              },
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Genre</InputLabel>
            <Select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {genres.map(genre => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Quality</InputLabel>
            <Select
              value={filterQuality}
              onChange={(e) => setFilterQuality(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              <MenuItem value="all">All Qualities</MenuItem>
              {qualities.map(quality => (
                <MenuItem key={quality} value={quality}>{quality}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('create');
              setDialogOpen(true);
            }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Add Movie
          </Button>
        </Box>
      </Box>

      {/* Movies Table */}
      <DataTable component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Downloads</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={movie.poster || '/api/placeholder/60/90'}
                      alt={movie.title}
                      sx={{
                        width: 40,
                        height: 60,
                        borderRadius: 1,
                        objectFit: 'cover',
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {movie.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {movie.director}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {movie.year}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {movie.genre?.slice(0, 2).map((g, index) => (
                      <Chip
                        key={index}
                        label={g}
                        size="small"
                        variant="outlined"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                      />
                    ))}
                    {movie.genre?.length > 2 && (
                      <Chip
                        label={`+${movie.genre.length - 2}`}
                        size="small"
                        variant="outlined"
                        sx={{ color: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={movie.quality}
                    size="small"
                    color={getQualityColor(movie.quality)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={movie.rating?.average / 2 || movie.imdbRating / 2 || 0}
                      readOnly
                      size="small"
                      precision={0.1}
                    />
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {movie.rating?.average || movie.imdbRating || 0}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {movie.downloadCount?.toLocaleString() || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={movie.isActive ? 'Active' : 'Hidden'}
                    size="small"
                    color={getStatusColor(movie.isActive)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, movie)}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        />
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ color: 'white' }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Movie
        </MenuItem>
        <MenuItem onClick={handleManageDownloads} sx={{ color: 'white' }}>
          <CloudDownloadIcon sx={{ mr: 1 }} />
          Manage Downloads
        </MenuItem>
        <MenuItem onClick={handleToggleStatus} sx={{ color: 'white' }}>
          {selectedMovie?.isActive ? <VisibilityOffIcon sx={{ mr: 1 }} /> : <VisibilityIcon sx={{ mr: 1 }} />}
          {selectedMovie?.isActive ? 'Hide Movie' : 'Show Movie'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ff4757' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Movie
        </MenuItem>
      </Menu>

      {/* Edit/Create Movie Dialog */}
      <Dialog
        open={dialogOpen && (dialogType === 'edit' || dialogType === 'create')}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {dialogType === 'edit' ? 'Edit Movie' : 'Add New Movie'}
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={genres}
                  value={formData.genre}
                  onChange={(e, newValue) => setFormData({ ...formData, genre: newValue })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Genres"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Director"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Quality</InputLabel>
                  <Select
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  >
                    {qualities.map(quality => (
                      <MenuItem key={quality} value={quality}>{quality}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Poster URL"
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IMDB Rating"
                  type="number"
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  value={formData.imdbRating}
                  onChange={(e) => setFormData({ ...formData, imdbRating: parseFloat(e.target.value) })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                  sx={{ color: 'white' }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveMovie} variant="contained">
            {dialogType === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen && dialogType === 'delete'}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete "{selectedMovie?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteMovie} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Download Manager */}
      {showDownloadManager && downloadManagerMovie && (
        <Dialog
          open={showDownloadManager}
          onClose={handleCloseDownloadManager}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(145deg, #2a2a3e, #1f1f2e)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxHeight: '90vh',
            }
          }}
        >
          <MovieDownloadManager
            movieId={downloadManagerMovie._id}
            movieTitle={downloadManagerMovie.title}
            onClose={handleCloseDownloadManager}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default MovieManagement;