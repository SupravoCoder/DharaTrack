/* ============================================
   SANITIZE TESTS
   ============================================ */

import { Sanitize } from '../js/utils/sanitize.js';

describe('Sanitize — escapeHTML', () => {
  it('should escape angle brackets', () => {
    expect(Sanitize.escapeHTML('<script>alert("xss")</script>')).toContain('&lt;');
    expect(Sanitize.escapeHTML('<script>alert("xss")</script>')).toContain('&gt;');
  });

  it('should escape quotes', () => {
    expect(Sanitize.escapeHTML('" \' `')).toContain('&quot;');
    expect(Sanitize.escapeHTML('" \' `')).toContain('&#x27;');
    expect(Sanitize.escapeHTML('" \' `')).toContain('&#96;');
  });

  it('should escape ampersands', () => {
    expect(Sanitize.escapeHTML('a & b')).toContain('&amp;');
  });

  it('should return empty string for non-string input', () => {
    expect(Sanitize.escapeHTML(null)).toBe('');
    expect(Sanitize.escapeHTML(undefined)).toBe('');
    expect(Sanitize.escapeHTML(123)).toBe('');
  });

  it('should not modify safe strings', () => {
    expect(Sanitize.escapeHTML('Hello World')).toBe('Hello World');
  });
});

describe('Sanitize — stripTags', () => {
  it('should remove HTML tags', () => {
    expect(Sanitize.stripTags('<p>Hello</p>')).toBe('Hello');
    expect(Sanitize.stripTags('<b>bold</b> text')).toBe('bold text');
  });

  it('should handle empty and non-string input', () => {
    expect(Sanitize.stripTags('')).toBe('');
    expect(Sanitize.stripTags(null)).toBe('');
  });
});

describe('Sanitize — number', () => {
  it('should parse valid numbers', () => {
    expect(Sanitize.number('42')).toBe(42);
    expect(Sanitize.number(3.14)).toBeCloseTo(3.14, 2);
  });

  it('should clamp to min/max', () => {
    expect(Sanitize.number(200, { min: 0, max: 100 })).toBe(100);
    expect(Sanitize.number(-5, { min: 0, max: 100 })).toBe(0);
  });

  it('should return fallback for invalid input', () => {
    expect(Sanitize.number('abc')).toBe(0);
    expect(Sanitize.number('abc', { fallback: -1 })).toBe(-1);
    expect(Sanitize.number(NaN)).toBe(0);
    expect(Sanitize.number(Infinity)).toBe(0);
  });
});

describe('Sanitize — string', () => {
  it('should trim and validate', () => {
    expect(Sanitize.string('  hello  ')).toBe('hello');
  });

  it('should truncate to maxLength', () => {
    const long = 'a'.repeat(1000);
    const result = Sanitize.string(long, { maxLength: 10 });
    expect(result.length).toBe(10);
  });

  it('should return fallback for non-string', () => {
    expect(Sanitize.string(null, { fallback: 'default' })).toBe('default');
    expect(Sanitize.string(123)).toBe('');
  });

  it('should return fallback for empty string', () => {
    expect(Sanitize.string('  ', { fallback: 'default' })).toBe('default');
  });
});

describe('Sanitize — date', () => {
  it('should accept valid YYYY-MM-DD', () => {
    expect(Sanitize.date('2024-06-15')).toBe('2024-06-15');
  });

  it('should reject invalid dates', () => {
    const result = Sanitize.date('not-a-date');
    expect(result).toBeTruthy(); // Returns fallback (today)
  });

  it('should reject non-string input', () => {
    const result = Sanitize.date(12345);
    expect(result).toBeTruthy();
  });
});

describe('Sanitize — enum', () => {
  it('should accept allowed values', () => {
    expect(Sanitize.enum('a', ['a', 'b', 'c'])).toBe('a');
  });

  it('should return fallback for disallowed values', () => {
    expect(Sanitize.enum('x', ['a', 'b'], 'a')).toBe('a');
  });

  it('should return first element as default fallback', () => {
    expect(Sanitize.enum('x', ['a', 'b'])).toBe('a');
  });
});

describe('Sanitize — id', () => {
  it('should accept alphanumeric IDs', () => {
    expect(Sanitize.id('abc-123_test')).toBe('abc-123_test');
  });

  it('should strip special characters', () => {
    expect(Sanitize.id('hello<script>')).toBe('helloscript');
  });

  it('should return null for non-string input', () => {
    expect(Sanitize.id(null)).toBeNull();
  });

  it('should truncate to 100 characters', () => {
    const long = 'a'.repeat(200);
    const result = Sanitize.id(long);
    expect(result.length).toBe(100);
  });
});
