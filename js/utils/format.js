/* ============================================
   FORMAT — Number, Date & Unit Formatting
   ============================================ */

/**
 * @module format
 * Provides consistent formatting for CO₂ values,
 * dates, percentages, and relative times.
 */

/**
 * Format CO₂ amount with smart unit selection.
 * @param {number} kgCO2 - Amount in kg CO₂
 * @param {Object} [opts]
 * @param {number} [opts.decimals=1] - Decimal places
 * @param {boolean} [opts.showUnit=true] - Whether to append unit
 * @returns {string} Formatted string (e.g., "1.2 kg", "450 g", "2.3 tonnes")
 */
export function formatCO2(kgCO2, opts = {}) {
  const { decimals = 1, showUnit = true } = opts;
  const abs = Math.abs(kgCO2);
  let value, unit;

  if (abs >= 1000) {
    value = (kgCO2 / 1000).toFixed(decimals);
    unit = 'tonnes';
  } else if (abs >= 1) {
    value = kgCO2.toFixed(decimals);
    unit = 'kg';
  } else if (abs > 0) {
    value = (kgCO2 * 1000).toFixed(0);
    unit = 'g';
  } else {
    value = '0';
    unit = 'kg';
  }

  return showUnit ? `${value} ${unit} CO₂` : value;
}

/**
 * Format a number with locale-appropriate separators.
 * @param {number} num
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatNumber(num, decimals = 0) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format a percentage.
 * @param {number} value - Decimal value (e.g., 0.42)
 * @param {number} [decimals=0]
 * @returns {string} e.g., "42%"
 */
export function formatPercentage(value, decimals = 0) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a date as a readable string.
 * @param {string|Date} date - Date string or Date object
 * @param {string} [style='medium'] - 'short', 'medium', 'long'
 * @returns {string}
 */
export function formatDate(date, style = 'medium') {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';

  const styles = {
    short: { month: 'numeric', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };

  return d.toLocaleDateString('en-US', styles[style] || styles.medium);
}

/**
 * Format relative time (e.g., "2 hours ago", "just now").
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(d, 'short');
}

/**
 * Get the current date as YYYY-MM-DD.
 * @returns {string}
 */
export function today() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get a date N days ago as YYYY-MM-DD.
 * @param {number} n - Number of days
 * @returns {string}
 */
export function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

/**
 * Get the start of the current week (Monday).
 * @returns {string}
 */
export function weekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

/**
 * Get the start of the current month.
 * @returns {string}
 */
export function monthStart() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split('T')[0];
}

/**
 * Generate an array of date strings between start and end (inclusive).
 * @param {string} start - Start date (YYYY-MM-DD)
 * @param {string} end - End date (YYYY-MM-DD)
 * @returns {string[]}
 */
export function dateRange(start, end) {
  const dates = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
