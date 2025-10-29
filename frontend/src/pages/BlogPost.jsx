import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Fade,
  useTheme,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from '../components/UI/Button';
import { PageLoader } from '../components/UI/LoadingSpinner';

const BlogContent = styled(Box)(({ theme }) => ({
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: 'white',
    fontWeight: 600,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  '& p': {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.8,
    marginBottom: theme.spacing(2),
    fontSize: '1.1rem',
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(3, 0),
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: theme.spacing(2),
    borderRadius: 8,
  },
  '& ul, & ol': {
    color: 'rgba(255, 255, 255, 0.8)',
    paddingLeft: theme.spacing(3),
    '& li': {
      marginBottom: theme.spacing(1),
    },
  },
  '& img': {
    width: '100%',
    borderRadius: 12,
    marginBottom: theme.spacing(2),
  },
}));

const RelatedPostCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    background: 'rgba(255, 255, 255, 0.08)',
  },
}));

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const theme = useTheme();

  useEffect(() => {
    // Mock blog post data
    const mockPost = {
      id: parseInt(id),
      title: 'The Evolution of Superhero Movies: From Comics to Cinematic Universe',
      content: `
        <p>The superhero genre has undergone a remarkable transformation over the past few decades, evolving from simple comic book adaptations to complex, interconnected cinematic universes that dominate the global box office.</p>
        
        <h2>The Early Days</h2>
        <p>In the early days of superhero cinema, films like Superman (1978) and Batman (1989) laid the groundwork for what would become one of the most successful genres in Hollywood. These films proved that audiences were hungry for larger-than-life heroes and spectacular action sequences.</p>
        
        <blockquote>"With great power comes great responsibility" - This iconic line from Spider-Man encapsulates the moral complexity that modern superhero films strive to achieve.</blockquote>
        
        <h2>The Marvel Revolution</h2>
        <p>The launch of the Marvel Cinematic Universe with Iron Man (2008) changed everything. Kevin Feige and Marvel Studios created an unprecedented shared universe that connected multiple franchises, culminating in epic crossover events like The Avengers.</p>
        
        <p>Key factors in Marvel's success:</p>
        <ul>
          <li>Consistent tone and quality across films</li>
          <li>Long-term planning and storytelling</li>
          <li>Character development over multiple films</li>
          <li>Strategic casting and direction</li>
        </ul>
        
        <h2>The Impact on Cinema</h2>
        <p>Superhero movies have fundamentally changed how studios approach franchise filmmaking. The success of interconnected storytelling has influenced everything from horror franchises to fantasy epics.</p>
        
        <p>The genre has also pushed the boundaries of visual effects technology, with each new film raising the bar for what's possible on screen. From the realistic suit mechanics in Iron Man to the cosmic spectacle of Guardians of the Galaxy, superhero films continue to innovate.</p>
        
        <h2>Looking Forward</h2>
        <p>As we look to the future, superhero cinema shows no signs of slowing down. With new characters being introduced and existing ones being reimagined, the genre continues to evolve and surprise audiences worldwide.</p>
      `,
      excerpt: 'From comic books to blockbuster films, explore how superhero movies have transformed cinema and created the modern blockbuster landscape.',
      image: '/placeholder-blog.svg',
      author: {
        name: 'Sarah Johnson',
        avatar: '/placeholder-avatar.svg',
        bio: 'Film critic and entertainment journalist with over 10 years of experience covering Hollywood and the entertainment industry.',
      },
      publishDate: '2024-01-12',
      views: 2100,
      comments: 45,
      likes: 156,
      tags: ['Superhero', 'Cinema', 'Analysis', 'Marvel', 'DC'],
      readTime: 8,
    };

    const mockRelatedPosts = [
      {
        id: 1,
        title: 'Top 10 Movies to Watch This Weekend',
        image: '/placeholder-blog.svg',
        publishDate: '2024-01-15',
        readTime: 5,
      },
      {
        id: 3,
        title: 'Behind the Scenes: Movie Production Secrets',
        image: '/placeholder-blog.svg',
        publishDate: '2024-01-10',
        readTime: 6,
      },
      {
        id: 4,
        title: 'The Art of Movie Soundtracks',
        image: '/placeholder-blog.svg',
        publishDate: '2024-01-08',
        readTime: 7,
      },
    ];

    setTimeout(() => {
      setPost(mockPost);
      setRelatedPosts(mockRelatedPosts);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return <PageLoader text="Loading blog post..." />;
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="white" gutterBottom>
          Post Not Found
        </Typography>
        <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 4 }}>
          The blog post you're looking for doesn't exist.
        </Typography>
        <Button component={Link} to="/blog" variant="contained">
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/blog"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Blog
          </Button>
        </Box>

        <Grid container spacing={6}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={600}>
              <Box>
                {/* Hero Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 4,
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {post.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Article Header */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      mb: 3,
                      lineHeight: 1.2,
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={post.author.avatar}
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                          {post.author.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {formatDate(post.publishDate)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.6)' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {post.readTime} min read
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.6)' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {post.views} views
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      onClick={() => setLiked(!liked)}
                      sx={{
                        color: liked ? '#ff4757' : 'rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        },
                      }}
                    >
                      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {post.likes + (liked ? 1 : 0)}
                    </Typography>

                    <IconButton
                      onClick={() => setBookmarked(!bookmarked)}
                      sx={{
                        color: bookmarked ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    >
                      {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>

                    <IconButton
                      onClick={handleShare}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

                {/* Article Content */}
                <BlogContent
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />

                {/* Author Bio */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    mb: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={post.author.avatar}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        About {post.author.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {post.author.bio}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={800}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                {/* Related Posts */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Related Posts
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard key={relatedPost.id}>
                      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                        <CardMedia
                          component={Link}
                          to={`/blog/${relatedPost.id}`}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            overflow: 'hidden',
                            flexShrink: 0,
                            textDecoration: 'none',
                          }}
                        >
                          <Box
                            component="img"
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          />
                        </CardMedia>
                        <CardContent sx={{ p: 0, flex: 1, '&:last-child': { pb: 0 } }}>
                          <Typography
                            variant="subtitle2"
                            component={Link}
                            to={`/blog/${relatedPost.id}`}
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontWeight: 600,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 1,
                              '&:hover': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            {relatedPost.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {formatDate(relatedPost.publishDate)} • {relatedPost.readTime} min read
                          </Typography>
                        </CardContent>
                      </Box>
                    </RelatedPostCard>
                  ))}
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Button
                    component={Link}
                    to="/blog"
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                  >
                    View All Posts
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPost;