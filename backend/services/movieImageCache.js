const fs = require('fs').promises;
const path = require('path');

class MovieImageCache {
    constructor() {
        this.cacheFile = path.join(__dirname, '../data/movie-image-cache.json');
        this.cache = new Map();
        this.initialized = false;
    }

    /**
     * Initialize the cache by loading from file
     */
    async initialize() {
        if (this.initialized) return;
        
        try {
            // Ensure data directory exists
            const dataDir = path.dirname(this.cacheFile);
            await fs.mkdir(dataDir, { recursive: true });
            
            // Load existing cache
            const data = await fs.readFile(this.cacheFile, 'utf8');
            const cacheData = JSON.parse(data);
            this.cache = new Map(Object.entries(cacheData));
            console.log(`Loaded ${this.cache.size} cached movie images`);
        } catch (error) {
            // File doesn't exist or is invalid, start with empty cache
            console.log('Starting with empty movie image cache');
            this.cache = new Map();
        }
        
        this.initialized = true;
    }

    /**
     * Generate a unique movie ID based on title and year
     * @param {string} title - Movie title
     * @param {number} year - Movie year
     * @returns {string} - Unique movie ID
     */
    generateMovieId(title, year) {
        const cleanTitle = title.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            .trim();
        return `${cleanTitle}-${year}`;
    }

    /**
     * Check if movie image is already cached
     * @param {string} movieId - Unique movie ID
     * @returns {Object|null} - Cached image data or null
     */
    getCachedImage(movieId) {
        return this.cache.get(movieId) || null;
    }

    /**
     * Cache movie image data
     * @param {string} movieId - Unique movie ID
     * @param {Object} imageData - Image URLs and metadata
     */
    async cacheImage(movieId, imageData) {
        this.cache.set(movieId, {
            ...imageData,
            cachedAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        });
        
        await this.saveCache();
    }

    /**
     * Update last used timestamp for cached image
     * @param {string} movieId - Unique movie ID
     */
    async updateLastUsed(movieId) {
        const cached = this.cache.get(movieId);
        if (cached) {
            cached.lastUsed = new Date().toISOString();
            await this.saveCache();
        }
    }

    /**
     * Save cache to file
     */
    async saveCache() {
        try {
            const cacheData = Object.fromEntries(this.cache);
            await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
        } catch (error) {
            console.error('Failed to save movie image cache:', error.message);
        }
    }

    /**
     * Clear old cache entries (older than 30 days)
     */
    async cleanupCache() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        let removedCount = 0;
        for (const [movieId, data] of this.cache.entries()) {
            const lastUsed = new Date(data.lastUsed);
            if (lastUsed < thirtyDaysAgo) {
                this.cache.delete(movieId);
                removedCount++;
            }
        }
        
        if (removedCount > 0) {
            console.log(`Cleaned up ${removedCount} old cached images`);
            await this.saveCache();
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} - Cache statistics
     */
    getStats() {
        return {
            totalCached: this.cache.size,
            cacheFile: this.cacheFile
        };
    }
}

module.exports = MovieImageCache;