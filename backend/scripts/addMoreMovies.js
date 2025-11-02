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

// Additional movies to reach 100+
const additionalMovies = [
  // More Action Movies
  { title: "Fast & Furious 6", releaseYear: 2013, genres: ["Action", "Adventure", "Crime"], imdbRating: 7.0, description: "Hobbs has Dominic and Brian reassemble their crew to take down a team of mercenaries." },
  { title: "Fast Five", releaseYear: 2011, genres: ["Action", "Adventure", "Crime"], imdbRating: 7.3, description: "Dom and his crew find themselves on the wrong side of the law once again as they try to switch lanes between a ruthless drug lord and a relentless federal agent." },
  { title: "Mission: Impossible - Fallout", releaseYear: 2018, genres: ["Action", "Adventure", "Thriller"], imdbRating: 7.7, description: "Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong." },
  { title: "Casino Royale", releaseYear: 2006, genres: ["Action", "Adventure", "Thriller"], imdbRating: 8.0, description: "After earning 00 status and a licence to kill, Secret Agent James Bond sets out on his first mission as 007." },
  { title: "Skyfall", releaseYear: 2012, genres: ["Action", "Adventure", "Thriller"], imdbRating: 7.8, description: "James Bond's loyalty to M is tested when her past comes back to haunt her." },
  { title: "The Bourne Identity", releaseYear: 2002, genres: ["Action", "Mystery", "Thriller"], imdbRating: 7.9, description: "A man is picked up by a fishing boat, bullet-riddled and suffering from amnesia, before racing to elude assassins and attempting to regain his memory." },
  { title: "The Bourne Supremacy", releaseYear: 2004, genres: ["Action", "Mystery", "Thriller"], imdbRating: 7.7, description: "When Jason Bourne is framed for a CIA operation gone awry, he is forced to resume his former life as a trained assassin to survive." },
  { title: "The Bourne Ultimatum", releaseYear: 2007, genres: ["Action", "Mystery", "Thriller"], imdbRating: 8.0, description: "Jason Bourne dodges a ruthless C.I.A. official and his agents from a new assassination program while searching for the origins of his life as a trained killer." },
  { title: "Iron Man", releaseYear: 2008, genres: ["Action", "Adventure", "Sci-Fi"], imdbRating: 7.9, description: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil." },
  { title: "Captain America: The Winter Soldier", releaseYear: 2014, genres: ["Action", "Adventure", "Sci-Fi"], imdbRating: 7.7, description: "As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent to battle a new threat." },
  
  // More Sci-Fi Movies
  { title: "Alien", releaseYear: 1979, genres: ["Horror", "Sci-Fi"], imdbRating: 8.4, description: "After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form." },
  { title: "Aliens", releaseYear: 1986, genres: ["Action", "Adventure", "Sci-Fi"], imdbRating: 8.3, description: "Fifty-seven years after surviving an apocalyptic attack aboard her space vessel by merciless space creatures, Officer Ripley awakens from hyper-sleep." },
  { title: "2001: A Space Odyssey", releaseYear: 1968, genres: ["Adventure", "Sci-Fi"], imdbRating: 8.3, description: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000." },
  { title: "E.T. the Extra-Terrestrial", releaseYear: 1982, genres: ["Adventure", "Family", "Sci-Fi"], imdbRating: 7.8, description: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world." },
  { title: "Close Encounters of the Third Kind", releaseYear: 1977, genres: ["Drama", "Sci-Fi"], imdbRating: 7.6, description: "Roy Neary, an electric lineman, has his life turned upside down after a close encounter with a UFO." },
  { title: "District 9", releaseYear: 2009, genres: ["Action", "Sci-Fi", "Thriller"], imdbRating: 7.9, description: "Violence ensues after an extraterrestrial race forced to live in slum-like conditions on Earth finds a kindred spirit in a government agent." },
  { title: "Edge of Tomorrow", releaseYear: 2014, genres: ["Action", "Adventure", "Sci-Fi"], imdbRating: 7.9, description: "A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies." },
  { title: "Looper", releaseYear: 2012, genres: ["Action", "Drama", "Sci-Fi"], imdbRating: 7.4, description: "In 2074, when the mob wants to get rid of someone, the target is sent into the past, where a hired gun awaits - someone like Joe." },
  { title: "Pacific Rim", releaseYear: 2013, genres: ["Action", "Adventure", "Sci-Fi"], imdbRating: 6.9, description: "As a war between humankind and monstrous sea creatures wages on, a former pilot and a trainee are paired up to drive a seemingly obsolete special weapon." },
  { title: "Elysium", releaseYear: 2013, genres: ["Action", "Drama", "Sci-Fi"], imdbRating: 6.6, description: "In the year 2154, the very wealthy live on a man-made space station while the rest of the population resides on a ruined Earth." },
  
  // More Horror Movies
  { title: "The Exorcist", releaseYear: 1973, genres: ["Horror"], imdbRating: 8.0, description: "When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter." },
  { title: "Halloween", releaseYear: 1978, genres: ["Horror", "Thriller"], imdbRating: 7.7, description: "Fifteen years after murdering his sister on Halloween night 1963, Michael Myers escapes from a mental hospital and returns to the small town of Haddonfield." },
  { title: "The Thing", releaseYear: 1982, genres: ["Horror", "Mystery", "Sci-Fi"], imdbRating: 8.1, description: "A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims." },
  { title: "Poltergeist", releaseYear: 1982, genres: ["Horror", "Thriller"], imdbRating: 7.3, description: "A family's home is haunted by a host of demonic ghosts." },
  { title: "The Shining", releaseYear: 1980, genres: ["Drama", "Horror"], imdbRating: 8.4, description: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence." },
  { title: "Rosemary's Baby", releaseYear: 1968, genres: ["Drama", "Horror"], imdbRating: 8.0, description: "A young couple trying for a baby move into a fancy apartment surrounded by peculiar neighbors." },
  { title: "Don't Look Now", releaseYear: 1973, genres: ["Drama", "Horror", "Mystery"], imdbRating: 7.1, description: "A married couple grieving the recent death of their young daughter are in Venice when they encounter two elderly sisters." },
  { title: "The Omen", releaseYear: 1976, genres: ["Horror", "Mystery"], imdbRating: 7.5, description: "Mysterious deaths surround an American ambassador. Could the child that he is raising actually be the Antichrist?" },
  { title: "Carrie", releaseYear: 1976, genres: ["Drama", "Horror"], imdbRating: 7.4, description: "Carrie White, a shy, friendless teenage girl who is sheltered by her domineering, religious mother, unleashes her telekinetic powers after being humiliated by her classmates." },
  { title: "The Texas Chain Saw Massacre", releaseYear: 1974, genres: ["Horror"], imdbRating: 7.4, description: "Two siblings and three of their friends en route to visit their grandfather's grave in Texas end up falling victim to a family of cannibalistic psychopaths." },
  
  // More Comedy Movies
  { title: "Anchorman: The Legend of Ron Burgundy", releaseYear: 2004, genres: ["Comedy"], imdbRating: 7.2, description: "Ron Burgundy is San Diego's top-rated newsman in the male-dominated broadcasting of the 1970s, but that's all about to change for Ron and his cronies when an ambitious woman is hired as a new anchor." },
  { title: "Zoolander", releaseYear: 2001, genres: ["Comedy"], imdbRating: 6.5, description: "At the end of his career, a clueless fashion model is brainwashed to kill the Prime Minister of Malaysia." },
  { title: "Dumb and Dumber", releaseYear: 1994, genres: ["Comedy"], imdbRating: 7.3, description: "After a woman leaves a briefcase at the airport terminal, a dumb limo driver and his dumber friend set out on a hilarious cross-country road trip to Aspen to return it." },
  { title: "The Hangover", releaseYear: 2009, genres: ["Comedy"], imdbRating: 7.7, description: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing." },
  { title: "Step Brothers", releaseYear: 2008, genres: ["Comedy"], imdbRating: 6.9, description: "Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry." },
  { title: "Tropic Thunder", releaseYear: 2008, genres: ["Action", "Comedy", "War"], imdbRating: 7.0, description: "Through a series of freak occurrences, a group of actors shooting a big-budget war movie are forced to become the soldiers they are portraying." },
  { title: "Borat", releaseYear: 2006, genres: ["Comedy"], imdbRating: 7.3, description: "Kazakh TV talking head Borat is dispatched to the United States to report on the greatest country in the world." },
  { title: "Napoleon Dynamite", releaseYear: 2004, genres: ["Comedy"], imdbRating: 6.9, description: "A listless and alienated teenager decides to help his new friend win the class presidency in their small western high school." },
  { title: "Meet the Parents", releaseYear: 2000, genres: ["Comedy", "Romance"], imdbRating: 7.0, description: "Male nurse Greg Focker meets his girlfriend's parents before proposing, but her suspicious father is every date's worst nightmare." },
  { title: "There's Something About Mary", releaseYear: 1998, genres: ["Comedy", "Romance"], imdbRating: 7.1, description: "A man gets a chance to meet up with his dream girl from high school, even though his date with her back then was a complete disaster." }
];

// Function to add movies to database
const addMovies = async () => {
  try {
    console.log('🎬 Adding additional movies to reach 100+...');
    
    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }

    // Get current count
    const currentCount = await Movie.countDocuments();
    console.log(`📊 Current movies in database: ${currentCount}`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const movieData of additionalMovies) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ 
          title: { $regex: new RegExp(`^${movieData.title}$`, 'i') }
        });

        if (existingMovie) {
          console.log(`⏭️ Skipping "${movieData.title}" - already exists`);
          skippedCount++;
          continue;
        }

        // Create new movie with correct quality values
        const newMovie = new Movie({
          title: movieData.title,
          description: movieData.description,
          genres: movieData.genres,
          releaseYear: movieData.releaseYear,
          duration: Math.floor(Math.random() * 60) + 90, // Random duration between 90-150 minutes
          rating: {
            average: movieData.imdbRating,
            count: Math.floor(Math.random() * 10000) + 1000
          },
          cast: [], // Will be populated later if needed
          director: "Various Directors", // Placeholder
          poster: null, // Will be auto-fetched by the pre-save hook
          backdrop: null, // Will be auto-fetched by the pre-save hook
          trailer: "",
          quality: [["WEBDL", "BLURAY", "WEBRIP", "DVDRIP"][Math.floor(Math.random() * 4)]],
          size: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9) + 1}GB`,
          languages: ["English"],
          countries: ["United States"],
          views: Math.floor(Math.random() * 100000),
          downloads: Math.floor(Math.random() * 50000),
          featured: Math.random() > 0.8,
          trending: Math.random() > 0.7,
          status: 'published',
          tags: movieData.genres.map(g => g.toLowerCase()),
          createdBy: adminUser._id
        });

        await newMovie.save();
        addedCount++;
        console.log(`✅ Added "${movieData.title}" (${movieData.releaseYear})`);

        // Add small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`❌ Error adding "${movieData.title}":`, error.message);
      }
    }

    // Get final count
    const totalMovies = await Movie.countDocuments();
    
    console.log('\n📊 Final Summary:');
    console.log(`   Movies added: ${addedCount}`);
    console.log(`   Movies skipped: ${skippedCount}`);
    console.log(`   Total movies in database: ${totalMovies}`);
    
    if (totalMovies >= 100) {
      console.log('🎉 SUCCESS! Database now has at least 100 movies!');
    } else {
      console.log(`⚠️ Need ${100 - totalMovies} more movies to reach 100`);
    }

  } catch (error) {
    console.error('❌ Error in addMovies function:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await addMovies();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

module.exports = { addMovies };