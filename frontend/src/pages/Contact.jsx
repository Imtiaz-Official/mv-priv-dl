import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  useTheme,
  Fade,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all fields');
      setShowError(true);
      return;
    }

    // Additional frontend validation to match backend requirements
    if (formData.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters long');
      setShowError(true);
      return;
    }

    if (formData.subject.trim().length < 5) {
      setErrorMessage('Subject must be at least 5 characters long');
      setShowError(true);
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long');
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/contact', formData);
      
      if (response.status === 201) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Display detailed validation errors from backend
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        setErrorMessage(errorMessages);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to send message. Please try again later.');
      }
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: EmailIcon,
      title: 'Email Us',
      content: 'contact@moviehub.com',
      description: 'Send us an email anytime',
      color: theme.palette.primary.main,
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm',
      color: theme.palette.secondary.main,
    },
    {
      icon: LocationIcon,
      title: 'Visit Us',
      content: '123 Movie Street, Cinema City',
      description: 'Come say hello at our office',
      color: theme.palette.info.main,
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, url: '#', color: '#1877f2' },
    { name: 'Twitter', icon: TwitterIcon, url: '#', color: '#1da1f2' },
    { name: 'Instagram', icon: InstagramIcon, url: '#', color: '#e4405f' },
    { name: 'YouTube', icon: YouTubeIcon, url: '#', color: '#ff0000' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Contact Information */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    Get in Touch
                  </Typography>
                  
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <Card
                        key={index}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          mb: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${info.color}20`,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Icon sx={{ color: info.color, mr: 2, fontSize: 24 }} />
                            <Typography
                              variant="h6"
                              sx={{ color: 'white', fontWeight: 600 }}
                            >
                              {info.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ color: 'white', mb: 0.5 }}
                          >
                            {info.content}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                          >
                            {info.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Social Links */}
                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: 'white', mb: 2 }}
                    >
                      Follow Us
                    </Typography>
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
                              width: 48,
                              height: 48,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: social.color,
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${social.color}40`,
                              },
                            }}
                          >
                            <Icon fontSize="small" />
                          </IconButton>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Contact Form */}
              <Grid item xs={12} md={8}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 3,
                      }}
                    >
                      Send us a Message
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your full name (min. 2 characters)"
                            helperText="Minimum 2 characters required"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.primary.main,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              '& .MuiFormHelperText-root': {
                                color: 'rgba(255, 255, 255, 0.5)',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Your Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="your.email@example.com"
                            helperText="We'll use this to respond to your message"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.primary.main,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              '& .MuiFormHelperText-root': {
                                color: 'rgba(255, 255, 255, 0.5)',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            placeholder="Brief description of your inquiry (min. 5 characters)"
                            helperText="Minimum 5 characters required"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.primary.main,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              '& .MuiFormHelperText-root': {
                                color: 'rgba(255, 255, 255, 0.5)',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Please provide details about your inquiry or feedback (min. 10 characters)"
                            helperText="Minimum 10 characters required"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.primary.main,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              '& .MuiFormHelperText-root': {
                                color: 'rgba(255, 255, 255, 0.5)',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              py: 1.5,
                              px: 4,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                              },
                              '&:disabled': {
                                background: 'rgba(102, 126, 234, 0.5)',
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                            }}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you for your message! We'll get back to you soon.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;