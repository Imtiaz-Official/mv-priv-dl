import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudDownload as CloudIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
  Subtitles as SubtitlesIcon,
  AudioFile as AudioIcon,
  VideoFile as VideoIcon,
  Security as SecurityIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}));

const QualityChip = styled(Chip)(({ quality }) => {
  const getQualityColor = (quality) => {
    switch (quality) {
      case '4K':
      case 'BLURAY':
        return { bg: '#4caf50', color: '#fff' };
      case '1080p':
      case 'WEBDL':
        return { bg: '#2196f3', color: '#fff' };
      case '720p':
      case 'WEBRIP':
        return { bg: '#ff9800', color: '#fff' };
      case '480p':
      case 'DVDRIP':
        return { bg: '#f44336', color: '#fff' };
      default:
        return { bg: '#9e9e9e', color: '#fff' };
    }
  };

  const colors = getQualityColor(quality);
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

const ProviderIcon = ({ provider }) => {
  const iconMap = {
    'Google Drive': <CloudIcon />,
    'Mega': <StorageIcon />,
    'MediaFire': <StorageIcon />,
    'Dropbox': <CloudIcon />,
    'OneDrive': <CloudIcon />,
    'Torrent': <SpeedIcon />,
    'Direct Link': <LinkIcon />,
    'Zippyshare': <StorageIcon />,
    'Uploaded': <StorageIcon />,
    'Rapidgator': <StorageIcon />,
  };
  
  return iconMap[provider] || <LinkIcon />;
};

const DownloadCard = ({ download, onDownload }) => {
  const [expanded, setExpanded] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleDownloadClick = (link) => {
    if (link.password) {
      setSelectedLink(link);
      setPasswordDialog(true);
    } else {
      handleDownload(link);
    }
  };

  const handleDownload = (link) => {
    // Increment download count
    if (onDownload) {
      onDownload(download._id, link);
    }
    
    // Open download link
    window.open(link.url, '_blank');
    
    setSnackbar({
      open: true,
      message: `Download started from ${link.provider}`,
      severity: 'success'
    });
    
    setPasswordDialog(false);
    setPassword('');
    setSelectedLink(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Link copied to clipboard',
      severity: 'info'
    });
  };

  const formatFileSize = (size) => {
    return `${size.value} ${size.unit}`;
  };

  const getProviderColor = (provider) => {
    const colorMap = {
      'Google Drive': '#4285f4',
      'Mega': '#d9272e',
      'MediaFire': '#1e74d0',
      'Dropbox': '#0061ff',
      'OneDrive': '#0078d4',
      'Torrent': '#2e7d32',
      'Direct Link': '#6a1b9a',
      'Zippyshare': '#ff5722',
      'Uploaded': '#ff9800',
      'Rapidgator': '#f44336',
    };
    return colorMap[provider] || '#757575';
  };

  return (
    <>
      <StyledCard>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                {download.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <QualityChip
                  label={download.quality}
                  size="small"
                  sx={QualityChip({ quality: download.quality })}
                />
                <Chip
                  label={download.resolution}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                />
                <Chip
                  label={download.format}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                />
              </Box>
            </Box>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'white' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Quick Info */}
          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StorageIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {formatFileSize(download.size)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LanguageIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {download.language}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DownloadIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {download.downloadCount || 0} downloads
              </Typography>
            </Box>
          </Box>

          {/* Download Links */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
              Download Links ({download.downloadLinks?.filter(link => link.isActive).length || 0} available)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {download.downloadLinks?.filter(link => link.isActive).slice(0, 3).map((link, index) => (
                <Button
                  key={index}
                  variant="contained"
                  size="small"
                  startIcon={<ProviderIcon provider={link.provider} />}
                  onClick={() => handleDownloadClick(link)}
                  sx={{
                    backgroundColor: getProviderColor(link.provider),
                    '&:hover': {
                      backgroundColor: getProviderColor(link.provider),
                      filter: 'brightness(0.9)',
                    },
                    minWidth: 'auto',
                    fontSize: '0.75rem',
                  }}
                >
                  {link.provider}
                  {link.password && <SecurityIcon sx={{ ml: 0.5, fontSize: 14 }} />}
                </Button>
              ))}
              {download.downloadLinks?.filter(link => link.isActive).length > 3 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setExpanded(true)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                >
                  +{download.downloadLinks.filter(link => link.isActive).length - 3} more
                </Button>
              )}
            </Box>
          </Box>

          {/* Expanded Content */}
          <Collapse in={expanded}>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
            
            {/* Technical Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Technical Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <VideoIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Video Codec
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {download.videoCodec || 'H.264'}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AudioIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Audio Codec
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {download.audioCodec || 'AAC'}
                  </Typography>
                </Box>
                {download.bitrate && (
                  <>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Video Bitrate
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {download.bitrate.video || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Audio Bitrate
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {download.bitrate.audio || 'N/A'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>

            {/* Audio Tracks */}
            {download.audioTracks && download.audioTracks.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                  Audio Tracks
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {download.audioTracks.map((track, index) => (
                    <Chip
                      key={index}
                      label={`${track.language} (${track.quality})`}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Subtitles */}
            {download.subtitles && download.subtitles.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                  Subtitles Available
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {download.subtitles.map((subtitle, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      startIcon={<SubtitlesIcon />}
                      onClick={() => window.open(subtitle.url, '_blank')}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    >
                      {subtitle.language}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* All Download Links */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                All Download Links
              </Typography>
              <List sx={{ p: 0 }}>
                {download.downloadLinks?.filter(link => link.isActive).map((link, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: getProviderColor(link.provider),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ProviderIcon provider={link.provider} />
                        </Box>
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {link.provider}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {link.password && (
                              <Chip
                                label="Password Protected"
                                size="small"
                                icon={<SecurityIcon />}
                                sx={{
                                  backgroundColor: 'rgba(255, 152, 0, 0.2)',
                                  color: '#ff9800',
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                            {link.expiresAt && (
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Expires: {new Date(link.expiresAt).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Copy Link">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(link.url)}
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadClick(link)}
                          sx={{
                            backgroundColor: getProviderColor(link.provider),
                            '&:hover': {
                              backgroundColor: getProviderColor(link.provider),
                              filter: 'brightness(0.9)',
                            },
                          }}
                        >
                          Download
                        </Button>
                      </Box>
                    </ListItem>
                    {index < download.downloadLinks.filter(link => link.isActive).length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Notes */}
            {download.notes && (
              <Box sx={{ mt: 3 }}>
                <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: 'white',
                    '& .MuiAlert-icon': { color: '#2196f3' },
                  }}
                >
                  {download.notes}
                </Alert>
              </Box>
            )}
          </Collapse>
        </CardContent>
      </StyledCard>

      {/* Password Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Password Required
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            This download link is password protected. Please enter the password to continue.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#2196f3' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDownload(selectedLink)}
            variant="contained"
            disabled={!password}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

export default DownloadCard;