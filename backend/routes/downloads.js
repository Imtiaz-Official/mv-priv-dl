const express = require('express');
const { Download, Movie } = require('../models');
const { authenticate, requireModerator, optionalAuth } = require('../middleware/auth');
const { validateDownload, validatePagination, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @desc    Get downloads for a movie
// @route   GET /api/downloads/movie/:movieId
// @access  Public
router.get('/movie/:movieId', validateObjectId('movieId'), async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const downloads = await Download.find({
      movie: movieId,
      isActive: true
    })
      .populate('movie', 'title poster slug')
      .populate('uploadedBy', 'username')
      .sort({ quality: 1, resolution: -1 });

    // Group downloads by quality
    const groupedDownloads = downloads.reduce((acc, download) => {
      const quality = download.quality;
      if (!acc[quality]) {
        acc[quality] = [];
      }
      acc[quality].push(download);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        movie: {
          id: movie._id,
          title: movie.title,
          poster: movie.poster,
          slug: movie.slug
        },
        downloads: groupedDownloads,
        totalDownloads: downloads.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching downloads'
    });
  }
});

// @desc    Get all downloads with pagination and filtering
// @route   GET /api/downloads
// @access  Private (Moderator+)
router.get('/', authenticate, requireModerator, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by quality
    if (req.query.quality) {
      filter.quality = req.query.quality;
    }

    // Filter by resolution
    if (req.query.resolution) {
      filter.resolution = req.query.resolution;
    }

    // Filter by format
    if (req.query.format) {
      filter.format = req.query.format;
    }

    // Filter by active status
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
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
      case 'downloads':
        sort = { downloadCount: -1 };
        break;
      case 'quality':
        sort = { quality: 1, resolution: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query
    const downloads = await Download.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('movie', 'title poster slug')
      .populate('uploadedBy', 'username');

    // Get total count for pagination
    const total = await Download.countDocuments(filter);

    res.json({
      success: true,
      data: {
        downloads,
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
      message: 'Server error fetching downloads'
    });
  }
});

// @desc    Get download by ID
// @route   GET /api/downloads/:id
// @access  Public
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const download = await Download.findOne({
      _id: req.params.id,
      isActive: true
    })
      .populate('movie', 'title poster slug releaseYear')
      .populate('uploadedBy', 'username');

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    // Clean up expired links
    await download.deactivateExpiredLinks();

    res.json({
      success: true,
      data: { download }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching download'
    });
  }
});

// @desc    Create new download
// @route   POST /api/downloads
// @access  Private (Moderator+)
router.post('/', authenticate, requireModerator, validateDownload, async (req, res) => {
  try {
    const downloadData = {
      ...req.body,
      uploadedBy: req.user._id
    };

    // Check if movie exists
    const movie = await Movie.findById(downloadData.movie);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const download = await Download.create(downloadData);
    await download.populate('movie', 'title poster slug');
    await download.populate('uploadedBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Download created successfully',
      data: { download }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating download'
    });
  }
});

// @desc    Update download
// @route   PUT /api/downloads/:id
// @access  Private (Moderator+)
router.put('/:id', authenticate, requireModerator, validateObjectId('id'), validateDownload, async (req, res) => {
  try {
    const download = await Download.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('movie', 'title poster slug')
      .populate('uploadedBy', 'username');

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    res.json({
      success: true,
      message: 'Download updated successfully',
      data: { download }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating download'
    });
  }
});

// @desc    Delete download
// @route   DELETE /api/downloads/:id
// @access  Private (Moderator+)
router.delete('/:id', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const download = await Download.findByIdAndDelete(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    res.json({
      success: true,
      message: 'Download deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting download'
    });
  }
});

// @desc    Track download
// @route   POST /api/downloads/:id/track
// @access  Public
router.post('/:id/track', validateObjectId('id'), async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    // Increment download count
    await download.incrementDownloadCount();

    // Also increment movie download count
    const movie = await Movie.findById(download.movie);
    if (movie) {
      await movie.incrementDownloads();
    }

    res.json({
      success: true,
      message: 'Download tracked successfully',
      data: {
        downloadCount: download.downloadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error tracking download'
    });
  }
});

// @desc    Add download link to existing download
// @route   POST /api/downloads/:id/links
// @access  Private (Moderator+)
router.post('/:id/links', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const { provider, url, password, expiresAt } = req.body;

    if (!provider || !url) {
      return res.status(400).json({
        success: false,
        message: 'Provider and URL are required'
      });
    }

    const download = await Download.findById(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    await download.addDownloadLink(provider, url, password, expiresAt);

    res.json({
      success: true,
      message: 'Download link added successfully',
      data: { download }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding download link'
    });
  }
});

// @desc    Toggle download active status
// @route   PATCH /api/downloads/:id/toggle
// @access  Private (Moderator+)
router.patch('/:id/toggle', authenticate, requireModerator, validateObjectId('id'), async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    download.isActive = !download.isActive;
    await download.save();

    res.json({
      success: true,
      message: `Download ${download.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: download.isActive }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling download status'
    });
  }
});

// @desc    Get download statistics
// @route   GET /api/downloads/stats/overview
// @access  Private (Moderator+)
router.get('/stats/overview', authenticate, requireModerator, async (req, res) => {
  try {
    const totalDownloads = await Download.countDocuments({ isActive: true });
    const totalDownloadCount = await Download.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    const downloadsByQuality = await Download.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$quality', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const downloadsByFormat = await Download.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$format', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const mostDownloaded = await Download.find({ isActive: true })
      .sort({ downloadCount: -1 })
      .limit(10)
      .populate('movie', 'title poster slug')
      .select('title quality resolution downloadCount');

    res.json({
      success: true,
      data: {
        totalDownloads,
        totalDownloadCount: totalDownloadCount[0]?.total || 0,
        downloadsByQuality,
        downloadsByFormat,
        mostDownloaded
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching download statistics'
    });
  }
});

// @desc    Clean up expired download links
// @route   POST /api/downloads/cleanup
// @access  Private (Moderator+)
router.post('/cleanup', authenticate, requireModerator, async (req, res) => {
  try {
    const downloads = await Download.find({ isActive: true });
    let cleanedCount = 0;

    for (const download of downloads) {
      const originalLinksCount = download.downloadLinks.filter(link => link.isActive).length;
      await download.deactivateExpiredLinks();
      const newLinksCount = download.downloadLinks.filter(link => link.isActive).length;
      
      if (originalLinksCount !== newLinksCount) {
        cleanedCount++;
      }
    }

    res.json({
      success: true,
      message: `Cleanup completed. ${cleanedCount} downloads had expired links removed.`,
      data: { cleanedCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during cleanup'
    });
  }
});

module.exports = router;