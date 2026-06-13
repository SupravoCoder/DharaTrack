/* ============================================
   SANITIZE — Input Sanitization & XSS Prevention
   ============================================ */

/**
 * @module sanitize
 * Provides HTML entity escaping, input validation,
 * and safe DOM insertion utilities.
 */
export const Sanitize = {
  /**
   * Escapes HTML special characters to prevent XSS.
   * @param {string} str - Raw user input
   * @returns {string} Escaped string safe for HTML insertion
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&#96;'
    };
    return str.replace(/[&<>"'/`]/g, char => map[char]);
  },

  /**
   * Strips all HTML tags from a string.
   * @param {string} str - Input string
   * @returns {string} Plain text
   */
  stripTags(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '');
  },

  /**
   * Validates and sanitizes a number input.
   * @param {*} value - Input to validate
   * @param {Object} [opts] - Options
   * @param {number} [opts.min=-Infinity] - Minimum allowed value
   * @param {number} [opts.max=Infinity] - Maximum allowed value  
   * @param {number} [opts.fallback=0] - Fallback if invalid
   * @returns {number} Validated number
   */
  number(value, opts = {}) {
    const { min = -Infinity, max = Infinity, fallback = 0 } = opts;
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, num));
  },

  /**
   * Validates a string input.
   * @param {*} value - Input to validate
   * @param {Object} [opts] - Options
   * @param {number} [opts.maxLength=500] - Maximum string length
   * @param {string} [opts.fallback=''] - Fallback if invalid
   * @returns {string} Validated and trimmed string
   */
  string(value, opts = {}) {
    const { maxLength = 500, fallback = '' } = opts;
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    if (trimmed.length === 0) return fallback;
    return trimmed.slice(0, maxLength);
  },

  /**
   * Validates a date string (YYYY-MM-DD format).
   * @param {string} value - Date string
   * @param {string} [fallback] - Fallback (defaults to today)
   * @returns {string} Valid date string
   */
  date(value, fallback = null) {
    const today = new Date().toISOString().split('T')[0];
    if (!fallback) fallback = today;
    if (typeof value !== 'string') return fallback;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return fallback;
    const d = new Date(value);
    if (isNaN(d.getTime())) return fallback;
    // Don't allow future dates
    if (d > new Date()) return today;
    return value;
  },

  /**
   * Validates an enum value (must be one of allowed values).
   * @param {*} value - Input value
   * @param {Array} allowed - Array of allowed values
   * @param {*} fallback - Fallback if not in allowed list
   * @returns {*} Validated value
   */
  enum(value, allowed, fallback) {
    return allowed.includes(value) ? value : (fallback ?? allowed[0]);
  },

  /**
   * Validates an ID (alphanumeric + dashes only).
   * @param {string} value - Input ID
   * @returns {string|null} Valid ID or null
   */
  id(value) {
    if (typeof value !== 'string') return null;
    const clean = value.replace(/[^a-zA-Z0-9_-]/g, '');
    return clean.length > 0 ? clean.slice(0, 100) : null;
  }
};
