// Daily movies routes

import { selectDailyMovies, getFullMovieDetails } from '../utils/movieSelection.js';
import { getTodayDate, isValidDate } from '../utils/dates.js';

/**
 * GET /api/movies/daily?date=YYYY-MM-DD
 * Get daily movies for a specific date
 *
 * Query params: date (optional, defaults to today)
 * Headers: X-Session-ID
 * Returns: { date: string, movies: Array }
 */
export async function getDailyMovies(request, env) {
  try {
    const url = new URL(request.url);
    let date = url.searchParams.get('date') || getTodayDate();

    // Validate date format
    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: 'Invalid date format. Use YYYY-MM-DD'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Select movies (or get existing selection)
    const selectedMovies = await selectDailyMovies(env.DB, date);

    // Get full details (quotes, actors) from movies table
    const fullMovies = await getFullMovieDetails(env.DB, selectedMovies);

    return new Response(JSON.stringify({
      date,
      movies: fullMovies
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error in getDailyMovies:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get daily movies',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/movies/history?limit=30
 * Get history of daily movie selections
 *
 * Query params: limit (optional, defaults to 30)
 * Returns: { history: Array }
 */
export async function getMovieHistory(request, env) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '30', 10);

    const history = await env.DB.prepare(`
      SELECT date, difficulty, movie_title, movie_year
      FROM daily_movies
      WHERE date < date('now')
      ORDER BY date DESC, difficulty ASC
      LIMIT ?
    `).bind(Math.min(limit, 365)).all();

    // Group by date
    const grouped = {};
    for (const row of history.results) {
      if (!grouped[row.date]) {
        grouped[row.date] = [];
      }
      grouped[row.date].push({
        difficulty: row.difficulty,
        title: row.movie_title,
        year: row.movie_year
      });
    }

    return new Response(JSON.stringify({
      history: Object.entries(grouped).map(([date, movies]) => ({
        date,
        movies
      }))
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error in getMovieHistory:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get movie history',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
