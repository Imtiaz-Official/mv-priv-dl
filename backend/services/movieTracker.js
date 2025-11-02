const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const Movie = require('../models/Movie');
const User = require('../models/User');

class MovieTracker {
  constructor() {
    this.isRunning = false;
    this.cronJob = null;
    this.lastCheck = null;
    this.trackedMovies = new Set();
    this.imdbApiKey = process.env.OMDB_API_KEY || ''; // You'll need to get this from http://www.omdbapi.com/
    this.adminUserId = null;
  }

  // Initialize the tracker with existing movies and get admin user ID
  async initialize() {
    try {
      // Get admin user ID for createdBy field
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        this.adminUserId = adminUser._id;
        console.log('Found admin user for movie creation');
      } else {
        console.warn('No admin user found - movies may fail to save');
      }

      const existingMovies = await Movie.find({}, 'title');
      existingMovies.forEach(movie => {
        this.trackedMovies.add(movie.title.toLowerCase());
      });
      console.log(`Initialized tracker with ${this.trackedMovies.size} existing movies`);
    } catch (error) {
      console.error('Error initializing movie tracker:', error);
    }
  }

  // Get movie data from IMDB/OMDB API
  async getIMDBData(title, year = null) {
    if (!this.imdbApiKey) {
      console.warn('OMDB API key not configured');
      return null;
    }

    try {
      const searchParams = new URLSearchParams({
        apikey: this.imdbApiKey,
        t: title,
        type: 'movie',
        plot: 'full'
      });

      if (year) {
        searchParams.append('y', year);
      }

      const response = await axios.get(`http://www.omdbapi.com/?${searchParams}`, {
        timeout: 5000
      });

      if (response.data && response.data.Response === 'True') {
        const data = response.data;
        return {
          title: data.Title,
          year: parseInt(data.Year),
          rating: parseFloat(data.imdbRating) || 0,
          genres: data.Genre ? data.Genre.split(', ') : [],
          description: data.Plot !== 'N/A' ? data.Plot : '',
          poster: data.Poster !== 'N/A' ? data.Poster : null,
          director: data.Director !== 'N/A' ? data.Director : 'Unknown',
          cast: data.Actors !== 'N/A' ? data.Actors.split(', ') : [],
          duration: data.Runtime !== 'N/A' ? parseInt(data.Runtime.replace(' min', '')) : 0,
          country: data.Country !== 'N/A' ? data.Country : 'Unknown',
          language: data.Language !== 'N/A' ? data.Language.split(', ')[0] : 'English',
          imdbId: data.imdbID,
          imdbRating: parseFloat(data.imdbRating) || 0,
          releaseDate: new Date(data.Released !== 'N/A' ? data.Released : `${data.Year}-01-01`)
        };
      }
    } catch (error) {
      console.error(`Error fetching IMDB data for ${title}:`, error.message);
    }
    return null;
  }

  // Scrape Fojik.site for movies
  async scrapeFojikSite() {
    try {
      console.log('Starting movie scraping from Fojik.site...');
      const response = await axios.get('https://fojik.site/', {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const $ = cheerio.load(response.data);
      const movies = [];

      // Updated selectors based on the actual site structure
      const movieElements = $('.post, .movie-item, article, .film-poster, .item').filter((i, el) => {
        const $el = $(el);
        const hasTitle = $el.find('h1, h2, h3, .title, .movie-title, a[title]').length > 0;
        const hasImage = $el.find('img').length > 0;
        return hasTitle || hasImage;
      });

      console.log(`Found ${movieElements.length} potential movie elements`);

      for (let i = 0; i < Math.min(movieElements.length, 50); i++) {
        try {
          const $element = $(movieElements[i]);
          
          // Extract movie information with multiple fallback selectors
          let title = $element.find('h1, h2, h3, .title, .movie-title').first().text().trim();
          if (!title) {
            title = $element.find('a').first().attr('title') || '';
          }
          if (!title) {
            title = $element.find('img').first().attr('alt') || '';
          }

          // Clean up title
          title = title.replace(/\s*\(\d{4}\)\s*/g, '').replace(/\s*\[\d{4}\]\s*/g, '').trim();
          
          if (!title || title.length < 3) continue;

          // Extract year
          const fullText = $element.text();
          const yearMatch = fullText.match(/\b(19|20)\d{2}\b/) || title.match(/\b(19|20)\d{2}\b/);
          const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

          // Extract image
          let image = $element.find('img').first().attr('src') || $element.find('img').first().attr('data-src');
          if (image && !image.startsWith('http')) {
            image = `https://fojik.site${image}`;
          }

          // Extract link
          let link = $element.find('a').first().attr('href');
          if (link && !link.startsWith('http')) {
            link = `https://fojik.site${link}`;
          }

          // Extract quality and other metadata
          const qualityText = fullText.match(/(WEB-DL|HD|4K|1080p|720p|480p|BluRay|DVDRip|CAM)/i);
          let quality = qualityText ? qualityText[1].toUpperCase() : 'HD';
          
          // Map quality values to match enum
          const qualityMap = {
            'WEB-DL': 'WEBDL',
            'BLURAY': 'BLURAY',
            'DVDRIP': 'DVDRIP',
            'BRRIP': 'BRRIP',
            'WEBRIP': 'WEBRIP',
            'CAM': 'CAM',
            'TS': 'TS',
            'TC': 'TC',
            'DVDSCR': 'DVDSCR',
            '4K': '4K',
            'HD': 'WEBRIP'
          };
          quality = qualityMap[quality] || 'WEBRIP';

          // Extract rating if available
          const ratingMatch = fullText.match(/(\d+\.?\d*)\s*\/?\s*10|IMDb:\s*(\d+\.?\d*)/i);
          let rating = ratingMatch ? parseFloat(ratingMatch[1] || ratingMatch[2]) : 0;

          // Get IMDB data for better accuracy
          const imdbData = await this.getIMDBData(title, year);
          
          const movieData = {
            title: imdbData?.title || title,
            releaseYear: imdbData?.year || year,
            description: imdbData?.description || `${title} is a ${year} movie featuring exciting storylines and compelling characters.`,
            poster: imdbData?.poster || image || null,
            backdrop: imdbData?.poster || image,
            duration: imdbData?.duration || Math.floor(Math.random() * 60) + 90,
            genres: imdbData?.genres || ['Drama'],
            languages: [imdbData?.language || 'English'],
            countries: [imdbData?.country || 'USA'],
            director: imdbData?.director || 'Unknown Director',
            cast: imdbData?.cast?.map(actor => ({ name: actor, character: 'Unknown' })) || [{ name: 'Unknown Actor', character: 'Unknown' }],
            quality: [quality],
            imdbId: imdbData?.imdbId,
            imdbRating: imdbData?.imdbRating || rating || Math.random() * 3 + 6,
            rating: {
              average: imdbData?.imdbRating || rating || Math.random() * 3 + 6,
              count: 0
            },
            views: 0,
            downloads: 0,
            featured: false,
            trending: Math.random() > 0.7,
            status: 'published',
            tags: [quality.toLowerCase(), 'fojik'],
            createdBy: this.adminUserId // Add the required createdBy field
          };

          movies.push(movieData);
          
          // Add delay to avoid overwhelming the IMDB API
          if (imdbData) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }

        } catch (error) {
          console.error('Error parsing movie element:', error.message);
        }
      }

      console.log(`Successfully parsed ${movies.length} movies from Fojik.site`);
      return movies;
    } catch (error) {
      console.error('Error scraping Fojik.site:', error.message);
      return [];
    }
  }

  // Scrape MovieLinkBD.to for movies
  async scrapeMovieLinkBD() {
    try {
      console.log('Starting movie scraping from MovieLinkBD.to...');
      const response = await axios.get('https://movielinkbd.to/', {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive'
        }
      });

      const $ = cheerio.load(response.data);
      const movies = [];

      // Look for movie elements in MovieLinkBD structure
      const movieElements = $('.post, .movie-item, .film-item, article, .item').filter((i, el) => {
        const $el = $(el);
        return $el.find('img, a').length > 0;
      });

      console.log(`Found ${movieElements.length} potential movie elements on MovieLinkBD`);

      for (let i = 0; i < Math.min(movieElements.length, 30); i++) {
        try {
          const $element = $(movieElements[i]);
          
          // Extract title
          let title = $element.find('h1, h2, h3, .title').first().text().trim();
          if (!title) {
            title = $element.find('a').first().attr('title') || $element.find('img').first().attr('alt') || '';
          }

          // Clean title
          title = title.replace(/\s*\(\d{4}\)\s*/g, '').replace(/\s*\[\d{4}\]\s*/g, '').trim();
          
          if (!title || title.length < 3) continue;

          // Extract year
          const fullText = $element.text();
          const yearMatch = fullText.match(/\b(19|20)\d{2}\b/);
          const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

          // Extract quality and language info
          const qualityMatch = fullText.match(/(WEB-DL|HD|4K|1080p|720p|BluRay|DVDRip)/i);
          let quality = qualityMatch ? qualityMatch[1].toUpperCase() : 'HD';
          
          // Map quality values to match enum
          const qualityMap = {
            'WEB-DL': 'WEBDL',
            'BLURAY': 'BLURAY',
            'DVDRIP': 'DVDRIP',
            'BRRIP': 'BRRIP',
            'WEBRIP': 'WEBRIP',
            'CAM': 'CAM',
            'TS': 'TS',
            'TC': 'TC',
            'DVDSCR': 'DVDSCR',
            '4K': '4K',
            'HD': 'WEBRIP'
          };
          quality = qualityMap[quality] || 'WEBRIP';

          const languageMatch = fullText.match(/(Hindi|English|Bangla|Korean|Japanese|Dual Audio)/i);
          const language = languageMatch ? languageMatch[1] : 'English';

          // Extract rating
          const ratingMatch = fullText.match(/(\d+\.?\d*)\s*\/?\s*10/);
          let rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

          // Get IMDB data
          const imdbData = await this.getIMDBData(title, year);

          const movieData = {
            title: imdbData?.title || title,
            releaseYear: imdbData?.year || year,
            description: imdbData?.description || `${title} is a ${year} movie featuring exciting storylines and compelling characters.`,
            poster: imdbData?.poster || null,
            backdrop: imdbData?.poster,
            duration: imdbData?.duration || Math.floor(Math.random() * 60) + 90,
            genres: imdbData?.genres || ['Drama'],
            languages: [imdbData?.language || language],
            countries: [imdbData?.country || 'Unknown'],
            director: imdbData?.director || 'Unknown Director',
            cast: imdbData?.cast?.map(actor => ({ name: actor, character: 'Unknown' })) || [{ name: 'Unknown Actor', character: 'Unknown' }],
            quality: [quality],
            imdbId: imdbData?.imdbId,
            imdbRating: imdbData?.imdbRating || rating || Math.random() * 3 + 6,
            rating: {
              average: imdbData?.imdbRating || rating || Math.random() * 3 + 6,
              count: 0
            },
            views: 0,
            downloads: 0,
            featured: false,
            trending: Math.random() > 0.7,
            status: 'published',
            tags: [quality.toLowerCase(), 'movielinkbd', language.toLowerCase()],
            createdBy: this.adminUserId // Add the required createdBy field
          };

          movies.push(movieData);

          // Add delay for IMDB API
          if (imdbData) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }

        } catch (error) {
          console.error('Error parsing MovieLinkBD element:', error.message);
        }
      }

      console.log(`Successfully parsed ${movies.length} movies from MovieLinkBD`);
      return movies;
    } catch (error) {
      console.error('Error scraping MovieLinkBD:', error.message);
      return [];
    }
  }

  // Main scraping function that combines all sources
  async scrapeMovies() {
    try {
      console.log('Starting comprehensive movie scraping...');
      
      const [fojikMovies, movieLinkBDMovies] = await Promise.allSettled([
        this.scrapeFojikSite(),
        this.scrapeMovieLinkBD()
      ]);

      let allMovies = [];
      
      if (fojikMovies.status === 'fulfilled') {
        allMovies = allMovies.concat(fojikMovies.value);
      } else {
        console.error('Fojik scraping failed:', fojikMovies.reason);
      }

      if (movieLinkBDMovies.status === 'fulfilled') {
        allMovies = allMovies.concat(movieLinkBDMovies.value);
      } else {
        console.error('MovieLinkBD scraping failed:', movieLinkBDMovies.reason);
      }

      // Remove duplicates based on title and year
      const uniqueMovies = [];
      const seen = new Set();

      for (const movie of allMovies) {
        const key = `${movie.title.toLowerCase()}-${movie.year}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueMovies.push(movie);
        }
      }

      console.log(`Total unique movies found: ${uniqueMovies.length}`);
      return uniqueMovies;
    } catch (error) {
      console.error('Error in comprehensive movie scraping:', error);
      return [];
    }
  }

  // Add new movies to database
  async addNewMovies(scrapedMovies) {
    let addedCount = 0;
    
    for (const movieData of scrapedMovies) {
      const titleLower = movieData.title.toLowerCase();
      
      if (!this.trackedMovies.has(titleLower)) {
        try {
          // Check if movie already exists in database
          const existingMovie = await Movie.findOne({ 
            $or: [
              { title: { $regex: new RegExp(movieData.title, 'i') } },
              { imdbId: movieData.imdbId }
            ].filter(condition => condition.imdbId || condition.title)
          });
          
          if (!existingMovie) {
            const newMovie = new Movie(movieData);
            await newMovie.save();
            this.trackedMovies.add(titleLower);
            addedCount++;
            console.log(`Added new movie: ${movieData.title} (${movieData.year})`);
          } else {
            this.trackedMovies.add(titleLower);
            console.log(`Movie already exists: ${movieData.title}`);
          }
        } catch (error) {
          console.error(`Error adding movie ${movieData.title}:`, error.message);
        }
      }
    }
    
    return addedCount;
  }

  // Main tracking function
  async trackMovies() {
    if (this.isRunning) {
      console.log('Movie tracking already in progress...');
      return;
    }

    this.isRunning = true;
    this.lastCheck = new Date();

    try {
      console.log('Starting enhanced movie tracking cycle...');
      const scrapedMovies = await this.scrapeMovies();
      const addedCount = await this.addNewMovies(scrapedMovies);
      
      console.log(`Movie tracking completed. Added ${addedCount} new movies out of ${scrapedMovies.length} scraped.`);
      return { success: true, addedCount, totalScraped: scrapedMovies.length };
    } catch (error) {
      console.error('Error in movie tracking:', error);
      return { success: false, error: error.message };
    } finally {
      this.isRunning = false;
    }
  }

  // Start scheduled tracking
  startScheduledTracking(cronExpression = '0 */6 * * *') {
    if (this.cronJob) {
      console.log('Scheduled tracking is already running');
      return false;
    }

    this.cronJob = cron.schedule(cronExpression, async () => {
      console.log('Running scheduled movie tracking...');
      await this.trackMovies();
    }, {
      scheduled: false
    });

    this.cronJob.start();
    console.log(`Started scheduled movie tracking with cron: ${cronExpression}`);
    return true;
  }

  // Stop scheduled tracking
  stopScheduledTracking() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob.destroy();
      this.cronJob = null;
      console.log('Stopped scheduled movie tracking');
      return true;
    }
    return false;
  }

  // Get tracker status
  getStatus() {
    return {
      isRunning: this.isRunning,
      isScheduled: !!this.cronJob,
      lastCheck: this.lastCheck,
      trackedMoviesCount: this.trackedMovies.size,
      imdbApiConfigured: !!this.imdbApiKey
    };
  }

  // Manual trigger
  async manualTrack() {
    return await this.trackMovies();
  }
}

// Create singleton instance
const movieTracker = new MovieTracker();

module.exports = movieTracker;