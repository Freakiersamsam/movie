// Script to sync movies.js to D1 database
// Run with: node sync-movies.js

// This script reads movies.js and syncs it to the D1 database via the API

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read movies.js from parent directory
const moviesJsPath = path.join(__dirname, '..', 'movies.js');
let moviesContent = fs.readFileSync(moviesJsPath, 'utf8');

// Extract MOVIE_DATABASE array (simple regex parsing)
const match = moviesContent.match(/const MOVIE_DATABASE\s*=\s*(\[[\s\S]*?\]);/);

if (!match) {
  console.error('Could not find MOVIE_DATABASE in movies.js');
  process.exit(1);
}

// Parse the array
const moviesArrayStr = match[1];
const MOVIE_DATABASE = eval(moviesArrayStr);

console.log(`Found ${MOVIE_DATABASE.length} movies in database`);

// Group by difficulty
const byDifficulty = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
MOVIE_DATABASE.forEach(m => {
  byDifficulty[m.difficulty]++;
});

console.log('Movies by difficulty:', byDifficulty);

// Determine target URL
const args = process.argv.slice(2);
const target = args[0] || 'local';

let apiUrl;
if (target === 'local') {
  apiUrl = 'http://localhost:8787/api/admin/sync-movies';
} else if (target === 'production' || target === 'prod') {
  apiUrl = 'https://api.cinemdle.com/api/admin/sync-movies';
} else {
  apiUrl = target; // Custom URL
}

console.log(`\nSyncing to: ${apiUrl}`);

// Send to API
async function syncMovies() {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movies: MOVIE_DATABASE })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('\nSync complete!');
    console.log(`- Synced: ${result.synced}`);
    console.log(`- Errors: ${result.errors}`);
    console.log(`- Total: ${result.total}`);

  } catch (error) {
    console.error('\nSync failed:', error.message);
    process.exit(1);
  }
}

syncMovies();
