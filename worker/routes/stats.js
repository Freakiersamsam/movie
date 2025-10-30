// Global statistics routes

import { getTodayDate, isValidDate } from '../utils/dates.js';

/**
 * GET /api/stats/global?date=YYYY-MM-DD&difficulty=1
 * Get global statistics for a specific round
 *
 * Query params: date (optional), difficulty (required)
 * Returns: { date, difficulty, stats }
 */
export async function getGlobalStats(request, env) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || getTodayDate();
    const difficulty = parseInt(url.searchParams.get('difficulty'), 10);

    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: 'Invalid date format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!difficulty || difficulty < 1 || difficulty > 5) {
      return new Response(JSON.stringify({
        error: 'Difficulty must be between 1 and 5'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get overall stats (production only - filter out dev data)
    const overallStats = await env.DB.prepare(`
      SELECT
        COUNT(*) as totalPlayed,
        SUM(won) as totalWon,
        AVG(CAST(hints_used AS FLOAT)) as avgHints
      FROM round_results
      WHERE date = ?
        AND difficulty = ?
        AND is_dev = 0
    `).bind(date, difficulty).first();

    // Get hint distribution
    const hintDist = await env.DB.prepare(`
      SELECT
        hints_used,
        COUNT(*) as count
      FROM round_results
      WHERE date = ?
        AND difficulty = ?
        AND won = 1
        AND is_dev = 0
      GROUP BY hints_used
      ORDER BY hints_used
    `).bind(date, difficulty).all();

    const hintDistribution = [0, 0, 0, 0, 0, 0];
    for (const row of hintDist.results) {
      if (row.hints_used >= 1 && row.hints_used <= 6) {
        hintDistribution[row.hints_used - 1] = row.count;
      }
    }

    const stats = {
      totalPlayed: overallStats.totalPlayed || 0,
      totalWon: overallStats.totalWon || 0,
      winRate: overallStats.totalPlayed > 0
        ? parseFloat(((overallStats.totalWon / overallStats.totalPlayed) * 100).toFixed(1))
        : 0,
      avgHints: overallStats.avgHints
        ? parseFloat(overallStats.avgHints.toFixed(1))
        : 0,
      hintDistribution
    };

    return new Response(JSON.stringify({
      date,
      difficulty,
      stats
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Error in getGlobalStats:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get global stats',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/stats/daily?date=YYYY-MM-DD
 * Get aggregated stats for all difficulties on a given day
 *
 * Query params: date (optional, defaults to today)
 * Returns: { date, difficulties: Array }
 */
export async function getDailyStats(request, env) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || getTodayDate();

    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: 'Invalid date format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const difficulties = [];

    for (let difficulty = 1; difficulty <= 5; difficulty++) {
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

      difficulties.push({
        difficulty,
        totalPlayed: stats.totalPlayed || 0,
        totalWon: stats.totalWon || 0,
        winRate: stats.totalPlayed > 0
          ? parseFloat(((stats.totalWon / stats.totalPlayed) * 100).toFixed(1))
          : 0,
        avgHints: stats.avgHints ? parseFloat(stats.avgHints.toFixed(1)) : 0
      });
    }

    return new Response(JSON.stringify({
      date,
      difficulties
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error in getDailyStats:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get daily stats',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
