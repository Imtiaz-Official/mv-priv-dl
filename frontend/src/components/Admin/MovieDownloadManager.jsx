import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  styled,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Movie as MovieIcon,
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ExpandMore as ExpandMoreIcon,
  CloudDownload as CloudDownloadIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
}));

const QualityCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2a2a3e, #1f1f2e)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  marginBottom: theme.spacing(2),
}));

const DownloadLinkCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 8,
  marginBottom: theme.spacing(1),
}));

const MovieDownloadManager = ({ movieId, movieTitle, onClose }) => {
  const [downloads, setDownloads] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    quality: 'BRRIP',
    resolution: '1080p',
    size: { value: '', unit: 'GB' },
    format: 'MP4',
    language: 'English',
    downloadLinks: [{ provider: 'Google Drive', url: '', password: '' }],
  });

  const qualityOptions = ['CAM', 'TS', 'TC', 'DVDSCR', 'DVDRIP', 'BRRIP', 'WEBRIP', 'WEBDL', 'BLURAY', '4K'];
  const resolutionOptions = ['240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4K'];
  const formatOptions = ['MP4', 'MKV', 'AVI', 'MOV', 'WMV', 'FLV', 'WEBM'];
  const sizeUnits = ['MB', 'GB', 'TB'];
  const providerOptions = [
    'Google Drive', 'Mega', 'MediaFire', 'Dropbox', 'OneDrive',
    'WeTransfer', 'SendSpace', 'Zippyshare', 'Rapidgator', 'Uploaded'
  ];

  useEffect(() => {
    if (movieId) {
      fetchDownloads();
    }
  }, [movieId]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/downloads/movie/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDownloads(data.data.downloads || {});
        }
      } else {
        console.error('Failed to fetch downloads');
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
      showSnackbar('Error fetching downloads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (download = null) => {
    if (download) {
      setEditingDownload(download);
      setFormData({
        title: download.title || '',
        quality: download.quality || 'BRRIP',
        resolution: download.resolution || '1080p',
        size: download.size || { value: '', unit: 'GB' },
        format: download.format || 'MP4',
        language: download.language || 'English',
        downloadLinks: download.downloadLinks?.length > 0 
          ? download.downloadLinks.map(link => ({
              provider: link.provider || 'Google Drive',
              url: link.url || '',
              password: link.password || ''
            }))
          : [{ provider: 'Google Drive', url: '', password: '' }],
      });
    } else {
      setEditingDownload(null);
      setFormData({
        title: `${movieTitle} - Download`,
        quality: 'BRRIP',
        resolution: '1080p',
        size: { value: '', unit: 'GB' },
        format: 'MP4',
        language: 'English',
        downloadLinks: [{ provider: 'Google Drive', url: '', password: '' }],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDownload(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSizeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      size: {
        ...prev.size,
        [field]: value
      }
    }));
  };

  const handleDownloadLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addDownloadLink = () => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: [...prev.downloadLinks, { provider: 'Google Drive', url: '', password: '' }]
    }));
  };

  const removeDownloadLink = (index) => {
    if (formData.downloadLinks.length > 1) {
      setFormData(prev => ({
        ...prev,
        downloadLinks: prev.downloadLinks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        movie: movieId,
        ...formData,
        downloadLinks: formData.downloadLinks.filter(link => link.url.trim() !== '')
      };

      const url = editingDownload 
        ? `http://localhost:5000/api/downloads/${editingDownload._id}`
        : 'http://localhost:5000/api/downloads';
      
      const method = editingDownload ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showSnackbar(
            editingDownload ? 'Download updated successfully' : 'Download created successfully'
          );
          handleCloseDialog();
          fetchDownloads();
        }
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving download:', error);
      showSnackbar('Error saving download', 'error');
    }
  };

  const handleDelete = async (downloadId) => {
    if (!window.confirm('Are you sure you want to delete this download?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/downloads/${downloadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showSnackbar('Download deleted successfully');
        fetchDownloads();
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.message || 'Delete failed', 'error');
      }
    } catch (error) {
      console.error('Error deleting download:', error);
      showSnackbar('Error deleting download', 'error');
    }
  };

  const getQualityColor = (quality) => {
    const colors = {
      'CAM': '#f44336',
      'TS': '#ff5722',
      'TC': '#ff9800',
      'DVDSCR': '#ffc107',
      'DVDRIP': '#ffeb3b',
      'BRRIP': '#8bc34a',
      'WEBRIP': '#4caf50',
      'WEBDL': '#009688',
      'BLURAY': '#2196f3',
      '4K': '#9c27b0'
    };
    return colors[quality] || '#757575';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading downloads...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
            Download Management
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {movieTitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
              }
            }}
          >
            Add Download
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Downloads by Quality */}
      {Object.keys(downloads).length > 0 ? (
        Object.entries(downloads).map(([quality, qualityDownloads]) => (
          <QualityCard key={quality}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={quality}
                  sx={{
                    background: getQualityColor(quality),
                    color: 'white',
                    fontWeight: 600,
                    mr: 2
                  }}
                />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {qualityDownloads.length} Download{qualityDownloads.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {qualityDownloads.map((download) => (
                  <Grid item xs={12} key={download._id}>
                    <DownloadLinkCard>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              {download.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                              <Chip label={download.resolution} size="small" color="primary" />
                              <Chip label={download.format} size="small" color="secondary" />
                              <Chip 
                                label={`${download.size?.value || 'N/A'} ${download.size?.unit || ''}`} 
                                size="small" 
                                sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                              />
                              <Chip 
                                label={download.language} 
                                size="small" 
                                sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                              {download.downloadLinks?.length || 0} Download Link{download.downloadLinks?.length !== 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Downloads: {download.downloadCount || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit Download">
                              <IconButton
                                onClick={() => handleOpenDialog(download)}
                                sx={{ color: '#667eea' }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Download">
                              <IconButton
                                onClick={() => handleDelete(download._id)}
                                sx={{ color: '#f44336' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </DownloadLinkCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </QualityCard>
        ))
      ) : (
        <StyledCard>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CloudDownloadIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              No Downloads Available
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Start by adding download links for this movie
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                }
              }}
            >
              Add First Download
            </Button>
          </CardContent>
        </StyledCard>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #2a2a3e, #1f1f2e)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {editingDownload ? 'Edit Download' : 'Add New Download'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Quality</InputLabel>
                <Select
                  value={formData.quality}
                  onChange={(e) => handleFormChange('quality', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  }}
                >
                  {qualityOptions.map(quality => (
                    <MenuItem key={quality} value={quality}>{quality}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Resolution</InputLabel>
                <Select
                  value={formData.resolution}
                  onChange={(e) => handleFormChange('resolution', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  }}
                >
                  {resolutionOptions.map(resolution => (
                    <MenuItem key={resolution} value={resolution}>{resolution}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="File Size"
                type="number"
                value={formData.size.value}
                onChange={(e) => handleSizeChange('value', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Unit</InputLabel>
                <Select
                  value={formData.size.unit}
                  onChange={(e) => handleSizeChange('unit', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  }}
                >
                  {sizeUnits.map(unit => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Format</InputLabel>
                <Select
                  value={formData.format}
                  onChange={(e) => handleFormChange('format', e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  }}
                >
                  {formatOptions.map(format => (
                    <MenuItem key={format} value={format}>{format}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Language"
                value={formData.language}
                onChange={(e) => handleFormChange('language', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
            </Grid>

            {/* Download Links Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Download Links
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addDownloadLink}
                  sx={{ color: '#667eea' }}
                >
                  Add Link
                </Button>
              </Box>

              {formData.downloadLinks.map((link, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Provider</InputLabel>
                        <Select
                          value={link.provider}
                          onChange={(e) => handleDownloadLinkChange(index, 'provider', e.target.value)}
                          sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          }}
                        >
                          {providerOptions.map(provider => (
                            <MenuItem key={provider} value={provider}>{provider}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Download URL"
                        value={link.url}
                        onChange={(e) => handleDownloadLinkChange(index, 'url', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        label="Password (Optional)"
                        value={link.password}
                        onChange={(e) => handleDownloadLinkChange(index, 'password', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        onClick={() => removeDownloadLink(index)}
                        disabled={formData.downloadLinks.length === 1}
                        sx={{ color: '#f44336', mt: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
              }
            }}
          >
            {editingDownload ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieDownloadManager;