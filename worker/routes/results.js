// Results submission routes

import { isValidUUID } from '../utils/uuid.js';
import { isValidDate, getCurrentWeekStart } from '../utils/dates.js';
import { updateWeeklyLeaderboard } from '../utils/scoring.js';

/**
 * POST /api/results/submit
 * Submit a round result
 *
 * Headers: X-Session-ID, X-Is-Dev
 * Body: { date: string, difficulty: number, won: boolean, hintsUsed: number }
 * Returns: { success: boolean, globalStats: object, leaderboard: object }
 */
export async function submitResult(request, env) {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    const isDevHeader = request.headers.get('X-Is-Dev');
    const isDev = isDevHeader === '1' || isDevHeader === 'true';

    // Validate session
    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        error: 'Invalid or missing session ID'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { date, difficulty, won, hintsUsed } = body;

    // Validate inputs
    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: 'Invalid date format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (difficulty < 1 || difficulty > 5) {
      return new Response(JSON.stringify({
        error: 'Difficulty must be between 1 and 5'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (hintsUsed < 1 || hintsUsed > 6) {
      return new Response(JSON.stringify({
        error: 'Hints used must be between 1 and 6'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if result already submitted
    const existing = await env.DB.prepare(`
      SELECT id
      FROM round_results
      WHERE session_id = ?
        AND date = ?
        AND difficulty = ?
    `).bind(sessionId, date, difficulty).first();

    if (existing) {
      return new Response(JSON.stringify({
        error: 'Result already submitted for this round',
        duplicate: true
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert result
    await env.DB.prepare(`
      INSERT INTO round_results (session_id, date, difficulty, won, hints_used, is_dev)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      date,
      difficulty,
      won ? 1 : 0,
      hintsUsed,
      isDev ? 1 : 0
    ).run();

    // Update weekly leaderboard
    const weekStart = getCurrentWeekStart();
    const leaderboardStats = await updateWeeklyLeaderboard(
      env.DB,
      sessionId,
      weekStart,
      isDev
    );

    // Get global stats for this round (production only)
    let globalStats = null;
    if (!isDev) {
      const stats = await env.DB.prepare(`
        SELECT
          COUNT(*) as totalPlayed,
          SUM(won) as totalWon,
          AVG(CAST(hints_used AS FLOAT)) as avgHints
        FROM round_results
        WHERE date = ?
          AND difficulty = ?
          AND is_dev = 0
      `).bind(date, difficulty).first();

      globalStats = {
        totalPlayed: stats.totalPlayed || 0,
        totalWon: stats.totalWon || 0,
        winRate: stats.totalPlayed > 0
          ? ((stats.totalWon / stats.totalPlayed) * 100).toFixed(1)
          : 0,
        avgHints: stats.avgHints ? parseFloat(stats.avgHints.toFixed(1)) : 0
      };
    }

    return new Response(JSON.stringify({
      success: true,
      globalStats,
      leaderboardStats: isDev ? null : leaderboardStats
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in submitResult:', error);
    return new Response(JSON.stringify({
      error: 'Failed to submit result',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/results/user?date=YYYY-MM-DD
 * Get user's results for a specific date
 *
 * Headers: X-Session-ID
 * Query params: date (optional, defaults to today)
 * Returns: { date: string, results: Array }
 */
export async function getUserResults(request, env) {
  try {
    const sessionId = request.headers.get('X-Session-ID');

    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        error: 'Invalid or missing session ID'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (date && !isValidDate(date)) {
      return new Response(JSON.stringify({
        error: 'Invalid date format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const query = date
      ? `SELECT * FROM round_results WHERE session_id = ? AND date = ? ORDER BY difficulty`
      : `SELECT * FROM round_results WHERE session_id = ? ORDER BY date DESC, difficulty LIMIT 100`;

    const results = date
      ? await env.DB.prepare(query).bind(sessionId, date).all()
      : await env.DB.prepare(query).bind(sessionId).all();

    return new Response(JSON.stringify({
      date,
      results: results.results
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in getUserResults:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get user results',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
