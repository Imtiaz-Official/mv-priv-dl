import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  Alert,
  Tooltip,
  useTheme,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  Error as ErrorIcon,
  Schedule as QueueIcon,
  Refresh as RetryIcon,
  Clear as ClearIcon,
  GetApp as GetAppIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    minWidth: 600,
    maxWidth: 800,
    minHeight: 400,
    maxHeight: '80vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
  },
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  ...(status === 'downloading' && {
    backgroundColor: '#2196f3',
    color: 'white',
  }),
  ...(status === 'completed' && {
    backgroundColor: '#4caf50',
    color: 'white',
  }),
  ...(status === 'paused' && {
    backgroundColor: '#ff9800',
    color: 'white',
  }),
  ...(status === 'error' && {
    backgroundColor: '#f44336',
    color: 'white',
  }),
  ...(status === 'queued' && {
    backgroundColor: '#9e9e9e',
    color: 'white',
  }),
}));

const DownloadManager = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [downloads, setDownloads] = useState([]);
  const theme = useTheme();

  // Mock download data - replace with actual download state management
  useEffect(() => {
    const mockDownloads = [
      {
        id: 1,
        movieTitle: 'The Dark Knight',
        quality: '4K',
        format: 'MP4',
        size: '8.5 GB',
        progress: 75,
        speed: '2.5 MB/s',
        status: 'downloading',
        timeRemaining: '5m 32s',
        downloadUrl: 'https://example.com/download1',
        startTime: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: 2,
        movieTitle: 'Inception',
        quality: '1080p',
        format: 'MKV',
        size: '4.2 GB',
        progress: 100,
        speed: '0 MB/s',
        status: 'completed',
        timeRemaining: 'Complete',
        downloadUrl: 'https://example.com/download2',
        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
        completedTime: new Date(Date.now() - 60000), // 1 minute ago
      },
      {
        id: 3,
        movieTitle: 'Interstellar',
        quality: '720p',
        format: 'MP4',
        size: '2.1 GB',
        progress: 45,
        speed: '0 MB/s',
        status: 'paused',
        timeRemaining: 'Paused',
        downloadUrl: 'https://example.com/download3',
        startTime: new Date(Date.now() - 600000), // 10 minutes ago
      },
      {
        id: 4,
        movieTitle: 'Avatar',
        quality: '4K',
        format: 'MP4',
        size: '12.8 GB',
        progress: 0,
        speed: '0 MB/s',
        status: 'queued',
        timeRemaining: 'Queued',
        downloadUrl: 'https://example.com/download4',
        startTime: null,
      },
      {
        id: 5,
        movieTitle: 'Titanic',
        quality: '1080p',
        format: 'MKV',
        size: '6.4 GB',
        progress: 25,
        speed: '0 MB/s',
        status: 'error',
        timeRemaining: 'Failed',
        downloadUrl: 'https://example.com/download5',
        startTime: new Date(Date.now() - 900000), // 15 minutes ago
        error: 'Network connection lost',
      },
    ];
    setDownloads(mockDownloads);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFilteredDownloads = () => {
    switch (activeTab) {
      case 0: // All
        return downloads;
      case 1: // Active (downloading, paused, queued)
        return downloads.filter(d => ['downloading', 'paused', 'queued'].includes(d.status));
      case 2: // Completed
        return downloads.filter(d => d.status === 'completed');
      case 3: // Failed
        return downloads.filter(d => d.status === 'error');
      default:
        return downloads;
    }
  };

  const handleDownloadAction = (downloadId, action) => {
    setDownloads(prev => prev.map(download => {
      if (download.id === downloadId) {
        switch (action) {
          case 'pause':
            return { ...download, status: 'paused', speed: '0 MB/s', timeRemaining: 'Paused' };
          case 'resume':
            return { ...download, status: 'downloading', speed: '2.1 MB/s', timeRemaining: '8m 15s' };
          case 'stop':
            return { ...download, status: 'queued', progress: 0, speed: '0 MB/s', timeRemaining: 'Queued' };
          case 'retry':
            return { ...download, status: 'downloading', speed: '1.8 MB/s', timeRemaining: '12m 45s', error: null };
          case 'remove':
            return null; // Will be filtered out
          default:
            return download;
        }
      }
      return download;
    }).filter(Boolean));
  };

  const clearCompleted = () => {
    setDownloads(prev => prev.filter(d => d.status !== 'completed'));
  };

  const clearFailed = () => {
    setDownloads(prev => prev.filter(d => d.status !== 'error'));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'downloading':
        return <DownloadIcon sx={{ color: '#2196f3' }} />;
      case 'completed':
        return <CompleteIcon sx={{ color: '#4caf50' }} />;
      case 'paused':
        return <PauseIcon sx={{ color: '#ff9800' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'queued':
        return <QueueIcon sx={{ color: '#9e9e9e' }} />;
      default:
        return <DownloadIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredDownloads = getFilteredDownloads();

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GetAppIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            Download Manager
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 0 }}>
        <Box sx={{ px: 3, mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
              },
            }}
          >
            <Tab label={`All (${downloads.length})`} />
            <Tab label={`Active (${downloads.filter(d => ['downloading', 'paused', 'queued'].includes(d.status)).length})`} />
            <Tab label={`Completed (${downloads.filter(d => d.status === 'completed').length})`} />
            <Tab label={`Failed (${downloads.filter(d => d.status === 'error').length})`} />
          </Tabs>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {filteredDownloads.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              No downloads found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {activeTab === 1 && 'No active downloads at the moment'}
              {activeTab === 2 && 'No completed downloads yet'}
              {activeTab === 3 && 'No failed downloads'}
              {activeTab === 0 && 'Start downloading movies to see them here'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 1 }}>
            {filteredDownloads.map((download, index) => (
              <Fade in timeout={300 + index * 100} key={download.id}>
                <ListItem
                  sx={{
                    mb: 1,
                    mx: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getStatusIcon(download.status)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {download.movieTitle}
                          </Typography>
                          <StatusChip
                            label={download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                            size="small"
                            status={download.status}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {download.quality} • {download.format} • {download.size}
                          {download.startTime && ` • Started: ${formatTime(download.startTime)}`}
                          {download.error && (
                            <Box component="span" sx={{ color: '#f44336', ml: 1 }}>
                              • Error: {download.error}
                            </Box>
                          )}
                        </Typography>
                      }
                    />

                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {download.status === 'downloading' && (
                          <Tooltip title="Pause">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadAction(download.id, 'pause')}
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              <PauseIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {download.status === 'paused' && (
                          <Tooltip title="Resume">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadAction(download.id, 'resume')}
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              <ResumeIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {download.status === 'error' && (
                          <Tooltip title="Retry">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadAction(download.id, 'retry')}
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              <RetryIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {download.status === 'completed' && (
                          <Tooltip title="Open Folder">
                            <IconButton
                              size="small"
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              <FolderIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {['downloading', 'paused', 'queued'].includes(download.status) && (
                          <Tooltip title="Stop">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadAction(download.id, 'stop')}
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              <StopIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Remove">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadAction(download.id, 'remove')}
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </Box>

                  {/* Progress Bar */}
                  {download.status !== 'completed' && download.status !== 'error' && (
                    <ProgressContainer>
                      <LinearProgress
                        variant="determinate"
                        value={download.progress}
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: download.status === 'paused' ? '#ff9800' : '#2196f3',
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ minWidth: 45, textAlign: 'right' }}>
                        {download.progress}%
                      </Typography>
                    </ProgressContainer>
                  )}

                  {/* Download Stats */}
                  {download.status === 'downloading' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Speed: {download.speed}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Time remaining: {download.timeRemaining}
                      </Typography>
                    </Box>
                  )}
                </ListItem>
              </Fade>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          {activeTab === 2 && filteredDownloads.length > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={clearCompleted}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Clear Completed
            </Button>
          )}
          {activeTab === 3 && filteredDownloads.length > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={clearFailed}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Clear Failed
            </Button>
          )}
        </Box>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DownloadManager;