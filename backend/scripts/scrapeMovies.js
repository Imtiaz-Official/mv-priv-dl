const mongoose = require('mongoose');
const MovieTracker = require('../services/movieTracker');
const { Movie } = require('../models');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Main function to scrape and add movies
const scrapeAndAddMovies = async () => {
  try {
    console.log('🎬 Starting movie scraping process...');
    
    // Get initial movie count
    const initialCount = await Movie.countDocuments();
    console.log(`📊 Current movies in database: ${initialCount}`);
    
    // Initialize movie tracker
    const movieTracker = new MovieTracker();
    await movieTracker.initialize();
    
    // Scrape movies from both sites
    console.log('🔍 Scraping movies from fojik.site and movielinkbd.to...');
    const scrapedMovies = await movieTracker.scrapeMovies();
    
    if (scrapedMovies.length === 0) {
      console.log('⚠️ No movies found during scraping');
      return;
    }
    
    console.log(`🎯 Found ${scrapedMovies.length} unique movies to process`);
    
    // Add new movies to database
    console.log('💾 Adding new movies to database...');
    const addedCount = await movieTracker.addNewMovies(scrapedMovies);
    
    // Get final movie count
    const finalCount = await Movie.countDocuments();
    
    console.log('\n📈 Scraping Results:');
    console.log(`   Initial movies: ${initialCount}`);
    console.log(`   Movies scraped: ${scrapedMovies.length}`);
    console.log(`   New movies added: ${addedCount}`);
    console.log(`   Final movie count: ${finalCount}`);
    
    if (finalCount >= 100) {
      console.log('✅ Success! Database now has at least 100 movies');
    } else {
      console.log(`⚠️ Database has ${finalCount} movies. Need ${100 - finalCount} more to reach 100`);
    }
    
  } catch (error) {
    console.error('❌ Error during movie scraping:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await scrapeAndAddMovies();
};

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

module.exports = { scrapeAndAddMovies };