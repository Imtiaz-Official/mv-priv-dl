const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie reference is required']
  },
  title: {
    type: String,
    required: [true, 'Download title is required'],
    trim: true
  },
  quality: {
    type: String,
    required: [true, 'Quality is required'],
    enum: ['CAM', 'TS', 'TC', 'DVDSCR', 'DVDRIP', 'BRRIP', 'WEBRIP', 'WEBDL', 'BLURAY', '4K']
  },
  resolution: {
    type: String,
    enum: ['240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4K'],
    required: [true, 'Resolution is required']
  },
  size: {
    value: {
      type: Number,
      required: [true, 'File size value is required']
    },
    unit: {
      type: String,
      enum: ['MB', 'GB', 'TB'],
      required: [true, 'File size unit is required']
    }
  },
  format: {
    type: String,
    enum: ['MP4', 'MKV', 'AVI', 'MOV', 'WMV', 'FLV', 'WEBM'],
    required: [true, 'File format is required']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    default: 'English'
  },
  subtitles: [{
    language: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  downloadLinks: [{
    provider: {
      type: String,
      required: [true, 'Provider name is required'],
      enum: [
        'Google Drive', 'Mega', 'MediaFire', 'Dropbox', 'OneDrive',
        'Torrent', 'Direct Link', 'Zippyshare', 'Uploaded', 'Rapidgator'
      ]
    },
    url: {
      type: String,
      required: [true, 'Download URL is required']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    password: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  }],
  screenshots: [{
    type: String // URLs to screenshot images
  }],
  audioTracks: [{
    language: {
      type: String,
      required: true
    },
    quality: {
      type: String,
      enum: ['Stereo', '5.1', '7.1', 'Dolby Atmos'],
      default: 'Stereo'
    }
  }],
  videoCodec: {
    type: String,
    enum: ['H.264', 'H.265', 'HEVC', 'VP9', 'AV1', 'XVID'],
    default: 'H.264'
  },
  audioCodec: {
    type: String,
    enum: ['AAC', 'MP3', 'AC3', 'DTS', 'FLAC'],
    default: 'AAC'
  },
  bitrate: {
    video: {
      type: String // e.g., "2000 kbps"
    },
    audio: {
      type: String // e.g., "128 kbps"
    }
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
downloadSchema.index({ movie: 1 });
downloadSchema.index({ quality: 1 });
downloadSchema.index({ resolution: 1 });
downloadSchema.index({ format: 1 });
downloadSchema.index({ language: 1 });
downloadSchema.index({ isActive: 1 });
downloadSchema.index({ downloadCount: -1 });
downloadSchema.index({ createdAt: -1 });

// Virtual for formatted file size
downloadSchema.virtual('formattedSize').get(function() {
  return `${this.size.value} ${this.size.unit}`;
});

// Virtual for active download links count
downloadSchema.virtual('activeLinksCount').get(function() {
  return this.downloadLinks.filter(link => link.isActive).length;
});

// Method to increment download count
downloadSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

// Method to add download link
downloadSchema.methods.addDownloadLink = function(provider, url, password = null, expiresAt = null) {
  this.downloadLinks.push({
    provider,
    url,
    password,
    expiresAt
  });
  return this.save();
};

// Method to deactivate expired links
downloadSchema.methods.deactivateExpiredLinks = function() {
  const now = new Date();
  this.downloadLinks.forEach(link => {
    if (link.expiresAt && link.expiresAt < now) {
      link.isActive = false;
    }
  });
  return this.save();
};

// Static method to find downloads by movie and quality
downloadSchema.statics.findByMovieAndQuality = function(movieId, quality) {
  return this.find({
    movie: movieId,
    quality: quality,
    isActive: true
  }).populate('movie', 'title poster');
};

// Pre-save middleware to clean up expired links
downloadSchema.pre('save', function(next) {
  const now = new Date();
  this.downloadLinks.forEach(link => {
    if (link.expiresAt && link.expiresAt < now) {
      link.isActive = false;
    }
  });
  next();
});

module.exports = mongoose.model('Download', downloadSchema);