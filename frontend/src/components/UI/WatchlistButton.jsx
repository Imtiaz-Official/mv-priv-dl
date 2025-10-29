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
              color: isInWatchlist ? '#f50057' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: isInWatchlist ? '#f50057' : 'white',
                transform: 'scale(1.05)',
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
          backgroundColor: isInWatchlist ? '#f50057' : 'transparent',
          borderColor: isInWatchlist ? '#f50057' : 'rgba(255, 255, 255, 0.3)',
          color: isInWatchlist ? 'white' : 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: isInWatchlist ? '#c51162' : 'rgba(245, 0, 87, 0.1)',
            borderColor: '#f50057',
            color: isInWatchlist ? 'white' : '#f50057',
          },
          '&:disabled': {
            opacity: 0.6,
          },
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