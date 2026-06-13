/* ============================================
   NAV — Sidebar Navigation Component
   ============================================ */

import { navigateTo, getCurrentRoute } from '../router.js';
import { getState } from '../store.js';
import { $, delegate } from '../utils/dom.js';

/**
 * Render the sidebar navigation.
 */
export function renderNav() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const state = getState();
  const streak = state.streak?.current || 0;

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="logo-icon" aria-hidden="true">🌍</div>
        <span>Dharatrack</span>
      </div>
    </div>

    <nav class="sidebar-nav" aria-label="Main navigation">
      <div class="nav-section">
        <div class="nav-section-title">Overview</div>
        <a class="nav-item" data-route="/dashboard" href="#/dashboard" tabindex="0" role="link">
          <span class="nav-icon" aria-hidden="true">📊</span>
          <span>Dashboard</span>
        </a>
        <a class="nav-item" data-route="/log" href="#/log" tabindex="0" role="link">
          <span class="nav-icon" aria-hidden="true">📝</span>
          <span>Log Activity</span>
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Progress</div>
        <a class="nav-item" data-route="/goals" href="#/goals" tabindex="0" role="link">
          <span class="nav-icon" aria-hidden="true">🎯</span>
          <span>Goals & Challenges</span>
        </a>
        <a class="nav-item" data-route="/insights" href="#/insights" tabindex="0" role="link">
          <span class="nav-icon" aria-hidden="true">💡</span>
          <span>Insights</span>
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Account</div>
        <a class="nav-item" data-route="/settings" href="#/settings" tabindex="0" role="link">
          <span class="nav-icon" aria-hidden="true">⚙️</span>
          <span>Settings</span>
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      ${streak > 0 ? `
        <div class="streak-display">
          <span class="streak-icon" aria-hidden="true">🔥</span>
          <div>
            <div class="streak-count">${streak}</div>
            <div class="streak-label">day streak</div>
          </div>
        </div>
      ` : ''}
      <div class="version-tag" style="margin-top: var(--space-sm);">Dharatrack v1.0.0</div>
    </div>
  `;

  // Update active state
  updateActiveItem();

  // Handle nav clicks
  delegate(sidebar, 'click', '.nav-item', (e, item) => {
    e.preventDefault();
    const route = item.getAttribute('data-route');
    if (route) {
      navigateTo(route);
      closeMobileSidebar();
    }
  });
}

/**
 * Update the active nav item based on current route.
 */
export function updateActiveItem() {
  const current = getCurrentRoute();
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => {
    const route = item.getAttribute('data-route');
    if (route === current) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });
}

/**
 * Set up mobile hamburger menu.
 */
export function setupMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('visible');
      const isOpen = sidebar?.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('hamburger-btn');
  sidebar?.classList.remove('open');
  overlay?.classList.remove('visible');
  hamburger?.setAttribute('aria-expanded', 'false');
}
