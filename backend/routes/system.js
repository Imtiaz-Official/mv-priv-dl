const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { Settings } = require('../models');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// @desc    Get system settings
// @route   GET /api/system/settings
// @access  Private/Admin
router.get('/settings', authenticate, requireAdmin, async (req, res) => {
  try {
    // Get settings from database
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system settings'
    });
  }
});

// @desc    Update system settings
// @route   PUT /api/system/settings
// @access  Private/Admin
router.put('/settings', authenticate, requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body;
    
    // Update settings in database
    const updatedSettings = await Settings.updateSettings(settings);
    
    res.json({
      success: true,
      message: 'System settings updated successfully',
      data: { settings: updatedSettings }
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating system settings'
    });
  }
});

// @desc    Create database backup
// @route   POST /api/system/backup
// @access  Private/Admin
router.post('/backup', authenticate, requireAdmin, async (req, res) => {
  try {
    const backupName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const backupPath = path.join(__dirname, '../backups', backupName);
    
    // Ensure backups directory exists
    const backupsDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      collections: {}
    };

    // Export each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      backup.collections[collectionName] = data;
    }

    // Write backup to file
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    // Get file stats
    const stats = fs.statSync(backupPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    res.json({
      success: true,
      message: 'Backup created successfully',
      data: {
        backup: {
          id: Date.now().toString(),
          name: backupName,
          size: `${fileSizeInMB} MB`,
          date: new Date().toLocaleString(),
          path: backupPath,
          collections: Object.keys(backup.collections).length
        }
      }
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating backup: ' + error.message
    });
  }
});

// @desc    Get list of backups
// @route   GET /api/system/backups
// @access  Private/Admin
router.get('/backups', authenticate, requireAdmin, async (req, res) => {
  try {
    const backupsDir = path.join(__dirname, '../backups');
    
    if (!fs.existsSync(backupsDir)) {
      return res.json({
        success: true,
        data: { backups: [] }
      });
    }

    const files = fs.readdirSync(backupsDir);
    const backups = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(backupsDir, file);
        const stats = fs.statSync(filePath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        return {
          id: file.replace('.json', ''),
          name: file,
          size: `${fileSizeInMB} MB`,
          date: stats.mtime.toLocaleString(),
          path: filePath
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: { backups }
    });
  } catch (error) {
    console.error('Error fetching backups:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching backups'
    });
  }
});

// @desc    Download backup file
// @route   GET /api/system/backup/:id/download
// @access  Private/Admin
router.get('/backup/:id/download', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const backupName = id.endsWith('.json') ? id : `${id}.json`;
    const backupPath = path.join(__dirname, '../backups', backupName);

    // Check if file exists
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${backupName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(backupPath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading backup: ' + error.message
    });
  }
});

// @desc    Delete backup file
// @route   DELETE /api/system/backup/:id
// @access  Private/Admin
router.delete('/backup/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const backupName = id.endsWith('.json') ? id : `${id}.json`;
    const backupPath = path.join(__dirname, '../backups', backupName);

    // Check if file exists
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }

    // Delete the file
    fs.unlinkSync(backupPath);

    res.json({
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting backup: ' + error.message
    });
  }
});

// @desc    Get download timer setting
// @route   GET /api/system/download-timer
// @access  Public
router.get('/download-timer', async (req, res) => {
  try {
    // Get settings from database
    const settings = await Settings.getSettings();
    const downloadTimer = settings.content.downloadTimer;
    
    res.json({
      success: true,
      data: { downloadTimer }
    });
  } catch (error) {
    console.error('Error fetching download timer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching download timer'
    });
  }
});

module.exports = router;