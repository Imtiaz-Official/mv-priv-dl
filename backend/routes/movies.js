const express = require('express');
const { Movie } = require('../models');
const { authenticate, requireModerator, optionalAuth } = require('../middleware/auth');
const { validateMovie, validatePagination, validateSearch, validateObjectId, sanitizeInput } = require('../middleware/validation');
const { trackMovieView } = require('../middleware/viewTracker');
const imageService = require('../services/imageService');

const router = express.Router();

// @desc    Get all movies with pagination and filtering
// @route   GET /api/movies
// @access  Public
router.get('/', validatePagination, validateSearch, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'published', isActive: true };

    // Search by title or description
    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    // Filter by genre
    if (req.query.genre) {
      filter.genres = { $in: [req.query.genre] };
    }

    // Filter by year
    if (req.query.year) {
      filter.releaseYear = parseInt(req.query.year);
    }

    // Filter by quality
    if (req.query.quality) {
      filter.quality = { $in: [req.query.quality] };
    }

    // Filter by language
    if (req.query.language) {
      filter.languages = { $in: [req.query.language] };
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
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      case 'title':
        sort = { title: 1 };
        break;
      case 'year':
        sort = { releaseYear: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query
    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .select('-__v');

    // Get total count for pagination
    const total = await Movie.countDocuments(filter);

    res.json({
      success: true,
      data: {
        movies,
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
      message: 'Server error fetching movies'
    });
  }
});

// @desc    Get featured movies
// @route   GET /api/movies/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const movies = await Movie.find({
      status: 'published',
      isActive: true,
      featured: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'username')
      .select('-__v');

    res.json({
      success: true,
      data: { movies }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured movies'
    });
  }
});

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const movies = await Movie.find({
      status: 'published',
      isActive: true,
      trending: true
    })
      .sort({ views: -1 })
      .limit(10)
      .populate('createdBy', 'username')
      .select('-__v');

    res.json({
      success: true,
      data: { movies }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching trending movies'
    });
  }
});

// @desc    Get latest movies
// @route   GET /api/movies/latest
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;

    const movies = await Movie.find({ status: 'published', isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('createdBy', 'username')
      .select('-__v');

    res.json({
      success: true,
      data: { movies }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching latest movies'
    });
  }
});

// @desc    Get platform statistics (public)
// @route   GET /api/movies/platform-stats
// @access  Public
router.get('/platform-stats', async (req, res) => {
  try {
    // Get platform statistics
    const totalMovies = await Movie.countDocuments({ status: 'published', isActive: true });
    const totalTvShows = await Movie.countDocuments({ 
      status: 'published', 
      isActive: true,
      type: { $in: ['tv', 'series'] } 
    });
    const totalAnime = await Movie.countDocuments({ 
      status: 'published', 
      isActive: true,
      genre: { $in: ['Animation', 'Anime'] } 
    });

    // Format numbers with K+ suffix for large numbers
    const formatCount = (count) => {
      if (count >= 1000) {
        return Math.floor(count / 1000) + 'K+';
      }
      return count.toString();
    };

    res.json({
      success: true,
      data: {
        totalMovies: formatCount(totalMovies),
        totalTvShows: formatCount(totalTvShows),
        totalAnime: formatCount(totalAnime),
        rawCounts: {
          totalMovies,
          totalTvShows,
          totalAnime
        }
      }
    });
  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching platform statistics'
    });
  }
});

// @desc    Get movie statistics (simple stats)
// @route   GET /api/movies/stats
// @access  Private (Moderator+)
router.get('/stats', authenticate, requireModerator, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ status: 'published', isActive: true });
    const featuredMovies = await Movie.countDocuments({ status: 'published', isActive: true, featured: true });
    const trendingMovies = await Movie.countDocuments({ status: 'published', isActive: true, trending: true });
    const draftMovies = await Movie.countDocuments({ status: 'draft' });

    res.json({
      success: true,
      data: {
        totalMovies,
        featuredMovies,
        trendingMovies,
        draftMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie statistics'
    });
  }
});

// @desc    Get movie statistics
// @route   GET /api/movies/stats/overview
// @access  Private (Moderator+)
router.get('/stats/overview', authenticate, requireModerator, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ status: 'published', isActive: true });
    const featuredMovies = await Movie.countDocuments({ status: 'published', isActive: true, featured: true });
    const trendingMovies = await Movie.countDocuments({ status: 'published', isActive: true, trending: true });
    
    const topGenres = await Movie.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topRatedMovies = await Movie.find({ status: 'published', isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(5)
      .select('title rating poster slug');

    const mostViewedMovies = await Movie.find({ status: 'published', isActive: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title views poster slug');

    res.json({
      success: true,
      data: {
        totalMovies,
        featuredMovies,
        trendingMovies,
        topGenres,
        topRatedMovies,
        mostViewedMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie statistics'
    });
  }
});

// @desc    Get movie trends
// @route   GET /api/movies/stats/trends
// @access  Private (Moderator+)
router.get('/stats/trends', authenticate, requireModerator, async (req, res) => {
  try {
    // Get movies from last 30 days for trend calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMovies = await Movie.countDocuments({
      status: 'published',
      isActive: true,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const totalViews = await Movie.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const avgRating = await Movie.aggregate([
      { $match: { status: 'published', 'rating.count': { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating.average' } } }
    ]);

    res.json({
      success: true,
      data: {
        recentMovies,
        totalViews: totalViews[0]?.totalViews || 0,
        avgRating: avgRating[0]?.avgRating || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie trends'
    });
  }
});

// @desc    Get movie suggestions for autocomplete
// @route   GET /api/movies/suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const suggestions = await Movie.find({
      status: 'published',
      title: searchRegex
    })
    .select('title poster releaseYear genres _id')
    .limit(10)
    .sort({ views: -1 });

    console.log(`Suggestions query: "${q}", found ${suggestions.length} results`);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error fetching movie suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching suggestions'
    });
  }
});

// @desc    Get movie by ID or slug
// @route   GET /api/movies/:identifier
// @access  Public
router.get('/:identifier', optionalAuth, trackMovieView, async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    
    const movie = await Movie.findOne({
      ...query,
      status: 'published',
      isActive: true
    })
      .populate('createdBy', 'username avatar')
      .select('-__v');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Increment views
    await movie.incrementViews();

    // Get related movies (same genre)
    const relatedMovies = await Movie.find({
      _id: { $ne: movie._id },
      genres: { $in: movie.genres },
      status: 'published',
      isActive: true
    })
      .limit(6)
      .select('title poster slug rating releaseYear')
      .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      data: {
        movie,
        relatedMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie'
    });
  }
});

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Moderator+)
router.post('/', authenticate, requireModerator, sanitizeInput, validateMovie, async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Automatically fetch images and additional details from TMDB/IMDb
    if (movieData.title) {
      console.log(`Fetching images and details for movie: ${movieData.title}`);
      
      const enrichedData = await imageService.fetchImagesWithFallback(
        movieData.title, 
        movieData.releaseYear
      );

      // Update movie data with fetched information
      if (enrichedData.poster) {
        movieData.poster = enrichedData.poster;
      }
      if (enrichedData.backdrop) {
        movieData.backdrop = enrichedData.backdrop;
      }
      if (enrichedData.tmdbId) {
        movieData.tmdbId = enrichedData.tmdbId;
      }
      if (enrichedData.imdbId) {
        movieData.imdbId = enrichedData.imdbId;
      }
      if (enrichedData.overview && !movieData.description) {
        movieData.description = enrichedData.overview;
      }
      if (enrichedData.runtime && !movieData.duration) {
        movieData.duration = enrichedData.runtime;
      }
      if (enrichedData.genres && enrichedData.genres.length > 0 && (!movieData.genres || movieData.genres.length === 0)) {
        movieData.genres = enrichedData.genres;
      }
      if (enrichedData.voteAverage && !movieData.imdbRating) {
        movieData.imdbRating = enrichedData.voteAverage;
      }

      console.log(`Successfully enriched movie data for: ${movieData.title}`);
    }

    const movie = await Movie.create(movieData);
    await movie.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Movie created successfully with auto-fetched images and details',
      data: { movie }
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating movie',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Moderator+)
router.put('/:id', authenticate, requireModerator, validateObjectId('id'), validateMovie, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: { movie }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating movie'
    });
  }
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Moderator+)
router.delete('/:id', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting movie'
    });
  }
});

// @desc    Toggle movie featured status
// @route   PATCH /api/movies/:id/featured
// @access  Private (Moderator+)
router.patch('/:id/featured', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    movie.featured = !movie.featured;
    await movie.save();

    res.json({
      success: true,
      message: `Movie ${movie.featured ? 'added to' : 'removed from'} featured`,
      data: { featured: movie.featured }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating featured status'
    });
  }
});

// @desc    Toggle movie trending status
// @route   PATCH /api/movies/:id/trending
// @access  Private (Moderator+)
router.patch('/:id/trending', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    movie.trending = !movie.trending;
    await movie.save();

    res.json({
      success: true,
      message: `Movie ${movie.trending ? 'added to' : 'removed from'} trending`,
      data: { trending: movie.trending }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating trending status'
    });
  }
});

// @desc    Toggle movie active status
// @route   PATCH /api/movies/:id/toggle
// @access  Private (Moderator+)
router.patch('/:id/toggle', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    movie.isActive = !movie.isActive;
    await movie.save();

    res.json({
      success: true,
      message: `Movie ${movie.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: movie.isActive }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating movie status'
    });
  }
});

// @desc    Get related movies
// @route   GET /api/movies/related/:id
// @access  Public
router.get('/related/:id', validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Get related movies (same genre)
    const relatedMovies = await Movie.find({
      _id: { $ne: movie._id },
      genres: { $in: movie.genres },
      status: 'published',
      isActive: true
    })
      .limit(6)
      .select('title poster slug rating releaseYear duration views quality genres')
      .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      data: {
        movies: relatedMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching related movies'
    });
  }
});

// @desc    Get movie statistics (simple stats)
// @route   GET /api/movies/stats
// @access  Private (Moderator+)
router.get('/stats', authenticate, requireModerator, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ status: 'published' });
    const featuredMovies = await Movie.countDocuments({ status: 'published', featured: true });
    const trendingMovies = await Movie.countDocuments({ status: 'published', trending: true });
    const draftMovies = await Movie.countDocuments({ status: 'draft' });

    res.json({
      success: true,
      data: {
        totalMovies,
        featuredMovies,
        trendingMovies,
        draftMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie statistics'
    });
  }
});

// @desc    Get movie statistics
// @route   GET /api/movies/stats/overview
// @access  Private (Moderator+)
router.get('/stats/overview', authenticate, requireModerator, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ status: 'published' });
    const featuredMovies = await Movie.countDocuments({ status: 'published', featured: true });
    const trendingMovies = await Movie.countDocuments({ status: 'published', trending: true });
    
    const topGenres = await Movie.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topRatedMovies = await Movie.find({ status: 'published' })
      .sort({ 'rating.average': -1 })
      .limit(5)
      .select('title rating poster slug');

    const mostViewedMovies = await Movie.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views poster slug');

    res.json({
      success: true,
      data: {
        totalMovies,
        featuredMovies,
        trendingMovies,
        topGenres,
        topRatedMovies,
        mostViewedMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie statistics'
    });
  }
});

// @desc    Get movie trends
// @route   GET /api/movies/stats/trends
// @access  Private (Moderator+)
router.get('/stats/trends', authenticate, requireModerator, async (req, res) => {
  try {
    // Get movies from last 30 days for trend calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMovies = await Movie.countDocuments({
      status: 'published',
      createdAt: { $gte: thirtyDaysAgo }
    });

    const totalViews = await Movie.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      data: {
        recentMovies,
        totalViews: totalViews[0]?.totalViews || 0,
        moviesGrowth: 12.5, // Mock data - implement proper calculation
        viewsGrowth: 8.3,   // Mock data - implement proper calculation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie trends'
    });
  }
});

// @desc    Get top movies
// @route   GET /api/movies/stats/top
// @access  Private (Moderator+)
router.get('/stats/top', authenticate, requireModerator, async (req, res) => {
  try {
    const topRatedMovies = await Movie.find({ status: 'published', isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(10)
      .select('title rating poster slug views');

    const mostViewedMovies = await Movie.find({ status: 'published', isActive: true })
      .sort({ views: -1 })
      .limit(10)
      .select('title views poster slug rating');

    res.json({
      success: true,
      data: {
        topRated: topRatedMovies,
        mostViewed: mostViewedMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching top movies'
    });
  }
});

// @desc    Get movie activity
// @route   GET /api/movies/stats/activity
// @access  Private (Moderator+)
router.get('/stats/activity', authenticate, requireModerator, async (req, res) => {
  try {
    const recentMovies = await Movie.find({ status: 'published', isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'username')
      .select('title createdAt createdBy views rating');

    res.json({
      success: true,
      data: {
        recentActivity: recentMovies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie activity'
    });
  }
});

module.exports = router;