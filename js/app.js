/* ============================================
   APP — Main Entry Point
   ============================================ */

/**
 * @module app
 * Initializes the application: store, router,
 * navigation, chat, and global event listeners.
 */

import { getState, subscribe } from './store.js';
import { registerRoute, initRouter, navigateTo } from './router.js';
import { renderNav, setupMobileNav } from './components/nav.js';
import { renderQuiz } from './components/quiz.js';
import { renderDashboard } from './components/dashboard.js';
import { renderLogger } from './components/logger.js';
import { renderGoals } from './components/goals.js';
import { renderInsights } from './components/insights.js';
import { renderSettings } from './components/settings.js';
import { initChat } from './components/chat.js';
import { initNature } from './engine/nature.js';

/**
 * Boot the application.
 */
function boot() {
  // Register routes
  registerRoute('/quiz', {
    title: 'Welcome',
    render: renderQuiz,
    requiresOnboarding: false
  });

  registerRoute('/dashboard', {
    title: 'Dashboard',
    render: renderDashboard
  });

  registerRoute('/log', {
    title: 'Log Activity',
    render: renderLogger
  });

  registerRoute('/goals', {
    title: 'Goals & Challenges',
    render: renderGoals
  });

  registerRoute('/insights', {
    title: 'Insights',
    render: renderInsights
  });

  registerRoute('/settings', {
    title: 'Settings',
    render: renderSettings
  });

  // Check onboarding status
  const state = getState();
  
  if (state.onboarded) {
    // Show full app layout
    showAppLayout();
  } else {
    // Hide sidebar for onboarding
    hideAppLayout();
  }

  // Initialize router
  initRouter('#main-content');

  // Initialize chat (only after onboarding)
  if (state.onboarded) {
    initChat();
  }

  // Subscribe to state changes for layout updates
  subscribe((newState) => {
    if (newState.onboarded) {
      showAppLayout();
      // Initialize chat if not already
      if (!document.getElementById('chat-toggle')) {
        initChat();
      }
      renderNav();
    }
  });

  // Initialize nature effects (floating leaves, fireflies, mist)
  initNature();

  console.log('[Dharatrack] Application booted successfully ✅');
}

/**
 * Show the full app layout (sidebar + main content area).
 */
function showAppLayout() {
  const sidebar = document.getElementById('sidebar');
  const mobileHeader = document.getElementById('mobile-header');
  const overlay = document.getElementById('sidebar-overlay');
  const mainContent = document.getElementById('main-content');

  if (sidebar) sidebar.classList.remove('hidden');
  if (mobileHeader) mobileHeader.classList.remove('hidden');
  if (overlay) overlay.classList.remove('hidden');
  if (mainContent) mainContent.classList.remove('onboarding-mode');

  renderNav();
  setupMobileNav();
}

/**
 * Hide sidebar for onboarding flow.
 */
function hideAppLayout() {
  const sidebar = document.getElementById('sidebar');
  const mobileHeader = document.getElementById('mobile-header');
  const overlay = document.getElementById('sidebar-overlay');
  const mainContent = document.getElementById('main-content');

  if (sidebar) sidebar.classList.add('hidden');
  if (mobileHeader) mobileHeader.classList.add('hidden');
  if (overlay) overlay.classList.add('hidden');
  if (mainContent) mainContent.classList.add('onboarding-mode');
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
