/* ============================================
   ROUTER — Hash-Based SPA Router
   ============================================ */

/**
 * @module router
 * Simple hash-based router for single-page navigation.
 * Supports route guards, transition animations, and
 * dynamic view rendering.
 */

import { getState } from './store.js';
import { $ } from './utils/dom.js';
import { announce } from './utils/accessibility.js';

/* ---- Route Definitions ---- */

const routes = {};
let currentRoute = null;
let containerEl = null;

/** Duration in ms for the view fade-out before re-render. */
const VIEW_TRANSITION_OUT_MS = 150;
/** Duration in ms for the view fade-in after re-render. */
const VIEW_TRANSITION_IN_MS = 300;

/**
 * Register a route.
 * @param {string} path - Hash path (e.g., '/dashboard')
 * @param {Object} config
 * @param {string} config.title - Page title
 * @param {Function} config.render - Render function (receives container element)
 * @param {Function} [config.onEnter] - Called when entering route
 * @param {Function} [config.onLeave] - Called when leaving route
 * @param {boolean} [config.requiresOnboarding=true] - Redirect to quiz if not onboarded
 */
export function registerRoute(path, config) {
  routes[path] = {
    title: config.title,
    render: config.render,
    onEnter: config.onEnter || null,
    onLeave: config.onLeave || null,
    requiresOnboarding: config.requiresOnboarding !== false
  };
}

/**
 * Initialize the router.
 * @param {string|Element} container - Container element or selector
 */
export function initRouter(container) {
  containerEl = typeof container === 'string' ? $(container) : container;

  window.addEventListener('hashchange', handleRouteChange);
  
  // Handle initial route
  handleRouteChange();
}

/**
 * Navigate to a route.
 * @param {string} path - Route path
 */
export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

/**
 * Get the current route path.
 * @returns {string}
 */
export function getCurrentRoute() {
  return currentRoute;
}

/* ---- Internal ---- */

function handleRouteChange() {
  const hash = window.location.hash.slice(1) || '/dashboard';
  const path = hash.startsWith('/') ? hash : `/${hash}`;

  // Route guard: redirect to quiz if not onboarded
  const state = getState();
  const route = routes[path];

  if (!route) {
    navigateTo('/dashboard');
    return;
  }

  if (route.requiresOnboarding && !state.onboarded) {
    navigateTo('/quiz');
    return;
  }

  // If onboarded and trying to access quiz, redirect to dashboard
  if (path === '/quiz' && state.onboarded) {
    // Allow access (user might want to retake)
  }

  // Leave current route
  if (currentRoute && routes[currentRoute]?.onLeave) {
    routes[currentRoute].onLeave();
  }

  currentRoute = path;

  // Set body class for background changes (preserve existing classes)
  const routeName = path.split('?')[0].substring(1) || 'dashboard';
  document.body.classList.forEach(cls => {
    if (cls.startsWith('route-')) document.body.classList.remove(cls);
  });
  document.body.classList.add(`route-${routeName}`);

  // Update page title
  document.title = `${route.title} — Dharatrack`;

  // Update active nav item
  updateActiveNav(path);

  // Render with transition
  renderRoute(route);

  // Announce to screen readers
  announce(`Navigated to ${route.title}`);
}

function renderRoute(route) {
  if (!containerEl) return;

  // Fade out
  containerEl.style.opacity = '0';
  containerEl.style.transform = 'translateY(10px)';

  setTimeout(() => {
    containerEl.innerHTML = '';
    
    // Create view wrapper
    const view = document.createElement('div');
    view.className = 'view-container';
    containerEl.appendChild(view);

    // Render route content
    route.render(view);

    // Fade in
    requestAnimationFrame(() => {
      containerEl.style.transition = `opacity ${VIEW_TRANSITION_IN_MS}ms ease, transform ${VIEW_TRANSITION_IN_MS}ms ease`;
      containerEl.style.opacity = '1';
      containerEl.style.transform = 'translateY(0)';
    });

    // Call onEnter
    if (route.onEnter) {
      route.onEnter(view);
    }
  }, VIEW_TRANSITION_OUT_MS);
}

function updateActiveNav(path) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const href = item.getAttribute('data-route');
    if (href === path) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });
}
