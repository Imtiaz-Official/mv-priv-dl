import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  MovieFilter as FilmIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerSections = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Movies', path: '/movies' },
      { name: 'Blog', path: '/blog' },
      { name: 'Search', path: '/movies' },
    ],
    'Categories': [
      { name: 'Action', path: '/movies?genre=action' },
      { name: 'Comedy', path: '/movies?genre=comedy' },
      { name: 'Drama', path: '/movies?genre=drama' },
      { name: 'Horror', path: '/movies?genre=horror' },
    ],
    'Quality': [
      { name: 'HD 720p', path: '/movies?quality=720p' },
      { name: 'Full HD 1080p', path: '/movies?quality=1080p' },
      { name: '4K UHD', path: '/movies?quality=4k' },
      { name: 'BluRay', path: '/movies?quality=bluray' },
    ],
    'Support': [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, url: '#', color: '#1877f2' },
    { name: 'Twitter', icon: TwitterIcon, url: '#', color: '#1da1f2' },
    { name: 'Instagram', icon: InstagramIcon, url: '#', color: '#e4405f' },
    { name: 'YouTube', icon: YouTubeIcon, url: '#', color: '#ff0000' },
  ];

  const contactInfo = [
    { icon: EmailIcon, text: 'contact@moviehub.com', color: theme.palette.primary.main },
    { icon: PhoneIcon, text: '+1 (555) 123-4567', color: theme.palette.secondary.main },
    { icon: LocationIcon, text: '123 Movie Street, Cinema City', color: theme.palette.info.main },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: 'none',
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}20 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}20 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box
                  component={Link}
                  to="/"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 8px 25px rgba(102, 126, 234, 0.4)',
                      },
                    }}
                  >
                    <FilmIcon sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    MovieHub
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  Your ultimate destination for high-quality movie streaming and downloads. 
                  Discover, stream, and enjoy the latest movies in stunning quality with our 
                  modern Material Design interface.
                </Typography>

                {/* Contact Info */}
                <Box sx={{ mb: 3 }}>
                  {contactInfo.map((contact, index) => {
                    const Icon = contact.icon;
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1.5,
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <Icon sx={{ color: contact.color, mr: 1.5, fontSize: 20 }} />
                        <Typography variant="body2">{contact.text}</Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <IconButton
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: 44,
                          height: 44,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                          '&:hover': {
                            background: social.color,
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: `0px 8px 25px ${social.color}40`,
                          },
                        }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    );
                  })}
                </Box>
              </Box>
            </Grid>

            {/* Footer Links */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {Object.entries(footerSections).map(([title, links]) => (
                  <Grid item xs={6} sm={3} key={title}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 2,
                        fontSize: '1rem',
                      }}
                    >
                      {title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {links.map((link) => (
                        <Typography
                          key={link.name}
                          component={Link}
                          to={link.path}
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            textDecoration: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                            '&:hover': {
                              color: theme.palette.primary.main,
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          {link.name}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            © {currentYear} MovieHub. Made with
            <FavoriteIcon sx={{ color: theme.palette.error.main, fontSize: 16 }} />
            using Material Design
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Chip
              label="Material-UI"
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            <Chip
              label="React"
              size="small"
              sx={{
                background: 'rgba(97, 218, 251, 0.2)',
                color: '#61dafb',
                border: '1px solid rgba(97, 218, 251, 0.3)',
              }}
            />
            <Chip
              label="Modern Design"
              size="small"
              sx={{
                background: `rgba(${theme.palette.primary.main.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}40`,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;