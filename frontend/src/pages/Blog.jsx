import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Pagination,
  Fade,
  useTheme,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../components/UI/Button';
import SearchBar from '../components/UI/SearchBar';
import { SectionLoader } from '../components/UI/LoadingSpinner';

const BlogCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    background: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.3)',
  },
}));

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  
  const theme = useTheme();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/posts', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPosts(data.data.posts || []);
          }
        } else {
          // Set empty array if API fails
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <SectionLoader text="Loading blog posts..." />;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Movie Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Stay updated with the latest movie news, reviews, and behind-the-scenes content
          </Typography>
          
          <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <SearchBar
              placeholder="Search blog posts..."
              onSearch={setSearchQuery}
              fullWidth
            />
          </Box>
        </Box>

        {/* Featured Post */}
        {paginatedPosts.length > 0 && (
          <Fade in timeout={600}>
            <Box sx={{ mb: 6 }}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={paginatedPosts[0].image}
                      alt={paginatedPosts[0].title}
                      sx={{
                        objectFit: 'cover',
                        height: { xs: 250, md: 300 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Chip
                        label="Featured"
                        sx={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          fontWeight: 600,
                          mb: 2,
                          alignSelf: 'flex-start',
                        }}
                      />
                      <Typography
                        variant="h4"
                        component={Link}
                        to={`/blog/${paginatedPosts[0].id}`}
                        sx={{
                          color: 'white',
                          textDecoration: 'none',
                          fontWeight: 700,
                          mb: 2,
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {paginatedPosts[0].title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {paginatedPosts[0].excerpt}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                        <Avatar
                          src={paginatedPosts[0].author.avatar}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                            {paginatedPosts[0].author.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {formatDate(paginatedPosts[0].publishDate)} • {paginatedPosts[0].readTime} min read
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          to={`/blog/${paginatedPosts[0].id}`}
                          variant="contained"
                          endIcon={<ArrowIcon />}
                        >
                          Read More
                        </Button>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Fade>
        )}

        {/* Blog Posts Grid */}
        <Grid container spacing={4}>
          {paginatedPosts.slice(1).map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Fade in timeout={800 + index * 100}>
                <BlogCard>
                  <CardMedia
                    component={Link}
                    to={`/blog/${post.id}`}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Box
                      component="img"
                      src={post.image}
                      alt={post.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/blog/${post.id}`}
                      sx={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 600,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={post.author.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                          {post.author.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                          {formatDate(post.publishDate)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ViewIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {post.views}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CommentIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {post.comments}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {post.readTime} min read
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/blog/${post.id}`}
                      variant="outlined"
                      fullWidth
                      endIcon={<ArrowIcon />}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </BlogCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blog;