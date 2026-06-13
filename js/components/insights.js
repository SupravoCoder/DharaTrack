/* ============================================
   INSIGHTS — Insights & Reports Component
   ============================================ */

import { getState, getActivities, getDailyTotals, getTotalCO2 } from '../store.js';
import { BASELINES, getFootprintRating, TRANSPORT_FACTORS, DIET_FACTORS } from '../engine/calculator.js';
import { getRelevantTips } from '../engine/tips.js';
import { Sanitize } from '../utils/sanitize.js';
import { formatCO2, today, daysAgo, weekStart, monthStart, formatDate } from '../utils/format.js';
import { announce } from '../utils/accessibility.js';

/**
 * Render the insights view.
 * @param {Element} container
 */
export function renderInsights(container) {
  const state = getState();
  const { breakdown } = state;

  // Weekly summary
  const weekActivities = getActivities({ startDate: weekStart() });
  const weekCO2 = weekActivities.reduce((sum, a) => sum + (a.co2 || 0), 0);
  const weekByCategory = { transport: 0, diet: 0, energy: 0, shopping: 0 };
  weekActivities.forEach(a => {
    if (weekByCategory[a.category] !== undefined) weekByCategory[a.category] += a.co2 || 0;
  });

  // Find highest and lowest categories this week
  const sortedCats = Object.entries(weekByCategory).sort(([,a], [,b]) => b - a);
  const highCat = sortedCats[0];
  const lowCat = sortedCats[sortedCats.length - 1];

  // Get relevant tips
  const tips = getRelevantTips(breakdown);

  // What-if scenarios
  const scenarios = buildScenarios(state);

  container.innerHTML = `
    <div class="page-header">
      <h1>Insights</h1>
      <p class="page-subtitle">Understand your impact and discover ways to improve</p>
    </div>

    <!-- Weekly Summary -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>📊 Weekly Summary</h3>
        <span class="badge badge-info">Week of ${formatDate(weekStart(), 'short')}</span>
      </div>
      <div class="card-body">
        ${weekActivities.length > 0 ? `
          <div class="grid-3" style="margin-bottom: var(--space-lg);">
            <div style="text-align: center;">
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: var(--space-2xs);">Total This Week</div>
              <div style="font-family: var(--font-display); font-size: var(--text-3xl); font-weight: var(--weight-bold); color: var(--color-text-primary);">${weekCO2.toFixed(1)}</div>
              <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">kg CO₂</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: var(--space-2xs);">Highest Category</div>
              <div style="font-family: var(--font-display); font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-warning);">${getCategoryIcon(highCat[0])} ${highCat[0]}</div>
              <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">${highCat[1].toFixed(1)} kg</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: var(--space-2xs);">Activities Logged</div>
              <div style="font-family: var(--font-display); font-size: var(--text-3xl); font-weight: var(--weight-bold); color: var(--color-accent);">${weekActivities.length}</div>
              <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">this week</div>
            </div>
          </div>

          <!-- Category Bars -->
          <div style="margin-bottom: var(--space-md);">
            ${sortedCats.map(([cat, val]) => {
              const pct = weekCO2 > 0 ? Math.round((val / weekCO2) * 100) : 0;
              return `
                <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
                  <span style="width: 80px; font-size: var(--text-sm);">${getCategoryIcon(cat)} ${cat}</span>
                  <div class="progress-bar" style="flex: 1;">
                    <div class="progress-bar-fill" style="width: ${pct}%; background: var(--color-${cat});"></div>
                  </div>
                  <span style="width: 70px; text-align: right; font-size: var(--text-sm); font-weight: var(--weight-medium);">${val.toFixed(1)} kg</span>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="empty-state" style="padding: var(--space-xl);">
            <div class="empty-icon">📊</div>
            <h4>No activity data this week</h4>
            <p style="font-size: var(--text-sm);">Log some activities to see your weekly summary</p>
          </div>
        `}
      </div>
    </div>

    <!-- What-If Simulator -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>🤔 What If Simulator</h3>
        <span class="text-muted" style="font-size: var(--text-xs);">Toggle changes to see projected impact</span>
      </div>
      <div class="card-body">
        <div class="whatif-container" id="whatif-container">
          ${scenarios.map(s => `
            <div class="whatif-toggle" data-scenario="${Sanitize.escapeHTML(s.id)}">
              <div class="toggle-info">
                <div class="toggle-label">${Sanitize.escapeHTML(s.label)}</div>
                <div class="toggle-savings">Saves ~${s.savingsKg} kg CO₂/year</div>
              </div>
              <div class="toggle-switch ${s.active ? 'active' : ''}" data-scenario="${Sanitize.escapeHTML(s.id)}" role="switch" aria-checked="${s.active}" aria-label="${Sanitize.escapeHTML(s.label)}" tabindex="0"></div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); text-align: center;" id="whatif-summary">
          <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: var(--space-xs);">Projected Annual Footprint</div>
          <div style="font-family: var(--font-display); font-size: var(--text-3xl); font-weight: var(--weight-bold); color: var(--color-accent);" id="whatif-total">
            ${(breakdown.total / 1000).toFixed(1)} tonnes
          </div>
          <div style="font-size: var(--text-sm); color: var(--color-text-secondary);" id="whatif-savings">
            Current footprint
          </div>
        </div>
      </div>
    </div>

    <!-- Personalized Tips -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>💡 Personalized Tips</h3>
        <span class="badge badge-accent">Based on your profile</span>
      </div>
      <div class="card-body">
        ${tips.map((t, i) => `
          <div style="display: flex; gap: var(--space-md); padding: var(--space-md) 0; ${i < tips.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
            <div style="width: 32px; height: 32px; background: var(--color-accent-subtle); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: var(--text-sm); flex-shrink: 0;" aria-hidden="true">💡</div>
            <div style="flex: 1;">
              <p style="font-size: var(--text-sm); color: var(--color-text-primary); margin-bottom: var(--space-2xs);">${Sanitize.escapeHTML(t.text)}</p>
              <div style="display: flex; gap: var(--space-sm); font-size: var(--text-xs);">
                <span class="badge badge-accent">${t.category}</span>
                ${t.savingsKg > 0 ? `<span style="color: var(--color-accent);">~${t.savingsKg} kg/year</span>` : ''}
                <span style="color: var(--color-text-tertiary);">${t.difficulty}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Export -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>📥 Export Data</h3>
      </div>
      <div class="card-body" style="display: flex; gap: var(--space-sm);">
        <button class="btn btn-secondary" id="export-json-btn">Download JSON</button>
        <button class="btn btn-secondary" id="export-csv-btn">Download CSV</button>
      </div>
    </div>
  `;

  // What-if toggle events
  setupWhatIfEvents(scenarios, breakdown);

  // Export events
  document.getElementById('export-json-btn')?.addEventListener('click', exportJSON);
  document.getElementById('export-csv-btn')?.addEventListener('click', exportCSV);
}

function getCategoryIcon(cat) {
  const icons = { transport: '🚗', diet: '🍽️', energy: '⚡', shopping: '🛍️' };
  return icons[cat] || '📝';
}

function buildScenarios(state) {
  const { profile, breakdown } = state;
  const scenarios = [];

  // Transport scenarios
  if (profile.commuteMode?.startsWith('car')) {
    scenarios.push({
      id: 'switch-to-bike',
      label: 'Cycle to work instead of driving',
      savingsKg: Math.round(breakdown.transport * 0.6),
      active: false
    });
    scenarios.push({
      id: 'switch-to-transit',
      label: 'Take public transit for commute',
      savingsKg: Math.round(breakdown.transport * 0.4),
      active: false
    });
  }

  // Diet scenarios
  if (profile.dietType === 'heavy_meat' || profile.dietType === 'medium_meat') {
    scenarios.push({
      id: 'go-vegetarian',
      label: 'Switch to a vegetarian diet',
      savingsKg: Math.round(breakdown.diet * 0.3),
      active: false
    });
    scenarios.push({
      id: 'meatless-mondays',
      label: 'Go meatless one day per week',
      savingsKg: Math.round(breakdown.diet * 0.1),
      active: false
    });
  }

  // Energy scenarios
  scenarios.push({
    id: 'switch-renewable',
    label: 'Switch to 100% renewable electricity',
    savingsKg: Math.round(breakdown.energy * 0.5),
    active: false
  });
  scenarios.push({
    id: 'reduce-heating',
    label: 'Reduce heating by 2°C',
    savingsKg: Math.round(breakdown.energy * 0.1),
    active: false
  });

  // Shopping scenarios
  scenarios.push({
    id: 'buy-less',
    label: 'Reduce shopping by 30%',
    savingsKg: Math.round(breakdown.shopping * 0.3),
    active: false
  });

  return scenarios;
}

function setupWhatIfEvents(scenarios, breakdown) {
  const toggles = document.querySelectorAll('.toggle-switch');
  const totalEl = document.getElementById('whatif-total');
  const savingsEl = document.getElementById('whatif-savings');

  toggles.forEach(toggle => {
    const handler = () => {
      toggle.classList.toggle('active');
      const isActive = toggle.classList.contains('active');
      toggle.setAttribute('aria-checked', String(isActive));

      const scenarioId = toggle.dataset.scenario;
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (scenario) scenario.active = isActive;

      // Calculate new total
      const totalSavings = scenarios.filter(s => s.active).reduce((sum, s) => sum + s.savingsKg, 0);
      const newTotal = Math.max(0, breakdown.total - totalSavings);
      
      if (totalEl) totalEl.textContent = `${(newTotal / 1000).toFixed(1)} tonnes`;
      if (savingsEl) {
        if (totalSavings > 0) {
          savingsEl.textContent = `Saving ${(totalSavings / 1000).toFixed(1)} tonnes/year with selected changes`;
          savingsEl.style.color = 'var(--color-accent)';
        } else {
          savingsEl.textContent = 'Current footprint';
          savingsEl.style.color = '';
        }
      }

      announce(`Projected footprint: ${(newTotal / 1000).toFixed(1)} tonnes. Savings: ${(totalSavings / 1000).toFixed(1)} tonnes per year.`);
    };

    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

function exportJSON() {
  const state = getState();
  const data = {
    exportDate: new Date().toISOString(),
    profile: state.profile,
    breakdown: state.breakdown,
    activities: state.activities,
    goals: state.goals,
    streak: state.streak
  };

  downloadFile(JSON.stringify(data, null, 2), 'dharatrack-data.json', 'application/json');
  announce('Data exported as JSON');
}

function exportCSV() {
  const activities = getActivities({});
  if (activities.length === 0) {
    announce('No activities to export');
    return;
  }

  const headers = ['Date', 'Category', 'Label', 'CO2 (kg)', 'Description'];
  const rows = activities.map(a => [
    a.date,
    a.category,
    `"${(a.label || '').replace(/"/g, '""')}"`,
    a.co2.toFixed(3),
    `"${(a.description || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csv, 'dharatrack-activities.csv', 'text/csv');
  announce('Activities exported as CSV');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
