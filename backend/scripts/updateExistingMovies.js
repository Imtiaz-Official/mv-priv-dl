const mongoose = require('mongoose');
const { Movie } = require('../models');
const imageService = require('../services/imageService');
require('dotenv').config({ path: './.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Update existing movies with real images
const updateExistingMovies = async () => {
  try {
    console.log('🔍 Finding movies with placeholder images...');
    
    // Find movies that have placeholder images or no images
    const movies = await Movie.find({
      $or: [
        { poster: '/placeholder-movie.svg' },
        { poster: { $exists: false } },
        { poster: null },
        { poster: '' },
        { backdrop: '/placeholder-backdrop.svg' },
        { backdrop: { $exists: false } },
        { backdrop: null },
        { backdrop: '' }
      ]
    });

    console.log(`📊 Found ${movies.length} movies that need image updates`);

    if (movies.length === 0) {
      console.log('✅ All movies already have proper images!');
      return;
    }

    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      console.log(`\n🎬 Processing ${i + 1}/${movies.length}: "${movie.title}" (${movie.releaseYear || 'Unknown year'})`);

      try {
        // Fetch images and metadata from TMDB
        const enrichedData = await imageService.fetchImagesWithFallback(
          movie.title,
          movie.releaseYear
        );

        // Prepare update data
        const updateData = {};
        let hasUpdates = false;

        // Update poster if we got a real image (not placeholder)
        if (enrichedData.poster && enrichedData.poster !== '/placeholder-movie.svg') {
          updateData.poster = enrichedData.poster;
          hasUpdates = true;
          console.log(`  📸 Updated poster: ${enrichedData.poster}`);
        }

        // Update backdrop if we got a real image (not placeholder)
        if (enrichedData.backdrop && enrichedData.backdrop !== '/placeholder-backdrop.svg') {
          updateData.backdrop = enrichedData.backdrop;
          hasUpdates = true;
          console.log(`  🖼️  Updated backdrop: ${enrichedData.backdrop}`);
        }

        // Update other metadata if available and not already set
        if (enrichedData.tmdbId && !movie.tmdbId) {
          updateData.tmdbId = enrichedData.tmdbId;
          hasUpdates = true;
          console.log(`  🆔 Added TMDB ID: ${enrichedData.tmdbId}`);
        }

        if (enrichedData.imdbId && !movie.imdbId) {
          updateData.imdbId = enrichedData.imdbId;
          hasUpdates = true;
          console.log(`  🎭 Added IMDb ID: ${enrichedData.imdbId}`);
        }

        if (enrichedData.overview && (!movie.description || movie.description.trim() === '')) {
          updateData.description = enrichedData.overview;
          hasUpdates = true;
          console.log(`  📝 Added description`);
        }

        if (enrichedData.runtime && !movie.duration) {
          updateData.duration = enrichedData.runtime;
          hasUpdates = true;
          console.log(`  ⏱️  Added duration: ${enrichedData.runtime} minutes`);
        }

        if (enrichedData.genres && enrichedData.genres.length > 0 && (!movie.genres || movie.genres.length === 0)) {
          updateData.genres = enrichedData.genres;
          hasUpdates = true;
          console.log(`  🎭 Added genres: ${enrichedData.genres.join(', ')}`);
        }

        if (enrichedData.voteAverage && !movie.imdbRating) {
          updateData.imdbRating = enrichedData.voteAverage;
          hasUpdates = true;
          console.log(`  ⭐ Added rating: ${enrichedData.voteAverage}`);
        }

        // Update the movie if we have changes
        if (hasUpdates) {
          await Movie.findByIdAndUpdate(movie._id, updateData);
          updatedCount++;
          console.log(`  ✅ Successfully updated "${movie.title}"`);
        } else {
          console.log(`  ℹ️  No updates available for "${movie.title}"`);
        }

        // Add delay to respect API rate limits
        if (i < movies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }

      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error updating "${movie.title}":`, error.message);
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} movies`);
    console.log(`❌ Errors encountered: ${errorCount} movies`);
    console.log(`📝 Total processed: ${movies.length} movies`);

  } catch (error) {
    console.error('❌ Error in updateExistingMovies:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🚀 Starting existing movies image update process...');
  
  await connectDB();
  await updateExistingMovies();
  
  console.log('🏁 Update process completed!');
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the script
main();