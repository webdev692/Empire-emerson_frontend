/**
 * Require an exact, configured browser origin. Public form requests are
 * cross-origin browser requests and therefore carry Origin; accepting a
 * missing origin would bypass the configured allowlist for scripted callers.
 *
 * @param {string | null} origin
 * @param {Set<string>} allowedOrigins
 * @returns {boolean}
 */
export function isAllowedRequestOrigin(origin, allowedOrigins) {
  if (typeof origin !== "string" || origin.trim().length === 0) return false;

  const normalized = origin.trim().replace(/\/$/, "");
  try {
    const parsed = new URL(normalized);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    if (parsed.origin !== normalized) return false;
    return allowedOrigins.has(parsed.origin);
  } catch {
    return false;
  }
}

/**
 * Keep user-controlled labels out of email header injection paths.
 *
 * @param {string | null | undefined} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function sanitizeSubjectLabel(value, fallback = "General inquiry") {
  const withoutControls = Array.from(String(value || ""), (character) => {
    const codePoint = character.codePointAt(0) || 0;
    return codePoint < 32 || codePoint === 127 ? " " : character;
  }).join("");
  const cleaned = withoutControls
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned || fallback;
}
