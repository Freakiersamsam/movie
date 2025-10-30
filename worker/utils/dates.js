// Date utility functions

/**
 * Get today's date in YYYY-MM-DD format (UTC)
 */
export function getTodayDate() {
  const now = new Date();
  return formatDate(now);
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the Monday of the week for a given date
 */
export function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(d.setUTCDate(diff));
  return formatDate(monday);
}

/**
 * Get current week start (Monday)
 */
export function getCurrentWeekStart() {
  return getWeekStart(new Date());
}

/**
 * Hash a date string to a number for deterministic selection
 */
export function hashDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Parse date string (YYYY-MM-DD) to Date object
 */
export function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Check if date is valid
 */
export function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = parseDate(dateStr);
  return date instanceof Date && !isNaN(date);
}
