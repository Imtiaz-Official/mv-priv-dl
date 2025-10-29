const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');
const { authenticate, requireModerator } = require('../middleware/auth');

// @desc    Get comprehensive analytics overview
// @route   GET /api/analytics/overview
// @access  Private (Moderator+)
router.get('/overview', authenticate, requireModerator, async (req, res) => {
  try {
    const overviewStats = await analyticsService.getOverviewStats();
    
    res.json({
      success: true,
      data: overviewStats
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics overview',
      error: error.message
    });
  }
});

// @desc    Get analytics trends
// @route   GET /api/analytics/trends
// @access  Private (Moderator+)
router.get('/trends', authenticate, requireModerator, async (req, res) => {
  try {
    const monthlyGrowth = await analyticsService.calculateMonthlyGrowth();
    
    res.json({
      success: true,
      data: {
        moviesGrowth: monthlyGrowth.movies,
        usersGrowth: monthlyGrowth.users,
        downloadsGrowth: monthlyGrowth.downloads,
        viewsGrowth: monthlyGrowth.views
      }
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics trends',
      error: error.message
    });
  }
});

// @desc    Get top movies analytics
// @route   GET /api/analytics/top-movies
// @access  Private (Moderator+)
router.get('/top-movies', authenticate, requireModerator, async (req, res) => {
  try {
    const topMovies = await analyticsService.getTopMovies();
    
    res.json({
      success: true,
      data: topMovies
    });
  } catch (error) {
    console.error('Top movies analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top movies analytics',
      error: error.message
    });
  }
});

// @desc    Get recent activity
// @route   GET /api/analytics/activity
// @access  Private (Moderator+)
router.get('/activity', authenticate, requireModerator, async (req, res) => {
  try {
    const recentActivity = await analyticsService.getRecentActivity();
    
    res.json({
      success: true,
      data: {
        recentActivity
      }
    });
  } catch (error) {
    console.error('Recent activity analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
});

// @desc    Get genre statistics
// @route   GET /api/analytics/genres
// @access  Private (Moderator+)
router.get('/genres', authenticate, requireModerator, async (req, res) => {
  try {
    const genreStats = await analyticsService.getGenreStats();
    
    res.json({
      success: true,
      data: {
        genreStats
      }
    });
  } catch (error) {
    console.error('Genre analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching genre statistics',
      error: error.message
    });
  }
});

// @desc    Get quality statistics
// @route   GET /api/analytics/quality
// @access  Private (Moderator+)
router.get('/quality', authenticate, requireModerator, async (req, res) => {
  try {
    const qualityStats = await analyticsService.getQualityStats();
    
    res.json({
      success: true,
      data: {
        qualityStats
      }
    });
  } catch (error) {
    console.error('Quality analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quality statistics',
      error: error.message
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/analytics/users
// @access  Private (Moderator+)
router.get('/users', authenticate, requireModerator, async (req, res) => {
  try {
    const userStats = await analyticsService.getUserStats();
    
    res.json({
      success: true,
      data: userStats
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
});

// @desc    Get comprehensive analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private (Moderator+)
router.get('/dashboard', authenticate, requireModerator, async (req, res) => {
  try {
    const [
      overview,
      trends,
      topMovies,
      recentActivity,
      genreStats,
      qualityStats
    ] = await Promise.all([
      analyticsService.getOverviewStats(),
      analyticsService.calculateMonthlyGrowth(),
      analyticsService.getTopMovies(),
      analyticsService.getRecentActivity(),
      analyticsService.getGenreStats(),
      analyticsService.getQualityStats()
    ]);

    res.json({
      success: true,
      data: {
        overview,
        trends,
        topMovies: topMovies.mostViewed.slice(0, 5), // Top 5 for dashboard
        recentActivity,
        genreStats,
        qualityStats
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
});

module.exports = router;