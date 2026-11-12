/**
 * Shared HTML escaping for FindYourSound dynamic markup.
 * Use before interpolating any untrusted or catalog text into HTML strings.
 */

/**
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
