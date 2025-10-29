const { User, Movie, Download, Post } = require('../models');

class AnalyticsService {
  // Get comprehensive overview statistics
  async getOverviewStats() {
    try {
      const [
        totalUsers,
        activeUsers,
        totalMovies,
        totalDownloads,
        totalViews,
        totalPosts,
        newUsersThisMonth,
        newMoviesThisMonth
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Movie.countDocuments({ status: 'published' }),
        Download.countDocuments({ isActive: true }),
        this.getTotalViews(),
        Post.countDocuments({ status: 'published' }),
        this.getNewUsersThisMonth(),
        this.getNewMoviesThisMonth()
      ]);

      // Calculate monthly growth percentages
      const monthlyGrowth = await this.calculateMonthlyGrowth();

      return {
        totalUsers,
        activeUsers,
        totalMovies,
        totalDownloads: await this.getTotalDownloadCount(),
        totalViews,
        totalPosts,
        newUsersThisMonth,
        newMoviesThisMonth,
        monthlyGrowth: monthlyGrowth.users,
        moviesGrowth: monthlyGrowth.movies,
        downloadsGrowth: monthlyGrowth.downloads,
        viewsGrowth: monthlyGrowth.views
      };
    } catch (error) {
      console.error('Error getting overview stats:', error);
      throw error;
    }
  }

  // Get total views across all movies
  async getTotalViews() {
    try {
      const result = await Movie.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      return result[0]?.totalViews || 0;
    } catch (error) {
      console.error('Error getting total views:', error);
      return 0;
    }
  }

  // Get total download count
  async getTotalDownloadCount() {
    try {
      const result = await Download.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
      ]);
      return result[0]?.totalDownloads || 0;
    } catch (error) {
      console.error('Error getting total download count:', error);
      return 0;
    }
  }

  // Get new users this month
  async getNewUsersThisMonth() {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      return await User.countDocuments({
        createdAt: { $gte: startOfMonth }
      });
    } catch (error) {
      console.error('Error getting new users this month:', error);
      return 0;
    }
  }

  // Get new movies this month
  async getNewMoviesThisMonth() {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      return await Movie.countDocuments({
        status: 'published',
        createdAt: { $gte: startOfMonth }
      });
    } catch (error) {
      console.error('Error getting new movies this month:', error);
      return 0;
    }
  }

  // Calculate monthly growth percentages
  async calculateMonthlyGrowth() {
    try {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const [
        thisMonthUsers,
        lastMonthUsers,
        thisMonthMovies,
        lastMonthMovies,
        thisMonthDownloads,
        lastMonthDownloads
      ] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
        User.countDocuments({ 
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
        }),
        Movie.countDocuments({ 
          status: 'published',
          createdAt: { $gte: startOfThisMonth } 
        }),
        Movie.countDocuments({ 
          status: 'published',
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
        }),
        this.getDownloadsInPeriod(startOfThisMonth, now),
        this.getDownloadsInPeriod(startOfLastMonth, endOfLastMonth)
      ]);

      // Calculate growth percentages
      const usersGrowth = lastMonthUsers > 0 ? 
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0;
      const moviesGrowth = lastMonthMovies > 0 ? 
        ((thisMonthMovies - lastMonthMovies) / lastMonthMovies * 100) : 0;
      const downloadsGrowth = lastMonthDownloads > 0 ? 
        ((thisMonthDownloads - lastMonthDownloads) / lastMonthDownloads * 100) : 0;

      // Calculate views growth (simplified - based on recent activity)
      const viewsGrowth = await this.calculateViewsGrowth();

      return {
        users: Math.round(usersGrowth * 10) / 10,
        movies: Math.round(moviesGrowth * 10) / 10,
        downloads: Math.round(downloadsGrowth * 10) / 10,
        views: Math.round(viewsGrowth * 10) / 10
      };
    } catch (error) {
      console.error('Error calculating monthly growth:', error);
      return { users: 0, movies: 0, downloads: 0, views: 0 };
    }
  }

  // Get downloads in a specific period
  async getDownloadsInPeriod(startDate, endDate) {
    try {
      // Since we don't have download timestamps, we'll use a simplified approach
      // In a real app, you'd track download events with timestamps
      const totalDownloads = await this.getTotalDownloadCount();
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      // Estimate based on total downloads and time period
      return Math.floor(totalDownloads * (daysDiff / 365));
    } catch (error) {
      console.error('Error getting downloads in period:', error);
      return 0;
    }
  }

  // Calculate views growth (simplified)
  async calculateViewsGrowth() {
    try {
      // Get recent movies and their views
      const recentMovies = await Movie.find({
        status: 'published',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }).select('views');

      const recentViews = recentMovies.reduce((sum, movie) => sum + (movie.views || 0), 0);
      const totalViews = await this.getTotalViews();
      
      if (totalViews > 0) {
        return (recentViews / totalViews) * 100;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating views growth:', error);
      return 0;
    }
  }

  // Get top movies by various metrics
  async getTopMovies() {
    try {
      const [topRated, mostViewed, mostDownloaded] = await Promise.all([
        Movie.find({ status: 'published' })
          .sort({ 'rating.average': -1 })
          .limit(10)
          .select('title rating poster slug views'),
        Movie.find({ status: 'published' })
          .sort({ views: -1 })
          .limit(10)
          .select('title views poster slug rating'),
        this.getMostDownloadedMovies()
      ]);

      return {
        topRated,
        mostViewed,
        mostDownloaded
      };
    } catch (error) {
      console.error('Error getting top movies:', error);
      throw error;
    }
  }

  // Get most downloaded movies
  async getMostDownloadedMovies() {
    try {
      const downloads = await Download.find({ isActive: true })
        .populate('movie', 'title poster slug rating')
        .sort({ downloadCount: -1 })
        .limit(10);

      return downloads.map(download => ({
        id: download.movie._id,
        title: download.movie.title,
        poster: download.movie.poster,
        slug: download.movie.slug,
        rating: download.movie.rating,
        downloads: download.downloadCount,
        views: download.movie.views || 0
      }));
    } catch (error) {
      console.error('Error getting most downloaded movies:', error);
      return [];
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      const [recentMovies, recentUsers, recentPosts] = await Promise.all([
        Movie.find({ status: 'published' })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('createdBy', 'username')
          .select('title createdAt createdBy'),
        User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('username createdAt'),
        Post.find({ status: 'published' })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('author', 'username')
          .select('title createdAt author')
      ]);

      const activity = [];

      // Add movie activities
      recentMovies.forEach(movie => {
        activity.push({
          type: 'movie_added',
          title: `New movie: ${movie.title}`,
          time: movie.createdAt,
          user: movie.createdBy?.username || 'System'
        });
      });

      // Add user registrations
      recentUsers.forEach(user => {
        activity.push({
          type: 'user_registered',
          title: 'New user registration',
          time: user.createdAt,
          user: user.username
        });
      });

      // Add post activities
      recentPosts.forEach(post => {
        activity.push({
          type: 'post_published',
          title: `New post: ${post.title}`,
          time: post.createdAt,
          user: post.author?.username || 'Anonymous'
        });
      });

      // Sort by time and return top 10
      return activity
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10)
        .map(item => ({
          ...item,
          time: this.getRelativeTime(item.time)
        }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  // Get genre statistics
  async getGenreStats() {
    try {
      const genreStats = await Movie.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$genres' },
        { $group: { _id: '$genres', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      const totalMovies = await Movie.countDocuments({ status: 'published' });

      return genreStats.map(stat => ({
        genre: stat._id,
        count: stat.count,
        percentage: totalMovies > 0 ? Math.round((stat.count / totalMovies) * 100) : 0
      }));
    } catch (error) {
      console.error('Error getting genre stats:', error);
      return [];
    }
  }

  // Get quality statistics
  async getQualityStats() {
    try {
      const qualityStats = await Download.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$quality', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const totalDownloads = await Download.countDocuments({ isActive: true });

      return qualityStats.map(stat => ({
        quality: stat._id,
        count: stat.count,
        percentage: totalDownloads > 0 ? Math.round((stat.count / totalDownloads) * 100) : 0
      }));
    } catch (error) {
      console.error('Error getting quality stats:', error);
      return [];
    }
  }

  // Helper function to get relative time
  getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  }

  // Get user statistics
  async getUserStats() {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const adminUsers = await User.countDocuments({ role: 'admin' });
      const moderatorUsers = await User.countDocuments({ role: 'moderator' });
      const blockedUsers = await User.countDocuments({ isActive: false });
      const newUsersThisMonth = await this.getNewUsersThisMonth();

      return {
        totalUsers,
        activeUsers,
        adminUsers,
        moderatorUsers,
        blockedUsers,
        newUsersThisMonth
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();