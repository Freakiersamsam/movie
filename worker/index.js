// Cinemdle API Worker
// Cloudflare Worker with D1 Database

import { initSession, validateSession } from './routes/session.js';
import { getDailyMovies, getMovieHistory } from './routes/movies.js';
import { submitResult, getUserResults } from './routes/results.js';
import { getGlobalStats, getDailyStats } from './routes/stats.js';
import { getWeeklyLeaderboard, getPlayerRankInfo } from './routes/leaderboard.js';
import { syncMovieDatabase } from './utils/movieSelection.js';

/**
 * CORS headers for API responses
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // TODO: Restrict to cinemdle.com in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Session-ID, X-Is-Dev',
  'Access-Control-Max-Age': '86400', // 24 hours
};

/**
 * Handle CORS preflight requests
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response) {
  const newResponse = new Response(response.body, response);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  return newResponse;
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    try {
      let response;

      // Health check
      if (path === '/api/health' || path === '/health') {
        response = new Response(JSON.stringify({
          status: 'ok',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Session routes
      else if (path === '/api/session/init' && method === 'POST') {
        response = await initSession(request, env);
      }
      else if (path === '/api/session/validate' && method === 'GET') {
        response = await validateSession(request, env);
      }

      // Movie routes
      else if (path === '/api/movies/daily' && method === 'GET') {
        response = await getDailyMovies(request, env);
      }
      else if (path === '/api/movies/history' && method === 'GET') {
        response = await getMovieHistory(request, env);
      }

      // Results routes
      else if (path === '/api/results/submit' && method === 'POST') {
        response = await submitResult(request, env);
      }
      else if (path === '/api/results/user' && method === 'GET') {
        response = await getUserResults(request, env);
      }

      // Stats routes
      else if (path === '/api/stats/global' && method === 'GET') {
        response = await getGlobalStats(request, env);
      }
      else if (path === '/api/stats/daily' && method === 'GET') {
        response = await getDailyStats(request, env);
      }

      // Leaderboard routes
      else if (path === '/api/leaderboard/weekly' && method === 'GET') {
        response = await getWeeklyLeaderboard(request, env);
      }
      else if (path === '/api/leaderboard/rank' && method === 'GET') {
        response = await getPlayerRankInfo(request, env);
      }

      // Admin routes (for syncing movie database)
      else if (path === '/api/admin/sync-movies' && method === 'POST') {
        // TODO: Add admin authentication
        const body = await request.json();
        const result = await syncMovieDatabase(env.DB, body.movies);
        response = new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Not found
      else {
        response = new Response(JSON.stringify({
          error: 'Not found',
          path,
          method
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return addCorsHeaders(response);

    } catch (error) {
      console.error('Worker error:', error);

      const errorResponse = new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: env.ENVIRONMENT === 'development' ? error.stack : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });

      return addCorsHeaders(errorResponse);
    }
  }
};
