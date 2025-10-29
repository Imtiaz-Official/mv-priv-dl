const { Settings } = require('../models');
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.isConfigured = false;
    this.settings = null;
    this.transporter = null;
  }

  // Initialize email service with current settings
  async initialize() {
    try {
      this.settings = await Settings.getSettings();
      this.isConfigured = this.settings?.notifications?.enableGmailNotifications && 
                         this.settings?.notifications?.adminGmailAddress;
      
      // Initialize SMTP transporter if configured
      if (this.isConfigured) {
        await this.setupTransporter();
      }
      
      return this.isConfigured;
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      return false;
    }
  }

  // Setup nodemailer transporter for Gmail SMTP
  async setupTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail service directly
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      await this.transporter.verify();
      console.log('✅ Gmail SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to setup Gmail SMTP transporter:', error.message);
      this.transporter = null;
      return false;
    }
  }

  // Check if email service is ready to send emails
  isReady() {
    return this.isConfigured && this.settings?.notifications?.adminGmailAddress && this.transporter;
  }

  // Get admin Gmail address from settings
  getAdminEmail() {
    return this.settings?.notifications?.adminGmailAddress || null;
  }

  // Check if specific notification type is enabled
  isNotificationTypeEnabled(type) {
    if (!this.isReady()) return false;
    return this.settings?.notifications?.gmailNotificationTypes?.[type] || false;
  }

  // Send contact form notification
  async sendContactNotification(contactData) {
    if (!this.isNotificationTypeEnabled('systemAlerts')) {
      console.log('Contact notifications are disabled');
      return { success: false, reason: 'Contact notifications disabled' };
    }

    const emailData = {
      to: this.getAdminEmail(),
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: this.generateContactEmailTemplate(contactData),
      type: 'contact_form'
    };

    return this.sendEmail(emailData);
  }

  // Send new user registration notification
  async sendNewUserNotification(userData) {
    if (!this.isNotificationTypeEnabled('newUserRegistration')) {
      console.log('New user notifications are disabled');
      return { success: false, reason: 'New user notifications disabled' };
    }

    const emailData = {
      to: this.getAdminEmail(),
      subject: `New User Registration: ${userData.username}`,
      html: this.generateNewUserEmailTemplate(userData),
      type: 'new_user'
    };

    return this.sendEmail(emailData);
  }

  // Send movie upload notification
  async sendMovieUploadNotification(movieData) {
    if (!this.isNotificationTypeEnabled('newMovieUploaded')) {
      console.log('Movie upload notifications are disabled');
      return { success: false, reason: 'Movie upload notifications disabled' };
    }

    const emailData = {
      to: this.getAdminEmail(),
      subject: `New Movie Uploaded: ${movieData.title}`,
      html: this.generateMovieUploadEmailTemplate(movieData),
      type: 'movie_upload'
    };

    return this.sendEmail(emailData);
  }

  // Send download tracking notification
  async sendDownloadTrackingNotification(downloadData) {
    if (!this.isNotificationTypeEnabled('downloadTracking')) {
      console.log('Download tracking notifications are disabled');
      return { success: false, reason: 'Download tracking notifications disabled' };
    }

    const emailData = {
      to: this.getAdminEmail(),
      subject: `Download Activity: ${downloadData.movieTitle}`,
      html: this.generateDownloadTrackingEmailTemplate(downloadData),
      type: 'download_tracking'
    };

    return this.sendEmail(emailData);
  }

  // Send system alert notification
  async sendSystemAlertNotification(alertData) {
    if (!this.isNotificationTypeEnabled('systemAlerts')) {
      console.log('System alert notifications are disabled');
      return { success: false, reason: 'System alert notifications disabled' };
    }

    const emailData = {
      to: this.getAdminEmail(),
      subject: `System Alert: ${alertData.title}`,
      html: this.generateSystemAlertEmailTemplate(alertData),
      type: 'system_alert'
    };

    return this.sendEmail(emailData);
  }

  // Core email sending method using Gmail SMTP
  async sendEmail(emailData) {
    try {
      if (!this.transporter) {
        console.log('📧 Email service not configured - logging email data:', {
          to: emailData.to,
          subject: emailData.subject,
          type: emailData.type,
          timestamp: new Date().toISOString()
        });
        return {
          success: false,
          error: 'SMTP transporter not configured'
        };
      }

      // Prepare email options
      const mailOptions = {
        from: `"MovieStream Pro" <${process.env.EMAIL_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html
      };

      // Send email using nodemailer
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully:', {
        to: emailData.to,
        subject: emailData.subject,
        messageId: info.messageId,
        type: emailData.type,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to send email:', {
        error: error.message,
        to: emailData.to,
        subject: emailData.subject,
        type: emailData.type
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Email template generators
  generateContactEmailTemplate(contactData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #555;">${contactData.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
          <p style="margin: 0; color: #1976d2; font-size: 14px;">
            <strong>Note:</strong> Please respond to this inquiry promptly to maintain good customer service.
          </p>
        </div>
      </div>
    `;
  }

  generateNewUserEmailTemplate(userData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4caf50; padding-bottom: 10px;">
          New User Registration
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4caf50; margin-top: 0;">User Information</h3>
          <p><strong>Username:</strong> ${userData.username}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> ${userData.role || 'User'}</p>
          <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
          <p style="margin: 0; color: #2e7d32; font-size: 14px;">
            <strong>Action:</strong> A new user has joined your platform. Consider sending a welcome message.
          </p>
        </div>
      </div>
    `;
  }

  generateMovieUploadEmailTemplate(movieData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #ff9800; padding-bottom: 10px;">
          New Movie Uploaded
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #ff9800; margin-top: 0;">Movie Details</h3>
          <p><strong>Title:</strong> ${movieData.title}</p>
          <p><strong>Year:</strong> ${movieData.releaseYear || 'N/A'}</p>
          <p><strong>Genre:</strong> ${Array.isArray(movieData.genres) ? movieData.genres.join(', ') : 'N/A'}</p>
          <p><strong>Uploaded:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px;">
          <p style="margin: 0; color: #f57c00; font-size: 14px;">
            <strong>Note:</strong> New content has been added to your platform. Review for quality and compliance.
          </p>
        </div>
      </div>
    `;
  }

  generateDownloadTrackingEmailTemplate(downloadData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #9c27b0; padding-bottom: 10px;">
          Download Activity
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #9c27b0; margin-top: 0;">Download Information</h3>
          <p><strong>Movie:</strong> ${downloadData.movieTitle}</p>
          <p><strong>User:</strong> ${downloadData.username || 'Anonymous'}</p>
          <p><strong>Quality:</strong> ${downloadData.quality || 'N/A'}</p>
          <p><strong>Downloaded:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  }

  generateSystemAlertEmailTemplate(alertData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #f44336; padding-bottom: 10px;">
          System Alert
        </h2>
        
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
          <h3 style="color: #f44336; margin-top: 0;">${alertData.title}</h3>
          <p style="color: #333;">${alertData.message}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          ${alertData.details ? `<p><strong>Details:</strong> ${alertData.details}</p>` : ''}
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #ffcdd2; border-radius: 8px;">
          <p style="margin: 0; color: #c62828; font-size: 14px;">
            <strong>Action Required:</strong> Please investigate this alert immediately.
          </p>
        </div>
      </div>
    `;
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;