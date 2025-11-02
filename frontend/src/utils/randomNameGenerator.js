// Random name generator for movies
const firstNames = [
  'Shadow', 'Crimson', 'Azure', 'Golden', 'Silver', 'Midnight', 'Dawn', 'Storm', 'Fire', 'Ice',
  'Thunder', 'Lightning', 'Mystic', 'Phantom', 'Cosmic', 'Stellar', 'Lunar', 'Solar', 'Neon', 'Crystal',
  'Velvet', 'Jade', 'Ruby', 'Sapphire', 'Diamond', 'Emerald', 'Onyx', 'Pearl', 'Amber', 'Coral',
  'Violet', 'Scarlet', 'Indigo', 'Turquoise', 'Magenta', 'Cyan', 'Maroon', 'Teal', 'Lime', 'Fuchsia'
];

const secondNames = [
  'Warrior', 'Guardian', 'Hunter', 'Seeker', 'Wanderer', 'Keeper', 'Watcher', 'Rider', 'Walker', 'Runner',
  'Fighter', 'Defender', 'Protector', 'Champion', 'Hero', 'Legend', 'Master', 'Sage', 'Oracle', 'Prophet',
  'Knight', 'Paladin', 'Ranger', 'Scout', 'Assassin', 'Ninja', 'Samurai', 'Gladiator', 'Berserker', 'Monk',
  'Wizard', 'Sorcerer', 'Mage', 'Enchanter', 'Alchemist', 'Necromancer', 'Druid', 'Shaman', 'Priest', 'Cleric'
];

const suffixes = [
  'of the North', 'of the South', 'of the East', 'of the West', 'of the Dawn', 'of the Dusk',
  'of the Mountains', 'of the Seas', 'of the Skies', 'of the Depths', 'of the Shadows', 'of the Light',
  'of the Storm', 'of the Fire', 'of the Ice', 'of the Wind', 'of the Earth', 'of the Stars',
  'of the Moon', 'of the Sun', 'of the Void', 'of the Realm', 'of the Kingdom', 'of the Empire',
  'the Brave', 'the Bold', 'the Wise', 'the Swift', 'the Strong', 'the Fierce', 'the Noble', 'the Pure',
  'the Dark', 'the Bright', 'the Ancient', 'the Eternal', 'the Immortal', 'the Legendary', 'the Mighty', 'the Great'
];

/**
 * Generates a random name based on a seed (movie ID or title)
 * This ensures the same movie always gets the same random name
 * @param {string} seed - A unique identifier for the movie (ID or title)
 * @returns {string} - A randomly generated name
 */
export const generateRandomName = (seed) => {
  // Simple hash function to convert seed to number
  let hash = 0;
  if (seed.length === 0) return 'Unknown Hero';
  
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Make hash positive
  hash = Math.abs(hash);
  
  // Use hash to select random elements consistently
  const firstNameIndex = hash % firstNames.length;
  const secondNameIndex = Math.floor(hash / firstNames.length) % secondNames.length;
  const suffixIndex = Math.floor(hash / (firstNames.length * secondNames.length)) % suffixes.length;
  
  const firstName = firstNames[firstNameIndex];
  const secondName = secondNames[secondNameIndex];
  const suffix = suffixes[suffixIndex];
  
  // Randomly decide the format (with 3 different patterns)
  const formatType = hash % 3;
  
  switch (formatType) {
    case 0:
      return `${firstName} ${secondName}`;
    case 1:
      return `${firstName} ${secondName} ${suffix}`;
    case 2:
      return `${secondName} ${suffix}`;
    default:
      return `${firstName} ${secondName}`;
  }
};

/**
 * Generates a shorter random name for mobile displays
 * @param {string} seed - A unique identifier for the movie
 * @returns {string} - A shorter randomly generated name
 */
export const generateShortRandomName = (seed) => {
  let hash = 0;
  if (seed.length === 0) return 'Hero';
  
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  hash = Math.abs(hash);
  
  const firstNameIndex = hash % firstNames.length;
  const secondNameIndex = Math.floor(hash / firstNames.length) % secondNames.length;
  
  const firstName = firstNames[firstNameIndex];
  const secondName = secondNames[secondNameIndex];
  
  // For mobile, prefer shorter names
  return hash % 2 === 0 ? firstName : secondName;
};

export default { generateRandomName, generateShortRandomName };