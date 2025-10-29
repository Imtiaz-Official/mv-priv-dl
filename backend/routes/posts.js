const express = require('express');
const { Post } = require('../models');
const { authenticate, requireModerator, optionalAuth } = require('../middleware/auth');
const { validatePost, validateComment, validatePagination, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all posts with pagination and filtering
// @route   GET /api/posts
// @access  Public
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'published' };

    // Search by title or content
    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by tag
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'newest':
        sort = { publishedAt: -1 };
        break;
      case 'oldest':
        sort = { publishedAt: 1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      case 'likes':
        sort = { likes: -1 };
        break;
      default:
        sort = { publishedAt: -1 };
    }

    // Execute query
    const posts = await Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar')
      .populate('relatedMovies', 'title poster slug')
      .select('-content -comments');

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
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
      message: 'Server error fetching posts'
    });
  }
});

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const posts = await Post.find({
      status: 'published',
      featured: true
    })
      .sort({ publishedAt: -1 })
      .limit(5)
      .populate('author', 'username avatar')
      .select('-content -comments');

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured posts'
    });
  }
});

// @desc    Get latest posts
// @route   GET /api/posts/latest
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const posts = await Post.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('author', 'username avatar')
      .select('-content -comments');

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching latest posts'
    });
  }
});

// @desc    Get post categories
// @route   GET /api/posts/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
});

// @desc    Get popular tags
// @route   GET /api/posts/tags
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: { tags }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching tags'
    });
  }
});

// @desc    Get post by ID or slug
// @route   GET /api/posts/:identifier
// @access  Public
router.get('/:identifier', optionalAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    
    const post = await Post.findOne({
      ...query,
      status: 'published'
    })
      .populate('author', 'username avatar')
      .populate('relatedMovies', 'title poster slug rating')
      .populate('comments.user', 'username avatar')
      .populate('comments.replies.user', 'username avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    await post.incrementViews();

    // Get related posts (same category)
    const relatedPosts = await Post.find({
      _id: { $ne: post._id },
      category: post.category,
      status: 'published'
    })
      .limit(4)
      .select('title excerpt featuredImage slug publishedAt')
      .populate('author', 'username')
      .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: {
        post,
        relatedPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching post'
    });
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Moderator+)
router.post('/', authenticate, requireModerator, validatePost, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id
    };

    const post = await Post.create(postData);
    await post.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating post'
    });
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Moderator+)
router.put('/:id', authenticate, requireModerator, validateObjectId('id'), validatePost, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating post'
    });
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Moderator+)
router.delete('/:id', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting post'
    });
  }
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', authenticate, validateObjectId('id'), validateComment, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.addComment(req.user._id, content);
    await post.populate('comments.user', 'username avatar');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding comment'
    });
  }
});

// @desc    Like post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', authenticate, validateObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.likePost();

    res.json({
      success: true,
      message: 'Post liked successfully',
      data: { likes: post.likes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error liking post'
    });
  }
});

// @desc    Toggle post featured status
// @route   PATCH /api/posts/:id/featured
// @access  Private (Moderator+)
router.patch('/:id/featured', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.featured = !post.featured;
    await post.save();

    res.json({
      success: true,
      message: `Post ${post.featured ? 'added to' : 'removed from'} featured`,
      data: { featured: post.featured }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating featured status'
    });
  }
});

// @desc    Get post statistics
// @route   GET /api/posts/stats/overview
// @access  Private (Moderator+)
router.get('/stats/overview', authenticate, requireModerator, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments({ status: 'published' });
    const featuredPosts = await Post.countDocuments({ status: 'published', featured: true });
    const draftPosts = await Post.countDocuments({ status: 'draft' });
    
    const postsByCategory = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const mostViewedPosts = await Post.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views slug publishedAt')
      .populate('author', 'username');

    const mostLikedPosts = await Post.find({ status: 'published' })
      .sort({ likes: -1 })
      .limit(5)
      .select('title likes slug publishedAt')
      .populate('author', 'username');

    res.json({
      success: true,
      data: {
        totalPosts,
        featuredPosts,
        draftPosts,
        postsByCategory,
        mostViewedPosts,
        mostLikedPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching post statistics'
    });
  }
});

module.exports = router;