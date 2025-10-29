const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['movie', 'post', 'user', 'comment'],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    enum: [
      'Spam content',
      'Inappropriate content', 
      'Copyright violation',
      'Suspicious behavior',
      'Fake reviews',
      'Harassment',
      'Violence',
      'Other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  moderatedAt: {
    type: Date,
    default: null
  },
  moderationReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reportSchema.index({ status: 1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);