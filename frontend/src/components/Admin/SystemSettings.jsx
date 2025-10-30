import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Check as CheckIcon,
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
      downloadTimer: 15,
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      adminNotifications: true,
      userWelcomeEmail: true,
      adminGmailAddress: '',
      enableGmailNotifications: false,
      gmailNotificationTypes: {
        newUserRegistration: true,
        newMovieUploaded: true,
        downloadTracking: true,
        systemAlerts: true,
        userActivity: false,
        errorReports: true,
      },
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
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSettingChange = useCallback((category, setting, value) => {
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
    
    // Show save button when changes are made
    setSaveButtonVisible(true);
    setSaveSuccess(false);
  }, []);

  // Create refs for number inputs to manage cursor position
  const inputRefs = useRef({});
  
  const getInputRef = (category, setting) => {
    const key = `${category}.${setting}`;
    if (!inputRefs.current[key]) {
      inputRefs.current[key] = React.createRef();
    }
    return inputRefs.current[key];
  };

  const handleNumberChange = useCallback((category, setting) => {
    return (e) => {
      const value = e.target.value;
      const cursorPosition = e.target.selectionStart;
      
      console.log(`Number input change: ${category}.${setting}, value: "${value}", cursor: ${cursorPosition}`);
      
      // Store cursor position for restoration
      const inputKey = `${category}.${setting}`;
      const inputRef = inputRefs.current[inputKey];
      
      // Allow empty string for better UX while typing
      if (value === '') {
        handleSettingChange(category, setting, '');
        // Restore focus and cursor position after React re-render
        requestAnimationFrame(() => {
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
        return;
      }
      
      // Allow partial numbers while typing (e.g., "1", "12", etc.)
      if (/^\d+$/.test(value)) {
        const numValue = parseInt(value, 10);
        handleSettingChange(category, setting, numValue);
        // Restore focus and cursor position after React re-render
        requestAnimationFrame(() => {
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      }
    };
  }, [handleSettingChange]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      
      const response = await fetch('http://localhost:5000/api/system/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const result = await response.json();
      console.log('Success response:', result);
      showSnackbar('Settings saved successfully!', 'success');
      
      // Show success animation and hide save button
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveButtonVisible(false);
        setSaveSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar(`Failed to save settings: ${error.message}`, 'error');
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
                onChange={handleNumberChange('security', 'maxLoginAttempts')}
                inputRef={getInputRef('security', 'maxLoginAttempts')}
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
                onChange={handleNumberChange('security', 'sessionTimeout')}
                inputRef={getInputRef('security', 'sessionTimeout')}
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
                label="Password Min Length"
                type="number"
                value={settings.security?.passwordMinLength || 8}
                onChange={handleNumberChange('security', 'passwordMinLength')}
                inputRef={getInputRef('security', 'passwordMinLength')}
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
                    checked={settings.security?.requireStrongPassword || false}
                    onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
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
                label="Cache Timeout (minutes)"
                type="number"
                value={settings.performance?.cacheTimeout || 60}
                onChange={handleNumberChange('performance', 'cacheTimeout')}
                inputRef={getInputRef('performance', 'cacheTimeout')}
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
                onChange={handleNumberChange('performance', 'maxFileSize')}
                inputRef={getInputRef('performance', 'maxFileSize')}
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
                label="Max Movies Per Page"
                type="number"
                value={settings.content?.maxMoviesPerPage || 20}
                onChange={handleNumberChange('content', 'maxMoviesPerPage')}
                inputRef={getInputRef('content', 'maxMoviesPerPage')}
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

              <TextField
                label="Download Timer (seconds)"
                type="number"
                value={settings.content?.downloadTimer || 30}
                onChange={handleNumberChange('content', 'downloadTimer')}
                inputRef={getInputRef('content', 'downloadTimer')}
                fullWidth
                variant="outlined"
                inputProps={{ min: 1, max: 300 }}
                helperText="Time users must wait before download becomes available (1-300 seconds)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.6)' },
                }}
              />
            </Box>
          </SettingsCard>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <SettingsCard 
            title="Notification Settings" 
            icon={<NotificationIcon sx={{ color: '#f59e0b' }} />}
          >
            <Grid container spacing={4}>
              {/* General Notifications */}
              <Grid item xs={12} lg={4}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  height: 'fit-content'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <NotificationIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      General Settings
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Enable email-based notifications' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                      { key: 'adminNotifications', label: 'Admin Notifications', desc: 'Administrative alerts' },
                      { key: 'userWelcomeEmail', label: 'Welcome Emails', desc: 'Send welcome emails to new users' }
                    ].map((item) => (
                      <Box key={item.key} sx={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          transform: 'translateY(-1px)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                            {item.label}
                          </Typography>
                          <StyledSwitch
                            checked={settings.notifications?.[item.key] || false}
                            onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Gmail Configuration */}
              <Grid item xs={12} lg={8}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  height: 'fit-content'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                      </svg>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Gmail Integration
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 3,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        mb: 3
                      }}>
                        <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
                          Configuration
                        </Typography>
                        
                        <TextField
                          label="Admin Gmail Address"
                          type="email"
                          value={settings.notifications?.adminGmailAddress || ''}
                          onChange={(e) => handleSettingChange('notifications', 'adminGmailAddress', e.target.value)}
                          fullWidth
                          variant="outlined"
                          placeholder="admin@gmail.com"
                          helperText="Gmail address to receive notifications"
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              background: 'rgba(255, 255, 255, 0.05)',
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                              '&:hover fieldset': { borderColor: 'rgba(34, 197, 94, 0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#22c55e' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                            '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.6)' },
                          }}
                        />

                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          background: 'rgba(34, 197, 94, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          border: '1px solid rgba(34, 197, 94, 0.2)'
                        }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 500 }}>
                              Enable Gmail Notifications
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Activate email notifications via Gmail
                            </Typography>
                          </Box>
                          <StyledSwitch
                            checked={settings.notifications?.enableGmailNotifications || false}
                            onChange={(e) => handleSettingChange('notifications', 'enableGmailNotifications', e.target.checked)}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 3,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
                          Notification Types
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {[
                            { key: 'newUserRegistration', label: 'New User Registration', icon: '👤', color: '#3b82f6' },
                            { key: 'newMovieUploaded', label: 'New Movie Uploaded', icon: '🎬', color: '#8b5cf6' },
                            { key: 'downloadTracking', label: 'Download Tracking', icon: '📥', color: '#06b6d4' },
                            { key: 'systemAlerts', label: 'System Alerts', icon: '⚠️', color: '#f59e0b' },
                            { key: 'userActivity', label: 'User Activity', icon: '📊', color: '#10b981' },
                            { key: 'errorReports', label: 'Error Reports', icon: '🚨', color: '#ef4444' }
                          ].map((item) => (
                            <Box key={item.key} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 1.5,
                              p: 1.5,
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.06)',
                                transform: 'translateX(4px)'
                              }
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  fontSize: '16px', 
                                  mr: 1.5,
                                  background: `${item.color}20`,
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {item.icon}
                                </Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                  {item.label}
                                </Typography>
                              </Box>
                              <StyledSwitch
                                checked={settings.notifications?.gmailNotificationTypes?.[item.key] || false}
                                onChange={(e) => handleSettingChange('notifications', 'gmailNotificationTypes', {
                                  ...settings.notifications?.gmailNotificationTypes,
                                  [item.key]: e.target.checked
                                })}
                                size="small"
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
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
                 onChange={handleNumberChange('backup', 'backupRetention')}
                 inputRef={getInputRef('backup', 'backupRetention')}
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

      {/* Floating Save Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          transform: saveButtonVisible ? 'translateY(0)' : 'translateY(100px)',
          opacity: saveButtonVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          disabled={loading}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            minWidth: 'unset',
            background: saveSuccess 
              ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transform: loading ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
              background: saveSuccess 
                ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)'
                : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          {loading ? (
            <Box
              sx={{
                width: 24,
                height: 24,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          ) : saveSuccess ? (
            <CheckIcon 
              sx={{ 
                fontSize: 28,
                animation: 'checkmark 0.5s ease-in-out',
                '@keyframes checkmark': {
                  '0%': { transform: 'scale(0)', opacity: 0 },
                  '50%': { transform: 'scale(1.2)', opacity: 1 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
              }} 
            />
          ) : (
            <SaveIcon sx={{ fontSize: 28 }} />
          )}
        </Button>
        
        {/* Tooltip */}
        <Box
          sx={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 2,
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: 1,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              border: '6px solid transparent',
              borderLeftColor: 'rgba(0, 0, 0, 0.8)',
            },
            '.MuiButton-root:hover + &': {
              opacity: 1,
            },
          }}
        >
          {loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save All Settings'}
        </Box>
      </Box>

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