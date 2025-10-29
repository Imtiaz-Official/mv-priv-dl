import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const MetricCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  height: '100%',
}));

const TrendIndicator = ({ value, isPositive }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {isPositive ? (
      <TrendingUpIcon sx={{ color: '#4ade80', fontSize: 16 }} />
    ) : (
      <TrendingDownIcon sx={{ color: '#f87171', fontSize: 16 }} />
    )}
    <Typography
      variant="caption"
      sx={{
        color: isPositive ? '#4ade80' : '#f87171',
        fontWeight: 600,
      }}
    >
      {Math.abs(value)}%
    </Typography>
  </Box>
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalMovies: 0,
      totalUsers: 0,
      totalDownloads: 0,
      totalViews: 0,
      monthlyGrowth: 0,
      activeUsers: 0,
    },
    trends: {
      moviesGrowth: 0,
      usersGrowth: 0,
      downloadsGrowth: 0,
      viewsGrowth: 0,
    },
    topMovies: [],
    recentActivity: [],
    genreStats: [],
    qualityStats: [],
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch analytics data from the new comprehensive analytics endpoint
      const response = await fetch('http://localhost:5000/api/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const analyticsData = data.data;
          
          setAnalytics({
            overview: {
              totalMovies: analyticsData.totalMovies || 0,
              totalUsers: analyticsData.totalUsers || 0,
              totalDownloads: analyticsData.totalDownloads || 0,
              totalViews: analyticsData.totalViews || 0,
              monthlyGrowth: analyticsData.monthlyGrowth?.users || 0,
              activeUsers: analyticsData.activeUsers || 0,
            },
            trends: {
              moviesGrowth: analyticsData.monthlyGrowth?.movies || 0,
              usersGrowth: analyticsData.monthlyGrowth?.users || 0,
              downloadsGrowth: analyticsData.monthlyGrowth?.downloads || 0,
              viewsGrowth: analyticsData.monthlyGrowth?.views || 0,
            },
            topMovies: analyticsData.topMovies?.byDownloads || [],
            recentActivity: analyticsData.recentActivity || [],
            genreStats: analyticsData.genreStats || [],
            qualityStats: analyticsData.qualityStats || [],
          });
          return;
        }
      }

      // Fallback: Try individual endpoints if dashboard endpoint fails
      const [overviewRes, trendsRes, topMoviesRes, activityRes] = await Promise.all([
        fetch('http://localhost:5000/api/analytics/overview', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/analytics/trends', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/analytics/top-movies', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/analytics/activity', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const overview = overviewRes.ok ? await overviewRes.json() : null;
      const trends = trendsRes.ok ? await trendsRes.json() : null;
      const topMovies = topMoviesRes.ok ? await topMoviesRes.json() : null;
      const activity = activityRes.ok ? await activityRes.json() : null;

      if (overview?.success || trends?.success || topMovies?.success || activity?.success) {
        setAnalytics({
          overview: overview?.data || {
            totalMovies: 0,
            totalUsers: 0,
            totalDownloads: 0,
            totalViews: 0,
            monthlyGrowth: 0,
            activeUsers: 0,
          },
          trends: trends?.data || {
            moviesGrowth: 0,
            usersGrowth: 0,
            downloadsGrowth: 0,
            viewsGrowth: 0,
          },
          topMovies: topMovies?.data || [],
          recentActivity: activity?.data || [],
          genreStats: [],
          qualityStats: [],
        });
        return;
      }

      throw new Error('All API endpoints failed');

    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set empty data instead of mock data to show real state
      setAnalytics({
        overview: {
          totalMovies: 0,
          totalUsers: 0,
          totalDownloads: 0,
          totalViews: 0,
          monthlyGrowth: 0,
          activeUsers: 0,
        },
        trends: {
          moviesGrowth: 0,
          usersGrowth: 0,
          downloadsGrowth: 0,
          viewsGrowth: 0,
        },
        topMovies: [],
        recentActivity: [],
        genreStats: [],
        qualityStats: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'movie_added': return <MovieIcon sx={{ color: '#667eea' }} />;
      case 'user_registered': return <PeopleIcon sx={{ color: '#4ade80' }} />;
      case 'movie_downloaded': return <DownloadIcon sx={{ color: '#f59e0b' }} />;
      case 'post_published': return <AssessmentIcon sx={{ color: '#8b5cf6' }} />;
      case 'movie_rated': return <StarIcon sx={{ color: '#fbbf24' }} />;
      default: return <PlayIcon sx={{ color: '#6b7280' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Loading Analytics...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <MovieIcon sx={{ color: '#667eea', fontSize: 32 }} />
                <TrendIndicator value={analytics.trends.moviesGrowth} isPositive={analytics.trends.moviesGrowth > 0} />
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {analytics.overview.totalMovies.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Movies
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <PeopleIcon sx={{ color: '#4ade80', fontSize: 32 }} />
                <TrendIndicator value={analytics.trends.usersGrowth} isPositive={analytics.trends.usersGrowth > 0} />
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {analytics.overview.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Users
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <DownloadIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                <TrendIndicator value={analytics.trends.downloadsGrowth} isPositive={analytics.trends.downloadsGrowth > 0} />
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {analytics.overview.totalDownloads.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Downloads
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <VisibilityIcon sx={{ color: '#8b5cf6', fontSize: 32 }} />
                <TrendIndicator value={analytics.trends.viewsGrowth} isPositive={analytics.trends.viewsGrowth > 0} />
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {(analytics.overview.totalViews / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Views
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Movies */}
        <Grid item xs={12} md={6}>
          <StatsCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                Top Performing Movies
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Movie</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Downloads</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', border: 'none' }}>Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.topMovies.map((movie, index) => (
                      <TableRow key={movie.id}>
                        <TableCell sx={{ color: 'white', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                minWidth: 24,
                                height: 24,
                                fontSize: '0.75rem',
                                background: index < 3 ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
                              }}
                            />
                            {movie.title}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
                          {movie.downloads.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
                            {movie.rating}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <StatsCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                Recent Activity
              </Typography>
              <List sx={{ p: 0 }}>
                {analytics.recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ background: 'rgba(255, 255, 255, 0.1)', width: 32, height: 32 }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {activity.time} • {activity.user}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < analytics.recentActivity.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Genre Distribution */}
        <Grid item xs={12} md={6}>
          <StatsCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                Genre Distribution
              </Typography>
              {analytics.genreStats.map((genre) => (
                <Box key={genre.genre} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {genre.genre}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {genre.count} ({genre.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={genre.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Quality Distribution */}
        <Grid item xs={12} md={6}>
          <StatsCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                Quality Distribution
              </Typography>
              {analytics.qualityStats.map((quality) => (
                <Box key={quality.quality} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {quality.quality}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {quality.count} ({quality.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={quality.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;