/**
 * Minimal in-memory sliding-window rate limiter for the AI routes.
 * Suitable for a single-instance micro-app; swap for Redis in a cluster.
 */
const buckets = new Map();

/**
 * Minimal in-memory sliding-window rate limiter for client-side API routes.
 * @param {string} key - Unique key per rate limit target (e.g. user ID or IP).
 * @param {Object} [options] - Options configuration.
 * @param {number} [options.limit=20] - Maximum requests allowed in the timeframe window.
 * @param {number} [options.windowMs=60000] - Window timeframe size in milliseconds.
 * @returns {boolean} True if the request is permitted, false if rate-limited.
 */
export function rateLimit(key, { limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}
