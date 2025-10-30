// Leaderboard scoring system

/**
 * Calculate weekly score for a player
 * Higher is better
 *
 * @param {Object} stats - Player's weekly stats
 * @param {number} stats.wins - Number of rounds won
 * @param {number} stats.rounds - Total rounds played
 * @param {number} stats.totalHints - Total hints used across all rounds
 * @param {number} stats.perfectRounds - Rounds won with only 1 hint
 * @returns {number} - Calculated score
 */
export function calculateScore({ wins, rounds, totalHints, perfectRounds }) {
  if (rounds === 0) return 0;

  // Base score: 100 points per win
  let score = wins * 100;

  // Bonus: efficiency (fewer hints = better)
  // Average hints per round (lower is better)
  const avgHints = rounds > 0 ? totalHints / rounds : 6;

  // Efficiency bonus: up to 300 points if avg 1 hint, 0 if avg 6 hints
  const efficiencyBonus = Math.max(0, (6 - avgHints) * 60);
  score += efficiencyBonus;

  // Bonus: perfect rounds (guessed with 1 hint)
  // 200 points per perfect round
  score += perfectRounds * 200;

  // Bonus: win rate
  const winRate = rounds > 0 ? wins / rounds : 0;
  const winRateBonus = winRate * 150;
  score += winRateBonus;

  // Penalty: losses (small penalty to encourage trying)
  const losses = rounds - wins;
  score -= losses * 5;

  return Math.floor(Math.max(0, score));
}

/**
 * Update or create weekly leaderboard entry
 */
export async function updateWeeklyLeaderboard(db, sessionId, weekStart, isDev = false) {
  // Get all results for this user this week
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const results = await db.prepare(`
    SELECT
      COUNT(*) as rounds,
      SUM(won) as wins,
      SUM(hints_used) as totalHints,
      SUM(CASE WHEN won = 1 AND hints_used = 1 THEN 1 ELSE 0 END) as perfectRounds
    FROM round_results
    WHERE session_id = ?
      AND date >= ?
      AND date < ?
      AND is_dev = ?
  `).bind(sessionId, weekStart, weekEndStr, isDev ? 1 : 0).first();

  const stats = {
    wins: results.wins || 0,
    rounds: results.rounds || 0,
    totalHints: results.totalHints || 0,
    perfectRounds: results.perfectRounds || 0
  };

  const score = calculateScore(stats);

  // Insert or update
  await db.prepare(`
    INSERT INTO weekly_leaderboard
      (session_id, week_start, total_rounds, total_wins, total_hints, perfect_rounds, score, is_dev, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(session_id, week_start) DO UPDATE SET
      total_rounds = excluded.total_rounds,
      total_wins = excluded.total_wins,
      total_hints = excluded.total_hints,
      perfect_rounds = excluded.perfect_rounds,
      score = excluded.score,
      updated_at = datetime('now')
  `).bind(
    sessionId,
    weekStart,
    stats.rounds,
    stats.wins,
    stats.totalHints,
    stats.perfectRounds,
    score,
    isDev ? 1 : 0
  ).run();

  return { ...stats, score };
}

/**
 * Get top N players for a week
 */
export async function getTopPlayers(db, weekStart, limit = 100, isDev = false) {
  const players = await db.prepare(`
    SELECT
      session_id,
      total_rounds,
      total_wins,
      total_hints,
      perfect_rounds,
      score
    FROM weekly_leaderboard
    WHERE week_start = ?
      AND is_dev = ?
      AND total_rounds > 0
    ORDER BY score DESC
    LIMIT ?
  `).bind(weekStart, isDev ? 1 : 0, limit).all();

  return players.results.map((p, index) => ({
    rank: index + 1,
    sessionId: p.session_id.substring(0, 8) + '...', // Anonymize
    wins: p.total_wins,
    rounds: p.total_rounds,
    avgHints: p.total_rounds > 0 ? (p.total_hints / p.total_rounds).toFixed(1) : 0,
    perfectRounds: p.perfect_rounds,
    score: p.score
  }));
}

/**
 * Get player's rank for a week
 */
export async function getPlayerRank(db, sessionId, weekStart, isDev = false) {
  // Get player's score
  const playerData = await db.prepare(`
    SELECT score, total_rounds, total_wins, total_hints, perfect_rounds
    FROM weekly_leaderboard
    WHERE session_id = ?
      AND week_start = ?
      AND is_dev = ?
  `).bind(sessionId, weekStart, isDev ? 1 : 0).first();

  if (!playerData) {
    return null;
  }

  // Count how many players have a better score
  const rankData = await db.prepare(`
    SELECT COUNT(*) + 1 as rank
    FROM weekly_leaderboard
    WHERE week_start = ?
      AND is_dev = ?
      AND score > ?
  `).bind(weekStart, isDev ? 1 : 0, playerData.score).first();

  return {
    rank: rankData.rank,
    wins: playerData.total_wins,
    rounds: playerData.total_rounds,
    avgHints: playerData.total_rounds > 0 ? (playerData.total_hints / playerData.total_rounds).toFixed(1) : 0,
    perfectRounds: playerData.perfect_rounds,
    score: playerData.score
  };
}
