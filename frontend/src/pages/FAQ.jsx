import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  useTheme,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Movie as MovieIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

const FAQ = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpIcon },
    { id: 'movies', label: 'Movies & Content', icon: MovieIcon },
    { id: 'downloads', label: 'Downloads', icon: DownloadIcon },
    { id: 'account', label: 'Account & Security', icon: SecurityIcon },
    { id: 'billing', label: 'Billing & Payment', icon: PaymentIcon },
    { id: 'technical', label: 'Technical Support', icon: SupportIcon },
  ];

  const faqs = [
    {
      category: 'movies',
      question: 'How do I search for movies?',
      answer: 'You can search for movies using the search bar in the navigation. Simply type the movie title, genre, or actor name and press enter. You can also use our advanced filters to narrow down your search by year, rating, quality, and genre.',
    },
    {
      category: 'movies',
      question: 'What video qualities are available?',
      answer: 'We offer multiple video qualities including HD 720p, Full HD 1080p, 4K UHD, and BluRay quality. The available quality options depend on the specific movie and source availability.',
    },
    {
      category: 'movies',
      question: 'How often is new content added?',
      answer: 'New movies and TV shows are added regularly. We update our library weekly with the latest releases and popular content. You can check our "Recently Added" section to see the newest additions.',
    },
    {
      category: 'downloads',
      question: 'How do I download movies?',
      answer: 'To download movies, navigate to the movie details page and click the download button. You may need to create an account and be logged in to access download features. Downloads are available in various qualities.',
    },
    {
      category: 'downloads',
      question: 'Are there download limits?',
      answer: 'Download limits depend on your account type. Free users may have daily or monthly limits, while premium users typically have unlimited downloads. Check your account settings for specific limits.',
    },
    {
      category: 'downloads',
      question: 'What file formats are available for download?',
      answer: 'Movies are typically available in MP4 format, which is compatible with most devices and media players. Some content may also be available in other formats like MKV or AVI.',
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button in the navigation bar and fill out the registration form with your email, username, and password. You\'ll receive a confirmation email to verify your account.',
    },
    {
      category: 'account',
      question: 'I forgot my password. How can I reset it?',
      answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a password reset link via email. Follow the instructions in the email to create a new password.',
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile page by clicking on your username in the navigation. From there, you can edit your personal information, change your password, and update your preferences.',
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and various digital payment methods. All payments are processed securely through encrypted connections.',
    },
    {
      category: 'billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won\'t be charged for the next cycle.',
    },
    {
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Slow loading can be caused by various factors. Try clearing your browser cache, disabling browser extensions, or switching to a different browser. If the problem persists, check your internet connection or contact our support team.',
    },
    {
      category: 'technical',
      question: 'Videos won\'t play. How can I fix this?',
      answer: 'Ensure your browser is up to date and supports HTML5 video. Try disabling ad blockers, clearing your browser cache, or switching to a different browser. Make sure you have a stable internet connection.',
    },
    {
      category: 'technical',
      question: 'How do I report a broken link or technical issue?',
      answer: 'You can report technical issues through our Contact Us page or by emailing support@moviehub.com. Please include details about the issue, your browser, and any error messages you received.',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                Frequently Asked Questions
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 4,
                }}
              >
                Find answers to common questions about MovieHub. Can't find what you're looking for? Contact our support team.
              </Typography>

              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  maxWidth: 500,
                  mx: 'auto',
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    color: 'white',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Category Filters */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Chip
                      key={category.id}
                      icon={<Icon />}
                      label={category.label}
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{
                        background: selectedCategory === category.id 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: selectedCategory === category.id 
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: selectedCategory === category.id 
                            ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                            : 'rgba(255, 255, 255, 0.15)',
                        },
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* FAQ List */}
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              {filteredFAQs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}
                  >
                    No FAQs found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    Try adjusting your search or category filter
                  </Typography>
                </Box>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      mb: 2,
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: '0 0 16px 0',
                        boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          margin: '16px 0',
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>

            {/* Contact Support */}
            <Box
              sx={{
                textAlign: 'center',
                mt: 8,
                p: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Still need help?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 3,
                }}
              >
                Can't find the answer you're looking for? Our support team is here to help.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label="Contact Support"
                  component="a"
                  href="/contact"
                  clickable
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
                <Chip
                  label="Email: support@moviehub.com"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    px: 2,
                    py: 1,
                    fontSize: '1rem',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default FAQ;