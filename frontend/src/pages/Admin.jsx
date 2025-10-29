import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  Snackbar,
  Alert,
  LinearProgress,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
  styled,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Analytics as AnalyticsIcon,
  VideoLibrary as VideoLibraryIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Gavel as ModerationIcon,
  Download as DownloadIcon,
  Tv as TvIcon,
  Animation as AnimeIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewsIcon,
} from '@mui/icons-material';

// Import the new admin components
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard';
import UserManagement from '../components/Admin/UserManagement';
import MovieManagement from '../components/Admin/MovieManagement';
import ContentModeration from '../components/Admin/ContentModeration';
import DownloadManagement from '../components/Admin/DownloadManagement';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trackerStatus, setTrackerStatus] = useState({
    isRunning: false,
    lastRun: null,
    nextRun: null,
    moviesProcessed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Platform statistics
  const [platformStats, setPlatformStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalPosts: 0,
    totalTvShows: 0,
    totalAnime: 0,
    totalViews: 0,
    activeUsers: 0,
    monthlyGrowth: 0,
  });

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
    { text: 'Analytics', icon: <AnalyticsIcon />, index: 1 },
    { text: 'Movies', icon: <VideoLibraryIcon />, index: 2 },
    { text: 'Users', icon: <SupervisorAccountIcon />, index: 3 },
    { text: 'Content Moderation', icon: <ModerationIcon />, index: 4 },
    { text: 'Downloads', icon: <DownloadIcon />, index: 5 },
    { text: 'Blog Posts', icon: <ArticleIcon />, index: 6 },
    { text: 'Movie Tracker', icon: <AssessmentIcon />, index: 7 },
    { text: 'Settings', icon: <SettingsIcon />, index: 8 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const calculatePlatformStats = useCallback(async () => {
    try {
      // Fetch real analytics data from the new analytics endpoint
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const analytics = data.data;
          setPlatformStats({
            totalMovies: analytics.totalMovies || 0,
            totalUsers: analytics.totalUsers || 0,
            totalDownloads: analytics.totalDownloads || 0,
            totalPosts: analytics.totalPosts || 0,
            totalTvShows: analytics.moviesByType?.tv || 0,
            totalAnime: analytics.moviesByType?.anime || 0,
            activeUsers: analytics.activeUsers || 0,
            totalViews: analytics.totalViews || 0,
            monthlyGrowth: analytics.monthlyGrowth?.users || 0,
          });
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }

    // Fallback to calculating from existing data if analytics endpoint fails
    const activeUsers = users.filter(user => 
      user.status === 'active' && 
      new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    const moviesByType = movies.reduce((acc, movie) => {
      const type = movie.type || 'movie';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    setPlatformStats({
      totalMovies: movies.length,
      totalUsers: users.length,
      totalDownloads: movies.reduce((sum, movie) => sum + (movie.downloads || 0), 0),
      totalPosts: posts.length,
      totalTvShows: moviesByType.tv || 0,
      totalAnime: moviesByType.anime || 0,
      activeUsers,
      totalViews: movies.reduce((sum, movie) => sum + (movie.views || 0), 0),
      monthlyGrowth: 0, // No growth calculation without historical data
    });
  }, [movies, users, posts]);

  useEffect(() => {
    // Only calculate stats if we have data
    if (movies.length > 0 || users.length > 0) {
      calculatePlatformStats();
    }
  }, [calculatePlatformStats]);

  // Add separate effect to recalculate when posts change
  useEffect(() => {
    if (posts.length > 0) {
      calculatePlatformStats();
    }
  }, [posts, calculatePlatformStats]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchMovies(),
        fetchUsers(),
        fetchPosts(),
        fetchTrackerStatus(),
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/movies?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMovies(data.data.movies || []);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/posts?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPosts(data.data.posts || []);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const fetchTrackerStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tracker/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTrackerStatus(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching tracker status:', error);
    }
  };

  const handleTrackerAction = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tracker/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSnackbar({
            open: true,
            message: `Tracker ${action} successful`,
            severity: 'success'
          });
          await fetchTrackerStatus();
        }
      } else {
        throw new Error(`Failed to ${action} tracker`);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Loading Admin Panel...
          </Typography>
          <LinearProgress sx={{ width: 300 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
    }}>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Welcome, Admin
          </Typography>
        </Toolbar>
      </StyledAppBar>

      {/* Navigation Drawer */}
      <StyledDrawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ color: 'white', flexGrow: 1, ml: 2 }}>
            MovieVault Admin
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleTabChange(item.index)}
              sx={{
                color: activeTab === item.index ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: activeTab === item.index ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>

      {/* Main Content */}
      <Main open={drawerOpen}>
        <DrawerHeader />
        
        {/* Dashboard Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 600 }}>
            Dashboard Overview
          </Typography>
          
          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Platform Statistics Row */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Platform Statistics
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MovieIcon sx={{ color: '#667eea', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {platformStats.totalMovies}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Movies
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TvIcon sx={{ color: '#4ade80', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {platformStats.totalTvShows}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    TV Shows
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AnimeIcon sx={{ color: '#f59e0b', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {platformStats.totalAnime}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Anime
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ViewsIcon sx={{ color: '#8b5cf6', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {platformStats.totalViews.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Views
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ color: '#06d6a0', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    +{platformStats.monthlyGrowth}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Monthly Growth
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>

            {/* Admin Statistics Row */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Admin Statistics
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PeopleIcon sx={{ color: '#4ade80', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {users.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Users
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SupervisorAccountIcon sx={{ color: '#667eea', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {platformStats.activeUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Active Users
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ArticleIcon sx={{ color: '#f59e0b', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {posts.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Blog Posts
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssessmentIcon sx={{ color: '#8b5cf6', fontSize: 48, mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {trackerStatus.moviesProcessed || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Movies Processed
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Recent Movies
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Title</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Year</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {movies.slice(0, 5).map((movie) => (
                          <TableRow key={movie._id}>
                            <TableCell sx={{ color: 'white', border: 'none' }}>
                              {movie.title}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
                              {movie.year}
                            </TableCell>
                            <TableCell sx={{ border: 'none' }}>
                              <Chip
                                label={movie.isActive ? 'Active' : 'Hidden'}
                                size="small"
                                color={movie.isActive ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Recent Users
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>User</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Role</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.slice(0, 5).map((user) => (
                          <TableRow key={user._id}>
                            <TableCell sx={{ color: 'white', border: 'none' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24 }}>
                                  {user.username?.charAt(0).toUpperCase()}
                                </Avatar>
                                {user.username}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
                              {user.role}
                            </TableCell>
                            <TableCell sx={{ border: 'none' }}>
                              <Chip
                                label={user.isActive ? 'Active' : 'Blocked'}
                                size="small"
                                color={user.isActive ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={1}>
          <AnalyticsDashboard />
        </TabPanel>

        {/* Movies Tab */}
        <TabPanel value={activeTab} index={2}>
          <MovieManagement />
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={activeTab} index={3}>
          <UserManagement />
        </TabPanel>

        {/* Content Moderation Tab */}
        <TabPanel value={activeTab} index={4}>
          <ContentModeration />
        </TabPanel>

        {/* Downloads Tab */}
        <TabPanel value={activeTab} index={5}>
          <DownloadManagement />
        </TabPanel>

        {/* Blog Posts Tab */}
        <TabPanel value={activeTab} index={6}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 600 }}>
            Blog Posts Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Blog posts management functionality will be implemented here.
          </Typography>
        </TabPanel>

        {/* Movie Tracker Tab */}
        <TabPanel value={activeTab} index={7}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 600 }}>
            Movie Tracker
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Tracker Status
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={trackerStatus.isRunning ? 'Running' : 'Stopped'}
                      color={trackerStatus.isRunning ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Last Run: {trackerStatus.lastRun ? new Date(trackerStatus.lastRun).toLocaleString() : 'Never'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                    Movies Processed: {trackerStatus.moviesProcessed || 0}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleTrackerAction('start')}
                      disabled={trackerStatus.isRunning}
                      sx={{ 
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                      }}
                    >
                      Start
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<StopIcon />}
                      onClick={() => handleTrackerAction('stop')}
                      disabled={!trackerStatus.isRunning}
                      sx={{ 
                        background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
                      }}
                    >
                      Stop
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={() => handleTrackerAction('manual')}
                      sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          background: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      Manual Run
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={activeTab} index={8}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 600 }}>
            Settings
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            System settings and configuration options will be implemented here.
          </Typography>
        </TabPanel>
      </Main>

      {/* Snackbar for notifications */}
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
    </Box>
  );
};

export default Admin;