/**
 * Password hashing with Node's built-in scrypt — no external dependency,
 * constant-time comparison, per-user random salt.
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

/**
 * Generates a secure salt-hashed password string using Node's native scrypt sync algorithm.
 * @param {string} password - The plain text password to hash.
 * @returns {string} The formatted salt:hash string.
 */
export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

/**
 * Verifies a plain text password against a stored salt:hash string using constant-time timingSafeEqual.
 * @param {string} password - The plain text password to check.
 * @param {string} stored - The stored salt:hash string from the database.
 * @returns {boolean} True if the password matches, false otherwise.
 */
export function verifyPassword(password, stored) {
  if (typeof stored !== "string" || !stored.includes(":")) return false;
  const [salt, expectedHex] = stored.split(":");
  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(password, salt, KEY_LENGTH);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
