import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material';
import {
  Movie as MovieIcon,
  People as PeopleIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingIcon,
  Whatshot as FireIcon,
  Visibility as ViewIcon,
  FiberNew as NewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AnimatedCounter from '../UI/AnimatedCounter';
import { SectionFloatingElements } from '../UI/FloatingElements';

const StatsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)',
    zIndex: -1,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 20,
  padding: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.2)',
    '& .stat-icon': {
      transform: 'scale(1.2) rotate(5deg)',
    },
    '& .stat-glow': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
    zIndex: -1,
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  position: 'relative',
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: 'white',
  },
}));

const StatGlow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '120%',
  height: '120%',
  borderRadius: '50%',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  filter: 'blur(20px)',
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: theme.spacing(1),
  lineHeight: 1,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.9)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const StatDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: 'rgba(255, 255, 255, 0.7)',
  marginTop: theme.spacing(1),
  lineHeight: 1.4,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
}));

const EnhancedStatsSection = ({ stats: customStats, title = "Platform Statistics" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const defaultStats = [
    {
      id: 1,
      label: 'Total Movies',
      value: 15000,
      suffix: '+',
      icon: <MovieIcon />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      glowColor: 'rgba(102, 126, 234, 0.3)',
      description: 'High-quality movies available',
    },
    {
      id: 2,
      label: 'Active Users',
      value: 850000,
      suffix: '+',
      icon: <PeopleIcon />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      glowColor: 'rgba(240, 147, 251, 0.3)',
      description: 'Users streaming daily',
    },
    {
      id: 3,
      label: 'Downloads',
      value: 5200000,
      suffix: '+',
      icon: <DownloadIcon />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      glowColor: 'rgba(79, 172, 254, 0.3)',
      description: 'Movies downloaded',
    },
    {
      id: 4,
      label: 'New Releases',
      value: 120,
      suffix: '+',
      icon: <NewIcon />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      glowColor: 'rgba(67, 233, 123, 0.3)',
      description: 'Added this month',
    },
  ];

  const stats = customStats || defaultStats;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatValue = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  };

  return (
    <StatsContainer>
      <SectionFloatingElements />
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <SectionTitle variant="h3">
            {title}
          </SectionTitle>
        </Fade>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.id || index}>
              <Slide
                direction="up"
                in={isVisible}
                timeout={800 + index * 200}
              >
                <StatsCard>
                  <StatIcon
                    className="stat-icon"
                    sx={{
                      background: stat.color,
                    }}
                  >
                    <StatGlow
                      className="stat-glow"
                      sx={{
                        background: stat.glowColor,
                      }}
                    />
                    {stat.icon}
                  </StatIcon>

                  <StatValue variant="h2">
                    <AnimatedCounter
                      end={stat.value}
                      duration={2000}
                      delay={index * 200}
                      formatter={formatValue}
                      variant="span"
                    />
                    {stat.suffix}
                  </StatValue>

                  <StatLabel variant="h6">
                    {stat.label}
                  </StatLabel>

                  {stat.description && (
                    <StatDescription variant="body2">
                      {stat.description}
                    </StatDescription>
                  )}
                </StatsCard>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StatsContainer>
  );
};

export default EnhancedStatsSection;