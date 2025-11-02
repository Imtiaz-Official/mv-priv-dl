const mongoose = require('mongoose');
const { Movie } = require('../models');
require('dotenv').config();

const checkMovieCount = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const count = await Movie.countDocuments();
    console.log(`Total movies in database: ${count}`);
    
    // Get some sample movie titles
    const sampleMovies = await Movie.find({}, 'title releaseYear').limit(10);
    console.log('\nSample movies:');
    sampleMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

checkMovieCount();