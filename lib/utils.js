/** Small framework-free helpers shared by the app and covered by unit tests. */

export function validateEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function validateDestination(value) {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 120;
}

export function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(name) {
  return String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function truncate(text, maxLength = 140) {
  const value = String(text ?? "");
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function formatDate(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Joins conditional class names, skipping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Parses JSON returned by an LLM, tolerating markdown code fences and
 * leading/trailing prose. Returns null when nothing parseable is found.
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

/** Percentage of passport progress toward a goal, clamped to 0–100. */
export function passportProgress(stampCount, goal = 10) {
  const count = Number(stampCount) || 0;
  return Math.max(0, Math.min(100, Math.round((count / goal) * 100)));
}
