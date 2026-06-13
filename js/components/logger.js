/* ============================================
   LOGGER — Activity Logger Component
   ============================================ */

import { addActivity, getActivities, deleteActivity } from '../store.js';
import { QUICK_ACTIVITIES, activityToCO2 } from '../engine/calculator.js';
import { Sanitize } from '../utils/sanitize.js';
import { formatCO2, formatRelativeTime, today } from '../utils/format.js';
import { delegate } from '../utils/dom.js';
import { announce } from '../utils/accessibility.js';

/**
 * Render the activity logger view.
 * @param {Element} container
 */
export function renderLogger(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Log Activity</h1>
      <p class="page-subtitle">Track your daily carbon emissions</p>
    </div>

    <!-- Quick Add -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>⚡ Quick Add</h3>
        <span class="text-muted" style="font-size: var(--text-xs);">Tap to log common activities</span>
      </div>
      <div class="card-body">
        <div class="quick-actions" id="quick-actions-grid" role="group" aria-label="Quick add activities">
          ${QUICK_ACTIVITIES.map(qa => `
            <button class="quick-action-btn" data-key="${qa.key}" aria-label="Log ${qa.label}: ${qa.defaultAmount} ${qa.unit}" tabindex="0">
              <span class="action-icon" aria-hidden="true">${qa.icon}</span>
              <span>${Sanitize.escapeHTML(qa.label)}</span>
              <span style="font-size: 10px; color: var(--color-text-tertiary);">${qa.defaultAmount} ${qa.unit}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Custom Entry -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>📝 Custom Entry</h3>
      </div>
      <div class="card-body">
        <form id="custom-activity-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="activity-category">Category</label>
              <select id="activity-category" required>
                <option value="transport">🚗 Transport</option>
                <option value="diet">🍽️ Diet</option>
                <option value="energy">⚡ Energy</option>
                <option value="shopping">🛍️ Shopping</option>
              </select>
            </div>
            <div class="form-group">
              <label for="activity-description">Description</label>
              <input type="text" id="activity-description" placeholder="e.g., Drove to office" maxlength="100" required>
            </div>
          </div>
          <div class="form-row" style="margin-top: var(--space-md);">
            <div class="form-group">
              <label for="activity-co2">CO₂ Emissions (kg)</label>
              <input type="number" id="activity-co2" placeholder="0.0" min="0" max="10000" step="0.01" required>
              <span class="form-hint">Estimate the kg CO₂ for this activity</span>
            </div>
            <div class="form-group">
              <label for="activity-date">Date</label>
              <input type="date" id="activity-date" value="${today()}" max="${today()}">
            </div>
          </div>
          <div style="margin-top: var(--space-lg); display: flex; gap: var(--space-sm);">
            <button type="submit" class="btn btn-primary">Add Activity</button>
            <button type="reset" class="btn btn-secondary">Clear</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Activity History -->
    <div class="card animate-fade-in-up">
      <div class="card-header">
        <h3>📋 Activity History</h3>
        <div style="display: flex; gap: var(--space-xs);">
          <select id="filter-category" style="font-size: var(--text-xs); padding: var(--space-2xs) var(--space-sm);" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option value="transport">Transport</option>
            <option value="diet">Diet</option>
            <option value="energy">Energy</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>
      </div>
      <div class="card-body" id="activity-history-container">
        <!-- Populated dynamically -->
      </div>
    </div>
  `;

  // Render history
  renderHistory();

  // Quick-add event delegation
  delegate(document.getElementById('quick-actions-grid'), 'click', '.quick-action-btn', (e, btn) => {
    const key = btn.dataset.key;
    const qa = QUICK_ACTIVITIES.find(a => a.key === key);
    if (!qa) return;

    const co2 = activityToCO2({
      category: qa.category,
      type: qa.type,
      amount: qa.defaultAmount
    });

    addActivity({
      category: qa.category,
      type: qa.type,
      label: qa.label,
      amount: qa.defaultAmount,
      unit: qa.unit,
      co2,
      date: today(),
      description: qa.label
    });

    // Visual feedback
    btn.style.background = 'var(--color-accent-subtle)';
    btn.style.borderColor = 'var(--color-accent)';
    setTimeout(() => {
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 800);

    showToast(`Logged: ${qa.label} (+${co2.toFixed(2)} kg CO₂)`, 'success');
    announce(`Activity logged: ${qa.label}, ${co2.toFixed(2)} kilograms CO2`);
    renderHistory();
  });

  // Custom form submission
  document.getElementById('custom-activity-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('activity-category').value;
    const description = Sanitize.string(document.getElementById('activity-description').value, { maxLength: 100 });
    const co2 = Sanitize.number(document.getElementById('activity-co2').value, { min: 0, max: 10000 });
    const date = Sanitize.date(document.getElementById('activity-date').value);

    if (!description || co2 <= 0) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    addActivity({
      category,
      type: 'custom',
      label: description,
      amount: 1,
      unit: 'custom',
      co2,
      date,
      description
    });

    e.target.reset();
    document.getElementById('activity-date').value = today();
    showToast(`Custom activity logged (+${co2.toFixed(2)} kg CO₂)`, 'success');
    announce(`Custom activity logged: ${description}, ${co2.toFixed(2)} kilograms CO2`);
    renderHistory();
  });

  // Filter change
  document.getElementById('filter-category').addEventListener('change', () => {
    renderHistory();
  });
}

function renderHistory() {
  const historyContainer = document.getElementById('activity-history-container');
  if (!historyContainer) return;

  const filterEl = document.getElementById('filter-category');
  const category = filterEl?.value || '';

  const activities = getActivities({ category: category || undefined });
  const display = activities.slice(0, 50);

  if (display.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h4>No activities found</h4>
        <p style="font-size: var(--text-sm);">Use the quick-add buttons or custom form to log activities</p>
      </div>
    `;
    return;
  }

  const icons = { transport: '🚗', diet: '🍽️', energy: '⚡', shopping: '🛍️' };
  const bgColors = {
    transport: 'hsla(210, 90%, 62%, 0.12)',
    diet: 'hsla(28, 88%, 58%, 0.12)',
    energy: 'hsla(48, 96%, 56%, 0.12)',
    shopping: 'hsla(280, 68%, 62%, 0.12)'
  };

  historyContainer.innerHTML = `
    <div class="activity-feed" id="activity-feed">
      ${display.map(a => `
        <div class="activity-item" data-id="${Sanitize.escapeHTML(a.id)}">
          <div class="activity-icon" style="background: ${bgColors[a.category] || bgColors.transport};" aria-hidden="true">
            ${icons[a.category] || '📝'}
          </div>
          <div class="activity-info">
            <div class="activity-title">${Sanitize.escapeHTML(a.label)}</div>
            <div class="activity-meta">${a.date} · ${formatRelativeTime(a.createdAt)}</div>
          </div>
          <div class="activity-co2" style="margin-right: var(--space-sm);">+${a.co2.toFixed(2)} kg</div>
          <div class="activity-actions">
            <button class="btn-icon delete-activity-btn" data-id="${Sanitize.escapeHTML(a.id)}" aria-label="Delete activity: ${Sanitize.escapeHTML(a.label)}" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      `).join('')}
    </div>
    ${activities.length > 50 ? `<p style="text-align: center; font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: var(--space-md);">Showing 50 of ${activities.length} activities</p>` : ''}
  `;

  // Delete delegation
  delegate(document.getElementById('activity-feed'), 'click', '.delete-activity-btn', (e, btn) => {
    const id = btn.dataset.id;
    if (id) {
      deleteActivity(id);
      showToast('Activity deleted', 'info');
      renderHistory();
    }
  });
}

function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
