/* ============================================
   DASHBOARD — Dashboard View Component
   ============================================ */

import { getState, getActivities, getDailyTotals, getTotalCO2 } from '../store.js';
import { getFootprintRating, BASELINES } from '../engine/calculator.js';
import { getRandomTip } from '../engine/tips.js';
import { formatCO2, formatNumber, today, daysAgo, weekStart, monthStart, formatRelativeTime } from '../utils/format.js';
import { Sanitize } from '../utils/sanitize.js';
import { navigateTo } from '../router.js';

/**
 * Render the dashboard view.
 * @param {Element} container
 */
export function renderDashboard(container) {
  const state = getState();
  const { breakdown, streak } = state;
  const rating = getFootprintRating(breakdown.total);
  const totalTonnes = (breakdown.total / 1000).toFixed(1);

  // Monthly stats
  const monthlyActivities = getActivities({ startDate: monthStart() });
  const monthlyCO2 = monthlyActivities.reduce((sum, a) => sum + (a.co2 || 0), 0);

  // Weekly stats
  const weeklyCO2 = getTotalCO2(weekStart(), today());

  // Today stats
  const todayCO2 = getTotalCO2(today(), today());

  // Recent activities (last 5)
  const recentActivities = getActivities({}).slice(0, 5);

  // Daily data for chart (last 14 days)
  const dailyData = getDailyTotals(daysAgo(13), today());

  // Random tip
  const tip = getRandomTip();

  container.innerHTML = `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p class="page-subtitle">Your carbon footprint at a glance</p>
    </div>

    <!-- Stat Cards Row -->
    <div class="grid-4 stagger-children" style="margin-bottom: var(--space-xl);">
      <div class="stat-card animate-fade-in-up">
        <div class="stat-icon" style="background: hsla(152, 68%, 52%, 0.12); color: var(--color-accent);" aria-hidden="true">🌍</div>
        <div class="stat-label">Annual Footprint</div>
        <div class="stat-value">${totalTonnes}<span style="font-size: var(--text-lg); color: var(--color-text-secondary);"> t</span></div>
        <div class="stat-change ${rating.rating === 'excellent' || rating.rating === 'great' || rating.rating === 'good' ? 'positive' : 'negative'}">${rating.label}</div>
      </div>

      <div class="stat-card animate-fade-in-up">
        <div class="stat-icon" style="background: hsla(210, 90%, 62%, 0.12); color: var(--color-info);" aria-hidden="true">📅</div>
        <div class="stat-label">This Month</div>
        <div class="stat-value">${formatCO2(monthlyCO2, { showUnit: false })}<span style="font-size: var(--text-lg); color: var(--color-text-secondary);"> ${monthlyCO2 >= 1000 ? 't' : 'kg'}</span></div>
        <div class="stat-change">${monthlyActivities.length} activities logged</div>
      </div>

      <div class="stat-card animate-fade-in-up">
        <div class="stat-icon" style="background: hsla(48, 96%, 56%, 0.12); color: var(--color-energy);" aria-hidden="true">📊</div>
        <div class="stat-label">This Week</div>
        <div class="stat-value">${weeklyCO2.toFixed(1)}<span style="font-size: var(--text-lg); color: var(--color-text-secondary);"> kg</span></div>
        <div class="stat-change">Today: ${todayCO2.toFixed(1)} kg</div>
      </div>

      <div class="stat-card animate-fade-in-up">
        <div class="stat-icon" style="background: hsla(28, 88%, 58%, 0.12); color: var(--color-diet);" aria-hidden="true">🔥</div>
        <div class="stat-label">Logging Streak</div>
        <div class="stat-value">${streak.current}<span style="font-size: var(--text-lg); color: var(--color-text-secondary);"> days</span></div>
        <div class="stat-change positive">Best: ${streak.longest} days</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom: var(--space-xl);">
      <!-- Category Breakdown -->
      <div class="card animate-fade-in-up">
        <div class="card-header">
          <h3>Category Breakdown</h3>
          <span class="badge badge-accent">${totalTonnes}t total</span>
        </div>
        <div class="card-body">
          <div class="chart-wrapper">
            <canvas id="category-chart" aria-label="Category breakdown chart" role="img"></canvas>
          </div>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="card animate-fade-in-up">
        <div class="card-header">
          <h3>14-Day Trend</h3>
          <span class="badge badge-info">${weeklyCO2.toFixed(1)} kg this week</span>
        </div>
        <div class="card-body">
          <div class="chart-wrapper">
            <canvas id="trend-chart" aria-label="14-day emissions trend chart" role="img"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom: var(--space-xl);">
      <!-- Comparisons -->
      <div class="card animate-fade-in-up">
        <div class="card-header">
          <h3>How You Compare</h3>
        </div>
        <div class="card-body">
          <div class="comparison-grid" style="grid-template-columns: 1fr;">
            ${buildComparisonRow('🌍', 'Global Avg', BASELINES.global_avg, breakdown.total)}
            ${buildComparisonRow('🇺🇸', 'US Average', BASELINES.us_avg, breakdown.total)}
            ${buildComparisonRow('🇪🇺', 'EU Average', BASELINES.eu_avg, breakdown.total)}
            ${buildComparisonRow('🎯', 'Paris Target', BASELINES.paris_target, breakdown.total)}
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card animate-fade-in-up">
        <div class="card-header">
          <h3>Recent Activity</h3>
          <button class="btn btn-sm btn-secondary" id="view-all-activities-btn">View All</button>
        </div>
        <div class="card-body">
          ${recentActivities.length > 0 ? `
            <div class="activity-feed">
              ${recentActivities.map(a => renderActivityItem(a)).join('')}
            </div>
          ` : `
            <div class="empty-state" style="padding: var(--space-xl);">
              <div class="empty-icon">📝</div>
              <h4>No activities yet</h4>
              <p style="font-size: var(--text-sm);">Start logging to track your daily emissions</p>
              <button class="btn btn-primary btn-sm" id="log-first-activity-btn" style="margin-top: var(--space-md);">Log First Activity</button>
            </div>
          `}
        </div>
      </div>
    </div>

    <!-- Tip of the Day -->
    <div class="card animate-fade-in-up" style="border-left: 3px solid var(--color-accent); margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>💡 Tip of the Day</h3>
        <span class="badge badge-accent">${tip.category}</span>
      </div>
      <div class="card-body">
        <p style="font-size: var(--text-base); color: var(--color-text-primary); line-height: var(--leading-relaxed);">${Sanitize.escapeHTML(tip.text)}</p>
        ${tip.savingsKg > 0 ? `<p style="font-size: var(--text-sm); color: var(--color-accent); margin-top: var(--space-xs);">Potential savings: ~${tip.savingsKg} kg CO₂/year</p>` : ''}
      </div>
    </div>
  `;

  // Initialize charts
  initCharts(breakdown, dailyData);

  // Event listeners
  document.getElementById('view-all-activities-btn')?.addEventListener('click', () => navigateTo('/log'));
  document.getElementById('log-first-activity-btn')?.addEventListener('click', () => navigateTo('/log'));
}

function buildComparisonRow(icon, label, baseline, userTotal) {
  const baselineTonnes = (baseline / 1000).toFixed(1);
  const diff = userTotal - baseline;
  const isBelow = diff <= 0;
  const diffText = `${isBelow ? '▼' : '▲'} ${Math.abs(diff / 1000).toFixed(1)}t`;
  const pct = Math.min(100, Math.round((userTotal / baseline) * 100));

  return `
    <div style="display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-border);">
      <span aria-hidden="true">${icon}</span>
      <span style="flex: 1; font-size: var(--text-sm);">${label}</span>
      <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold);">${baselineTonnes}t</span>
      <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: ${isBelow ? 'var(--color-success)' : 'var(--color-danger)'};">${diffText}</span>
    </div>
  `;
}

function renderActivityItem(activity) {
  const icons = { transport: '🚗', diet: '🍽️', energy: '⚡', shopping: '🛍️' };
  const bgColors = {
    transport: 'hsla(210, 90%, 62%, 0.12)',
    diet: 'hsla(28, 88%, 58%, 0.12)',
    energy: 'hsla(48, 96%, 56%, 0.12)',
    shopping: 'hsla(280, 68%, 62%, 0.12)'
  };

  return `
    <div class="activity-item">
      <div class="activity-icon" style="background: ${bgColors[activity.category] || bgColors.transport};" aria-hidden="true">
        ${icons[activity.category] || '📝'}
      </div>
      <div class="activity-info">
        <div class="activity-title">${Sanitize.escapeHTML(activity.label)}</div>
        <div class="activity-meta">${formatRelativeTime(activity.createdAt)} · ${activity.date}</div>
      </div>
      <div class="activity-co2">+${activity.co2.toFixed(2)} kg</div>
    </div>
  `;
}

function initCharts(breakdown, dailyData) {
  // Load Chart.js from CDN if not already loaded
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.js';
    script.onload = () => createCharts(breakdown, dailyData);
    document.head.appendChild(script);
  } else {
    createCharts(breakdown, dailyData);
  }
}

function createCharts(breakdown, dailyData) {
  // Category Doughnut Chart
  const catCtx = document.getElementById('category-chart');
  if (catCtx) {
    new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: ['Transport', 'Diet', 'Energy', 'Shopping'],
        datasets: [{
          data: [breakdown.transport, breakdown.diet, breakdown.energy, breakdown.shopping],
          backgroundColor: [
            'hsl(210, 90%, 62%)',
            'hsl(28, 88%, 58%)',
            'hsl(48, 96%, 56%)',
            'hsl(280, 68%, 62%)'
          ],
          borderColor: 'transparent',
          borderWidth: 0,
          spacing: 4,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'hsl(220, 10%, 65%)',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: { family: 'Inter', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'hsl(220, 18%, 14%)',
            titleColor: 'hsl(0, 0%, 95%)',
            bodyColor: 'hsl(220, 10%, 65%)',
            borderColor: 'hsla(0, 0%, 100%, 0.08)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${(ctx.parsed / 1000).toFixed(1)} tonnes`
            }
          }
        }
      }
    });
  }

  // Trend Line Chart
  const trendCtx = document.getElementById('trend-chart');
  if (trendCtx) {
    const labels = dailyData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Daily CO₂ (kg)',
          data: dailyData.map(d => Math.round(d.total * 100) / 100),
          borderColor: 'hsl(152, 68%, 52%)',
          backgroundColor: 'hsla(152, 68%, 52%, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: 'hsl(152, 68%, 52%)',
          pointBorderColor: 'transparent',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            grid: { color: 'hsla(0, 0%, 100%, 0.04)' },
            ticks: { color: 'hsl(220, 10%, 45%)', font: { family: 'Inter', size: 11 }, maxTicksLimit: 7 }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'hsla(0, 0%, 100%, 0.04)' },
            ticks: { color: 'hsl(220, 10%, 45%)', font: { family: 'Inter', size: 11 }, callback: (v) => `${v} kg` }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'hsl(220, 18%, 14%)',
            titleColor: 'hsl(0, 0%, 95%)',
            bodyColor: 'hsl(220, 10%, 65%)',
            borderColor: 'hsla(0, 0%, 100%, 0.08)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y.toFixed(2)} kg CO₂`
            }
          }
        }
      }
    });
  }
}
