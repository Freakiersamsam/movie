// Movie selection logic

import { hashDate, formatDate } from './dates.js';

/**
 * Select daily movies ensuring no repeats
 * Uses database to track selections and ensure global uniqueness
 *
 * @param {Object} db - D1 database binding
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} - Array of 5 movies (one per difficulty)
 */
export async function selectDailyMovies(db, date) {
  // 1. Check if movies already selected for this date
  const existing = await db.prepare(`
    SELECT difficulty, movie_title, movie_year
    FROM daily_movies
    WHERE date = ?
    ORDER BY difficulty
  `).bind(date).all();

  if (existing.results.length === 5) {
    // Already selected, return them
    return existing.results.map(m => ({
      difficulty: m.difficulty,
      title: m.movie_title,
      year: m.movie_year
    }));
  }

  // 2. Select new movies for missing difficulties
  const selectedMovies = [];
  const seed = hashDate(date);

  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    // Check if already exists for this difficulty/date
    const existingForDifficulty = existing.results.find(m => m.difficulty === difficulty);

    if (existingForDifficulty) {
      selectedMovies.push({
        difficulty,
        title: existingForDifficulty.movie_title,
        year: existingForDifficulty.movie_year
      });
      continue;
    }

    // Get all movies of this difficulty
    const moviesOfDifficulty = await db.prepare(`
      SELECT title, year
      FROM movies
      WHERE difficulty = ?
      ORDER BY title
    `).bind(difficulty).all();

    if (moviesOfDifficulty.results.length === 0) {
      throw new Error(`No movies found for difficulty ${difficulty}`);
    }

    // Get recently used movies for this difficulty (last 365 days)
    const recentlyUsed = await db.prepare(`
      SELECT DISTINCT movie_title
      FROM daily_movies
      WHERE difficulty = ?
        AND date >= date('now', '-365 days')
    `).bind(difficulty).all();

    const usedTitles = new Set(recentlyUsed.results.map(r => r.movie_title));

    // Filter out recently used
    let availableMovies = moviesOfDifficulty.results.filter(m => !usedTitles.has(m.title));

    // If all movies used, reset and use all movies
    if (availableMovies.length === 0) {
      availableMovies = moviesOfDifficulty.results;
    }

    // Deterministic selection based on date and difficulty
    const index = (seed + difficulty * 37) % availableMovies.length;
    const selected = availableMovies[index];

    // Insert into database
    await db.prepare(`
      INSERT INTO daily_movies (date, difficulty, movie_title, movie_year)
      VALUES (?, ?, ?, ?)
    `).bind(date, difficulty, selected.title, selected.year).run();

    selectedMovies.push({
      difficulty,
      title: selected.title,
      year: selected.year
    });
  }

  return selectedMovies;
}

/**
 * Get full movie details (including quotes/actors) from database
 *
 * @param {Object} db - D1 database binding
 * @param {Array} movieTitles - Array of movie titles
 * @returns {Array} - Array of full movie objects
 */
export async function getFullMovieDetails(db, movieTitles) {
  const movies = [];

  for (const titleObj of movieTitles) {
    const movie = await db.prepare(`
      SELECT *
      FROM movies
      WHERE title = ? AND difficulty = ?
    `).bind(titleObj.title, titleObj.difficulty).first();

    if (movie) {
      movies.push({
        title: movie.title,
        year: movie.year,
        difficulty: movie.difficulty,
        quotes: [movie.quote1, movie.quote2],
        actors: [movie.actor1, movie.actor2]
      });
    }
  }

  return movies;
}

/**
 * Sync movies from frontend database to Worker database
 * This should be called periodically or when movies.js is updated
 *
 * @param {Object} db - D1 database binding
 * @param {Array} movieDatabase - Array of movies from movies.js
 */
export async function syncMovieDatabase(db, movieDatabase) {
  let synced = 0;
  let errors = 0;

  for (const movie of movieDatabase) {
    try {
      await db.prepare(`
        INSERT INTO movies (title, year, difficulty, quote1, quote2, actor1, actor2)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(title) DO UPDATE SET
          year = excluded.year,
          difficulty = excluded.difficulty,
          quote1 = excluded.quote1,
          quote2 = excluded.quote2,
          actor1 = excluded.actor1,
          actor2 = excluded.actor2,
          updated_at = datetime('now')
      `).bind(
        movie.title,
        movie.year,
        movie.difficulty,
        movie.quotes[0],
        movie.quotes[1],
        movie.actors[0],
        movie.actors[1]
      ).run();

      synced++;
    } catch (error) {
      console.error(`Error syncing movie ${movie.title}:`, error);
      errors++;
    }
  }

  return { synced, errors, total: movieDatabase.length };
}
