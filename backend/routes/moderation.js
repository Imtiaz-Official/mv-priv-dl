const express = require('express');
const { authenticate, requireModerator } = require('../middleware/auth');
const { Movie, Post, User } = require('../models');

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
    // Mock statistics - in a real app, you'd calculate these from your database
    const stats = {
      totalReports: 156,
      pendingReports: 23,
      underReviewReports: 12,
      resolvedReports: 121,
      highPriorityReports: 8,
      mediumPriorityReports: 15,
      lowPriorityReports: 133,
      reportsThisWeek: 18,
      reportsThisMonth: 67,
      averageResolutionTime: '2.5 hours',
      topReportReasons: [
        { reason: 'Spam content', count: 45 },
        { reason: 'Inappropriate content', count: 38 },
        { reason: 'Copyright violation', count: 28 },
        { reason: 'Suspicious behavior', count: 22 },
        { reason: 'Fake reviews', count: 15 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
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