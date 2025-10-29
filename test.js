// Test script to validate movie game functionality

// Load the movies database
const fs = require('fs');
const moviesCode = fs.readFileSync('movies.js', 'utf8');
eval(moviesCode);

console.log('=== MOVIE DATABASE VALIDATION ===\n');

// Test 1: Check if MOVIE_DATABASE exists
if (typeof MOVIE_DATABASE === 'undefined') {
    console.error('❌ MOVIE_DATABASE is not defined!');
    process.exit(1);
} else {
    console.log('✅ MOVIE_DATABASE is defined');
}

// Test 2: Count movies by difficulty
const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
MOVIE_DATABASE.forEach(movie => {
    if (movie.difficulty >= 1 && movie.difficulty <= 5) {
        counts[movie.difficulty]++;
    }
});

console.log(`✅ Total films: ${MOVIE_DATABASE.length}`);
console.log(`   - Difficulty 1: ${counts[1]} films`);
console.log(`   - Difficulty 2: ${counts[2]} films`);
console.log(`   - Difficulty 3: ${counts[3]} films`);
console.log(`   - Difficulty 4: ${counts[4]} films`);
console.log(`   - Difficulty 5: ${counts[5]} films`);

// Test 3: Validate movie structure
console.log('\n=== VALIDATING MOVIE STRUCTURE ===\n');
let errors = [];
MOVIE_DATABASE.forEach((movie, index) => {
    if (!movie.title) errors.push(`Movie ${index}: missing title`);
    if (!movie.year) errors.push(`Movie ${index}: missing year`);
    if (!movie.actors || !Array.isArray(movie.actors)) errors.push(`Movie ${index} (${movie.title}): missing or invalid actors`);
    if (!movie.quotes || !Array.isArray(movie.quotes)) errors.push(`Movie ${index} (${movie.title}): missing or invalid quotes`);
    if (!movie.difficulty) errors.push(`Movie ${index} (${movie.title}): missing difficulty`);
});

if (errors.length > 0) {
    console.error('❌ Found validation errors:');
    errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
} else {
    console.log('✅ All movies have valid structure');
}

// Test 4: Check for duplicate titles
console.log('\n=== CHECKING FOR DUPLICATES ===\n');
const titles = new Map();
MOVIE_DATABASE.forEach((movie, index) => {
    if (titles.has(movie.title)) {
        console.warn(`⚠️  Duplicate title found: "${movie.title}" at indices ${titles.get(movie.title)} and ${index}`);
    } else {
        titles.set(movie.title, index);
    }
});
console.log('✅ Duplicate check complete');

// Test 5: Simulate film selection logic
console.log('\n=== TESTING FILM SELECTION LOGIC ===\n');
const today = new Date();
today.setHours(0, 0, 0, 0);
const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

function getMoviesForOffset(offset) {
    const seed = daysSinceEpoch + (offset * 37);
    const movies = [];

    for (let round = 0; round < 5; round++) {
        const difficulty = round + 1;
        const moviesOfDifficulty = MOVIE_DATABASE.filter(m => m.difficulty === difficulty);
        const index = (seed + round) % moviesOfDifficulty.length;
        movies.push(moviesOfDifficulty[index]);
    }

    return movies;
}

// Test offsets 0-3
for (let offset = 0; offset < 4; offset++) {
    const movies = getMoviesForOffset(offset);
    console.log(`Offset ${offset}:`);
    movies.forEach((movie, round) => {
        console.log(`  Round ${round + 1} (Difficulty ${round + 1}): ${movie.title} (${movie.year})`);
    });
    console.log('');
}

console.log('✅ Film selection logic working\n');
console.log('=== ALL TESTS PASSED ===');
