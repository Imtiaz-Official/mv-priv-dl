import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Fade,
  Popper,
  ClickAwayListener,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 25,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.15)',
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: `0px 0px 20px ${theme.palette.primary.main}40`,
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
    fontSize: '1rem',
    padding: '14px 0',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
      opacity: 1,
    },
  },
}));

const SearchResultsPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(20, 20, 35, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 16,
  marginTop: 8,
  maxHeight: 400,
  overflow: 'auto',
  boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.6)',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.5)',
    },
  },
}));

const SearchBar = ({
  placeholder = "Search movies, shows, actors...",
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  fullWidth = false,
  size = 'medium',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const anchorRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (query.trim() && suggestions && suggestions.length > 0) {
      const filtered = suggestions.filter(item =>
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  const debouncedSearch = useCallback((value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  }, [onSearch]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setIsOpen(true);
    
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    const searchTerm = suggestion.title || suggestion.name || suggestion;
    setQuery(searchTerm);
    setIsOpen(false);
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query);
      }
    }
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const showSuggestions = isOpen && (query.trim() || recentSearches.length > 0 || trendingSearches.length > 0);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        <StyledTextField
          ref={anchorRef}
          inputRef={inputRef}
          fullWidth={fullWidth}
          size={size}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 24 }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&:hover': {
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Popper
          open={showSuggestions}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ 
            width: anchorRef.current?.offsetWidth, 
            zIndex: 1300,
            position: 'fixed'
          }}
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top-start', 'bottom-start'],
              },
            },
          ]}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <SearchResultsPaper>
                <List sx={{ py: 1 }}>
                  {/* Search Results */}
                  {query.trim() && filteredSuggestions.length > 0 && (
                    <>
                      <ListItem sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                          SEARCH RESULTS
                        </Typography>
                      </ListItem>
                      {filteredSuggestions.map((suggestion, index) => (
                        <ListItem
                          key={index}
                          component="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={suggestion.poster}
                              sx={{
                                width: 32,
                                height: 32,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              }}
                            >
                              <MovieIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={suggestion.title || suggestion.name}
                            secondary={suggestion.year || suggestion.type}
                            primaryTypographyProps={{
                              color: 'white',
                              fontSize: '0.9rem',
                            }}
                            secondaryTypographyProps={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '0.8rem',
                            }}
                          />
                        </ListItem>
                      ))}
                      {(recentSearches.length > 0 || trendingSearches.length > 0) && (
                        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      )}
                    </>
                  )}

                  {/* Recent Searches */}
                  {!query.trim() && recentSearches.length > 0 && (
                    <>
                      <ListItem sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                          RECENT SEARCHES
                        </Typography>
                      </ListItem>
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <ListItem
                          key={index}
                          component="button"
                          onClick={() => handleSuggestionClick(search)}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, background: 'rgba(255, 255, 255, 0.1)' }}>
                              <HistoryIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={search}
                            primaryTypographyProps={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.9rem',
                            }}
                          />
                        </ListItem>
                      ))}
                      {trendingSearches.length > 0 && (
                        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      )}
                    </>
                  )}

                  {/* Trending Searches */}
                  {!query.trim() && trendingSearches.length > 0 && (
                    <>
                      <ListItem sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                          TRENDING
                        </Typography>
                      </ListItem>
                      {trendingSearches.slice(0, 3).map((search, index) => (
                        <ListItem
                          key={index}
                          component="button"
                          onClick={() => handleSuggestionClick(search)}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, background: 'rgba(255, 87, 108, 0.2)' }}>
                              <TrendingIcon fontSize="small" sx={{ color: '#f5576c' }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={search}
                            primaryTypographyProps={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.9rem',
                            }}
                          />
                        </ListItem>
                      ))}
                    </>
                  )}

                  {/* No Results */}
                  {query.trim() && filteredSuggestions.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No results found"
                        secondary={`Try searching for "${query}" with different keywords`}
                        primaryTypographyProps={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                        }}
                        secondaryTypographyProps={{
                          color: 'rgba(255, 255, 255, 0.4)',
                          fontSize: '0.8rem',
                          textAlign: 'center',
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </SearchResultsPaper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;