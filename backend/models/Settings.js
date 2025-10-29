const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Use a fixed ID to ensure only one settings document exists
  _id: {
    type: String,
    default: 'system_settings'
  },
  
  // General Settings
  general: {
    siteName: {
      type: String,
      default: 'MovieHub'
    },
    siteDescription: {
      type: String,
      default: 'Your ultimate movie streaming platform'
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    registrationEnabled: {
      type: Boolean,
      default: true
    },
    emailVerificationRequired: {
      type: Boolean,
      default: false
    }
  },

  // Security Settings
  security: {
    enableTwoFactor: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 30
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    passwordMinLength: {
      type: Number,
      default: 8
    },
    requireStrongPassword: {
      type: Boolean,
      default: true
    }
  },

  // Performance Settings
  performance: {
    cacheEnabled: {
      type: Boolean,
      default: true
    },
    cacheTimeout: {
      type: Number,
      default: 3600
    },
    maxFileSize: {
      type: Number,
      default: 100
    },
    compressionEnabled: {
      type: Boolean,
      default: true
    },
    cdnEnabled: {
      type: Boolean,
      default: false
    }
  },

  // Content Settings
  content: {
    autoApproveContent: {
      type: Boolean,
      default: false
    },
    maxMoviesPerPage: {
      type: Number,
      default: 20
    },
    enableComments: {
      type: Boolean,
      default: true
    },
    enableRatings: {
      type: Boolean,
      default: true
    },
    enableDownloads: {
      type: Boolean,
      default: true
    },
    downloadTimer: {
      type: Number,
      default: 15,
      min: 1,
      max: 300
    }
  },

  // Notification Settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: false
    },
    adminNotifications: {
      type: Boolean,
      default: true
    },
    userWelcomeEmail: {
      type: Boolean,
      default: true
    },
    // Gmail Settings for Admin Notifications
    adminGmailAddress: {
      type: String,
      default: '',
      validate: {
        validator: function(v) {
          // Allow empty string or valid email format
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid Gmail address'
      }
    },
    enableGmailNotifications: {
      type: Boolean,
      default: false
    },
    gmailNotificationTypes: {
      newUserRegistration: {
        type: Boolean,
        default: true
      },
      newMovieUploaded: {
        type: Boolean,
        default: true
      },
      downloadTracking: {
        type: Boolean,
        default: true
      },
      systemErrors: {
        type: Boolean,
        default: true
      },
      systemAlerts: {
        type: Boolean,
        default: true
      },
      dailyReports: {
        type: Boolean,
        default: false
      },
      weeklyReports: {
        type: Boolean,
        default: true
      }
    }
  },

  // Backup Settings
  backup: {
    autoBackup: {
      type: Boolean,
      default: false
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    backupRetention: {
      type: Number,
      default: 30
    }
  },

  // API Settings
  api: {
    rateLimitEnabled: {
      type: Boolean,
      default: true
    },
    apiRequestsPerMinute: {
      type: Number,
      default: 100
    },
    apiKeyRequired: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Static method to get or create settings
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findById('system_settings');
  if (!settings) {
    settings = new this({ _id: 'system_settings' });
    await settings.save();
  }
  return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updates) {
  const settings = await this.getSettings();
  
  // Filter out timestamp fields that Mongoose handles automatically
  const filteredUpdates = { ...updates };
  delete filteredUpdates.createdAt;
  delete filteredUpdates.updatedAt;
  delete filteredUpdates._id;
  delete filteredUpdates.__v;
  
  // Deep merge the updates
  Object.keys(filteredUpdates).forEach(category => {
    if (typeof filteredUpdates[category] === 'object' && filteredUpdates[category] !== null) {
      settings[category] = { ...settings[category], ...filteredUpdates[category] };
    } else {
      settings[category] = filteredUpdates[category];
    }
  });
  
  await settings.save();
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);