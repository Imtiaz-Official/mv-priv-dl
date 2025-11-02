const axios = require('axios');
const MovieScraper = require('./movieScraper');
const MovieImageCache = require('./movieImageCache');

class ImageService {
  constructor() {
    // TMDB API configuration
    this.tmdbApiKey = process.env.TMDB_API_KEY;
    this.tmdbBaseUrl = 'https://api.themoviedb.org/3';
    this.tmdbImageBaseUrl = 'https://image.tmdb.org/t/p';
    
    // Initialize movie scraper for fallback
    this.movieScraper = new MovieScraper();
    this.imageCache = new MovieImageCache();
    
    // Initialize cache
    this.imageCache.initialize().catch(console.error);
    
    // Image size configurations
    this.posterSizes = {
      small: 'w342',
      medium: 'w500',
      large: 'w780',
      original: 'original'
    };
    
    this.backdropSizes = {
      small: 'w780',
      medium: 'w1280',
      large: 'w1920',
      original: 'original'
    };
  }

  /**
   * Search for a movie on TMDB by title and year
   * @param {string} title - Movie title
   * @param {number} year - Release year (optional)
   * @returns {Object|null} Movie data or null if not found
   */
  async searchMovie(title, year = null) {
    try {
      // Check if API key is valid
      if (!this.tmdbApiKey) {
        console.log('TMDB API key not configured, using placeholder images');
        return null;
      }

      const searchUrl = `${this.tmdbBaseUrl}/search/movie`;
      const params = {
        api_key: this.tmdbApiKey,
        query: title,
        language: 'en-US',
        page: 1,
        include_adult: false
      };

      if (year) {
        params.year = year;
      }

      const response = await axios.get(searchUrl, { params });
      
      if (response.data.results && response.data.results.length > 0) {
        // Return the first (most relevant) result
        return response.data.results[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error searching movie on TMDB:', error.message);
      if (error.response && error.response.status === 401) {
        console.error('❌ TMDB API Error: Invalid or expired API key');
        console.error('📝 To get a valid TMDB API key:');
        console.error('   1. Visit https://www.themoviedb.org/');
        console.error('   2. Create a free account');
        console.error('   3. Go to Settings > API');
        console.error('   4. Request an API key');
        console.error('   5. Update your .env file with the new key');
        console.error('🔄 Using placeholder images for now...');
      }
      return null;
    }
  }

  /**
   * Get detailed movie information from TMDB
   * @param {number} movieId - TMDB movie ID
   * @returns {Object|null} Detailed movie data or null if not found
   */
  async getMovieDetails(movieId) {
    try {
      const detailsUrl = `${this.tmdbBaseUrl}/movie/${movieId}`;
      const params = {
        api_key: this.tmdbApiKey,
        language: 'en-US',
        append_to_response: 'credits,images'
      };

      const response = await axios.get(detailsUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details from TMDB:', error.message);
      return null;
    }
  }

  /**
   * Generate image URLs for different sizes
   * @param {string} imagePath - Image path from TMDB
   * @param {string} type - 'poster' or 'backdrop'
   * @param {string} size - Size key (small, medium, large, original)
   * @returns {string} Full image URL
   */
  getImageUrl(imagePath, type = 'poster', size = 'medium') {
    if (!imagePath) return null;
    
    const sizeConfig = type === 'backdrop' ? this.backdropSizes : this.posterSizes;
    const imageSize = sizeConfig[size] || sizeConfig.medium;
    
    return `${this.tmdbImageBaseUrl}/${imageSize}${imagePath}`;
  }

  /**
   * Fetch movie images automatically
   * @param {string} title - Movie title
   * @param {number} year - Release year (optional)
   * @returns {Object} Object containing poster and backdrop URLs
   */
  async fetchMovieImages(title, year = null) {
    try {
      // Search for the movie
      const movieData = await this.searchMovie(title, year);
      
      if (!movieData) {
        console.log(`Movie not found on TMDB: ${title} (${year})`);
        return {
          poster: null,
          backdrop: null,
          tmdbId: null
        };
      }

      // Get detailed information
      const movieDetails = await this.getMovieDetails(movieData.id);
      
      if (!movieDetails) {
        return {
          poster: null,
          backdrop: null,
          tmdbId: movieData.id
        };
      }

      // Generate image URLs
      const poster = this.getImageUrl(movieDetails.poster_path, 'poster', 'large');
      const backdrop = this.getImageUrl(movieDetails.backdrop_path, 'backdrop', 'large');

      return {
        poster,
        backdrop,
        tmdbId: movieDetails.id,
        imdbId: movieDetails.imdb_id,
        overview: movieDetails.overview,
        runtime: movieDetails.runtime,
        genres: movieDetails.genres?.map(g => g.name) || [],
        voteAverage: movieDetails.vote_average,
        releaseDate: movieDetails.release_date
      };
    } catch (error) {
      console.error('Error fetching movie images:', error.message);
      return {
        poster: null,
        backdrop: null,
        tmdbId: null
      };
    }
  }

  /**
   * Get fallback placeholder images
   * @returns {Object} Object containing placeholder image URLs
   */
  getPlaceholderImages() {
    return {
      poster: '/placeholder-movie.svg',
      backdrop: '/placeholder-backdrop.svg'
    };
  }

  /**
   * Fetch images with fallback to scraped images and then placeholders
   * @param {string} title - Movie title
   * @param {number} year - Release year (optional)
   * @returns {Object} Object containing image URLs (real, scraped, or placeholder)
   */
  async fetchImagesWithFallback(title, year = null) {
    console.log(`Fetching images for: ${title} (${year || 'no year'})`);
    
    // Generate unique movie ID
    const movieId = this.imageCache.generateMovieId(title, year || new Date().getFullYear());
    
    // Check cache first
    const cachedImages = this.imageCache.getCachedImage(movieId);
    if (cachedImages) {
      console.log(`Using cached images for: ${title}`);
      await this.imageCache.updateLastUsed(movieId);
      return cachedImages;
    }
    
    // First try TMDB
    const images = await this.fetchMovieImages(title, year);
    
    // If TMDB has images, cache and return them
    if (images.poster && images.backdrop) {
      console.log(`Successfully fetched images from TMDB for: ${title}`);
      const imageData = { ...images, source: 'tmdb' };
      await this.imageCache.cacheImage(movieId, imageData);
      return imageData;
    }
    
    // If TMDB failed or returned incomplete results, try scraping
    console.log(`TMDB images incomplete for "${title}", trying web scraping...`);
    try {
      const scrapedImages = await this.movieScraper.fetchMovieImage(title);
      
      if (scrapedImages && scrapedImages.posterUrl) {
        console.log(`Successfully scraped images for "${title}" from ${scrapedImages.source}`);
        const imageData = {
          poster: scrapedImages.posterUrl,
          backdrop: scrapedImages.backdropUrl,
          tmdbId: images.tmdbId,
          imdbId: images.imdbId,
          overview: images.overview,
          runtime: images.runtime,
          genres: images.genres,
          voteAverage: images.voteAverage,
          releaseDate: images.releaseDate,
          source: scrapedImages.source
        };
        
        // Cache the scraped images
        await this.imageCache.cacheImage(movieId, imageData);
        return imageData;
      }
    } catch (error) {
      console.error(`Error scraping images for "${title}":`, error.message);
    }
    
    // Final fallback to placeholders
    console.log(`Using placeholder images for: ${title}`);
    const placeholders = this.getPlaceholderImages();

    const placeholderData = {
      poster: images.poster || placeholders.poster,
      backdrop: images.backdrop || placeholders.backdrop,
      tmdbId: images.tmdbId,
      imdbId: images.imdbId,
      overview: images.overview,
      runtime: images.runtime,
      genres: images.genres,
      voteAverage: images.voteAverage,
      releaseDate: images.releaseDate,
      source: 'placeholder'
    };
    
    // Don't cache placeholder images
    return placeholderData;
  }
}

module.exports = new ImageService();