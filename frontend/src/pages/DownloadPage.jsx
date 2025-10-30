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
  Shield as ShieldIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Recommend as RecommendIcon,
  GetApp as GetAppIcon,
  FileCopy as FileCopyIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Check as CheckIcon
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
  },
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    minHeight: 'auto',
    paddingBottom: theme.spacing(4),
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
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
  },
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    }
  }
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1a1a2e, #25253a)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(3),
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    borderRadius: '12px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
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
  },
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    padding: '14px 24px',
    fontSize: '1rem',
    minHeight: '48px',
    borderRadius: '10px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    }
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

const QuickDownloadButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '20px 40px',
  fontWeight: 800,
  textTransform: 'none',
  fontSize: '1.3rem',
  background: 'linear-gradient(45deg, #2ed573 0%, #1e90ff 100%)',
  color: 'white',
  minHeight: '70px',
  boxShadow: '0 8px 30px rgba(46, 213, 115, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #26c765 0%, #1c7ed6 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 40px rgba(46, 213, 115, 0.6)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    padding: '16px 32px',
    fontSize: '1.1rem',
    minHeight: '56px',
    borderRadius: '12px',
    width: '100%',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(46, 213, 115, 0.5)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    }
  }
}));

const ShareButton = styled(IconButton)(({ theme, platform }) => ({
  background: platform === 'whatsapp' ? 'linear-gradient(45deg, #25D366, #128C7E)' :
              platform === 'telegram' ? 'linear-gradient(45deg, #0088cc, #005577)' :
              platform === 'facebook' ? 'linear-gradient(45deg, #1877F2, #0d47a1)' :
              platform === 'twitter' ? 'linear-gradient(45deg, #1DA1F2, #0d47a1)' :
              platform === 'copy' ? 'linear-gradient(45deg, #667eea, #764ba2)' :
              'rgba(255, 255, 255, 0.1)',
  color: 'white',
  margin: theme.spacing(0.5),
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    background: platform === 'whatsapp' ? 'linear-gradient(45deg, #2ee86c, #1aa05e)' :
                platform === 'telegram' ? 'linear-gradient(45deg, #0099dd, #006688)' :
                platform === 'facebook' ? 'linear-gradient(45deg, #2988ff, #1e5bb8)' :
                platform === 'twitter' ? 'linear-gradient(45deg, #2eb1ff, #1e5bb8)' :
                platform === 'copy' ? 'linear-gradient(45deg, #778bff, #8b5fbf)' :
                'rgba(255, 255, 255, 0.2)',
  },
  '&:active': {
    transform: 'translateY(0) scale(0.95)',
  },
  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    width: '44px',
    height: '44px',
    margin: theme.spacing(0.25),
    '&:hover': {
      transform: 'translateY(-1px) scale(1.02)',
    }
  }
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
  const [copySuccess, setCopySuccess] = useState(false);

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
            setMovie(movieData.data);
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

  const handleShareClick = (platform) => {
    const url = window.location.href;
    const title = `Download ${movie?.title || 'Movie'}`;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        }).catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      default:
        break;
    }
  };

  const handleQuickDownload = () => {
    if (downloads.length > 0) {
      // Download the first available option
      handleDownloadClick(downloads[0]);
    } else {
      // Download default HD option
      handleDownloadClick({ quality: '1080p', size: '2.1 GB', format: 'MP4' });
    }
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
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: { xs: 3, sm: 4 },
              flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
              <IconButton
                onClick={handleBackClick}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  mr: { xs: 1.5, sm: 2 },
                  minWidth: { xs: '44px', sm: '48px' },
                  minHeight: { xs: '44px', sm: '48px' },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
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
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                  lineHeight: { xs: 1.3, sm: 1.2 },
                  wordBreak: 'break-word',
                }}
              >
                Download {movie?.title}
              </Typography>
            </Box>

            {/* Quick Download Section */}
            <InfoCard sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Quick Download
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                Start downloading immediately with the best available quality
              </Typography>
              <QuickDownloadButton
                size="large"
                startIcon={<GetAppIcon />}
                disabled={!downloadReady}
                onClick={handleQuickDownload}
                sx={{ mb: { xs: 1.5, sm: 2 } }}
              >
                {downloadReady ? 'Quick Download HD' : `Quick Download in ${countdown}s`}
              </QuickDownloadButton>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Or choose specific quality below
              </Typography>
            </InfoCard>

            {/* Movie Info Card */}
            {movie && (
              <InfoCard sx={{ 
                p: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 3 }
              }}>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
                  <Grid item xs={12} sm={4} md={3}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: { 
                          xs: '160px', 
                          sm: '200px', 
                          md: '180px',
                          lg: '220px'
                        },
                        mx: 'auto',
                        aspectRatio: '3/4',
                        borderRadius: { xs: '12px', sm: '16px' },
                        overflow: 'hidden',
                        boxShadow: {
                          xs: '0 4px 16px rgba(0, 0, 0, 0.3)',
                          sm: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: { xs: 'scale(1.02)', sm: 'scale(1.05)' },
                          boxShadow: {
                            xs: '0 6px 24px rgba(0, 0, 0, 0.4)',
                            sm: '0 12px 48px rgba(0, 0, 0, 0.6)'
                          },
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={movie.poster || '/placeholder-movie.svg'}
                        alt={movie.title}
                        loading="lazy"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            filter: { xs: 'brightness(1.05)', sm: 'brightness(1.1)' },
                          }
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder-movie.svg';
                        }}
                      />
                      
                      {/* Image Overlay with Quality Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: { xs: 6, sm: 8 },
                          right: { xs: 6, sm: 8 },
                          background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                          color: 'white',
                          px: { xs: 0.75, sm: 1 },
                          py: { xs: 0.25, sm: 0.5 },
                          borderRadius: { xs: '6px', sm: '8px' },
                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                          }}
                        >
                          <Box
                            sx={{
                              background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                              color: 'white',
                              px: { xs: 0.75, sm: 1 },
                              py: { xs: 0.25, sm: 0.5 },
                              borderRadius: { xs: '6px', sm: '8px' },
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                              textAlign: 'center'
                            }}
                          >
                            HD 1080p
                          </Box>
                          <Box
                            sx={{
                              background: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              px: { xs: 0.5, sm: 0.75 },
                              py: { xs: 0.25, sm: 0.25 },
                              borderRadius: { xs: '4px', sm: '6px' },
                              fontSize: { xs: '0.55rem', sm: '0.65rem' },
                              fontWeight: 500,
                              textAlign: 'center'
                            }}
                          >
                            MP4 | 5.1
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Loading Skeleton Overlay */}
                      {!movie.poster && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite',
                            '@keyframes shimmer': {
                              '0%': { backgroundPosition: '-200% 0' },
                              '100%': { backgroundPosition: '200% 0' }
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Box sx={{ 
                      pl: { xs: 0, sm: 2, md: 3 },
                      pr: { xs: 0, sm: 1 },
                      py: { xs: 2, sm: 0 }
                    }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600, 
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                          textAlign: { xs: 'center', sm: 'left' },
                          lineHeight: { xs: 1.3, sm: 1.2 }
                        }}
                      >
                        {movie.title}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 1, sm: 1.5 }, 
                        mb: { xs: 2, sm: 2.5 }, 
                        flexWrap: 'wrap',
                        justifyContent: { xs: 'center', sm: 'flex-start' }
                      }}>
                        <Chip 
                          label={movie.year} 
                          size="small" 
                          sx={{ 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                          }} 
                        />
                        <Chip 
                          label={movie.genre?.split(',')[0]} 
                          size="small" 
                          sx={{ 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                          }} 
                        />
                        <QualityChip 
                          label="HD 1080p | MP4 | 5.1" 
                          size="small" 
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          mb: { xs: 2.5, sm: 3 },
                          fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                          textAlign: { xs: 'center', sm: 'left' },
                          lineHeight: { xs: 1.5, sm: 1.6 },
                          maxWidth: { xs: '100%', md: '90%' }
                        }}
                      >
                        {movie.description?.substring(0, 150)}...
                      </Typography>
                    
                    {/* Share Options */}
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600,
                          mb: 2,
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          textAlign: { xs: 'center', sm: 'left' }
                        }}
                      >
                        Share This Movie
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 1, sm: 1.5 }, 
                        flexWrap: 'wrap',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        alignItems: 'center'
                      }}>
                        <Tooltip title={copySuccess ? "Link Copied!" : "Copy Link"}>
                          <ShareButton 
                            platform="copy"
                            onClick={() => handleShareClick('copy')}
                            sx={{
                              background: copySuccess ? 'linear-gradient(45deg, #2ed573, #1e90ff)' : undefined
                            }}
                          >
                            {copySuccess ? <CheckIcon fontSize="small" /> : <FileCopyIcon fontSize="small" />}
                          </ShareButton>
                        </Tooltip>
                        
                        <Tooltip title="Share on WhatsApp">
                          <ShareButton platform="whatsapp" onClick={() => handleShareClick('whatsapp')}>
                            <WhatsAppIcon fontSize="small" />
                          </ShareButton>
                        </Tooltip>
                        
                        <Tooltip title="Share on Telegram">
                          <ShareButton platform="telegram" onClick={() => handleShareClick('telegram')}>
                            <TelegramIcon fontSize="small" />
                          </ShareButton>
                        </Tooltip>
                        
                        <Tooltip title="Share on Facebook">
                          <ShareButton platform="facebook" onClick={() => handleShareClick('facebook')}>
                            <FacebookIcon fontSize="small" />
                          </ShareButton>
                        </Tooltip>
                        
                        <Tooltip title="Share on Twitter">
                          <ShareButton platform="twitter" onClick={() => handleShareClick('twitter')}>
                            <TwitterIcon fontSize="small" />
                          </ShareButton>
                        </Tooltip>
                        
                        {/* Share Count/Stats */}
                        <Box sx={{ 
                          ml: { xs: 0, sm: 2 }, 
                          mt: { xs: 1, sm: 0 },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <ShareIcon sx={{ 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            fontSize: '1rem' 
                          }} />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            Share with friends
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    </Box>
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
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                '& .MuiAlert-icon': {
                  color: '#667eea',
                },
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.875rem', sm: '0.875rem' }
                }
              }}
            >
              <Typography variant="body2">
                <strong>Safe Download:</strong> All files are scanned for viruses and malware. Download with confidence.
              </Typography>
            </Alert>

            {/* Countdown or Download Ready */}
            {!downloadReady ? (
              <CountdownBox sx={{ mb: { xs: 3, sm: 4 } }}>
                <TimerIcon />
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
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
                  mb: { xs: 3, sm: 4 },
                  '& .MuiAlert-icon': {
                    color: 'white',
                  },
                  '& .MuiAlert-message': {
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Downloads are now ready!
                </Typography>
              </Alert>
            )}

            {/* Download Options */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
              {downloads.length > 0 ? downloads.map((download, index) => (
                  <Grid item xs={12} key={index}>
                    <Zoom in timeout={1000 + index * 200}>
                      <DownloadCard>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: { xs: 1.5, sm: 2 },
                                flexDirection: { xs: 'column', sm: 'row' },
                                textAlign: { xs: 'center', sm: 'left' }
                              }}>
                                <CloudDownloadIcon sx={{ 
                                  color: '#667eea', 
                                  mr: { xs: 0, sm: 2 }, 
                                  mb: { xs: 1, sm: 0 },
                                  fontSize: { xs: '1.75rem', sm: '2rem' }
                                }} />
                                <Box>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: 'white', 
                                      fontWeight: 600,
                                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                    }}
                                  >
                                    {download.quality || 'HD'} Quality
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                    }}
                                  >
                                    {download.format || 'MP4'} | {typeof download.size === 'object' && download.size?.value && download.size?.unit ? `${download.size.value} ${download.size.unit}` : download.size || '1.2 GB'}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 1, 
                                mb: { xs: 1.5, sm: 2 }, 
                                flexWrap: 'wrap',
                                justifyContent: { xs: 'center', sm: 'flex-start' }
                              }}>
                                <QualityChip label={`${download.quality || 'HD'} | ${download.format || 'MP4'} | 5.1`} size="small" />
                                <SizeChip label={typeof download.size === 'object' && download.size?.value && download.size?.unit ? `${download.size.value} ${download.size.unit}` : download.size || '1.2 GB'} size="small" />
                                <Chip 
                                  label={`${download.format || 'MP4'} H.264`} 
                                  size="small" 
                                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                                />
                              </Box>

                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  textAlign: { xs: 'center', sm: 'left' }
                                }}
                              >
                                High-speed download | Resume supported | No ads
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
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: { xs: 1.5, sm: 2 },
                                flexDirection: { xs: 'column', sm: 'row' },
                                textAlign: { xs: 'center', sm: 'left' }
                              }}>
                                <CloudDownloadIcon sx={{ 
                                  color: '#667eea', 
                                  mr: { xs: 0, sm: 2 }, 
                                  mb: { xs: 1, sm: 0 },
                                  fontSize: { xs: '1.75rem', sm: '2rem' }
                                }} />
                                <Box>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: 'white', 
                                      fontWeight: 600,
                                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                    }}
                                  >
                                    1080p HD Quality
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                    }}
                                  >
                                    MP4 | 2.1 GB
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 1, 
                                mb: { xs: 1.5, sm: 2 }, 
                                flexWrap: 'wrap',
                                justifyContent: { xs: 'center', sm: 'flex-start' }
                              }}>
                                <QualityChip label="1080p HD | MP4 | 5.1" size="small" />
                                <SizeChip label="2.1 GB" size="small" />
                                <Chip 
                                  label="MP4 H.264" 
                                  size="small" 
                                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                                />
                              </Box>

                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  textAlign: { xs: 'center', sm: 'left' }
                                }}
                              >
                                High-speed download | Resume supported | No ads
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
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: { xs: 1.5, sm: 2 },
                                flexDirection: { xs: 'column', sm: 'row' },
                                textAlign: { xs: 'center', sm: 'left' }
                              }}>
                                <CloudDownloadIcon sx={{ 
                                  color: '#667eea', 
                                  mr: { xs: 0, sm: 2 }, 
                                  mb: { xs: 1, sm: 0 },
                                  fontSize: { xs: '1.75rem', sm: '2rem' }
                                }} />
                                <Box>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: 'white', 
                                      fontWeight: 600,
                                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                    }}
                                  >
                                    720p HD Quality
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                    }}
                                  >
                                    MP4 | 1.2 GB
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 1, 
                                mb: { xs: 1.5, sm: 2 }, 
                                flexWrap: 'wrap',
                                justifyContent: { xs: 'center', sm: 'flex-start' }
                              }}>
                                <QualityChip label="720p HD | MP4 | Stereo" size="small" />
                                <SizeChip label="1.2 GB" size="small" />
                                <Chip 
                                  label="MP4 H.264" 
                                  size="small" 
                                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                                />
                              </Box>

                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  textAlign: { xs: 'center', sm: 'left' }
                                }}
                              >
                                High-speed download | Resume supported | No ads
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
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <SecurityIcon sx={{ color: '#667eea', fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Secure
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    Virus-free downloads
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <SpeedIcon sx={{ color: '#667eea', fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Fast
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    High-speed servers
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <ShieldIcon sx={{ color: '#667eea', fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Protected
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    SSL encrypted
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard>
                  <VerifiedIcon sx={{ color: '#667eea', fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Verified
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    Quality guaranteed
                  </Typography>
                </FeatureCard>
              </Grid>
            </Grid>

            {/* Instructions */}
            <InfoCard>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  mb: { xs: 1.5, sm: 2 }, 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                <InfoIcon sx={{ color: '#667eea' }} />
                Download Instructions
              </Typography>
              <List>
                <ListItem sx={{ px: 0, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: '56px' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Click the download button above"
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: '56px' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Choose your preferred quality and format"
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: '56px' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Download will start automatically"
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      } 
                    }}
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