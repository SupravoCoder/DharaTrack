/* ============================================
   DOM — DOM Helper Utilities
   ============================================ */

import { Sanitize } from './sanitize.js';

/**
 * @module dom
 * Lightweight DOM manipulation helpers that enforce
 * safe HTML insertion through sanitization.
 */

/**
 * Query a single element.
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query all matching elements.
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element
 * @returns {Element[]}
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Create a DOM element with attributes and children.
 * @param {string} tag - Tag name
 * @param {Object} [attrs={}] - Attributes (className, id, dataset, etc.)
 * @param {...(string|Element)} children - Text content or child elements
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      for (const [dKey, dValue] of Object.entries(value)) {
        el.dataset[dKey] = dValue;
      }
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'aria') {
      for (const [aKey, aValue] of Object.entries(value)) {
        el.setAttribute(`aria-${aKey}`, aValue);
      }
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      el.appendChild(child);
    }
  }

  return el;
}

/**
 * Safely set innerHTML using sanitized content.
 * @param {Element} el - Target element
 * @param {string} html - Trusted HTML string (already sanitized)
 */
export function setHTML(el, html) {
  if (window.DOMPurify) {
    el.innerHTML = window.DOMPurify.sanitize(html);
  } else {
    el.innerHTML = html;
  }
}

/**
 * Safely set text content (auto-escapes).
 * @param {Element} el - Target element
 * @param {string} text - Raw text
 */
export function setText(el, text) {
  el.textContent = text;
}

/**
 * Build an HTML string from a template, escaping all interpolated values.
 * Usage: safeHTML`<p>Hello ${userName}!</p>`
 * @param {TemplateStringsArray} strings
 * @param {...*} values
 * @returns {string} Safe HTML string
 */
export function safeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = i < values.length ? Sanitize.escapeHTML(String(values[i])) : '';
    return result + str + value;
  }, '');
}

/**
 * Event delegation: attach a single listener that matches child selectors.
 * @param {Element} parent - Parent element
 * @param {string} event - Event name
 * @param {string} selector - CSS selector for target children
 * @param {Function} handler - Event handler (receives event and matched element)
 */
export function delegate(parent, event, selector, handler) {
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  });
}

/**
 * Remove all children from an element.
 * @param {Element} el - Target element
 */
export function clearChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Show an element by removing the 'hidden' class.
 * @param {Element} el
 */
export function show(el) {
  if (el) el.classList.remove('hidden');
}

/**
 * Hide an element by adding the 'hidden' class.
 * @param {Element} el
 */
export function hide(el) {
  if (el) el.classList.add('hidden');
}

/**
 * Toggle element visibility.
 * @param {Element} el
 * @param {boolean} [force]
 */
export function toggle(el, force) {
  if (el) el.classList.toggle('hidden', force !== undefined ? !force : undefined);
}
