const axios = require('axios');
const cheerio = require('cheerio');

class MovieScraper {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        this.timeout = 10000; // 10 seconds timeout
        this.retryDelay = 2000; // 2 seconds between retries
    }

    /**
     * Search for a movie on fojik.site and extract image URL
     * @param {string} movieTitle - The movie title to search for
     * @returns {Promise<string|null>} - The image URL or null if not found
     */
    async searchFojikSite(movieTitle) {
        try {
            console.log(`Searching for "${movieTitle}" on fojik.site...`);
            
            // Clean the movie title for search
            const searchQuery = movieTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
            
            const response = await axios.get('https://fojik.site/', {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                timeout: this.timeout
            });

            const $ = cheerio.load(response.data);
            
            // Look for movie items with images
            const movieItems = $('.movie-item, .film-item, .item, .post, article').toArray();
            
            for (const item of movieItems) {
                const $item = $(item);
                const title = $item.find('h1, h2, h3, .title, .movie-title').text().trim();
                const img = $item.find('img').first();
                
                if (title && this.isMovieMatch(title, searchQuery)) {
                    const imgSrc = img.attr('src') || img.attr('data-src') || img.attr('data-original');
                    if (imgSrc) {
                        const fullImageUrl = this.resolveImageUrl(imgSrc, 'https://fojik.site/');
                        console.log(`Found image for "${movieTitle}" on fojik.site: ${fullImageUrl}`);
                        return fullImageUrl;
                    }
                }
            }

            console.log(`No specific match found for "${movieTitle}" on fojik.site`);
            return null;

        } catch (error) {
            console.error(`Error searching fojik.site for "${movieTitle}":`, error.message);
            return null;
        }
    }

    /**
     * Search for a movie on movielinkbd.to and extract image URL
     * @param {string} movieTitle - The movie title to search for
     * @returns {Promise<string|null>} - The image URL or null if not found
     */
    async searchMovieLinkBD(movieTitle) {
        try {
            console.log(`Searching for "${movieTitle}" on movielinkbd.to...`);
            
            // Clean the movie title for search
            const searchQuery = movieTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
            
            const response = await axios.get('https://movielinkbd.to/', {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                timeout: this.timeout
            });

            const $ = cheerio.load(response.data);
            
            // Look for movie items with images
            const movieItems = $('.movie-item, .film-item, .item, .post, article, .movie-card').toArray();
            
            for (const item of movieItems) {
                const $item = $(item);
                const title = $item.find('h1, h2, h3, .title, .movie-title').text().trim();
                const img = $item.find('img').first();
                
                if (title && this.isMovieMatch(title, searchQuery)) {
                    const imgSrc = img.attr('src') || img.attr('data-src') || img.attr('data-original');
                    if (imgSrc) {
                        const fullImageUrl = this.resolveImageUrl(imgSrc, 'https://movielinkbd.to/');
                        console.log(`Found image for "${movieTitle}" on movielinkbd.to: ${fullImageUrl}`);
                        return fullImageUrl;
                    }
                }
            }

            console.log(`No specific match found for "${movieTitle}" on movielinkbd.to`);
            return null;

        } catch (error) {
            console.error(`Error searching movielinkbd.to for "${movieTitle}":`, error.message);
            return null;
        }
    }

    /**
     * Check if a found title matches the search query with strict matching
     * @param {string} foundTitle - The title found on the website
     * @param {string} searchQuery - The cleaned search query
     * @returns {boolean} - Whether the titles match
     */
    isMovieMatch(foundTitle, searchQuery) {
        const cleanFoundTitle = foundTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
        
        // Exact match (highest priority)
        if (cleanFoundTitle === searchQuery) {
            return true;
        }
        
        // Check if the found title contains the search query as a complete phrase
        if (cleanFoundTitle.includes(searchQuery) && searchQuery.length > 3) {
            return true;
        }
        
        // Word-based matching with stricter criteria
        const foundWords = cleanFoundTitle.split(' ').filter(word => word.length > 2);
        const searchWords = searchQuery.split(' ').filter(word => word.length > 2);
        
        if (searchWords.length === 0 || foundWords.length === 0) {
            return false;
        }
        
        // Check if at least 70% of search words have exact matches in found title
        const matchingWords = searchWords.filter(word => 
            foundWords.some(foundWord => foundWord === word)
        );
        
        const matchRatio = matchingWords.length / searchWords.length;
        return matchRatio >= 0.7 && matchingWords.length >= 2;
    }

    /**
     * Resolve relative image URLs to absolute URLs
     * @param {string} imgSrc - The image source URL
     * @param {string} baseUrl - The base URL of the website
     * @returns {string} - The absolute image URL
     */
    resolveImageUrl(imgSrc, baseUrl) {
        if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
            return imgSrc;
        }
        
        if (imgSrc.startsWith('//')) {
            return 'https:' + imgSrc;
        }
        
        if (imgSrc.startsWith('/')) {
            return baseUrl.replace(/\/$/, '') + imgSrc;
        }
        
        return baseUrl.replace(/\/$/, '') + '/' + imgSrc;
    }

    /**
     * Fetch movie image from multiple sources with fallback
     * @param {string} movieTitle - The movie title to search for
     * @returns {Promise<Object>} - Object containing image URL and source
     */
    async fetchMovieImage(movieTitle) {
        console.log(`Fetching image for movie: "${movieTitle}"`);
        
        // Try fojik.site first
        let imageUrl = await this.searchFojikSite(movieTitle);
        if (imageUrl) {
            return {
                posterUrl: imageUrl,
                backdropUrl: imageUrl, // Use same image for both
                source: 'fojik.site'
            };
        }

        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));

        // Try movielinkbd.to as fallback
        imageUrl = await this.searchMovieLinkBD(movieTitle);
        if (imageUrl) {
            return {
                posterUrl: imageUrl,
                backdropUrl: imageUrl, // Use same image for both
                source: 'movielinkbd.to'
            };
        }

        console.log(`No images found for "${movieTitle}" on any scraping source`);
        return null;
    }

    /**
     * Validate if an image URL is accessible
     * @param {string} imageUrl - The image URL to validate
     * @returns {Promise<boolean>} - Whether the image is accessible
     */
    async validateImageUrl(imageUrl) {
        try {
            const response = await axios.head(imageUrl, {
                headers: { 'User-Agent': this.userAgent },
                timeout: 5000
            });
            return response.status === 200 && response.headers['content-type']?.startsWith('image/');
        } catch (error) {
            console.error(`Image validation failed for ${imageUrl}:`, error.message);
            return false;
        }
    }
}

module.exports = MovieScraper;