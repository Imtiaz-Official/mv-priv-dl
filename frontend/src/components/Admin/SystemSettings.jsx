import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Slider,
  InputAdornment,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Speed as PerformanceIcon,
  Notifications as NotificationIcon,
  Backup as BackupIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'MovieHub',
    siteDescription: 'Your ultimate movie streaming platform',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: false,
    
    // Security Settings
    maxLoginAttempts: 5,
    sessionTimeout: 30, // minutes
    passwordMinLength: 8,
    requireStrongPassword: true,
    twoFactorEnabled: false,
    
    // Performance Settings
    cacheEnabled: true,
    cacheTimeout: 3600, // seconds
    maxFileSize: 100, // MB
    compressionEnabled: true,
    cdnEnabled: false,
    
    // Content Settings
    autoApproveContent: false,
    maxMoviesPerPage: 20,
    enableComments: true,
    enableRatings: true,
    enableDownloads: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    adminNotifications: true,
    userWelcomeEmail: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30, // days
    
    // API Settings
    rateLimitEnabled: true,
    apiRequestsPerMinute: 100,
    apiKeyRequired: false,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [backupDialog, setBackupDialog] = useState(false);
  const [backups, setBackups] = useState([
    { id: 1, name: 'backup_2024_01_20.sql', size: '45.2 MB', date: '2024-01-20 10:30:00' },
    { id: 2, name: 'backup_2024_01_19.sql', size: '44.8 MB', date: '2024-01-19 10:30:00' },
    { id: 3, name: 'backup_2024_01_18.sql', size: '44.1 MB', date: '2024-01-18 10:30:00' },
  ]);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSnackbar('Settings saved successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup = {
        id: Date.now(),
        name: `backup_${new Date().toISOString().split('T')[0]}.sql`,
        size: '45.5 MB',
        date: new Date().toLocaleString()
      };
      
      setBackups(prev => [newBackup, ...prev]);
      showSnackbar('Backup created successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to create backup', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackup = (backupId) => {
    setBackups(prev => prev.filter(backup => backup.id !== backupId));
    showSnackbar('Backup deleted successfully!', 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const SettingsCard = ({ title, icon, children }) => (
    <Card sx={{ 
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
      mb: 3
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {icon}
          <Typography variant="h6" sx={{ color: 'white', ml: 2, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            loading={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
            }}
          >
            Save All Settings
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="General Settings" 
            icon={<SecurityIcon sx={{ color: '#667eea' }} />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Site Name"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
              
              <TextField
                label="Site Description"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                    color="primary"
                  />
                }
                label="Maintenance Mode"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.registrationEnabled}
                    onChange={(e) => handleSettingChange('general', 'registrationEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable User Registration"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailVerificationRequired}
                    onChange={(e) => handleSettingChange('general', 'emailVerificationRequired', e.target.checked)}
                    color="primary"
                  />
                }
                label="Require Email Verification"
                sx={{ color: 'white' }}
              />
            </Box>
          </SettingsCard>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Security Settings" 
            icon={<SecurityIcon sx={{ color: '#f59e0b' }} />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Max Login Attempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <TextField
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <TextField
                label="Minimum Password Length"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireStrongPassword}
                    onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
                    color="primary"
                  />
                }
                label="Require Strong Passwords"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Two-Factor Authentication"
                sx={{ color: 'white' }}
              />
            </Box>
          </SettingsCard>
        </Grid>

        {/* Performance Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Performance Settings" 
            icon={<PerformanceIcon sx={{ color: '#10b981' }} />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.cacheEnabled}
                    onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Caching"
                sx={{ color: 'white' }}
              />

              <TextField
                label="Cache Timeout (seconds)"
                type="number"
                value={settings.cacheTimeout}
                onChange={(e) => handleSettingChange('performance', 'cacheTimeout', parseInt(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <TextField
                label="Max File Size (MB)"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('performance', 'maxFileSize', parseInt(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.compressionEnabled}
                    onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Compression"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.cdnEnabled}
                    onChange={(e) => handleSettingChange('performance', 'cdnEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable CDN"
                sx={{ color: 'white' }}
              />
            </Box>
          </SettingsCard>
        </Grid>

        {/* Content Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Content Settings" 
            icon={<StorageIcon sx={{ color: '#8b5cf6' }} />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoApproveContent}
                    onChange={(e) => handleSettingChange('content', 'autoApproveContent', e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-approve Content"
                sx={{ color: 'white' }}
              />

              <TextField
                label="Movies Per Page"
                type="number"
                value={settings.maxMoviesPerPage}
                onChange={(e) => handleSettingChange('content', 'maxMoviesPerPage', parseInt(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableComments}
                    onChange={(e) => handleSettingChange('content', 'enableComments', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Comments"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableRatings}
                    onChange={(e) => handleSettingChange('content', 'enableRatings', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Ratings"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableDownloads}
                    onChange={(e) => handleSettingChange('content', 'enableDownloads', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Downloads"
                sx={{ color: 'white' }}
              />
            </Box>
          </SettingsCard>
        </Grid>

        {/* Backup Management */}
        <Grid item xs={12}>
          <SettingsCard 
            title="Backup Management" 
            icon={<BackupIcon sx={{ color: '#06b6d4' }} />}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable Auto Backup"
                    sx={{ color: 'white' }}
                  />

                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      }}
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Backup Retention (days)"
                    type="number"
                    value={settings.backupRetention}
                    onChange={(e) => handleSettingChange('backup', 'backupRetention', parseInt(e.target.value))}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<BackupIcon />}
                    onClick={handleCreateBackup}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      borderRadius: 2,
                    }}
                  >
                    Create Backup Now
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Recent Backups
                </Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {backups.map((backup) => (
                    <ListItem
                      key={backup.id}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={backup.name}
                        secondary={`${backup.size} • ${backup.date}`}
                        sx={{
                          '& .MuiListItemText-primary': { color: 'white' },
                          '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.7)' },
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => showSnackbar('Download started', 'info')}
                          sx={{ color: 'white', mr: 1 }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteBackup(backup.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </SettingsCard>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;