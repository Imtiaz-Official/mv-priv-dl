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
} from '@mui/material';
import {
  Security as SecurityIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Share as ShareIcon,
  Cookie as CookieIcon,
  ContactMail as ContactIcon,
  Update as UpdateIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const Privacy = () => {
  const theme = useTheme();

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: InfoIcon,
      content: [
        'Personal information you provide when creating an account (name, email, username)',
        'Usage data including pages visited, movies watched, and search queries',
        'Device information such as IP address, browser type, and operating system',
        'Cookies and similar tracking technologies for site functionality and analytics',
        'Payment information when you make purchases (processed securely by third-party providers)',
      ],
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: StorageIcon,
      content: [
        'Provide and maintain our movie streaming and download services',
        'Personalize your experience with movie recommendations',
        'Process transactions and send related information',
        'Send administrative information and service updates',
        'Respond to your comments, questions, and customer service requests',
        'Monitor and analyze usage patterns to improve our services',
        'Detect, prevent, and address technical issues and security threats',
      ],
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: ShareIcon,
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted service providers who assist in operating our website',
        'Legal compliance: We may disclose information when required by law or to protect our rights',
        'Business transfers: Information may be transferred in connection with a merger or acquisition',
        'Aggregated data: We may share anonymized, aggregated data for analytics purposes',
      ],
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: ShieldIcon,
      content: [
        'We implement industry-standard security measures to protect your information',
        'All data transmission is encrypted using SSL/TLS protocols',
        'Regular security audits and vulnerability assessments',
        'Access to personal information is restricted to authorized personnel only',
        'Secure data centers with physical and digital access controls',
        'Regular backups and disaster recovery procedures',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: CookieIcon,
      content: [
        'Essential cookies: Required for basic site functionality and security',
        'Analytics cookies: Help us understand how visitors use our website',
        'Preference cookies: Remember your settings and preferences',
        'Marketing cookies: Used to deliver relevant advertisements (with your consent)',
        'You can control cookie preferences through your browser settings',
        'Disabling certain cookies may limit website functionality',
      ],
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      icon: SecurityIcon,
      content: [
        'Access: Request a copy of the personal information we hold about you',
        'Correction: Request correction of inaccurate or incomplete information',
        'Deletion: Request deletion of your personal information (subject to legal requirements)',
        'Portability: Request transfer of your data to another service provider',
        'Opt-out: Unsubscribe from marketing communications at any time',
        'Account deletion: Delete your account and associated data through your profile settings',
      ],
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: StorageIcon,
      content: [
        'Account information: Retained while your account is active',
        'Usage data: Typically retained for 2 years for analytics purposes',
        'Payment information: Retained as required by law and payment processors',
        'Support communications: Retained for 3 years to improve customer service',
        'Legal compliance: Some data may be retained longer as required by law',
        'Deleted accounts: Most data is deleted within 30 days of account closure',
      ],
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: UpdateIcon,
      content: [
        'We may update this Privacy Policy from time to time',
        'Material changes will be communicated via email or website notification',
        'Continued use of our services constitutes acceptance of updated terms',
        'Previous versions of the policy are available upon request',
        'We encourage you to review this policy periodically',
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
                Privacy Policy
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
                Your privacy is important to us. This Privacy Policy explains how MovieHub collects, uses, and protects your personal information.
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
                  At MovieHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy describes how we collect, use, share, and protect information about you when you use our 
                  movie streaming and download platform. By using our services, you agree to the collection and use of information 
                  in accordance with this policy.
                </Typography>
              </CardContent>
            </Card>

            {/* Policy Sections */}
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

            {/* Contact Information */}
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                mt: 4,
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
                    Contact Us About Privacy
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
                  If you have any questions about this Privacy Policy, your personal information, or would like to exercise 
                  your privacy rights, please contact us:
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <strong>Email:</strong> privacy@moviehub.com
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
                  We will respond to privacy-related inquiries within 30 days of receipt.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Privacy;