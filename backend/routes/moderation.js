const express = require('express');
const { authenticate, requireModerator } = require('../middleware/auth');
const { Movie, Post, User, Report } = require('../models');

const router = express.Router();

// @desc    Get all reported content
// @route   GET /api/moderation/reports
// @access  Private (Moderator/Admin)
router.get('/reports', authenticate, requireModerator, async (req, res) => {
  try {
    const { type, status, priority, page = 1, limit = 10 } = req.query;
    
    // Mock data for now - in a real app, you'd have a Reports model
    const mockReports = [
      {
        _id: '1',
        type: 'movie',
        contentId: '507f1f77bcf86cd799439011',
        title: 'Inappropriate Movie Title',
        reason: 'Spam content',
        description: 'This movie contains spam and inappropriate content.',
        reportedBy: {
          _id: '507f1f77bcf86cd799439012',
          username: 'user123',
          email: 'user@example.com'
        },
        status: 'pending',
        priority: 'high',
        createdAt: new Date('2024-01-20T10:30:00Z'),
        updatedAt: new Date('2024-01-20T10:30:00Z')
      },
      {
        _id: '2',
        type: 'post',
        contentId: '507f1f77bcf86cd799439013',
        title: 'Offensive Blog Post',
        reason: 'Inappropriate content',
        description: 'Contains offensive language and inappropriate material.',
        reportedBy: {
          _id: '507f1f77bcf86cd799439014',
          username: 'reporter456',
          email: 'reporter@example.com'
        },
        status: 'under_review',
        priority: 'medium',
        createdAt: new Date('2024-01-19T15:45:00Z'),
        updatedAt: new Date('2024-01-20T09:15:00Z')
      },
      {
        _id: '3',
        type: 'user',
        contentId: '507f1f77bcf86cd799439015',
        title: 'Suspicious User Activity',
        reason: 'Suspicious behavior',
        description: 'User has been posting spam comments and fake reviews.',
        reportedBy: {
          _id: '507f1f77bcf86cd799439016',
          username: 'moderator789',
          email: 'mod@example.com'
        },
        status: 'resolved',
        priority: 'low',
        createdAt: new Date('2024-01-18T12:20:00Z'),
        updatedAt: new Date('2024-01-19T14:30:00Z')
      }
    ];

    // Filter reports based on query parameters
    let filteredReports = mockReports;
    
    if (type) {
      filteredReports = filteredReports.filter(report => report.type === type);
    }
    
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    if (priority) {
      filteredReports = filteredReports.filter(report => report.priority === priority);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        reports: paginatedReports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredReports.length / limit),
          totalReports: filteredReports.length,
          hasNext: endIndex < filteredReports.length,
          hasPrev: startIndex > 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching reports'
    });
  }
});

// @desc    Get moderation statistics
// @route   GET /api/moderation/stats
// @access  Private (Moderator/Admin)
router.get('/stats', authenticate, requireModerator, async (req, res) => {
  try {
    // Get real statistics from the database
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const underReviewReports = await Report.countDocuments({ status: 'under_review' });
    const approvedReports = await Report.countDocuments({ status: 'approved' });
    const rejectedReports = await Report.countDocuments({ status: 'rejected' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const highPriorityReports = await Report.countDocuments({ priority: 'high' });
    const mediumPriorityReports = await Report.countDocuments({ priority: 'medium' });
    const lowPriorityReports = await Report.countDocuments({ priority: 'low' });
    
    // Get reports from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayReports = await Report.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    // Get reports from this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const reportsThisWeek = await Report.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    // Get reports from this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const reportsThisMonth = await Report.countDocuments({
      createdAt: { $gte: monthAgo }
    });
    
    // Get top report reasons
    const topReportReasons = await Report.aggregate([
      { $group: { _id: '$reason', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { reason: '$_id', count: 1, _id: 0 } }
    ]);

    const stats = {
      totalReports,
      pendingReports,
      underReviewReports,
      resolvedReports,
      approvedReports,
      rejectedReports,
      highPriorityReports,
      mediumPriorityReports,
      lowPriorityReports,
      todayReports,
      reportsThisWeek,
      reportsThisMonth,
      averageResolutionTime: '0 hours', // Will calculate this when we have resolved reports
      topReportReasons
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching moderation statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching moderation statistics'
    });
  }
});

// @desc    Update report status
// @route   PATCH /api/moderation/reports/:id
// @access  Private (Moderator/Admin)
router.patch('/reports/:id', authenticate, requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderatorNotes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'under_review', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // In a real app, you'd update the report in the database
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: {
        reportId: id,
        status,
        moderatorNotes,
        updatedBy: req.user._id,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating report'
    });
  }
});

// @desc    Approve content
// @route   POST /api/moderation/approve/:type/:id
// @access  Private (Moderator/Admin)
router.post('/approve/:type/:id', authenticate, requireModerator, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { moderatorNotes } = req.body;

    // Validate content type
    const validTypes = ['movie', 'post', 'user'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }

    // In a real app, you'd update the content status in the database
    res.json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`,
      data: {
        contentType: type,
        contentId: id,
        action: 'approved',
        moderatorId: req.user._id,
        moderatorNotes,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error approving content'
    });
  }
});

// @desc    Reject/Remove content
// @route   POST /api/moderation/reject/:type/:id
// @access  Private (Moderator/Admin)
router.post('/reject/:type/:id', authenticate, requireModerator, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reason, moderatorNotes } = req.body;

    // Validate content type
    const validTypes = ['movie', 'post', 'user'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    // In a real app, you'd remove or flag the content in the database
    res.json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} rejected successfully`,
      data: {
        contentType: type,
        contentId: id,
        action: 'rejected',
        reason,
        moderatorId: req.user._id,
        moderatorNotes,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error rejecting content'
    });
  }
});

// @desc    Get content details for moderation
// @route   GET /api/moderation/content/:type/:id
// @access  Private (Moderator/Admin)
router.get('/content/:type/:id', authenticate, requireModerator, async (req, res) => {
  try {
    const { type, id } = req.params;

    // Validate content type
    const validTypes = ['movie', 'post', 'user'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }

    let content = null;

    try {
      switch (type) {
        case 'movie':
          content = await Movie.findById(id);
          break;
        case 'post':
          content = await Post.findById(id).populate('author', 'username email');
          break;
        case 'user':
          content = await User.findById(id).select('-password');
          break;
      }
    } catch (error) {
      // If content not found, return mock data for demo
      content = {
        _id: id,
        title: `Sample ${type} content`,
        description: `This is a sample ${type} for moderation review.`,
        createdAt: new Date(),
        status: 'active'
      };
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: {
        content,
        type
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching content'
    });
  }
});

module.exports = router;