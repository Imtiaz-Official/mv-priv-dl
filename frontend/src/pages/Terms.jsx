import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Fade,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Copyright as CopyrightIcon,
  Block as BlockIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  ContactMail as ContactIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

const Terms = () => {
  const theme = useTheme();

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: GavelIcon,
      content: [
        'By accessing and using MovieHub, you accept and agree to be bound by these Terms of Service',
        'If you do not agree to these terms, you may not use our services',
        'These terms apply to all visitors, users, and others who access or use the service',
        'We reserve the right to refuse service to anyone for any reason at any time',
      ],
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: AccountIcon,
      content: [
        'You must create an account to access certain features of our service',
        'You are responsible for safeguarding your account credentials',
        'You must provide accurate and complete information when creating your account',
        'You are responsible for all activities that occur under your account',
        'You must notify us immediately of any unauthorized use of your account',
        'We reserve the right to suspend or terminate accounts that violate these terms',
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      icon: SecurityIcon,
      content: [
        'You may not use our service for any unlawful or prohibited purpose',
        'You may not attempt to gain unauthorized access to our systems or networks',
        'You may not distribute malware, viruses, or other harmful code',
        'You may not engage in any activity that disrupts or interferes with our service',
        'You may not use automated systems to access our service without permission',
        'You may not share your account credentials with others',
      ],
    },
    {
      id: 'content-copyright',
      title: 'Content and Copyright',
      icon: CopyrightIcon,
      content: [
        'All content on MovieHub is protected by copyright and other intellectual property laws',
        'You may not reproduce, distribute, or create derivative works without permission',
        'We respect the intellectual property rights of others and expect users to do the same',
        'If you believe your copyright has been infringed, please contact us with a DMCA notice',
        'We will respond to valid copyright infringement claims in accordance with applicable law',
        'Repeat copyright infringers may have their accounts terminated',
      ],
    },
    {
      id: 'prohibited-activities',
      title: 'Prohibited Activities',
      icon: BlockIcon,
      content: [
        'Uploading, downloading, or sharing copyrighted content without authorization',
        'Using the service to distribute illegal or harmful content',
        'Attempting to reverse engineer or hack our systems',
        'Creating multiple accounts to circumvent restrictions',
        'Selling or transferring your account to another person',
        'Using the service for commercial purposes without our written consent',
        'Impersonating another person or entity',
      ],
    },
    {
      id: 'payments-billing',
      title: 'Payments and Billing',
      icon: PaymentIcon,
      content: [
        'Subscription fees are billed in advance on a recurring basis',
        'All fees are non-refundable except as required by law',
        'You authorize us to charge your payment method for all fees',
        'You are responsible for keeping your payment information current',
        'We may change our pricing with 30 days notice to existing subscribers',
        'Failure to pay may result in suspension or termination of your account',
      ],
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      icon: WarningIcon,
      content: [
        'Our service is provided "as is" without warranties of any kind',
        'We do not guarantee uninterrupted or error-free service',
        'We are not liable for any indirect, incidental, or consequential damages',
        'Our total liability is limited to the amount you paid for the service',
        'Some jurisdictions do not allow certain limitations, so these may not apply to you',
        'You use our service at your own risk',
      ],
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: BlockIcon,
      content: [
        'You may terminate your account at any time through your account settings',
        'We may terminate or suspend your account for violation of these terms',
        'Upon termination, your right to use the service ceases immediately',
        'We may delete your account and data after termination',
        'Provisions that should survive termination will remain in effect',
      ],
    },
    {
      id: 'changes-updates',
      title: 'Changes to Terms',
      icon: UpdateIcon,
      content: [
        'We reserve the right to modify these terms at any time',
        'Material changes will be communicated via email or website notification',
        'Continued use of our service constitutes acceptance of updated terms',
        'If you do not agree to changes, you should discontinue use of our service',
        'We encourage you to review these terms periodically',
      ],
    },
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
                Terms of Service
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                Please read these Terms of Service carefully before using MovieHub. These terms govern your use of our movie streaming and download platform.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
            </Box>

            {/* Important Notice */}
            <Alert
              severity="info"
              sx={{
                mb: 4,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                color: 'rgba(255, 255, 255, 0.9)',
                '& .MuiAlert-icon': {
                  color: theme.palette.info.main,
                },
              }}
            >
              <Typography variant="body2">
                <strong>Important:</strong> By using MovieHub, you agree to comply with these Terms of Service. 
                Violation of these terms may result in account suspension or termination.
              </Typography>
            </Alert>

            {/* Introduction */}
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                  }}
                >
                  Welcome to MovieHub! These Terms of Service ("Terms") govern your use of our website and services. 
                  MovieHub provides a platform for streaming and downloading movies and TV shows. By creating an account 
                  or using our services, you agree to be bound by these Terms and our Privacy Policy. Please read them 
                  carefully and contact us if you have any questions.
                </Typography>
              </CardContent>
            </Card>

            {/* Terms Sections */}
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.id}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    mb: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Icon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: 32,
                          mr: 2,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>
                    
                    <List sx={{ p: 0 }}>
                      {section.content.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: theme.palette.primary.main,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: 1.6,
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              );
            })}

            {/* Governing Law */}
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                mb: 4,
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
                  Governing Law and Jurisdiction
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                  in which MovieHub operates, without regard to its conflict of law provisions. Any disputes 
                  arising under these Terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
                </Typography>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ContactIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: 32,
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    Contact Information
                  </Typography>
                </Box>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  If you have any questions about these Terms of Service, please contact us:
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <strong>Email:</strong> legal@moviehub.com
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <strong>Address:</strong> 123 Movie Street, Cinema City, CC 12345
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontStyle: 'italic',
                  }}
                >
                  These Terms of Service are effective as of the date listed above and will remain in effect 
                  until modified or terminated in accordance with the terms herein.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Terms;