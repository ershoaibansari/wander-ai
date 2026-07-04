/** Small framework-free helpers shared by the app and covered by unit tests. */

/**
 * Validates whether the given string is a valid email address.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export function validateEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Validates whether the given string is a valid password.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is at least 8 characters, false otherwise.
 */
export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

/**
 * Validates whether the given destination is valid (between 2 and 120 characters).
 * @param {string} value - The destination to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateDestination(value) {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 120;
}

/**
 * Converts a string into a clean, URL-safe slug.
 * @param {string} text - The input string.
 * @returns {string} The slugified string.
 */
export function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Gets up to two uppercase initials from a user's name.
 * @param {string} name - The user's name.
 * @returns {string} The uppercase initials (e.g. "JD" for John Doe).
 */
export function getInitials(name) {
  return String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if exceeded.
 * @param {string} text - The string to truncate.
 * @param {number} [maxLength=140] - The maximum character length allowed.
 * @returns {string} The truncated string.
 */
export function truncate(text, maxLength = 140) {
  const value = String(text ?? "");
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * Formats a Date object or timestamp into a short, human-readable string.
 * @param {Date|number|string} input - The input date or timestamp.
 * @returns {string} The formatted date string (e.g. "Jul 4, 2026"), or an empty string if invalid.
 */
export function formatDate(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Joins conditional class names, skipping falsy values.
 * @param {...string} classes - List of class names or conditional expressions.
 * @returns {string} The joined class names.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Parses JSON returned by an LLM, tolerating markdown code fences and
 * leading/trailing prose. Returns null when nothing parseable is found.
 * @param {string} text - The text to parse.
 * @returns {any} The parsed JSON object/array, or null if parsing fails.
 */
export function parseJsonSafe(text) {
  if (typeof text !== "string" || !text.trim()) return null;
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.search(/[[{]/);
    if (start === -1) return null;
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

/**
 * Calculates the percentage of passport progress toward a target goal, clamped between 0 and 100.
 * @param {number} stampCount - The number of passport stamps collected.
 * @param {number} [goal=10] - The target number of stamps to reach.
 * @returns {number} The progress percentage (0-100).
 */
export function passportProgress(stampCount, goal = 10) {
  const count = Number(stampCount) || 0;
  return Math.max(0, Math.min(100, Math.round((count / goal) * 100)));
}

