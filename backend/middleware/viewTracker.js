const { Movie } = require('../models');

// Middleware to track movie views
const trackMovieView = async (req, res, next) => {
  try {
    // Only track views for GET requests to movie detail endpoints
    if (req.method === 'GET' && req.params.id) {
      const movieId = req.params.id;
      
      // Check if it's a valid ObjectId or slug
      if (movieId && movieId.length > 0) {
        // Try to find movie by ID or slug
        const movie = await Movie.findOne({
          $or: [
            { _id: movieId.match(/^[0-9a-fA-F]{24}$/) ? movieId : null },
            { slug: movieId }
          ],
          status: 'published'
        });

        if (movie) {
          // Increment view count
          await Movie.findByIdAndUpdate(
            movie._id,
            { $inc: { views: 1 } },
            { new: false }
          );

          // Optional: Track user view history (if user is authenticated)
          if (req.user) {
            await trackUserView(req.user._id, movie._id);
          }
        }
      }
    }
  } catch (error) {
    // Don't fail the request if view tracking fails
    console.error('Error tracking movie view:', error);
  }
  
  next();
};

// Track user view history (optional feature)
const trackUserView = async (userId, movieId) => {
  try {
    const { User } = require('../models');
    
    // Add to user's view history (limit to last 50 views)
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          viewHistory: {
            $each: [{
              movie: movieId,
              viewedAt: new Date()
            }],
            $slice: -50 // Keep only last 50 views
          }
        }
      }
    );
  } catch (error) {
    console.error('Error tracking user view history:', error);
  }
};

// Middleware to track download events
const trackDownload = async (req, res, next) => {
  try {
    if (req.method === 'POST' && req.params.id) {
      const downloadId = req.params.id;
      
      if (downloadId && downloadId.match(/^[0-9a-fA-F]{24}$/)) {
        const { Download } = require('../models');
        
        // Increment download count
        await Download.findByIdAndUpdate(
          downloadId,
          { $inc: { downloadCount: 1 } },
          { new: false }
        );

        // Optional: Track user download history
        if (req.user) {
          await trackUserDownload(req.user._id, downloadId);
        }
      }
    }
  } catch (error) {
    console.error('Error tracking download:', error);
  }
  
  next();
};

// Track user download history
const trackUserDownload = async (userId, downloadId) => {
  try {
    const { User, Download } = require('../models');
    
    // Get the download to find the associated movie
    const download = await Download.findById(downloadId).populate('movie');
    
    if (download && download.movie) {
      // Add to user's download history
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            downloadHistory: {
              $each: [{
                movie: download.movie._id,
                download: downloadId,
                downloadedAt: new Date()
              }],
              $slice: -100 // Keep only last 100 downloads
            }
          }
        }
      );
    }
  } catch (error) {
    console.error('Error tracking user download history:', error);
  }
};

// Middleware to track user activity
const trackUserActivity = (activityType) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const { User } = require('../models');
        
        // Update user's last activity
        await User.findByIdAndUpdate(
          req.user._id,
          {
            lastActivity: new Date(),
            $push: {
              activityLog: {
                $each: [{
                  type: activityType,
                  timestamp: new Date(),
                  details: {
                    method: req.method,
                    path: req.path,
                    params: req.params
                  }
                }],
                $slice: -50 // Keep only last 50 activities
              }
            }
          }
        );
      }
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
    
    next();
  };
};

module.exports = {
  trackMovieView,
  trackDownload,
  trackUserActivity
};