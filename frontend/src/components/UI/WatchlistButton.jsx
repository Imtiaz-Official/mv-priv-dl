import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  ...(variant === 'icon' && {
    minWidth: 'auto',
    width: 48,
    height: 48,
    borderRadius: '50%',
  }),
}));

const WatchlistButton = ({ 
  movieId, 
  variant = 'button', // 'button' or 'icon'
  size = 'medium',
  showText = true,
  onWatchlistChange,
  sx = {},
}) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Check if movie is in watchlist on component mount
  useEffect(() => {
    checkWatchlistStatus();
  }, [movieId]);

  const checkWatchlistStatus = async () => {
    try {
      // For now, check localStorage (later replace with API call)
      const watchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
      setIsInWatchlist(watchlist.includes(movieId));
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // For now, use localStorage (later replace with API call)
      const watchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
      
      let updatedWatchlist;
      let message;
      let severity = 'success';

      if (isInWatchlist) {
        // Remove from watchlist
        updatedWatchlist = watchlist.filter(id => id !== movieId);
        message = 'Removed from watchlist';
        setIsInWatchlist(false);
      } else {
        // Add to watchlist
        updatedWatchlist = [...watchlist, movieId];
        message = 'Added to watchlist';
        setIsInWatchlist(true);
      }

      localStorage.setItem('movieWatchlist', JSON.stringify(updatedWatchlist));
      
      // Call parent callback if provided
      if (onWatchlistChange) {
        onWatchlistChange(movieId, !isInWatchlist);
      }

      setSnackbar({ open: true, message, severity });

      // TODO: Replace with actual API call
      // const response = await fetch('/api/watchlist', {
      //   method: isInWatchlist ? 'DELETE' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ movieId }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update watchlist');
      // }

    } catch (error) {
      console.error('Error updating watchlist:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update watchlist. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}>
          <IconButton
            onClick={toggleWatchlist}
            disabled={loading}
            sx={{
              color: isInWatchlist ? '#f50057' : 'rgba(255, 255, 255, 0.8)',
              backgroundColor: isInWatchlist ? 'rgba(245, 0, 87, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isInWatchlist ? 'rgba(245, 0, 87, 0.3)' : 'rgba(255, 255, 255, 0.15)'}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isInWatchlist ? 'rgba(245, 0, 87, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                color: isInWatchlist ? '#f50057' : 'white',
                transform: 'translateY(-1px) scale(1.02)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderColor: isInWatchlist ? 'rgba(245, 0, 87, 0.5)' : 'rgba(255, 255, 255, 0.3)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: 'inherit' }} />
            ) : isInWatchlist ? (
              <BookmarkIcon />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
        </Tooltip>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <StyledButton
        variant={isInWatchlist ? 'contained' : 'outlined'}
        size={size}
        onClick={toggleWatchlist}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} sx={{ color: 'inherit' }} />
          ) : isInWatchlist ? (
            <CheckIcon />
          ) : (
            <AddIcon />
          )
        }
        sx={{
          backgroundColor: isInWatchlist ? 'linear-gradient(135deg, #f50057 0%, #c51162 100%)' : 'transparent',
          borderColor: isInWatchlist ? '#f50057' : 'rgba(255, 255, 255, 0.25)',
          color: isInWatchlist ? 'white' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: isInWatchlist ? '0 2px 8px rgba(245, 0, 87, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: isInWatchlist ? 'linear-gradient(135deg, #c51162 0%, #ad1457 100%)' : 'rgba(245, 0, 87, 0.08)',
            borderColor: '#f50057',
            color: isInWatchlist ? 'white' : '#f50057',
            boxShadow: isInWatchlist ? '0 4px 12px rgba(245, 0, 87, 0.35)' : '0 4px 12px rgba(245, 0, 87, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            opacity: 0.6,
          },
          transition: 'all 0.2s ease',
          ...sx, // Merge custom sx props
        }}
      >
        {showText && (isInWatchlist ? 'In Watchlist' : 'Add to Watchlist')}
      </StyledButton>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WatchlistButton;