const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'support', 'bug_report', 'feature_request', 'complaint', 'other'],
    default: 'general'
  },
  userAgent: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    default: ''
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient querying
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ category: 1 });

// Virtual for formatted creation date
contactSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static method to get contact statistics
contactSchema.statics.getContactStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    resolved: 0
  };
};

// Static method to get recent contacts
contactSchema.statics.getRecentContacts = async function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name email subject status priority createdAt');
};

// Instance method to mark as read
contactSchema.methods.markAsRead = async function() {
  if (this.status === 'new') {
    this.status = 'read';
    return this.save();
  }
  return this;
};

// Instance method to mark as replied
contactSchema.methods.markAsReplied = async function(adminId) {
  this.status = 'replied';
  this.repliedAt = new Date();
  this.repliedBy = adminId;
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);