const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Contact } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const emailService = require('../utils/emailService');

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', contactValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Create contact entry
    const contactData = {
      name,
      email,
      subject,
      message,
      userAgent: req.get('User-Agent') || '',
      ipAddress: req.ip || req.connection.remoteAddress || ''
    };

    const contact = new Contact(contactData);
    await contact.save();

    // Initialize email service and send notification
    try {
      await emailService.initialize();
      await emailService.sendContactNotification(contactData);
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      data: {
        id: contact._id,
        status: contact.status,
        submittedAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting contact form'
    });
  }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private (Admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('repliedBy', 'username email'),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalContacts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contacts'
    });
  }
});

// @desc    Get contact statistics (Admin only)
// @route   GET /api/contact/stats
// @access  Private (Admin)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const stats = await Contact.getContactStats();
    const recentContacts = await Contact.getRecentContacts(5);

    res.json({
      success: true,
      data: {
        stats,
        recentContacts
      }
    });

  } catch (error) {
    console.error('Error fetching contact statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contact statistics'
    });
  }
});

// @desc    Get single contact message (Admin only)
// @route   GET /api/contact/:id
// @access  Private (Admin)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'username email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      await contact.markAsRead();
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contact'
    });
  }
});

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.status = status;
    if (adminNotes !== undefined) {
      contact.adminNotes = adminNotes;
    }

    if (status === 'replied') {
      contact.repliedAt = new Date();
      contact.repliedBy = req.user._id;
    }

    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating contact status'
    });
  }
});

// @desc    Update contact priority (Admin only)
// @route   PUT /api/contact/:id/priority
// @access  Private (Admin)
router.put('/:id/priority', authenticate, requireAdmin, async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.priority = priority;
    await contact.save();

    res.json({
      success: true,
      message: 'Contact priority updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact priority:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating contact priority'
    });
  }
});

// @desc    Mark contact as spam (Admin only)
// @route   PUT /api/contact/:id/spam
// @access  Private (Admin)
router.put('/:id/spam', authenticate, requireAdmin, async (req, res) => {
  try {
    const { isSpam } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.isSpam = Boolean(isSpam);
    await contact.save();

    res.json({
      success: true,
      message: `Contact ${isSpam ? 'marked as spam' : 'unmarked as spam'} successfully`,
      data: contact
    });

  } catch (error) {
    console.error('Error updating spam status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating spam status'
    });
  }
});

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting contact'
    });
  }
});

// @desc    Bulk update contact status (Admin only)
// @route   PUT /api/contact/bulk/status
// @access  Private (Admin)
router.put('/bulk/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { contactIds, status, adminNotes } = req.body;

    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Contact IDs array is required'
      });
    }

    if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updateData = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (status === 'replied') {
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.user._id;
    }

    const result = await Contact.updateMany(
      { _id: { $in: contactIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} contact(s) updated successfully`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Error bulk updating contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error bulk updating contacts'
    });
  }
});

module.exports = router;