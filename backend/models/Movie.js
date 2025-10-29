const mongoose = require('mongoose');
const imageService = require('../services/imageService');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Release year must be after 1900'],
    max: [new Date().getFullYear() + 5, 'Release year cannot be too far in the future']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Movie duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  genres: [{
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
      'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
      'War', 'Western', 'Musical', 'Film-Noir'
    ]
  }],
  languages: [{
    type: String,
    required: true
  }],
  countries: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true
  },
  cast: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    character: {
      type: String,
      trim: true
    }
  }],
  poster: {
    type: String,
    default: '/placeholder-movie.svg'
  },
  backdrop: {
    type: String
  },
  trailer: {
    type: String // YouTube URL or video file path
  },
  imdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    count: {
      type: Number,
      default: 0
    }
  },
  quality: [{
    type: String,
    enum: ['CAM', 'TS', 'TC', 'DVDSCR', 'DVDRIP', 'BRRIP', 'WEBRIP', 'WEBDL', 'BLURAY', '4K']
  }],
  size: {
    type: String // e.g., "1.2GB", "750MB"
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ releaseYear: -1 });
movieSchema.index({ 'rating.average': -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ createdAt: -1 });
movieSchema.index({ featured: 1 });
movieSchema.index({ trending: 1 });
movieSchema.index({ status: 1 });

// Generate slug and fetch images before saving
movieSchema.pre('save', async function(next) {
  try {
    // Generate slug if title is modified or new
    if (this.isModified('title') || this.isNew) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    // Auto-fetch images if poster/backdrop are missing and we have title
    if ((this.isNew || this.isModified('title')) && 
        (!this.poster || this.poster === '/placeholder-movie.svg' || 
         !this.backdrop || this.backdrop === '/placeholder-backdrop.svg')) {
      
      console.log(`Fetching images for movie: ${this.title} (${this.releaseYear})`);
      
      const imageData = await imageService.fetchImagesWithFallback(this.title, this.releaseYear);
      
      // Update poster if not set or is placeholder
      if (!this.poster || this.poster === '/placeholder-movie.svg') {
        this.poster = imageData.poster;
      }
      
      // Update backdrop if not set or is placeholder
      if (!this.backdrop || this.backdrop === '/placeholder-backdrop.svg') {
        this.backdrop = imageData.backdrop;
      }
      
      // Update additional metadata if available and not already set
      if (imageData.tmdbId && !this.tmdbId) {
        this.tmdbId = imageData.tmdbId;
      }
      
      if (imageData.imdbId && !this.imdbId) {
        this.imdbId = imageData.imdbId;
      }
      
      if (imageData.overview && (!this.description || this.description.length < 50)) {
        this.description = imageData.overview;
      }
      
      if (imageData.runtime && !this.duration) {
        this.duration = imageData.runtime;
      }
      
      if (imageData.voteAverage && !this.imdbRating) {
        this.imdbRating = imageData.voteAverage;
      }
      
      // Merge genres if available
      if (imageData.genres && imageData.genres.length > 0 && this.genres.length === 0) {
        // Filter genres to match our enum
        const validGenres = imageData.genres.filter(genre => 
          ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
           'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
           'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
           'War', 'Western', 'Musical', 'Film-Noir'].includes(genre)
        );
        if (validGenres.length > 0) {
          this.genres = validGenres;
        }
      }
      
      console.log(`Images fetched successfully for: ${this.title}`);
    }
    
    next();
  } catch (error) {
    console.error('Error in movie pre-save middleware:', error.message);
    // Don't fail the save if image fetching fails
    next();
  }
});

// Virtual for formatted duration
movieSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Method to increment views
movieSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment downloads
movieSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

module.exports = mongoose.model('Movie', movieSchema);