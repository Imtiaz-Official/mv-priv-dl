const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const imageService = require('../services/imageService');
require('dotenv').config();

async function forceUpdateAllMovies() {
  try {
    console.log('🚀 Starting force update of all movies...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const movies = await Movie.find({});
    console.log(`📊 Found ${movies.length} movies to update`);
    
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      console.log(`\n🎬 [${i + 1}/${movies.length}] Updating: ${movie.title} (${movie.year})`);
      
      try {
        const images = await imageService.fetchImagesWithFallback(movie.title, movie.year);
        
        movie.poster = images.poster;
        movie.backdrop = images.backdrop;
        movie.tmdbId = images.tmdbId;
        movie.imdbId = images.imdbId;
        
        await movie.save();
        console.log(`✅ Updated ${movie.title} - Source: ${images.source || 'unknown'}`);
        
        // Add delay between requests to be respectful
        if (i < movies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Failed to update ${movie.title}:`, error.message);
      }
    }
    
    console.log('\n🏁 All movies update process completed!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

forceUpdateAllMovies();