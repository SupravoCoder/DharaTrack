/* ============================================
   GOALS — Goals & Challenges Component
   ============================================ */

import { getState, setMonthlyTarget, joinChallenge, leaveChallenge, completeChallengeDay, getTotalCO2 } from '../store.js';
import { CHALLENGES, getChallengeById, getChallengeProgress } from '../engine/challenges.js';
import { Sanitize } from '../utils/sanitize.js';
import { monthStart, today, formatCO2 } from '../utils/format.js';
import { delegate } from '../utils/dom.js';
import { announce } from '../utils/accessibility.js';

/**
 * Render the goals & challenges view.
 * @param {Element} container
 */
export function renderGoals(container) {
  const state = getState();
  const { goals, breakdown } = state;

  // Monthly progress
  const monthlyCO2 = getTotalCO2(monthStart(), today());
  const monthlyTarget = goals.monthlyTarget;
  const monthProgress = monthlyTarget ? Math.min(100, Math.round((monthlyCO2 / monthlyTarget) * 100)) : 0;
  const suggestedTarget = Math.round((breakdown.total / 12) * 0.9); // 10% reduction from annual

  container.innerHTML = `
    <div class="page-header">
      <h1>Goals & Challenges</h1>
      <p class="page-subtitle">Set targets and join challenges to reduce your footprint</p>
    </div>

    <!-- Monthly Target -->
    <div class="card animate-fade-in-up" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <h3>🎯 Monthly Target</h3>
        ${monthlyTarget ? `<span class="badge ${monthProgress > 90 ? 'badge-danger' : monthProgress > 70 ? 'badge-warning' : 'badge-accent'}">${monthProgress}% used</span>` : ''}
      </div>
      <div class="card-body">
        ${monthlyTarget ? `
          <div style="margin-bottom: var(--space-md);">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
              <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">This month: ${monthlyCO2.toFixed(1)} kg</span>
              <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold);">Target: ${monthlyTarget} kg</span>
            </div>
            <div class="progress-bar progress-bar-lg">
              <div class="progress-bar-fill ${monthProgress <= 100 ? 'animated' : ''}" style="width: ${Math.min(100, monthProgress)}%; ${monthProgress > 90 ? 'background: linear-gradient(90deg, var(--color-warning), var(--color-danger));' : ''}"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: var(--space-xs);">
              <span style="font-size: var(--text-xs); color: var(--color-text-tertiary);">0 kg</span>
              <span style="font-size: var(--text-xs); color: ${monthProgress > 100 ? 'var(--color-danger)' : 'var(--color-accent)'};">
                ${monthProgress > 100 ? `Over by ${(monthlyCO2 - monthlyTarget).toFixed(1)} kg` : `${(monthlyTarget - monthlyCO2).toFixed(1)} kg remaining`}
              </span>
              <span style="font-size: var(--text-xs); color: var(--color-text-tertiary);">${monthlyTarget} kg</span>
            </div>
          </div>
          <button class="btn btn-sm btn-secondary" id="change-target-btn">Change Target</button>
        ` : `
          <div style="text-align: center; padding: var(--space-lg);">
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">Set a monthly CO₂ target to track your progress</p>
            <div class="form-group" style="max-width: 300px; margin: 0 auto var(--space-md);">
              <label for="target-input">Monthly target (kg CO₂)</label>
              <input type="number" id="target-input" placeholder="${suggestedTarget}" min="10" max="10000" value="${suggestedTarget}" aria-label="Monthly CO₂ target in kilograms">
              <span class="form-hint">Suggested: ${suggestedTarget} kg/month (10% below your current rate)</span>
            </div>
            <button class="btn btn-primary" id="set-target-btn">Set Target</button>
          </div>
        `}
      </div>
    </div>

    <!-- Active Challenges -->
    ${goals.activeChallenges.length > 0 ? `
      <h2 style="font-size: var(--text-xl); margin-bottom: var(--space-md);">🏆 Active Challenges</h2>
      <div class="grid-2 stagger-children" style="margin-bottom: var(--space-xl);">
        ${goals.activeChallenges.map(ac => renderActiveChallenge(ac)).join('')}
      </div>
    ` : ''}

    <!-- Available Challenges -->
    <h2 style="font-size: var(--text-xl); margin-bottom: var(--space-md);">🚀 Available Challenges</h2>
    <div class="grid-2 stagger-children" style="margin-bottom: var(--space-xl);" id="challenges-grid">
      ${CHALLENGES.map(ch => {
        const isJoined = goals.activeChallenges.some(ac => ac.challengeId === ch.id);
        return renderChallengeCard(ch, isJoined);
      }).join('')}
    </div>
  `;

  // Event listeners
  setupGoalEvents();
}

function renderChallengeCard(challenge, isJoined) {
  const diffColors = { easy: 'badge-accent', moderate: 'badge-warning', challenging: 'badge-danger' };
  
  return `
    <div class="card animate-fade-in-up" data-challenge-id="${challenge.id}">
      <div class="card-header">
        <h3 style="display: flex; align-items: center; gap: var(--space-xs);">
          <span aria-hidden="true">${challenge.icon}</span>
          ${Sanitize.escapeHTML(challenge.title)}
        </h3>
        <span class="badge ${diffColors[challenge.difficulty]}">${challenge.difficulty}</span>
      </div>
      <div class="card-body">
        <p style="font-size: var(--text-sm); margin-bottom: var(--space-md);">${Sanitize.escapeHTML(challenge.description)}</p>
        <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md); font-size: var(--text-xs); color: var(--color-text-secondary);">
          <span>📅 ${challenge.totalDays} days</span>
          <span>🌱 ~${challenge.estimatedSavings} kg CO₂</span>
          <span>📁 ${challenge.category}</span>
        </div>
        <button class="btn ${isJoined ? 'btn-secondary' : 'btn-primary'} btn-sm join-challenge-btn" data-id="${challenge.id}" ${isJoined ? 'disabled' : ''}>
          ${isJoined ? '✅ Joined' : 'Join Challenge'}
        </button>
      </div>
    </div>
  `;
}

function renderActiveChallenge(activeChallenge) {
  const challenge = getChallengeById(activeChallenge.challengeId);
  if (!challenge) return '';

  const progress = getChallengeProgress(activeChallenge.challengeId, activeChallenge.completedDays);
  const currentDay = Math.min(challenge.totalDays, activeChallenge.completedDays.length + 1);
  const todayTask = challenge.tasks.find(t => t.day === currentDay);

  return `
    <div class="card animate-fade-in-up" style="border-left: 3px solid var(--color-accent);">
      <div class="card-header">
        <h3 style="display: flex; align-items: center; gap: var(--space-xs);">
          <span aria-hidden="true">${challenge.icon}</span>
          ${Sanitize.escapeHTML(challenge.title)}
        </h3>
        <button class="btn btn-sm btn-danger leave-challenge-btn" data-id="${activeChallenge.challengeId}" aria-label="Leave challenge">Leave</button>
      </div>
      <div class="card-body">
        <div style="margin-bottom: var(--space-md);">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
            <span style="font-size: var(--text-sm);">Progress</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-accent);">${progress.percentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill animated" style="width: ${progress.percentage}%;"></div>
          </div>
          <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: var(--space-2xs);">
            ${progress.completedCount}/${progress.totalDays} days · ${progress.savedKg} kg CO₂ saved
          </div>
        </div>

        ${todayTask ? `
          <div style="padding: var(--space-md); background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
            <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: var(--space-2xs);">Day ${currentDay} Task</div>
            <p style="font-size: var(--text-sm); color: var(--color-text-primary); margin-bottom: var(--space-sm);">${Sanitize.escapeHTML(todayTask.task)}</p>
            <button class="btn btn-primary btn-sm complete-day-btn" data-challenge="${activeChallenge.challengeId}" data-day="${currentDay}"
                    ${activeChallenge.completedDays.includes(currentDay) ? 'disabled' : ''}>
              ${activeChallenge.completedDays.includes(currentDay) ? '✅ Completed' : 'Mark Complete'}
            </button>
          </div>
        ` : `
          <div style="text-align: center; padding: var(--space-md); color: var(--color-accent);">
            🎉 Challenge complete! Well done!
          </div>
        `}
      </div>
    </div>
  `;
}

function setupGoalEvents() {
  // Set target
  document.getElementById('set-target-btn')?.addEventListener('click', () => {
    const input = document.getElementById('target-input');
    const value = Sanitize.number(input?.value, { min: 10, max: 10000 });
    if (value > 0) {
      setMonthlyTarget(value);
      announce(`Monthly target set to ${value} kilograms CO2`);
      // Re-render
      const container = document.querySelector('.view-container');
      if (container) renderGoals(container);
    }
  });

  // Change target
  document.getElementById('change-target-btn')?.addEventListener('click', () => {
    setMonthlyTarget(null);
    const container = document.querySelector('.view-container');
    if (container) renderGoals(container);
  });

  // Join challenge
  delegate(document.body, 'click', '.join-challenge-btn', (e, btn) => {
    const id = btn.dataset.id;
    if (id) {
      joinChallenge(id);
      announce(`Joined challenge`);
      const container = document.querySelector('.view-container');
      if (container) renderGoals(container);
    }
  });

  // Leave challenge
  delegate(document.body, 'click', '.leave-challenge-btn', (e, btn) => {
    const id = btn.dataset.id;
    if (id) {
      leaveChallenge(id);
      announce(`Left challenge`);
      const container = document.querySelector('.view-container');
      if (container) renderGoals(container);
    }
  });

  // Complete day
  delegate(document.body, 'click', '.complete-day-btn', (e, btn) => {
    const challengeId = btn.dataset.challenge;
    const day = parseInt(btn.dataset.day);
    if (challengeId && day) {
      completeChallengeDay(challengeId, day);
      announce(`Day ${day} completed`);
      const container = document.querySelector('.view-container');
      if (container) renderGoals(container);
    }
  });
}
