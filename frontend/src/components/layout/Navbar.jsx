import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Fade,
  Badge,
  Tooltip,
  Autocomplete,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Movie as MovieIcon,
  Article as ArticleIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon,
  MovieFilter as FilmIcon,
  Bookmark as BookmarkIcon,
  GetApp as DownloadIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigationItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Movies', path: '/movies', icon: MovieIcon },
    { name: 'Watchlist', path: '/watchlist', icon: BookmarkIcon },
    { name: 'Profile', path: '/profile', icon: PersonIcon },
    { name: 'Blog', path: '/blog', icon: ArticleIcon },
    { name: 'Admin', path: '/admin', icon: AdminIcon },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetch movie suggestions for autocomplete
  const fetchMovieSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setMovieSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/movies/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setMovieSuggestions(data.data.map(movie => ({
          title: movie.title,
          year: movie.releaseYear,
          poster: movie.poster,
          id: movie._id
        })));
      }
    } catch (error) {
      console.error('Error fetching movie suggestions:', error);
      setMovieSuggestions([]);
    }
  };

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMovieSuggestions(searchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMovieSuggestions([]);
    }
  };

  const handleSuggestionSelect = (movie) => {
    if (movie) {
      navigate(`/movies?search=${encodeURIComponent(movie.title)}`);
      setSearchQuery('');
      setMovieSuggestions([]);
    }
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Typography variant="h6" component="div" className="text-gradient">
          MovieHub
        </Typography>
        <IconButton onClick={handleDrawerToggle} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Icon sx={{ color: isActive(item.path) ? 'white' : 'inherit' }} />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 4px 20px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              <FilmIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              MovieHub
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 'auto' }}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.path}
                    startIcon={<Icon />}
                    variant={isActive(item.path) ? 'contained' : 'text'}
                    sx={{
                      color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white',
                        background: isActive(item.path) 
                          ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                          : 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              ml: 'auto',
              mr: 2,
            }}
          >
            <Autocomplete
              freeSolo
              options={movieSuggestions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
              inputValue={searchQuery}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              onChange={(event, newValue) => {
                handleSuggestionSelect(newValue);
              }}
              renderOption={(props, option) => (
                <Box 
                  component="li" 
                  {...props} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={option.poster || '/placeholder-movie.svg'}
                    alt={option.title}
                    sx={{
                      width: 36,
                      height: 54,
                      objectFit: 'cover',
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.95)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {option.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {option.year}
                    </Typography>
                  </Box>
                </Box>
              )}
              PaperComponent={({ children, ...other }) => (
                <Paper
                  {...other}
                  sx={{
                    background: 'rgba(20, 20, 30, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 2,
                    mt: 0.5,
                    maxHeight: 400,
                    overflow: 'auto',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {children}
                </Paper>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Search movies..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 320,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      fontSize: '0.875rem',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.12)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.12)',
                        borderColor: 'rgba(102, 126, 234, 0.5)',
                        boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                      },
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.875rem',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Mobile Search - Improved */}
          {isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={() => navigate('/movies')}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;