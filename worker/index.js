// Cinemdle API Worker
// Cloudflare Worker with D1 Database

import { initSession, validateSession } from './routes/session.js';
import { getDailyMovies, getMovieHistory } from './routes/movies.js';
import { submitResult, getUserResults } from './routes/results.js';
import { getGlobalStats, getDailyStats } from './routes/stats.js';
import { getWeeklyLeaderboard, getPlayerRankInfo } from './routes/leaderboard.js';
import { syncMovieDatabase } from './utils/movieSelection.js';
import { checkRateLimit, getRateLimitIdentifier, cleanupRateLimitStore } from './utils/rateLimit.js';

/**
 * Allowed origins for CORS
 */
const ALLOWED_ORIGINS = [
  'https://cinemdle.com',
  'https://www.cinemdle.com',
  'http://localhost:8787',
  'http://127.0.0.1:8787',
  'http://localhost:3000' // Dev server
];

/**
 * Security headers applied to all responses
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/**
 * Get CORS headers based on request origin
 */
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-ID, X-Is-Dev, X-Admin-Key',
    'Access-Control-Max-Age': '86400', // 24 hours
    'Vary': 'Origin' // Important for caching
  };
}

/**
 * Handle CORS preflight requests
 */
function handleOptions(request) {
  const corsHeaders = getCorsHeaders(request);
  const headers = { ...corsHeaders, ...SECURITY_HEADERS };

  return new Response(null, {
    status: 204,
    headers
  });
}

/**
 * Add CORS and security headers to response
 */
function addSecurityHeaders(response, request) {
  const newResponse = new Response(response.body, response);
  const corsHeaders = getCorsHeaders(request);

  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  return newResponse;
}

/**
 * Verify admin authentication
 */
function verifyAdmin(request, env) {
  const adminKey = request.headers.get('X-Admin-Key');

  // Check if admin key is set in environment
  if (!env.ADMIN_API_KEY) {
    console.error('ADMIN_API_KEY not set in environment');
    return false;
  }

  return adminKey === env.ADMIN_API_KEY;
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
      return handleOptions(request);
    }

    // Rate limiting check (skip for health check)
    if (path !== '/api/health' && path !== '/health') {
      const identifier = getRateLimitIdentifier(request);
      const rateLimitResult = checkRateLimit(identifier, path);

      if (!rateLimitResult.allowed) {
        const response = new Response(JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter.toString()
          }
        });
        return addSecurityHeaders(response, request);
      }
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
        // Verify admin authentication
        if (!verifyAdmin(request, env)) {
          response = new Response(JSON.stringify({
            error: 'Unauthorized',
            message: 'Valid admin API key required'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          const body = await request.json();
          const result = await syncMovieDatabase(env.DB, body.movies);
          response = new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // GDPR data deletion endpoint
      else if (path === '/api/user/data' && method === 'DELETE') {
        const sessionId = request.headers.get('X-Session-ID');

        if (!sessionId) {
          response = new Response(JSON.stringify({
            error: 'Session ID required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          // Delete all user data
          await env.DB.prepare(`DELETE FROM round_results WHERE session_id = ?`).bind(sessionId).run();
          await env.DB.prepare(`DELETE FROM weekly_leaderboard WHERE session_id = ?`).bind(sessionId).run();
          await env.DB.prepare(`DELETE FROM user_sessions WHERE session_id = ?`).bind(sessionId).run();

          response = new Response(JSON.stringify({
            success: true,
            message: 'All user data deleted'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
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

      return addSecurityHeaders(response, request);

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

      return addSecurityHeaders(errorResponse, request);
    }
  },

  // Scheduled task to cleanup rate limit store
  async scheduled(event, env, ctx) {
    cleanupRateLimitStore();
  }
};
