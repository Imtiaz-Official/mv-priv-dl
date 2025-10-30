const { body, param, query, validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');

// Sanitize HTML content to prevent XSS
const sanitizeHtml = (value) => {
  if (typeof value === 'string') {
    return DOMPurify.sanitize(value, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
  }
  return value;
};

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Sanitize request body middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeHtml(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
          }
        }
      }
    };
    sanitizeObject(req.body);
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Movie validation rules
const validateMovie = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('releaseYear')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Release year must be a valid year'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number in minutes'),
  
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  
  body('languages')
    .isArray({ min: 1 })
    .withMessage('At least one language is required'),
  
  body('countries')
    .isArray({ min: 1 })
    .withMessage('At least one country is required'),
  
  body('director')
    .trim()
    .notEmpty()
    .withMessage('Director is required'),
  
  body('poster')
    .optional()
    .isURL()
    .withMessage('Poster must be a valid URL'),
  
  handleValidationErrors
];

// Post validation rules
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  
  body('category')
    .isIn([
      'News', 'Reviews', 'Interviews', 'Behind the Scenes',
      'Box Office', 'Awards', 'Trailers', 'Upcoming Movies',
      'TV Shows', 'Streaming', 'Industry News', 'Celebrity News'
    ])
    .withMessage('Invalid category'),
  
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Download validation rules
const validateDownload = [
  body('movie')
    .isMongoId()
    .withMessage('Valid movie ID is required'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Download title is required'),
  
  body('quality')
    .isIn(['CAM', 'TS', 'TC', 'DVDSCR', 'DVDRIP', 'BRRIP', 'WEBRIP', 'WEBDL', 'BLURAY', '4K'])
    .withMessage('Invalid quality'),
  
  body('resolution')
    .isIn(['240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4K'])
    .withMessage('Invalid resolution'),
  
  body('size.value')
    .isFloat({ min: 0.1 })
    .withMessage('File size must be a positive number'),
  
  body('size.unit')
    .isIn(['MB', 'GB', 'TB'])
    .withMessage('Invalid file size unit'),
  
  body('format')
    .isIn(['MP4', 'MKV', 'AVI', 'MOV', 'WMV', 'FLV', 'WEBM'])
    .withMessage('Invalid file format'),
  
  body('downloadLinks')
    .isArray({ min: 1 })
    .withMessage('At least one download link is required'),
  
  body('downloadLinks.*.provider')
    .isIn([
      'Google Drive', 'Mega', 'MediaFire', 'Dropbox', 'OneDrive',
      'Torrent', 'Direct Link', 'Zippyshare', 'Uploaded', 'Rapidgator'
    ])
    .withMessage('Invalid download provider'),
  
  body('downloadLinks.*.url')
    .isURL()
    .withMessage('Download URL must be valid'),
  
  handleValidationErrors
];

// Comment validation rules
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  
  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('genre')
    .optional()
    .isIn([
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
      'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
      'War', 'Western', 'Musical', 'Film-Noir'
    ])
    .withMessage('Invalid genre'),
  
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid year'),
  
  query('quality')
    .optional()
    .isIn(['CAM', 'TS', 'TC', 'DVDSCR', 'DVDRIP', 'BRRIP', 'WEBRIP', 'WEBDL', 'BLURAY', '4K'])
    .withMessage('Invalid quality'),
  
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  sanitizeInput,
  validateUserRegistration,
  validateUserLogin,
  validateMovie,
  validatePost,
  validateDownload,
  validateComment,
  validatePagination,
  validateSearch,
  validateObjectId
};