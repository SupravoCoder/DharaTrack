/* ============================================
   ACCESSIBILITY — A11y Utilities
   ============================================ */

/**
 * @module accessibility
 * Provides focus trapping, screen reader announcements,
 * keyboard navigation helpers, and other a11y utilities.
 */

/**
 * Trap focus within a container (for modals, dialogs).
 * Returns a cleanup function to restore normal focus behavior.
 * @param {Element} container - Container element
 * @returns {Function} Cleanup function
 */
export function trapFocus(container) {
  const focusableSelector = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableEls = Array.from(container.querySelectorAll(focusableSelector));
  if (focusableEls.length === 0) return () => {};

  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  firstEl.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce a message to screen readers via aria-live region.
 * @param {string} message - Message to announce
 * @param {'polite'|'assertive'} [priority='polite'] - Announcement priority
 */
export function announce(message, priority = 'polite') {
  let region = document.getElementById('aria-live-region');
  
  if (!region) {
    region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }

  region.setAttribute('aria-live', priority);
  // Clear and re-set to trigger announcement
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

/**
 * Handle Enter/Space key as a click for custom interactive elements.
 * @param {Element} el - Target element
 * @param {Function} callback - Click handler
 */
export function onActivate(el, callback) {
  el.addEventListener('click', callback);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
    }
  });
}

/**
 * Set up keyboard navigation for a list of items (arrow keys).
 * @param {Element} container - Container with navigable children
 * @param {string} itemSelector - Selector for navigable items
 * @param {Object} [opts]
 * @param {boolean} [opts.wrap=true] - Wrap around at edges
 * @param {'vertical'|'horizontal'|'both'} [opts.direction='vertical']
 */
export function arrowKeyNav(container, itemSelector, opts = {}) {
  const { wrap = true, direction = 'vertical' } = opts;

  container.addEventListener('keydown', (e) => {
    const items = Array.from(container.querySelectorAll(itemSelector));
    const currentIndex = items.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    const isVertical = direction === 'vertical' || direction === 'both';
    const isHorizontal = direction === 'horizontal' || direction === 'both';

    if ((e.key === 'ArrowDown' && isVertical) || (e.key === 'ArrowRight' && isHorizontal)) {
      e.preventDefault();
      nextIndex = currentIndex + 1;
      if (nextIndex >= items.length) nextIndex = wrap ? 0 : currentIndex;
    } else if ((e.key === 'ArrowUp' && isVertical) || (e.key === 'ArrowLeft' && isHorizontal)) {
      e.preventDefault();
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = wrap ? items.length - 1 : currentIndex;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== currentIndex) {
      items[nextIndex].focus();
    }
  });
}

/**
 * Check if user prefers reduced motion.
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
