const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title poster slug')
      .populate('watchlist', 'title poster slug');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          favorites: user.favorites,
          watchlist: user.watchlist,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const userId = req.user._id;

    // Check if username or email is already taken by another user
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username ? 'Username already taken' : 'Email already registered'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatar && { avatar })
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @desc    Add movie to favorites
// @route   POST /api/auth/favorites/:movieId
// @access  Private
router.post('/favorites/:movieId', authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.favorites.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in favorites'
      });
    }

    user.favorites.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie added to favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding to favorites'
    });
  }
});

// @desc    Remove movie from favorites
// @route   DELETE /api/auth/favorites/:movieId
// @access  Private
router.delete('/favorites/:movieId', authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie removed from favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error removing from favorites'
    });
  }
});

// @desc    Add movie to watchlist
// @route   POST /api/auth/watchlist/:movieId
// @access  Private
router.post('/watchlist/:movieId', authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    user.watchlist.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie added to watchlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding to watchlist'
    });
  }
});

// @desc    Remove movie from watchlist
// @route   DELETE /api/auth/watchlist/:movieId
// @access  Private
router.delete('/watchlist/:movieId', authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie removed from watchlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error removing from watchlist'
    });
  }
});

module.exports = router;