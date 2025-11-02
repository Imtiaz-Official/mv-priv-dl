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

// Large collection of popular movies
const moviesData = [
  // Action Movies
  { title: "John Wick", releaseYear: 2014, genres: ["Action", "Thriller"], imdbRating: 7.4, description: "An ex-hitman comes out of retirement to track down the gangsters that took everything from him." },
  { title: "John Wick: Chapter 2", releaseYear: 2017, genres: ["Action", "Thriller"], imdbRating: 7.5, description: "After returning to the criminal underworld to repay a debt, John Wick discovers that a large bounty has been put on his life." },
  { title: "John Wick: Chapter 3 - Parabellum", releaseYear: 2019, genres: ["Action", "Thriller"], imdbRating: 7.4, description: "John Wick is on the run after killing a member of the international assassins' guild." },
  { title: "Mad Max: Fury Road", releaseYear: 2015, genres: ["Action", "Adventure"], imdbRating: 8.1, description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland." },
  { title: "The Dark Knight", releaseYear: 2008, genres: ["Action", "Crime", "Drama"], imdbRating: 9.0, description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests." },
  { title: "Inception", releaseYear: 2010, genres: ["Action", "Sci-Fi", "Thriller"], imdbRating: 8.8, description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
  { title: "The Matrix", releaseYear: 1999, genres: ["Action", "Sci-Fi"], imdbRating: 8.7, description: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix." },
  { title: "Gladiator", releaseYear: 2000, genres: ["Action", "Adventure", "Drama"], imdbRating: 8.5, description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery." },
  { title: "Die Hard", releaseYear: 1988, genres: ["Action", "Thriller"], imdbRating: 8.2, description: "An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles." },
  { title: "Terminator 2: Judgment Day", releaseYear: 1991, genres: ["Action", "Sci-Fi"], imdbRating: 8.6, description: "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son John Connor from a more advanced and powerful cyborg." },
  
  // Sci-Fi Movies
  { title: "Blade Runner 2049", releaseYear: 2017, genres: ["Sci-Fi", "Thriller"], imdbRating: 8.0, description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard." },
  { title: "Interstellar", releaseYear: 2014, genres: ["Adventure", "Drama", "Sci-Fi"], imdbRating: 8.6, description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { title: "The Martian", releaseYear: 2015, genres: ["Adventure", "Drama", "Sci-Fi"], imdbRating: 8.0, description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive." },
  { title: "Arrival", releaseYear: 2016, genres: ["Drama", "Sci-Fi"], imdbRating: 7.9, description: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world." },
  { title: "Ex Machina", releaseYear: 2014, genres: ["Drama", "Sci-Fi", "Thriller"], imdbRating: 7.7, description: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence." },
  { title: "Dune", releaseYear: 2021, genres: ["Action", "Adventure", "Drama"], imdbRating: 8.0, description: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset." },
  { title: "Gravity", releaseYear: 2013, genres: ["Drama", "Sci-Fi", "Thriller"], imdbRating: 7.7, description: "Two astronauts work together to survive after an accident leaves them stranded in space." },
  { title: "Star Wars: The Force Awakens", releaseYear: 2015, genres: ["Action", "Adventure", "Fantasy"], imdbRating: 7.8, description: "As a new threat to the galaxy rises, Rey, a desert scavenger, and Finn, an ex-stormtrooper, must join Han Solo and Chewbacca to search for the one hope of restoring peace." },
  { title: "Star Wars: The Last Jedi", releaseYear: 2017, genres: ["Action", "Adventure", "Fantasy"], imdbRating: 6.9, description: "The surviving Resistance faces the First Order once more in the final chapter of the sequel trilogy." },
  { title: "Guardians of the Galaxy", releaseYear: 2014, genres: ["Action", "Adventure", "Comedy"], imdbRating: 8.0, description: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe." },
  
  // Horror Movies
  { title: "Get Out", releaseYear: 2017, genres: ["Horror", "Mystery", "Thriller"], imdbRating: 7.7, description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness becomes a nightmare." },
  { title: "A Quiet Place", releaseYear: 2018, genres: ["Drama", "Horror", "Sci-Fi"], imdbRating: 7.5, description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing." },
  { title: "Hereditary", releaseYear: 2018, genres: ["Drama", "Horror", "Mystery"], imdbRating: 7.3, description: "A grieving family is haunted by tragedy and disturbing secrets." },
  { title: "The Conjuring", releaseYear: 2013, genres: ["Horror", "Mystery", "Thriller"], imdbRating: 7.5, description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse." },
  { title: "It", releaseYear: 2017, genres: ["Horror"], imdbRating: 7.3, description: "In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster, which disguises itself as a clown." },
  { title: "The Babadook", releaseYear: 2014, genres: ["Drama", "Horror", "Mystery"], imdbRating: 6.8, description: "A single mother and her child fall into a deep well of paranoia when an eerie children's book titled 'Mister Babadook' manifests in their home." },
  { title: "Midsommar", releaseYear: 2019, genres: ["Drama", "Horror", "Mystery"], imdbRating: 7.1, description: "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival." },
  { title: "The Witch", releaseYear: 2015, genres: ["Drama", "Fantasy", "Horror"], imdbRating: 6.9, description: "A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession." },
  { title: "Us", releaseYear: 2019, genres: ["Horror", "Mystery", "Thriller"], imdbRating: 6.8, description: "A family's serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them." },
  { title: "The Lighthouse", releaseYear: 2019, genres: ["Drama", "Fantasy", "Horror"], imdbRating: 7.4, description: "Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s." },
  
  // Comedy Movies
  { title: "Parasite", releaseYear: 2019, genres: ["Comedy", "Drama", "Thriller"], imdbRating: 8.5, description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan." },
  { title: "Knives Out", releaseYear: 2019, genres: ["Comedy", "Crime", "Drama"], imdbRating: 7.9, description: "A detective investigates the death of a patriarch of an eccentric, combative family." },
  { title: "The Grand Budapest Hotel", releaseYear: 2014, genres: ["Adventure", "Comedy", "Crime"], imdbRating: 8.1, description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy." },
  { title: "Jojo Rabbit", releaseYear: 2019, genres: ["Comedy", "Drama", "War"], imdbRating: 7.9, description: "A young German boy in the Hitler Youth whose hero and imaginary friend is the country's dictator is shocked to discover his mother is hiding a Jewish girl." },
  { title: "Once Upon a Time in Hollywood", releaseYear: 2019, genres: ["Comedy", "Drama"], imdbRating: 7.6, description: "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age." },
  { title: "The Nice Guys", releaseYear: 2016, genres: ["Action", "Comedy", "Crime"], imdbRating: 7.4, description: "In 1970s Los Angeles, a mismatched pair of private eyes investigate a missing girl and the mysterious death of a porn star." },
  { title: "Game Night", releaseYear: 2018, genres: ["Action", "Comedy", "Crime"], imdbRating: 6.9, description: "A group of friends who meet regularly for game nights find themselves entangled in a real-life mystery." },
  { title: "Birdman", releaseYear: 2014, genres: ["Comedy", "Drama"], imdbRating: 7.7, description: "A washed-up superhero actor attempts to revive his fading career by writing, directing, and starring in a Broadway production." },
  { title: "The Wolf of Wall Street", releaseYear: 2013, genres: ["Biography", "Comedy", "Crime"], imdbRating: 8.2, description: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government." },
  { title: "Superbad", releaseYear: 2007, genres: ["Comedy"], imdbRating: 7.6, description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry." },
  
  // Drama Movies
  { title: "1917", releaseYear: 2019, genres: ["Drama", "War"], imdbRating: 8.3, description: "Two British soldiers are tasked with delivering a critical message to call off a doomed attack during World War I." },
  { title: "Moonlight", releaseYear: 2016, genres: ["Drama"], imdbRating: 7.4, description: "A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood." },
  { title: "Manchester by the Sea", releaseYear: 2016, genres: ["Drama"], imdbRating: 7.8, description: "A depressed uncle is asked to take care of his teenage nephew after the boy's father dies." },
  { title: "La La Land", releaseYear: 2016, genres: ["Comedy", "Drama", "Music"], imdbRating: 8.0, description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future." },
  { title: "The Shape of Water", releaseYear: 2017, genres: ["Adventure", "Drama", "Fantasy"], imdbRating: 7.3, description: "At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity." },
  { title: "Three Billboards Outside Ebbing, Missouri", releaseYear: 2017, genres: ["Comedy", "Crime", "Drama"], imdbRating: 8.1, description: "A mother personally challenges the local authorities to solve her daughter's murder when they fail to catch the culprit." },
  { title: "Green Book", releaseYear: 2018, genres: ["Biography", "Comedy", "Drama"], imdbRating: 8.2, description: "A working-class Italian-American bouncer becomes the driver of an African-American classical pianist on a tour of venues through the 1960s American South." },
  { title: "Roma", releaseYear: 2018, genres: ["Drama"], imdbRating: 7.7, description: "A year in the life of a middle-class family's maid in Mexico City in the early 1970s." },
  { title: "Marriage Story", releaseYear: 2019, genres: ["Comedy", "Drama", "Romance"], imdbRating: 7.9, description: "Noah Baumbach's incisive and compassionate look at a marriage breaking up and a family staying together." },
  { title: "Little Women", releaseYear: 2019, genres: ["Drama", "Romance"], imdbRating: 7.8, description: "Jo March reflects back and forth on her life, telling the beloved story of the March sisters - four young women each determined to live life on her own terms." },
  
  // Thriller Movies
  { title: "Gone Girl", releaseYear: 2014, genres: ["Drama", "Mystery", "Thriller"], imdbRating: 8.1, description: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent." },
  { title: "Zodiac", releaseYear: 2007, genres: ["Crime", "Drama", "History"], imdbRating: 7.7, description: "In the late 1960s/early 1970s, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer." },
  { title: "Prisoners", releaseYear: 2013, genres: ["Crime", "Drama", "Mystery"], imdbRating: 8.1, description: "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads." },
  { title: "Shutter Island", releaseYear: 2010, genres: ["Mystery", "Thriller"], imdbRating: 8.2, description: "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane." },
  { title: "No Country for Old Men", releaseYear: 2007, genres: ["Crime", "Drama", "Thriller"], imdbRating: 8.1, description: "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande." },
  { title: "There Will Be Blood", releaseYear: 2007, genres: ["Drama"], imdbRating: 8.2, description: "A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of the business." },
  { title: "Nightcrawler", releaseYear: 2014, genres: ["Crime", "Drama", "Thriller"], imdbRating: 7.8, description: "When Louis Bloom, a driven man desperate for work, muscles into the world of L.A. crime journalism, he blurs the line between observer and participant." },
  { title: "The Departed", releaseYear: 2006, genres: ["Crime", "Drama", "Thriller"], imdbRating: 8.5, description: "An undercover cop and a police informant play a cat and mouse game with each other as they attempt to find out each other's identity." },
  { title: "Heat", releaseYear: 1995, genres: ["Action", "Crime", "Drama"], imdbRating: 8.2, description: "A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist." },
  { title: "Se7en", releaseYear: 1995, genres: ["Crime", "Drama", "Mystery"], imdbRating: 8.6, description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives." },
  
  // Animation Movies
  { title: "Spider-Man: Into the Spider-Verse", releaseYear: 2018, genres: ["Animation", "Action", "Adventure"], imdbRating: 8.4, description: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions." },
  { title: "Coco", releaseYear: 2017, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 8.4, description: "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather." },
  { title: "Inside Out", releaseYear: 2015, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 8.1, description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city." },
  { title: "Zootopia", releaseYear: 2016, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 8.0, description: "In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy." },
  { title: "Moana", releaseYear: 2016, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 7.6, description: "In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the Demigod to set things right." },
  { title: "Frozen", releaseYear: 2013, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 7.4, description: "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man." },
  { title: "Toy Story 4", releaseYear: 2019, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 7.7, description: "When a new toy called 'Forky' joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy." },
  { title: "The Incredibles 2", releaseYear: 2018, genres: ["Animation", "Action", "Adventure"], imdbRating: 7.6, description: "The Parr family struggles to maintain normal lives while Helen, as Elastigirl, continues to work as a superhero." },
  { title: "Finding Dory", releaseYear: 2016, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 7.3, description: "Friendly but forgetful blue tang Dory begins a search for her long-lost parents, and everyone learns a few things about the real meaning of family." },
  { title: "The Lion King", releaseYear: 2019, genres: ["Animation", "Adventure", "Drama"], imdbRating: 6.8, description: "After the murder of his father, a young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery." },
  
  // More Recent Popular Movies
  { title: "Tenet", releaseYear: 2020, genres: ["Action", "Sci-Fi", "Thriller"], imdbRating: 7.4, description: "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage." },
  { title: "Wonder Woman 1984", releaseYear: 2020, genres: ["Action", "Adventure", "Fantasy"], imdbRating: 5.4, description: "Diana must contend with a work colleague and businessman, whose desire for extreme wealth sends the world down a path of destruction." },
  { title: "Soul", releaseYear: 2020, genres: ["Animation", "Adventure", "Comedy"], imdbRating: 8.0, description: "A musician who has lost his passion for music is transported out of his body and must find his way back with the help of an infant soul learning about herself." },
  { title: "The Trial of the Chicago 7", releaseYear: 2020, genres: ["Drama", "History", "Thriller"], imdbRating: 7.8, description: "The story of 7 people on trial stemming from various charges surrounding the uprising at the 1968 Democratic National Convention in Chicago, Illinois." },
  { title: "Nomadland", releaseYear: 2020, genres: ["Drama"], imdbRating: 7.3, description: "A woman in her sixties, after losing everything in the Great Recession, embarks on a journey through the American West, living in a van as a present-day nomad." },
  { title: "Minari", releaseYear: 2020, genres: ["Drama"], imdbRating: 7.4, description: "A Korean family starts a farm in 1980s Arkansas." },
  { title: "Sound of Metal", releaseYear: 2019, genres: ["Drama", "Music"], imdbRating: 7.8, description: "A heavy-metal drummer's life is thrown into freefall when he begins to lose his hearing." },
  { title: "The Father", releaseYear: 2020, genres: ["Drama", "Mystery"], imdbRating: 8.2, description: "A man refuses all assistance from his daughter as he ages. As he tries to make sense of his changing circumstances, he begins to doubt his loved ones." },
  { title: "Promising Young Woman", releaseYear: 2020, genres: ["Crime", "Drama", "Mystery"], imdbRating: 7.2, description: "A young woman, traumatized by a tragic event in her past, seeks out vengeance against those who crossed her path." },
  { title: "Judas and the Black Messiah", releaseYear: 2021, genres: ["Biography", "Drama", "History"], imdbRating: 7.4, description: "Offered a plea deal by the FBI, William O'Neal infiltrates the Illinois chapter of the Black Panther Party to gather intelligence on Chairman Fred Hampton." },
  
  // Classic Movies
  { title: "The Godfather", releaseYear: 1972, genres: ["Crime", "Drama"], imdbRating: 9.2, description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." },
  { title: "The Godfather: Part II", releaseYear: 1974, genres: ["Crime", "Drama"], imdbRating: 9.0, description: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate." },
  { title: "Pulp Fiction", releaseYear: 1994, genres: ["Crime", "Drama"], imdbRating: 8.9, description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
  { title: "The Shawshank Redemption", releaseYear: 1994, genres: ["Drama"], imdbRating: 9.3, description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
  { title: "Schindler's List", releaseYear: 1993, genres: ["Biography", "Drama", "History"], imdbRating: 8.9, description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution." },
  { title: "Forrest Gump", releaseYear: 1994, genres: ["Drama", "Romance"], imdbRating: 8.8, description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75." },
  { title: "Fight Club", releaseYear: 1999, genres: ["Drama"], imdbRating: 8.8, description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more." },
  { title: "Goodfellas", releaseYear: 1990, genres: ["Biography", "Crime", "Drama"], imdbRating: 8.7, description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito." },
  { title: "The Silence of the Lambs", releaseYear: 1991, genres: ["Crime", "Drama", "Thriller"], imdbRating: 8.6, description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims." },
  { title: "Saving Private Ryan", releaseYear: 1998, genres: ["Drama", "War"], imdbRating: 8.6, description: "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action." }
];

// Function to add movies to database
const addMovies = async () => {
  try {
    console.log('🎬 Starting to add movie collection...');
    
    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const movieData of moviesData) {
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

        // Create new movie
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
          trailerUrl: "",
          downloadLinks: [],
          quality: ["WEBDL", "BLURAY", "WEBRIP"][Math.floor(Math.random() * 3)],
          fileSize: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9) + 1}GB`,
          language: "English",
          subtitles: ["English", "Spanish", "French"],
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
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error adding "${movieData.title}":`, error.message);
      }
    }

    // Get final count
    const totalMovies = await Movie.countDocuments();
    
    console.log('\n📊 Summary:');
    console.log(`   Movies added: ${addedCount}`);
    console.log(`   Movies skipped: ${skippedCount}`);
    console.log(`   Total movies in database: ${totalMovies}`);
    
    if (totalMovies >= 100) {
      console.log('🎉 Success! Database now has at least 100 movies!');
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