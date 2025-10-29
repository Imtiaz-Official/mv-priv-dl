const express = require('express');
const router = express.Router();
const movieTracker = require('../services/movieTracker');
const { authenticate, requireAdmin } = require('../middleware/auth');

// @desc    Get tracker status
// @route   GET /api/tracker/status
// @access  Private/Admin
router.get('/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const status = movieTracker.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting tracker status',
      error: error.message
    });
  }
});

// @desc    Start scheduled tracking
// @route   POST /api/tracker/start
// @access  Private/Admin
router.post('/start', authenticate, requireAdmin, async (req, res) => {
  try {
    const { cronExpression } = req.body;
    const started = movieTracker.startScheduledTracking(cronExpression);
    
    if (started) {
      res.json({
        success: true,
        message: 'Scheduled tracking started successfully',
        cronExpression: cronExpression || '0 */6 * * *'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Scheduled tracking is already running'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting scheduled tracking',
      error: error.message
    });
  }
});

// @desc    Stop scheduled tracking
// @route   POST /api/tracker/stop
// @access  Private/Admin
router.post('/stop', authenticate, requireAdmin, async (req, res) => {
  try {
    const stopped = movieTracker.stopScheduledTracking();
    
    if (stopped) {
      res.json({
        success: true,
        message: 'Scheduled tracking stopped successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No scheduled tracking is currently running'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error stopping scheduled tracking',
      error: error.message
    });
  }
});

// @desc    Manually trigger movie tracking
// @route   POST /api/tracker/manual
// @access  Private/Admin
router.post('/manual', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await movieTracker.manualTrack();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Manual tracking completed successfully',
        data: {
          addedCount: result.addedCount,
          totalScraped: result.totalScraped
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Manual tracking failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during manual tracking',
      error: error.message
    });
  }
});

// @desc    Update tracker configuration
// @route   PUT /api/tracker/config
// @access  Private/Admin
router.put('/config', authenticate, requireAdmin, async (req, res) => {
  try {
    const { cronExpression, autoStart } = req.body;
    
    // Stop current tracking if running
    movieTracker.stopScheduledTracking();
    
    // Start with new configuration if autoStart is true
    if (autoStart && cronExpression) {
      const started = movieTracker.startScheduledTracking(cronExpression);
      if (started) {
        res.json({
          success: true,
          message: 'Tracker configuration updated and started',
          cronExpression
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to start tracker with new configuration'
        });
      }
    } else {
      res.json({
        success: true,
        message: 'Tracker configuration updated (not started)',
        cronExpression
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tracker configuration',
      error: error.message
    });
  }
});

// @desc    Get tracking history/logs
// @route   GET /api/tracker/history
// @access  Private/Admin
router.get('/history', authenticate, requireAdmin, async (req, res) => {
  try {
    const status = movieTracker.getStatus();
    
    // For now, return basic status info
    // In a production app, you might want to store tracking history in the database
    res.json({
      success: true,
      data: {
        lastCheck: status.lastCheck,
        trackedMoviesCount: status.trackedMoviesCount,
        isRunning: status.isRunning,
        isScheduled: status.isScheduled
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting tracking history',
      error: error.message
    });
  }
});

module.exports = router;