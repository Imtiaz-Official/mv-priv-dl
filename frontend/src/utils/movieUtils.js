/**
 * Utility functions for movie-related operations
 */

/**
 * Generate a URL-friendly slug from a movie title
 * @param {string} title - The movie title
 * @returns {string} - URL-friendly slug
 */
export const generateMovieSlug = (title) => {
  if (!title || typeof title !== 'string') return '';
  
  return title
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate movie URL from movie object or title and ID
 * @param {object|string} movieOrTitle - Movie object or title string
 * @param {string|number} id - The movie ID (fallback, used when first param is string)
 * @returns {string} - Movie URL path
 */
export const generateMovieUrl = (movieOrTitle, id) => {
  let title, movieId;
  
  // Handle movie object
  if (typeof movieOrTitle === 'object' && movieOrTitle !== null) {
    title = movieOrTitle.title;
    movieId = movieOrTitle._id || movieOrTitle.id;
  } else {
    // Handle separate title and id parameters
    title = movieOrTitle;
    movieId = id;
  }
  
  const slug = generateMovieSlug(title);
  return `/movie/${slug || movieId}`;
};

/**
 * Extract movie identifier from URL slug
 * This function will be used to determine if we have a slug or an ID
 * @param {string} param - The URL parameter (slug or ID)
 * @returns {object} - Object with type and value
 */
export const parseMovieParam = (param) => {
  if (!param) return { type: 'id', value: null };
  
  // If it's a number, treat as ID
  if (/^\d+$/.test(param)) {
    return { type: 'id', value: param };
  }
  
  // Otherwise, treat as slug
  return { type: 'slug', value: param };
};

/**
 * Convert slug back to a searchable title format
 * @param {string} slug - The URL slug
 * @returns {string} - Title format for searching
 */
export const slugToTitle = (slug) => {
  if (!slug) return '';
  
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};