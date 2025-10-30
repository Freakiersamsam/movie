// Session management routes

import { generateUUID, isValidUUID } from '../utils/uuid.js';

/**
 * POST /api/session/init
 * Initialize or retrieve a session
 *
 * Body: { userAgent: string, isDev: boolean }
 * Returns: { sessionId: string, isNew: boolean }
 */
export async function initSession(request, env) {
  try {
    const body = await request.json();
    const { userAgent, isDev } = body;

    // Check if session already exists via header
    const existingSessionId = request.headers.get('X-Session-ID');

    if (existingSessionId && isValidUUID(existingSessionId)) {
      // Verify session exists in database
      const session = await env.DB.prepare(`
        SELECT session_id, is_dev
        FROM user_sessions
        WHERE session_id = ?
      `).bind(existingSessionId).first();

      if (session) {
        // Update last active
        await env.DB.prepare(`
          UPDATE user_sessions
          SET last_active = datetime('now')
          WHERE session_id = ?
        `).bind(existingSessionId).run();

        return new Response(JSON.stringify({
          sessionId: existingSessionId,
          isNew: false,
          isDev: session.is_dev === 1
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Create new session
    const sessionId = generateUUID();

    await env.DB.prepare(`
      INSERT INTO user_sessions (session_id, is_dev, user_agent, first_seen, last_active)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `).bind(sessionId, isDev ? 1 : 0, userAgent || 'unknown').run();

    return new Response(JSON.stringify({
      sessionId,
      isNew: true,
      isDev: isDev || false
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in initSession:', error);
    return new Response(JSON.stringify({
      error: 'Failed to initialize session',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/session/validate
 * Validate a session ID
 *
 * Headers: X-Session-ID
 * Returns: { valid: boolean, isDev: boolean }
 */
export async function validateSession(request, env) {
  try {
    const sessionId = request.headers.get('X-Session-ID');

    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Invalid session ID format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = await env.DB.prepare(`
      SELECT session_id, is_dev, first_seen
      FROM user_sessions
      WHERE session_id = ?
    `).bind(sessionId).first();

    if (!session) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Session not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update last active
    await env.DB.prepare(`
      UPDATE user_sessions
      SET last_active = datetime('now')
      WHERE session_id = ?
    `).bind(sessionId).run();

    return new Response(JSON.stringify({
      valid: true,
      isDev: session.is_dev === 1,
      firstSeen: session.first_seen
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in validateSession:', error);
    return new Response(JSON.stringify({
      error: 'Failed to validate session',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
