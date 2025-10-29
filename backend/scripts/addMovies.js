const mongoose = require('mongoose');
const { Movie, User } = require('../models');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Top 50 movies data extracted from Fojik website
const moviesData = [
  {
    title: "Avengers: Endgame",
    originalTitle: "Avengers: Endgame",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    releaseYear: 2019,
    duration: 181,
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Anthony Russo, Joe Russo",
    cast: [
      { name: "Robert Downey Jr.", character: "Tony Stark / Iron Man" },
      { name: "Chris Evans", character: "Steve Rogers / Captain America" },
      { name: "Mark Ruffalo", character: "Bruce Banner / Hulk" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 8.4,
    quality: ["BLURAY", "WEBDL"],
    size: "2.5GB",
    tags: ["superhero", "marvel", "action", "adventure"]
  },
  {
    title: "Spider-Man: No Way Home",
    originalTitle: "Spider-Man: No Way Home",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    releaseYear: 2021,
    duration: 148,
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Jon Watts",
    cast: [
      { name: "Tom Holland", character: "Peter Parker / Spider-Man" },
      { name: "Zendaya", character: "MJ" },
      { name: "Benedict Cumberbatch", character: "Doctor Strange" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 8.2,
    quality: ["BLURAY", "WEBDL"],
    size: "2.1GB",
    tags: ["superhero", "marvel", "spider-man", "multiverse"]
  },
  {
    title: "The Batman",
    originalTitle: "The Batman",
    description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    releaseYear: 2022,
    duration: 176,
    genres: ["Action", "Crime", "Drama"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Matt Reeves",
    cast: [
      { name: "Robert Pattinson", character: "Bruce Wayne / Batman" },
      { name: "Zoë Kravitz", character: "Selina Kyle / Catwoman" },
      { name: "Paul Dano", character: "The Riddler" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 7.8,
    quality: ["BLURAY", "WEBDL"],
    size: "2.3GB",
    tags: ["batman", "dc", "crime", "thriller"]
  },
  {
    title: "Top Gun: Maverick",
    originalTitle: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    releaseYear: 2022,
    duration: 130,
    genres: ["Action", "Drama"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Joseph Kosinski",
    cast: [
      { name: "Tom Cruise", character: "Pete 'Maverick' Mitchell" },
      { name: "Miles Teller", character: "Bradley 'Rooster' Bradshaw" },
      { name: "Jennifer Connelly", character: "Penny Benjamin" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 8.3,
    quality: ["BLURAY", "WEBDL"],
    size: "1.9GB",
    tags: ["action", "aviation", "military", "sequel"]
  },
  {
    title: "Black Panther: Wakanda Forever",
    originalTitle: "Black Panther: Wakanda Forever",
    description: "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    releaseYear: 2022,
    duration: 161,
    genres: ["Action", "Adventure", "Drama"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Ryan Coogler",
    cast: [
      { name: "Letitia Wright", character: "Shuri" },
      { name: "Angela Bassett", character: "Queen Ramonda" },
      { name: "Tenoch Huerta", character: "Namor" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 6.7,
    quality: ["BLURAY", "WEBDL"],
    size: "2.2GB",
    tags: ["marvel", "superhero", "wakanda", "action"]
  },
  {
    title: "Avatar: The Way of Water",
    originalTitle: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfamily formed on the planet of Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their planet.",
    releaseYear: 2022,
    duration: 192,
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully" },
      { name: "Zoe Saldana", character: "Neytiri" },
      { name: "Sigourney Weaver", character: "Kiri" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 7.6,
    quality: ["BLURAY", "WEBDL", "4K"],
    size: "3.1GB",
    tags: ["avatar", "pandora", "sci-fi", "adventure"]
  },
  {
    title: "Doctor Strange in the Multiverse of Madness",
    originalTitle: "Doctor Strange in the Multiverse of Madness",
    description: "Doctor Strange teams up with a mysterious teenage girl from his dreams who can travel across multiverses, to battle multiple threats, including other-universe versions of himself, which threaten to wipe out millions across the multiverse.",
    releaseYear: 2022,
    duration: 126,
    genres: ["Action", "Adventure", "Fantasy"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Sam Raimi",
    cast: [
      { name: "Benedict Cumberbatch", character: "Doctor Strange" },
      { name: "Elizabeth Olsen", character: "Wanda Maximoff" },
      { name: "Xochitl Gomez", character: "America Chavez" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 6.9,
    quality: ["BLURAY", "WEBDL"],
    size: "1.8GB",
    tags: ["marvel", "multiverse", "magic", "superhero"]
  },
  {
    title: "Thor: Love and Thunder",
    originalTitle: "Thor: Love and Thunder",
    description: "Thor enlists the help of Valkyrie, Korg and ex-girlfriend Jane Foster to fight Gorr the God Butcher, who intends to make the gods extinct.",
    releaseYear: 2022,
    duration: 119,
    genres: ["Action", "Adventure", "Comedy"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Taika Waititi",
    cast: [
      { name: "Chris Hemsworth", character: "Thor" },
      { name: "Natalie Portman", character: "Jane Foster / Mighty Thor" },
      { name: "Christian Bale", character: "Gorr the God Butcher" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 6.2,
    quality: ["BLURAY", "WEBDL"],
    size: "1.7GB",
    tags: ["marvel", "thor", "comedy", "superhero"]
  },
  {
    title: "Minions: The Rise of Gru",
    originalTitle: "Minions: The Rise of Gru",
    description: "The untold story of one twelve-year-old's dream to become the world's greatest supervillain.",
    releaseYear: 2022,
    duration: 87,
    genres: ["Animation", "Adventure", "Comedy"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Kyle Balda",
    cast: [
      { name: "Steve Carell", character: "Gru" },
      { name: "Pierre Coffin", character: "Minions" },
      { name: "Alan Arkin", character: "Wild Knuckles" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 6.5,
    quality: ["BLURAY", "WEBDL"],
    size: "1.2GB",
    tags: ["animation", "family", "comedy", "minions"]
  },
  {
    title: "Jurassic World Dominion",
    originalTitle: "Jurassic World Dominion",
    description: "Four years after the destruction of Isla Nublar, dinosaurs now live and hunt alongside humans all over the world. This fragile balance will reshape the future and determine, once and for all, whether human beings are to remain the apex predators on a planet they now share with history's most fearsome creatures.",
    releaseYear: 2022,
    duration: 147,
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi"],
    countries: ["USA"],
    director: "Colin Trevorrow",
    cast: [
      { name: "Chris Pratt", character: "Owen Grady" },
      { name: "Bryce Dallas Howard", character: "Claire Dearing" },
      { name: "Laura Dern", character: "Dr. Ellie Sattler" }
    ],
    poster: null, // Will be auto-fetched
    backdrop: null, // Will be auto-fetched
    imdbRating: 5.6,
    quality: ["BLURAY", "WEBDL"],
    size: "2.0GB",
    tags: ["dinosaurs", "jurassic", "adventure", "sci-fi"]
  }
];

// Function to add movies to database
const addMovies = async () => {
  try {
    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }

    console.log(`Found admin user: ${adminUser.username}`);
    console.log(`Adding ${moviesData.length} movies to database...`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const movieData of moviesData) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ title: movieData.title });
        if (existingMovie) {
          console.log(`Movie "${movieData.title}" already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Add createdBy field
        const movieWithCreator = {
          ...movieData,
          createdBy: adminUser._id
        };

        // Create and save movie
        const movie = new Movie(movieWithCreator);
        await movie.save();
        
        console.log(`✓ Added: ${movie.title} (${movie.releaseYear})`);
        addedCount++;
      } catch (error) {
        console.error(`Error adding movie "${movieData.title}":`, error.message);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Movies added: ${addedCount}`);
    console.log(`Movies skipped: ${skippedCount}`);
    console.log(`Total processed: ${addedCount + skippedCount}`);

  } catch (error) {
    console.error('Error in addMovies function:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await addMovies();
  await mongoose.connection.close();
  console.log('Database connection closed.');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addMovies };