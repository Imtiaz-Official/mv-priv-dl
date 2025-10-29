import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Badge,
} from '@mui/material';
import {
  Person as PersonIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  GetApp as GetAppIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/placeholder-avatar.svg',
  joinDate: '2023-01-15',
  totalDownloads: 156,
  favoriteGenres: ['Action', 'Sci-Fi', 'Thriller'],
  downloadHistory: [
    {
      id: 1,
      movieId: 1,
      title: 'The Dark Knight',
      poster: '/placeholder-movie.svg',
      quality: '1080p',
      format: 'MP4',
      size: '2.1 GB',
      downloadDate: '2024-01-15',
      status: 'completed',
      progress: 100,
    },
    {
      id: 2,
      movieId: 2,
      title: 'Inception',
      poster: '/placeholder-movie.svg',
      quality: '720p',
      format: 'MKV',
      size: '1.8 GB',
      downloadDate: '2024-01-14',
      status: 'completed',
      progress: 100,
    },
    {
      id: 3,
      movieId: 3,
      title: 'Interstellar',
      poster: '/placeholder-movie.svg',
      quality: '4K',
      format: 'MP4',
      size: '8.2 GB',
      downloadDate: '2024-01-13',
      status: 'downloading',
      progress: 65,
    },
  ],
  recommendations: [
    {
      id: 4,
      title: 'Tenet',
      poster: '/placeholder-movie.svg',
      genre: 'Sci-Fi',
      rating: 7.3,
      reason: 'Based on your interest in Christopher Nolan films',
    },
    {
      id: 5,
      title: 'Mad Max: Fury Road',
      poster: '/placeholder-movie.svg',
      genre: 'Action',
      rating: 8.1,
      reason: 'Popular among Action movie fans',
    },
    {
      id: 6,
      title: 'Blade Runner 2049',
      poster: '/placeholder-movie.svg',
      genre: 'Sci-Fi',
      rating: 8.0,
      reason: 'Recommended for Sci-Fi enthusiasts',
    },
  ],
};

const Profile = () => {
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
  });
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user.name,
      email: user.email,
    });
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
    }));
    setEditDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'downloading':
        return 'primary';
      case 'paused':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={user.avatar}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h4" fontWeight="bold">
                {user.name}
              </Typography>
              <IconButton onClick={handleEditProfile} size="small">
                <EditIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2}>
              {user.email}
            </Typography>
            <Box display="flex" gap={3} mb={2}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {user.totalDownloads}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Downloads
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {user.downloadHistory.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recent Downloads
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {new Date(user.joinDate).getFullYear()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Member Since
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              {user.favoriteGenres.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
            },
          }}
        >
          <Tab
            icon={<HistoryIcon />}
            label="Download History"
            iconPosition="start"
          />
          <Tab
            icon={<StarIcon />}
            label="Recommendations"
            iconPosition="start"
          />
          <Tab
            icon={<SettingsIcon />}
            label="Settings"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Download History Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {user.downloadHistory.map((download) => (
            <Grid item xs={12} key={download.id}>
              <Card
                sx={{
                  display: 'flex',
                  p: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 120, borderRadius: 1 }}
                  image={download.poster}
                  alt={download.title}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, ml: 2 }}>
                  <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                    <Typography variant="h6" gutterBottom>
                      {download.title}
                    </Typography>
                    <Box display="flex" gap={2} mb={2}>
                      <Chip
                        label={download.quality}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={download.format}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={download.size}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={download.status}
                        size="small"
                        color={getStatusColor(download.status)}
                      />
                    </Box>
                    {download.status === 'downloading' && (
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">
                            Progress: {download.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={download.progress}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Downloaded on {new Date(download.downloadDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => navigate(`/movie/${download.movieId}`)}
                    >
                      View Details
                    </Button>
                    {download.status === 'completed' && (
                      <Button
                        size="small"
                        startIcon={<PlayIcon />}
                        color="primary"
                      >
                        Play
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Recommendations Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>
          Recommended for You
        </Typography>
        <Grid container spacing={3}>
          {user.recommendations.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.poster}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {movie.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <StarIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {movie.rating}/10
                    </Typography>
                    <Chip
                      label={movie.genre}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {movie.reason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Edit Profile"
                    secondary="Update your personal information"
                  />
                  <Button onClick={handleEditProfile}>Edit</Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Download Preferences"
                    secondary="Set default quality and format"
                  />
                  <Button>Configure</Button>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Privacy & Security
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Download History"
                    secondary="Keep track of downloaded movies"
                  />
                  <Button>Manage</Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Clear Data"
                    secondary="Remove all download history"
                  />
                  <Button color="error">Clear</Button>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;