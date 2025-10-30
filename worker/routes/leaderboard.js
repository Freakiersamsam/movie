// Leaderboard routes

import { isValidUUID } from '../utils/uuid.js';
import { getCurrentWeekStart, getWeekStart, isValidDate } from '../utils/dates.js';
import { getTopPlayers, getPlayerRank } from '../utils/scoring.js';

/**
 * GET /api/leaderboard/weekly?week=YYYY-MM-DD&limit=100
 * Get weekly leaderboard
 *
 * Headers: X-Session-ID (optional, for player rank)
 * Query params: week (optional, defaults to current week), limit (optional)
 * Returns: { weekStart, topPlayers, yourRank }
 */
export async function getWeeklyLeaderboard(request, env) {
  try {
    const url = new URL(request.url);
    let weekStart = url.searchParams.get('week') || getCurrentWeekStart();
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);

    // Validate week format (should be a Monday)
    if (!isValidDate(weekStart)) {
      return new Response(JSON.stringify({
        error: 'Invalid week format. Use YYYY-MM-DD'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure it's a Monday
    weekStart = getWeekStart(weekStart);

    // Get top players (production only - no dev data)
    const topPlayers = await getTopPlayers(env.DB, weekStart, Math.min(limit, 500), false);

    // Get player's rank if session provided
    let yourRank = null;
    const sessionId = request.headers.get('X-Session-ID');

    if (sessionId && isValidUUID(sessionId)) {
      yourRank = await getPlayerRank(env.DB, sessionId, weekStart, false);
    }

    return new Response(JSON.stringify({
      weekStart,
      topPlayers,
      yourRank,
      totalPlayers: topPlayers.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });

  } catch (error) {
    console.error('Error in getWeeklyLeaderboard:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get weekly leaderboard',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/leaderboard/rank
 * Get player's current rank
 *
 * Headers: X-Session-ID
 * Returns: { weekStart, rank, stats }
 */
export async function getPlayerRankInfo(request, env) {
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

    const weekStart = getCurrentWeekStart();
    const rankInfo = await getPlayerRank(env.DB, sessionId, weekStart, false);

    if (!rankInfo) {
      return new Response(JSON.stringify({
        weekStart,
        rank: null,
        message: 'No games played this week'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      weekStart,
      ...rankInfo
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=30'
      }
    });

  } catch (error) {
    console.error('Error in getPlayerRankInfo:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get player rank',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
