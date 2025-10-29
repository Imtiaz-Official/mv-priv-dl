const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Movie, Post } = require('../models');
const { authenticate, requireAdmin, requireModerator } = require('../middleware/auth');
const { validatePagination, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all users with pagination and filtering
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', authenticate, requireAdmin, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Filter by active status
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    // Search by username or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { username: searchRegex },
        { email: searchRegex }
      ];
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'username':
        sort = { username: 1 };
        break;
      case 'lastLogin':
        sort = { lastLogin: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
router.get('/:id', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const favoriteMovies = await Movie.find({ _id: { $in: user.favorites } })
      .select('title poster slug')
      .limit(10);

    const watchlistMovies = await Movie.find({ _id: { $in: user.watchlist } })
      .select('title poster slug')
      .limit(10);

    const userPosts = await Post.countDocuments({ author: user._id });

    res.json({
      success: true,
      data: {
        user,
        statistics: {
          favoriteCount: user.favorites.length,
          watchlistCount: user.watchlist.length,
          postsCount: userPosts
        },
        favoriteMovies,
        watchlistMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Clean up user's posts (set author to null or delete)
    await Post.updateMany(
      { author: req.params.id },
      { author: null }
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Validate role
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, moderator, or admin'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating user'
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const { username, email, role } = req.body;

    // Validate role if provided
    if (role && !['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, moderator, or admin'
      });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString() && role && role !== req.user.role) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    // Check if username/email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// @desc    Toggle user active status
// @route   PATCH /api/users/:id/toggle
// @access  Private (Admin only)
router.patch('/:id/toggle', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling user status'
    });
  }
});

// @desc    Change user role
// @route   PATCH /api/users/:id/role
// @access  Private (Admin only)
router.patch('/:id/role', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (user, moderator, admin)'
      });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user role'
    });
  }
});

// @desc    Get user statistics (simple stats)
// @route   GET /api/users/stats
// @access  Private (Admin only for detailed stats)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const moderatorUsers = await User.countDocuments({ role: 'moderator' });
    const blockedUsers = await User.countDocuments({ isActive: false });
    
    // Calculate new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        adminUsers,
        moderatorUsers,
        blockedUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
});

// @desc    Get basic user statistics (public)
// @route   GET /api/users/stats/public
// @access  Public
router.get('/stats/public', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Calculate new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        adminUsers: 0, // Hidden for public
        moderatorUsers: 0, // Hidden for public
        blockedUsers: 0 // Hidden for public
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private (Moderator+)
router.get('/stats/overview', authenticate, requireModerator, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    const activeUsersByMonth = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$lastLogin' },
            month: { $month: '$lastLogin' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersByRole,
        recentUsers,
        activeUsersByMonth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Private (Moderator+)
router.get('/search', authenticate, requireModerator, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { email: searchRegex }
      ]
    })
      .select('username email role isActive avatar')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error searching users'
    });
  }
});

// @desc    Get user activity
// @route   GET /api/users/:id/activity
// @access  Private (Admin only)
router.get('/:id/activity', authenticate, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's posts
    const posts = await Post.find({ author: req.params.id })
      .select('title slug status createdAt views likes')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's favorite movies
    const favoriteMovies = await Movie.find({ _id: { $in: user.favorites } })
      .select('title poster slug releaseYear')
      .limit(10);

    // Get user's watchlist
    const watchlistMovies = await Movie.find({ _id: { $in: user.watchlist } })
      .select('title poster slug releaseYear')
      .limit(10);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        recentPosts: posts,
        favoriteMovies,
        watchlistMovies,
        statistics: {
          totalPosts: posts.length,
          totalFavorites: user.favorites.length,
          totalWatchlist: user.watchlist.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user activity'
    });
  }
});

module.exports = router;