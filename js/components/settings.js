/* ============================================
   SETTINGS — User Settings Component
   ============================================ */

import { getState, setState, resetState } from '../store.js';
import { calculateTotalFromQuiz } from '../engine/calculator.js';
import { Sanitize } from '../utils/sanitize.js';
import { navigateTo } from '../router.js';
import { announce } from '../utils/accessibility.js';

/**
 * Render the settings view.
 * @param {Element} container
 */
export function renderSettings(container) {
  const state = getState();
  const { profile, breakdown, preferences } = state;

  container.innerHTML = `
    <div class="page-header">
      <h1>Settings</h1>
      <p class="page-subtitle">Manage your profile and preferences</p>
    </div>

    <!-- Profile Summary -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>👤 Profile Summary</h3>
        <button class="btn btn-sm btn-secondary" id="retake-quiz-btn">Retake Quiz</button>
      </div>
      <div class="card-body">
        <div class="grid-2" style="gap: var(--space-md);">
          ${renderProfileItem('🚗 Commute', formatCommute(profile))}
          ${renderProfileItem('✈️ Flights', `${profile.flights || 0} per year`)}
          ${renderProfileItem('🍽️ Diet', formatDiet(profile.dietType))}
          ${renderProfileItem('🏠 Home', formatHome(profile))}
          ${renderProfileItem('☀️ Renewables', `${profile.renewablePercent || 0}%`)}
          ${renderProfileItem('🛍️ Shopping', profile.shoppingHabit || 'moderate')}
        </div>
      </div>
    </div>

    <!-- Preferences -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>⚙️ Preferences</h3>
      </div>
      <div class="card-body">
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-medium);">EcoBot Notifications</div>
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">Show proactive tips from EcoBot</div>
            </div>
            <div class="toggle-switch ${preferences.notifications ? 'active' : ''}" id="notif-toggle" role="switch" aria-checked="${preferences.notifications}" aria-label="EcoBot notifications" tabindex="0"></div>
          </div>

          <div class="divider" style="margin: var(--space-xs) 0;"></div>

          <div class="form-group">
            <label for="country-select">Country (for comparisons)</label>
            <select id="country-select">
              <option value="global" ${preferences.country === 'global' ? 'selected' : ''}>🌍 Global</option>
              <option value="us" ${preferences.country === 'us' ? 'selected' : ''}>🇺🇸 United States</option>
              <option value="eu" ${preferences.country === 'eu' ? 'selected' : ''}>🇪🇺 European Union</option>
              <option value="uk" ${preferences.country === 'uk' ? 'selected' : ''}>🇬🇧 United Kingdom</option>
              <option value="india" ${preferences.country === 'india' ? 'selected' : ''}>🇮🇳 India</option>
              <option value="china" ${preferences.country === 'china' ? 'selected' : ''}>🇨🇳 China</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- API Configuration -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>🤖 EcoBot AI API Configuration</h3>
      </div>
      <div class="card-body">
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <div class="form-group">
            <label for="gemini-api-key">Gemini API Key</label>
            <input type="password" id="gemini-api-key" class="form-input" placeholder="Enter your Gemini API key (optional)" value="${preferences.geminiApiKey || ''}">
            <div class="form-hint">Required for advanced AI capabilities. Stored locally only.</div>
          </div>
          <button class="btn btn-sm btn-primary" id="save-api-key-btn">Save Key</button>
        </div>
      </div>
    </div>

    <!-- Cloud Sync (Firebase) -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>☁️ Cloud Sync (Firebase)</h3>
      </div>
      <div class="card-body">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-medium);">Enable Cloud Sync</div>
            <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">Back up your data securely to Firestore</div>
          </div>
          <div class="toggle-switch ${preferences.cloudSync ? 'active' : ''}" id="sync-toggle" role="switch" aria-checked="${preferences.cloudSync || false}" aria-label="Cloud Sync" tabindex="0"></div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl); border: 1px solid hsla(0, 78%, 62%, 0.2);">
      <div class="card-header">
        <h3>🗑️ Data Management</h3>
      </div>
      <div class="card-body">
        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          All your data is stored locally in your browser. No data is sent to any server.
        </p>
        <div style="display: flex; gap: var(--space-sm);">
          <button class="btn btn-danger" id="reset-data-btn">
            Reset All Data
          </button>
        </div>
        <p style="font-size: var(--text-xs); color: var(--color-danger); margin-top: var(--space-sm);">
          ⚠️ This will permanently delete all your data including profile, activities, and goals.
        </p>
      </div>
    </div>

    <!-- About -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>ℹ️ About Dharatrack</h3>
      </div>
      <div class="card-body">
        <p style="font-size: var(--text-sm);">
          Dharatrack helps you understand, track, and reduce your personal carbon footprint through 
          data-driven insights and an AI-powered assistant.
        </p>
        <div style="margin-top: var(--space-md); font-size: var(--text-xs); color: var(--color-text-tertiary);">
          <p>Version 1.0.0</p>
          <p style="margin-top: var(--space-2xs);">Emission factors sourced from EPA, DEFRA, and IPCC AR6.</p>
          <p style="margin-top: var(--space-2xs);">Built with ❤️ for the planet.</p>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('retake-quiz-btn')?.addEventListener('click', () => {
    setState({ onboarded: false });
    navigateTo('/quiz');
  });

  // Notification toggle
  const notifToggle = document.getElementById('notif-toggle');
  if (notifToggle) {
    const handler = () => {
      notifToggle.classList.toggle('active');
      const isActive = notifToggle.classList.contains('active');
      notifToggle.setAttribute('aria-checked', String(isActive));
      setState({ preferences: { ...getState().preferences, notifications: isActive } });
      announce(`Notifications ${isActive ? 'enabled' : 'disabled'}`);
    };
    notifToggle.addEventListener('click', handler);
    notifToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  }

  // Country select
  document.getElementById('country-select')?.addEventListener('change', (e) => {
    setState({ preferences: { ...getState().preferences, country: e.target.value } });
    announce(`Country changed to ${e.target.options[e.target.selectedIndex].text}`);
  });

  // Reset data
  document.getElementById('reset-data-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      resetState();
      announce('All data has been reset');
      navigateTo('/quiz');
    }
  });

  // Save API Key
  document.getElementById('save-api-key-btn')?.addEventListener('click', () => {
    const key = document.getElementById('gemini-api-key').value.trim();
    setState({ preferences: { ...getState().preferences, geminiApiKey: key } });
    announce(key ? 'API Key saved' : 'API Key cleared');
    const btn = document.getElementById('save-api-key-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Saved!';
    setTimeout(() => { btn.textContent = originalText; }, 2000);
  });

  // Cloud Sync toggle
  const syncToggle = document.getElementById('sync-toggle');
  if (syncToggle) {
    const handler = () => {
      syncToggle.classList.toggle('active');
      const isActive = syncToggle.classList.contains('active');
      syncToggle.setAttribute('aria-checked', String(isActive));
      setState({ preferences: { ...getState().preferences, cloudSync: isActive } });
      announce(`Cloud sync ${isActive ? 'enabled' : 'disabled'}`);
    };
    syncToggle.addEventListener('click', handler);
    syncToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  }
}

function renderProfileItem(label, value) {
  return `
    <div style="display: flex; justify-content: space-between; padding: var(--space-sm); background: var(--glass-bg); border-radius: var(--radius-md);">
      <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">${label}</span>
      <span style="font-size: var(--text-sm); font-weight: var(--weight-medium);">${Sanitize.escapeHTML(String(value))}</span>
    </div>
  `;
}

function formatCommute(profile) {
  const modes = {
    car_petrol: 'Petrol Car', car_diesel: 'Diesel Car', car_hybrid: 'Hybrid',
    car_electric: 'Electric', bus: 'Bus', train: 'Train', bicycle: 'Bicycle',
    walking: 'Walking', motorcycle: 'Motorcycle'
  };
  return `${modes[profile.commuteMode] || 'Car'}, ${profile.commuteDistance || 0} km, ${profile.commuteDays || 5} days/wk`;
}

function formatDiet(type) {
  const diets = {
    heavy_meat: 'Heavy Meat', medium_meat: 'Medium Meat', low_meat: 'Low Meat',
    pescatarian: 'Pescatarian', vegetarian: 'Vegetarian', vegan: 'Vegan'
  };
  return diets[type] || 'Medium Meat';
}

function formatHome(profile) {
  const sizes = { studio: 'Studio', small: 'Small', medium: 'Medium', large: 'Large', very_large: 'Very Large' };
  const heating = { gas: 'Gas', oil: 'Oil', electric: 'Electric', heat_pump: 'Heat Pump', none: 'None' };
  return `${sizes[profile.homeSize] || 'Medium'}, ${heating[profile.heatingType] || 'Gas'} heating`;
}
