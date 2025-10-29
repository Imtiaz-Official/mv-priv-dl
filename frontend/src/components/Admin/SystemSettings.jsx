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
    general: {
      siteName: 'MovieHub',
      siteDescription: 'Your ultimate movie streaming platform',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: false,
    },
    
    // Security Settings
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 30, // minutes
      passwordMinLength: 8,
      requireStrongPassword: true,
      enableTwoFactor: false,
    },
    
    // Performance Settings
    performance: {
      cacheEnabled: true,
      cacheTimeout: 3600, // seconds
      maxFileSize: 100, // MB
      compressionEnabled: true,
      cdnEnabled: false,
    },
    
    // Content Settings
    content: {
      autoApproveContent: false,
      maxMoviesPerPage: 20,
      enableComments: true,
      enableRatings: true,
      enableDownloads: true,
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      adminNotifications: true,
      userWelcomeEmail: true,
    },
    
    // Backup Settings
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30, // days
    },
    
    // API Settings
    api: {
      rateLimitEnabled: true,
      apiRequestsPerMinute: 100,
      apiKeyRequired: false,
    }
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [backupDialog, setBackupDialog] = useState(false);
  const [backups, setBackups] = useState([]);

  // Custom styled switch with bright colors
  const StyledSwitch = ({ checked, onChange, ...props }) => (
    <Switch
      checked={checked}
      onChange={onChange}
      sx={{
        '& .MuiSwitch-switchBase': {
          color: '#fff',
          '&.Mui-checked': {
            color: '#00ff88',
            '& + .MuiSwitch-track': {
              backgroundColor: '#00ff88',
              opacity: 0.8,
            },
          },
          '&.Mui-checked:hover': {
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
          },
        },
        '& .MuiSwitch-track': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          opacity: 1,
        },
        '& .MuiSwitch-thumb': {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
      }}
      {...props}
    />
  );

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSettingChange = (category, setting, value) => {
    console.log(`Setting change: ${category}.${setting} = ${value}`);
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      };
      console.log('New settings state:', newSettings);
      return newSettings;
    });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/system/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      showSnackbar('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/system/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showSnackbar('Backup created successfully', 'success');
          fetchBackups(); // Refresh the backup list
        } else {
          showSnackbar(data.message || 'Error creating backup', 'error');
        }
      } else {
        showSnackbar('Error creating backup', 'error');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      showSnackbar('Error creating backup', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async (backup) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/system/backup/${backup.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.href = url;
        element.download = backup.name;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        window.URL.revokeObjectURL(url);
        
        showSnackbar('Backup download started', 'success');
      } else {
        showSnackbar('Error downloading backup', 'error');
      }
    } catch (error) {
      console.error('Error downloading backup:', error);
      showSnackbar('Error downloading backup', 'error');
    }
  };

  const handleDeleteBackup = async (backupId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/system/backup/${backupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showSnackbar('Backup deleted successfully', 'success');
          fetchBackups(); // Refresh the backup list
        } else {
          showSnackbar(data.message || 'Error deleting backup', 'error');
        }
      } else {
        showSnackbar('Error deleting backup', 'error');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      showSnackbar('Error deleting backup', 'error');
    }
  };

  // Fetch settings and backups on component mount
  useEffect(() => {
    fetchSettings();
    fetchBackups();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/system/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.settings) {
          // Merge backend settings with default settings to ensure all properties exist
          setSettings(prevSettings => {
            const mergedSettings = { ...prevSettings };
            
            // Safely merge each category
            Object.keys(data.data.settings).forEach(category => {
              if (mergedSettings[category]) {
                mergedSettings[category] = {
                  ...mergedSettings[category],
                  ...data.data.settings[category]
                };
              } else {
                mergedSettings[category] = data.data.settings[category];
              }
            });
            
            return mergedSettings;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showSnackbar('Error fetching settings', 'error');
    }
  };

  const fetchBackups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/system/backups', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBackups(data.data.backups);
        }
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
      showSnackbar('Error fetching backups', 'error');
    }
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
                   <StyledSwitch
                     checked={settings.general?.maintenanceMode || false}
                     onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                   />
                 }
                 label="Maintenance Mode"
                 sx={{ color: 'white' }}
               />

               <FormControlLabel
                 control={
                   <StyledSwitch
                     checked={settings.general?.registrationEnabled || false}
                     onChange={(e) => handleSettingChange('general', 'registrationEnabled', e.target.checked)}
                   />
                 }
                 label="Enable User Registration"
                 sx={{ color: 'white' }}
               />

               <FormControlLabel
                 control={
                   <StyledSwitch
                     checked={settings.general?.emailVerificationRequired || false}
                     onChange={(e) => handleSettingChange('general', 'emailVerificationRequired', e.target.checked)}
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
                value={settings.security?.maxLoginAttempts || 5}
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
                value={settings.security?.sessionTimeout || 30}
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
                value={settings.security?.passwordMinLength || 8}
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
                    checked={settings.security?.requireStrongPassword || false}
                    onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
                    color="primary"
                  />
                }
                label="Require Strong Passwords"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.security?.enableTwoFactor || false}
                    onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
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
                  <StyledSwitch
                    checked={settings.performance?.cacheEnabled || false}
                    onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                  />
                }
                label="Enable Caching"
                sx={{ color: 'white' }}
              />

              <TextField
                label="Cache Timeout (seconds)"
                type="number"
                value={settings.performance?.cacheTimeout || 3600}
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
                value={settings.performance?.maxFileSize || 100}
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
                  <StyledSwitch
                    checked={settings.performance?.compressionEnabled || false}
                    onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
                  />
                }
                label="Enable Compression"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.performance?.cdnEnabled || false}
                    onChange={(e) => handleSettingChange('performance', 'cdnEnabled', e.target.checked)}
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
                  <StyledSwitch
                    checked={settings.content?.autoApproveContent || false}
                    onChange={(e) => handleSettingChange('content', 'autoApproveContent', e.target.checked)}
                  />
                }
                label="Auto-approve Content"
                sx={{ color: 'white' }}
              />

              <TextField
                label="Movies Per Page"
                type="number"
                value={settings.content?.maxMoviesPerPage || 20}
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
                  <StyledSwitch
                    checked={settings.content?.enableComments || false}
                    onChange={(e) => handleSettingChange('content', 'enableComments', e.target.checked)}
                  />
                }
                label="Enable Comments"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.content?.enableRatings || false}
                    onChange={(e) => handleSettingChange('content', 'enableRatings', e.target.checked)}
                  />
                }
                label="Enable Ratings"
                sx={{ color: 'white' }}
              />

              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings.content?.enableDownloads || false}
                    onChange={(e) => handleSettingChange('content', 'enableDownloads', e.target.checked)}
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
                   <StyledSwitch
                     checked={settings.backup?.autoBackup || false}
                     onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                   />
                 }
                 label="Enable Auto Backup"
                 sx={{ color: 'white' }}
               />

                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backup?.backupFrequency || 'daily'}
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
                    value={settings.backup?.backupRetention || 30}
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
                          onClick={() => handleDownloadBackup(backup)}
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