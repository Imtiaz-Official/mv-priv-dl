const mongoose = require('mongoose');
const { Settings } = require('../models');
require('dotenv').config();

async function setupGmailNotifications(gmailAddress) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviehub');
    console.log('Connected to MongoDB');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmailAddress)) {
      console.error('❌ Invalid email format:', gmailAddress);
      process.exit(1);
    }

    // Get or create settings
    let settings = await Settings.findById('system_settings');
    
    if (!settings) {
      console.log('Creating new settings document...');
      settings = new Settings({ _id: 'system_settings' });
    }

    // Enable Gmail notifications
    if (!settings.notifications) {
      settings.notifications = {};
    }

    settings.notifications.adminGmailAddress = gmailAddress;
    settings.notifications.enableGmailNotifications = true;
    
    // Ensure all notification types are enabled
    if (!settings.notifications.gmailNotificationTypes) {
      settings.notifications.gmailNotificationTypes = {};
    }

    settings.notifications.gmailNotificationTypes.systemAlerts = true;
    settings.notifications.gmailNotificationTypes.systemErrors = true;
    settings.notifications.gmailNotificationTypes.newUserRegistration = true;
    settings.notifications.gmailNotificationTypes.newMovieUploaded = true;
    settings.notifications.gmailNotificationTypes.downloadTracking = true;

    // Save settings
    await settings.save();

    console.log('\n✅ Gmail notifications have been successfully enabled!');
    console.log(`📧 Admin Gmail: ${gmailAddress}`);
    console.log('📬 Enabled notification types:');
    console.log('   • Contact form submissions (systemAlerts)');
    console.log('   • System errors');
    console.log('   • New user registrations');
    console.log('   • New movie uploads');
    console.log('   • Download tracking');
    
    console.log('\n📝 Note: Make sure your Gmail account has proper authentication configured.');
    
  } catch (error) {
    console.error('❌ Error enabling Gmail notifications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Get email from command line argument
const gmailAddress = process.argv[2];

if (!gmailAddress) {
  console.error('❌ Please provide your Gmail address as an argument:');
  console.error('   node scripts/setupGmail.js your.email@gmail.com');
  process.exit(1);
}

// Run the script
setupGmailNotifications(gmailAddress);