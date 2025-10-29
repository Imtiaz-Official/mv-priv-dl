# Automatic Image Fetching Feature

## Overview

The Movie Tracker application now includes automatic image fetching functionality that retrieves movie posters and backdrop images from The Movie Database (TMDB) API when movies are created or updated.

## How It Works

### Automatic Fetching
- When a new movie is created with `poster` and/or `backdrop` fields set to `null`, the system automatically fetches images from TMDB
- The system searches for the movie using the title and release year
- If found, it downloads high-quality poster and backdrop images
- Additional metadata like TMDB ID, IMDB ID, and ratings are also retrieved

### Fallback Behavior
- If the movie is not found on TMDB or the API is unavailable, placeholder images are used
- Placeholder images: `/placeholder-movie.svg` and `/placeholder-backdrop.svg`

## Configuration

### TMDB API Key Setup
1. Register for a free account at [The Movie Database](https://www.themoviedb.org/)
2. Navigate to your account settings → API section
3. Request a developer API key (free for non-commercial use)
4. Add your API key to the `.env` file:
   ```
   TMDB_API_KEY=your_actual_api_key_here
   ```

### Environment Variables
```env
TMDB_API_KEY=your_tmdb_api_key_here
MONGODB_URI=mongodb://localhost:27017/movietracker
```

## Usage

### Creating Movies with Automatic Image Fetching

#### Method 1: Set poster/backdrop to null
```javascript
const movie = await Movie.create({
  title: 'Inception',
  releaseYear: 2010,
  description: 'A mind-bending thriller...',
  // ... other required fields
  poster: null,        // Will trigger automatic fetching
  backdrop: null,      // Will trigger automatic fetching
  createdBy: userId
});
```

#### Method 2: Omit poster/backdrop fields entirely
```javascript
const movie = await Movie.create({
  title: 'Inception',
  releaseYear: 2010,
  description: 'A mind-bending thriller...',
  // ... other required fields (poster/backdrop will be auto-fetched)
  createdBy: userId
});
```

### API Endpoint Usage
When creating movies via the API endpoint (`POST /api/movies`), simply omit the `poster` and `backdrop` fields or set them to `null`:

```json
{
  "title": "Inception",
  "releaseYear": 2010,
  "description": "A mind-bending thriller...",
  "genres": ["Action", "Sci-Fi", "Thriller"],
  "languages": ["English"],
  "countries": ["USA"],
  "director": "Christopher Nolan",
  "duration": 148
}
```

## Technical Details

### Pre-save Hook
The automatic image fetching is implemented using a Mongoose pre-save hook in the Movie model that:
1. Checks if the movie is new or the title has been modified
2. Verifies if poster/backdrop are missing or set to placeholders
3. Calls the `imageService.fetchImagesWithFallback()` method
4. Updates the movie document with fetched images and metadata

### Image Service
The `imageService` handles:
- Searching movies on TMDB by title and year
- Fetching detailed movie information including images
- Generating proper image URLs with appropriate sizes
- Providing fallback to placeholder images when needed

### Image Sizes
- **Posters**: w500 (500px width) - `https://image.tmdb.org/t/p/w500/...`
- **Backdrops**: w1280 (1280px width) - `https://image.tmdb.org/t/p/w1280/...`

## Troubleshooting

### Common Issues

1. **401 Unauthorized Error**
   - Check that your TMDB API key is correctly set in the `.env` file
   - Ensure the API key is valid and active

2. **Images Not Fetching**
   - Verify the movie title and year are accurate
   - Check that the TMDB API is accessible
   - Review server logs for specific error messages

3. **Placeholder Images Used**
   - This is normal fallback behavior when movies aren't found on TMDB
   - Ensure movie titles match TMDB database entries

### Logs
The system logs image fetching attempts:
```
Fetching images for movie: Inception (2010)
Images fetched successfully for: Inception
```

## Performance Considerations

- Image fetching adds ~1-2 seconds to movie creation time
- Failed API calls gracefully fall back to placeholders
- Consider implementing caching for frequently accessed movies
- TMDB API has rate limits (check their documentation for current limits)

## Future Enhancements

- Batch image fetching for multiple movies
- Image caching and local storage
- Alternative image sources as fallbacks
- Image optimization and resizing
- Manual image override capabilities