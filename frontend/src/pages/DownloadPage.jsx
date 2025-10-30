import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Paper,
  LinearProgress,
  Fade,
  Zoom,
  Skeleton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Download as DownloadIcon,
  CloudDownload as CloudDownloadIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  Timer as TimerIcon,
  Storage as StorageIcon,
  HighQuality as QualityIcon,
  Language as LanguageIcon,
  Verified as VerifiedIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 70% 30%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
    zIndex: 1,
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const DownloadCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1e1e2e, #2d2d44)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
  }
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1a1a2e, #25253a)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(3),
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '16px 32px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1.1rem',
  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  minHeight: '56px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  }
}));

const QualityChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.9rem',
  height: '32px',
}));

const SizeChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.9rem',
  height: '32px',
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2a2a3e, #1f1f2e)',
  borderRadius: '12px',
  padding: theme.spacing(2.5),
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  }
}));

const CountdownBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ff6b6b, #ee5a24)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.2rem',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const DownloadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [downloadReady, setDownloadReady] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch download timer setting
        const timerResponse = await fetch('http://localhost:5000/api/system/download-timer');
        if (timerResponse.ok) {
          const timerData = await timerResponse.json();
          if (timerData.success) {
            setCountdown(timerData.data.downloadTimer);
          }
        }
        
        // Fetch movie details
        const movieResponse = await fetch(`http://localhost:5000/api/movies/${id}`);
        if (movieResponse.ok) {
          const movieData = await movieResponse.json();
          if (movieData.success) {
            const movieInfo = movieData.data.movie; // Fix: Access movie from data.movie
            setMovie({
              id: movieInfo._id,
              title: movieInfo.title,
              poster: movieInfo.poster || '/placeholder-movie.svg',
              backdrop: movieInfo.backdrop || '/placeholder-backdrop.svg',
              rating: movieInfo.rating?.average || 0,
              year: movieInfo.releaseYear,
              duration: movieInfo.duration,
              views: movieInfo.views || 0,
              quality: movieInfo.quality?.[0] || 'HD',
              genres: movieInfo.genres || [],
              language: movieInfo.languages?.[0] || 'English',
              country: movieInfo.countries?.[0] || 'Unknown',
              director: movieInfo.director || 'Unknown',
              cast: movieInfo.cast || [],
              plot: movieInfo.description || movieInfo.plot || 'No description available.',
              trailer: movieInfo.trailer || '',
              downloadLinks: movieInfo.downloadLinks || [],
              ratings: {
                imdb: movieInfo.imdbRating || movieInfo.rating?.average || 0,
                rotten: movieInfo.rating?.rotten || 0,
                metacritic: movieInfo.rating?.metacritic || 0,
              },
            });
          }
        }

        // Fetch download links
        const downloadsResponse = await fetch(`http://localhost:5000/api/downloads/movie/${id}`);
        if (downloadsResponse.ok) {
          const downloadsData = await downloadsResponse.json();
          if (downloadsData.success) {
            // Flatten the grouped downloads into a single array
            const allDownloads = [];
            Object.values(downloadsData.data.downloads).forEach(qualityGroup => {
              allDownloads.push(...qualityGroup);
            });
            setDownloads(allDownloads);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (countdown > 0 && !downloadReady) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setDownloadReady(true);
    }
  }, [countdown, downloadReady]);

  const handleDownloadClick = async (download) => {
    try {
      setSelectedDownload(download);
      
      // Track the download in the database
      if (download._id || download.id) {
        const downloadId = download._id || download.id;
        const response = await fetch(`http://localhost:5000/api/downloads/${downloadId}/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Download tracked successfully:', data);
        } else {
          console.error('Failed to track download');
        }
      }
      
      // Open the download link
      if (download.downloadLinks && download.downloadLinks.length > 0) {
        // Use the first active download link
        const activeLink = download.downloadLinks.find(link => link.isActive);
        if (activeLink) {
          window.open(activeLink.url, '_blank');
        }
      } else if (download.url) {
        // Fallback for legacy format
        window.open(download.url, '_blank');
      }
    } catch (error) {
      console.error('Error handling download:', error);
      // Still open the download link even if tracking fails
      if (download.downloadLinks && download.downloadLinks.length > 0) {
        const activeLink = download.downloadLinks.find(link => link.isActive);
        if (activeLink) {
          window.open(activeLink.url, '_blank');
        }
      } else if (download.url) {
        window.open(download.url, '_blank');
      }
    }
  };

  const handleBackClick = () => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return (
      <HeroSection>
        <ContentWrapper maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#667eea', mb: 3 }} />
            <Typography variant="h5" sx={{ color: 'white' }}>
              Preparing your downloads...
            </Typography>
          </Box>
        </ContentWrapper>
      </HeroSection>
    );
  }

  return (
    <HeroSection>
      <ContentWrapper maxWidth="md">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton
                onClick={handleBackClick}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  mr: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Download {movie?.title}
              </Typography>
            </Box>

            {/* Movie Info Card */}
            {movie && (
              <InfoCard>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box
                      component="img"
                      src={movie.poster || '/placeholder-movie.svg'}
                      alt={movie.title}
                      sx={{
                        width: '100%',
                        maxWidth: '150px',
                        height: 'auto',
                        borderRadius: '12px',
                        mx: 'auto',
                        display: 'block',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                      {movie.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={movie.year} size="small" sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }} />
                      <Chip label={movie.genres?.[0] || 'Unknown'} size="small" sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }} />
                      <QualityChip label={movie.quality || 'HD'} size="small" />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {movie.plot?.substring(0, 150)}...
                    </Typography>
                  </Grid>
                </Grid>
              </InfoCard>
            )}

            {/* Security Notice */}
            <Alert
              severity="info"
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e, #25253a)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                color: 'white',
                mb: 3,
                '& .MuiAlert-icon': {
                  color: '#667eea',
                }
              }}
            >
              <Typography variant="body2">
                <strong>Safe Download:</strong> All files are scanned for viruses and malware. Download with confidence.
              </Typography>
            </Alert>

            {/* Countdown or Download Ready */}
            {!downloadReady ? (
              <CountdownBox sx={{ mb: 4 }}>
                <TimerIcon />
                <Typography variant="h6">
                  Download will be ready in {countdown} seconds
                </Typography>
              </CountdownBox>
            ) : (
              <Alert
                severity="success"
                sx={{
                  background: 'linear-gradient(145deg, #2ed573, #1e90ff)',
                  border: 'none',
                  color: 'white',
                  mb: 4,
                  '& .MuiAlert-icon': {
                    color: 'white',
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Downloads are now ready!
                </Typography>
              </Alert>
            )}

            {/* Download Options */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {downloads.length > 0 ? downloads.map((download, index) => (
                <Grid item xs={12} key={index}>
                  <Zoom in timeout={1000 + index * 200}>
                    <DownloadCard>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <CloudDownloadIcon sx={{ color: '#667eea', mr: 2, fontSize: '2rem' }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                  {download.quality || 'HD'} Quality
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {download.format || 'MP4'} • {typeof download.size === 'object' && download.size?.value && download.size?.unit ? `${download.size.value} ${download.size.unit}` : download.size || '1.2 GB'}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                              <QualityChip label={download.quality || 'HD'} size="small" />
                              <SizeChip label={typeof download.size === 'object' && download.size?.value && download.size?.unit ? `${download.size.value} ${download.size.unit}` : download.size || '1.2 GB'} size="small" />
                              <Chip 
                                label={download.format || 'MP4'} 
                                size="small" 
                                sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                              />
                            </Box>

                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                              High-speed download • Resume supported • No ads
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <DownloadButton
                              fullWidth
                              startIcon={<DownloadIcon />}
                              disabled={!downloadReady}
                              onClick={() => handleDownloadClick(download)}
                            >
                              {downloadReady ? 'Download Now' : `Wait ${countdown}s`}
                            </DownloadButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </DownloadCard>
                  </Zoom>
                </Grid>
              )) : (
                // Default download options when no specific downloads are available
                <>
                  <Grid item xs={12}>
                    <Zoom in timeout={1000}>
                      <DownloadCard>
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CloudDownloadIcon sx={{ color: '#667eea', mr: 2, fontSize: '2rem' }} />
                                <Box>
                                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                    1080p HD Quality
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    MP4 • 2.1 GB
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <QualityChip label="1080p" size="small" />
                                <SizeChip label="2.1 GB" size="small" />
                                <Chip 
                                  label="MP4" 
                                  size="small" 
                                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                                />
                              </Box>

                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                High-speed download • Resume supported • No ads
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                              <DownloadButton
                                fullWidth
                                startIcon={<DownloadIcon />}
                                disabled={!downloadReady}
                                onClick={() => handleDownloadClick({ quality: '1080p', size: '2.1 GB', format: 'MP4' })}
                              >
                                {downloadReady ? 'Download Now' : `Wait ${countdown}s`}
                              </DownloadButton>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </DownloadCard>
                    </Zoom>
                  </Grid>

                  <Grid item xs={12}>
                    <Zoom in timeout={1200}>
                      <DownloadCard>
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CloudDownloadIcon sx={{ color: '#667eea', mr: 2, fontSize: '2rem' }} />
                                <Box>
                                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                    720p HD Quality
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    MP4 • 1.2 GB
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <QualityChip label="720p" size="small" />
                                <SizeChip label="1.2 GB" size="small" />
                                <Chip 
                                  label="MP4" 
                                  size="small" 
                                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                                />
                              </Box>

                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                High-speed download • Resume supported • No ads
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                              <DownloadButton
                                fullWidth
                                startIcon={<DownloadIcon />}
                                disabled={!downloadReady}
                                onClick={() => handleDownloadClick({ quality: '720p', size: '1.2 GB', format: 'MP4' })}
                              >
                                {downloadReady ? 'Download Now' : `Wait ${countdown}s`}
                              </DownloadButton>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </DownloadCard>
                    </Zoom>
                  </Grid>
                </>
              )}
            </Grid>

            {/* Features */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <SecurityIcon sx={{ color: '#667eea', fontSize: '2.5rem', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    Secure
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Virus-free downloads
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <SpeedIcon sx={{ color: '#667eea', fontSize: '2.5rem', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    Fast
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    High-speed servers
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <ShieldIcon sx={{ color: '#667eea', fontSize: '2.5rem', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    Protected
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    SSL encrypted
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <VerifiedIcon sx={{ color: '#667eea', fontSize: '2.5rem', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Quality guaranteed
                  </Typography>
                </FeatureCard>
              </Grid>
            </Grid>

            {/* Instructions */}
            <InfoCard>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon sx={{ color: '#667eea' }} />
                Download Instructions
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Click the download button above"
                    sx={{ '& .MuiListItemText-primary': { color: 'rgba(255, 255, 255, 0.9)' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Choose your preferred quality and format"
                    sx={{ '& .MuiListItemText-primary': { color: 'rgba(255, 255, 255, 0.9)' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Download will start automatically"
                    sx={{ '& .MuiListItemText-primary': { color: 'rgba(255, 255, 255, 0.9)' } }}
                  />
                </ListItem>
              </List>
            </InfoCard>
          </Box>
        </Fade>
      </ContentWrapper>
    </HeroSection>
  );
};

export default DownloadPage;