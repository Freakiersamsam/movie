// Rate limiting utility for Cloudflare Workers
// Uses in-memory cache (resets on worker restart)

const rateLimitStore = new Map();

// Configuration for different endpoints
const RATE_LIMIT_CONFIG = {
  '/api/results/submit': { maxRequests: 10, windowMs: 60000 }, // 10 per minute
  '/api/session/init': { maxRequests: 5, windowMs: 60000 }, // 5 per minute
  '/api/admin/sync-movies': { maxRequests: 2, windowMs: 60000 }, // 2 per minute
  '/api/leaderboard/weekly': { maxRequests: 20, windowMs: 60000 }, // 20 per minute
  '/api/stats/global': { maxRequests: 30, windowMs: 60000 }, // 30 per minute
  'default': { maxRequests: 60, windowMs: 60000 } // 60 per minute for other endpoints
};

/**
 * Check if request should be rate limited
 * @param {string} identifier - IP address or session ID
 * @param {string} endpoint - API endpoint path
 * @returns {Object} { allowed: boolean, retryAfter: number }
 */
export function checkRateLimit(identifier, endpoint) {
  const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG['default'];
  const key = `${identifier}:${endpoint}`;
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(key, entry);
  }

  // Reset if window has passed
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + config.windowMs;
  }

  // Increment counter
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      retryAfter
    };
  }

  return {
    allowed: true,
    retryAfter: 0
  };
}

/**
 * Clean up old entries (call periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime + 300000) { // Remove entries older than 5 minutes past reset
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get identifier for rate limiting (IP or session ID)
 * @param {Request} request
 * @returns {string}
 */
export function getRateLimitIdentifier(request) {
  // Try to get session ID first
  const sessionId = request.headers.get('X-Session-ID');
  if (sessionId) return sessionId;

  // Fallback to IP address
  const ip = request.headers.get('CF-Connecting-IP') ||
              request.headers.get('X-Forwarded-For')?.split(',')[0] ||
              'unknown';

  return ip;
}
