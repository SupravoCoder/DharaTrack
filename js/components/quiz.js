/* ============================================
   QUIZ — Onboarding Lifestyle Quiz Component
   ============================================ */

import { setState, getState } from '../store.js';
import { calculateTotalFromQuiz, getFootprintRating, BASELINES } from '../engine/calculator.js';
import { Sanitize } from '../utils/sanitize.js';
import { navigateTo } from '../router.js';
import { announce } from '../utils/accessibility.js';
import { formatCO2, formatNumber } from '../utils/format.js';

/* ---- Quiz Questions ---- */

const QUESTIONS = [
  {
    id: 'commuteMode',
    question: 'How do you usually commute?',
    icon: '🚗',
    type: 'select',
    options: [
      { value: 'car_petrol', label: 'Petrol Car' },
      { value: 'car_diesel', label: 'Diesel Car' },
      { value: 'car_hybrid', label: 'Hybrid Car' },
      { value: 'car_electric', label: 'Electric Car' },
      { value: 'bus', label: 'Bus' },
      { value: 'train', label: 'Train / Metro' },
      { value: 'bicycle', label: 'Bicycle' },
      { value: 'walking', label: 'Walking' },
      { value: 'motorcycle', label: 'Motorcycle' }
    ],
    default: 'car_petrol'
  },
  {
    id: 'commuteDistance',
    question: 'How far is your daily commute (one way)?',
    icon: '📏',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    unit: 'km',
    default: 15
  },
  {
    id: 'commuteDays',
    question: 'How many days per week do you commute?',
    icon: '📅',
    type: 'select',
    options: [
      { value: '0', label: '0 — Fully remote' },
      { value: '1', label: '1 day' },
      { value: '2', label: '2 days' },
      { value: '3', label: '3 days' },
      { value: '4', label: '4 days' },
      { value: '5', label: '5 days' },
      { value: '6', label: '6 days' },
      { value: '7', label: '7 days' }
    ],
    default: '5'
  },
  {
    id: 'flights',
    question: 'How many return flights do you take per year?',
    icon: '✈️',
    type: 'range',
    min: 0,
    max: 20,
    step: 1,
    unit: 'flights',
    default: 2
  },
  {
    id: 'dietType',
    question: 'How would you describe your diet?',
    icon: '🍽️',
    type: 'select',
    options: [
      { value: 'heavy_meat', label: 'Heavy Meat Eater (daily beef/lamb)' },
      { value: 'medium_meat', label: 'Medium Meat Eater (a few times/week)' },
      { value: 'low_meat', label: 'Low Meat Eater (once or twice/week)' },
      { value: 'pescatarian', label: 'Pescatarian (fish, no meat)' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' }
    ],
    default: 'medium_meat'
  },
  {
    id: 'homeSize',
    question: 'What size is your home?',
    icon: '🏠',
    type: 'select',
    options: [
      { value: 'studio', label: 'Studio / Small Apartment' },
      { value: 'small', label: 'Small (1-2 bedrooms)' },
      { value: 'medium', label: 'Medium (2-3 bedrooms)' },
      { value: 'large', label: 'Large (4+ bedrooms)' },
      { value: 'very_large', label: 'Very Large / Detached House' }
    ],
    default: 'medium'
  },
  {
    id: 'heatingType',
    question: 'What is your primary heating source?',
    icon: '🔥',
    type: 'select',
    options: [
      { value: 'gas', label: 'Natural Gas' },
      { value: 'oil', label: 'Oil / Kerosene' },
      { value: 'electric', label: 'Electric Heater' },
      { value: 'heat_pump', label: 'Heat Pump' },
      { value: 'none', label: 'None / Warm Climate' }
    ],
    default: 'gas'
  },
  {
    id: 'renewablePercent',
    question: 'What percentage of your electricity comes from renewables?',
    icon: '☀️',
    type: 'range',
    min: 0,
    max: 100,
    step: 10,
    unit: '%',
    default: 0
  },
  {
    id: 'shoppingHabit',
    question: 'How would you describe your shopping habits?',
    icon: '🛍️',
    type: 'select',
    options: [
      { value: 'minimal', label: 'Minimal — I buy only essentials' },
      { value: 'moderate', label: 'Moderate — Occasional new items' },
      { value: 'frequent', label: 'Frequent — I enjoy shopping regularly' },
      { value: 'heavy', label: 'Heavy — I shop a lot (fast fashion, gadgets)' }
    ],
    default: 'moderate'
  },
  {
    id: 'onlineOrders',
    question: 'How many online deliveries do you receive per month?',
    icon: '📦',
    type: 'range',
    min: 0,
    max: 30,
    step: 1,
    unit: 'orders/month',
    default: 4
  }
];

/* ---- Quiz Renderer ---- */

let currentStep = 0;
let answers = {};

/**
 * Render the quiz view.
 * @param {Element} container
 */
export function renderQuiz(container) {
  currentStep = 0;
  answers = {};

  // Pre-fill defaults
  QUESTIONS.forEach(q => {
    answers[q.id] = q.default;
  });

  container.innerHTML = `
    <div class="onboarding-layout">
      <div class="onboarding-card card" id="quiz-card">
        <div class="quiz-header" style="text-align: center; margin-bottom: var(--space-xl);">
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">🌍</div>
          <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-xs);">Welcome to Dharatrack</h1>
          <p style="color: var(--color-text-secondary);">Let's estimate your carbon footprint in 2 minutes.</p>
        </div>

        <div id="quiz-progress" class="progress-bar" style="margin-bottom: var(--space-xl);" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Quiz progress">
          <div class="progress-bar-fill" style="width: 0%"></div>
        </div>

        <div id="quiz-question-area" aria-live="polite"></div>

        <div class="quiz-actions" style="display: flex; justify-content: space-between; margin-top: var(--space-xl);">
          <button class="btn btn-secondary" id="quiz-back-btn" style="visibility: hidden;" aria-label="Previous question">
            ← Back
          </button>
          <button class="btn btn-primary btn-lg" id="quiz-next-btn" aria-label="Next question">
            Next →
          </button>
        </div>
      </div>
    </div>
  `;

  renderQuestion();

  // Event listeners
  document.getElementById('quiz-next-btn').addEventListener('click', nextStep);
  document.getElementById('quiz-back-btn').addEventListener('click', prevStep);
}

function renderQuestion() {
  const q = QUESTIONS[currentStep];
  const area = document.getElementById('quiz-question-area');
  if (!area) return;

  const stepText = `Question ${currentStep + 1} of ${QUESTIONS.length}`;

  let inputHTML = '';

  if (q.type === 'select') {
    const optionsHTML = q.options.map((opt, i) => {
      const inputId = `${q.id}-opt-${i}`;
      return `
      <div class="chip ${answers[q.id] === opt.value ? 'active' : ''}" style="padding: var(--space-sm) var(--space-md); cursor: pointer; display: flex; align-items: center; gap: var(--space-xs);">
        <input type="radio" id="${inputId}" name="${q.id}" value="${opt.value}" ${answers[q.id] === opt.value ? 'checked' : ''} style="display: none;">
        <label for="${inputId}" style="cursor: pointer; width: 100%; height: 100%;">${Sanitize.escapeHTML(opt.label)}</label>
      </div>
    `}).join('');

    inputHTML = `<div class="quiz-options" style="display: flex; flex-wrap: wrap; gap: var(--space-sm);" role="radiogroup" aria-label="${Sanitize.escapeHTML(q.question)}">${optionsHTML}</div>`;
  } else if (q.type === 'range') {
    inputHTML = `
      <div class="quiz-range" style="padding: var(--space-md) 0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-md);">
          <span class="text-muted" style="font-size: var(--text-sm);">${q.min} ${q.unit}</span>
          <span id="range-value" style="font-family: var(--font-display); font-size: var(--text-3xl); font-weight: var(--weight-bold); color: var(--color-accent);">${answers[q.id]}</span>
          <span class="text-muted" style="font-size: var(--text-sm);">${q.max} ${q.unit}</span>
        </div>
        <input type="range" id="range-input" min="${q.min}" max="${q.max}" step="${q.step}" value="${answers[q.id]}" 
               style="width: 100%; accent-color: var(--color-accent);"
               aria-label="${Sanitize.escapeHTML(q.question)}"
               aria-valuemin="${q.min}" aria-valuemax="${q.max}" aria-valuenow="${answers[q.id]}">
      </div>
    `;
  }

  area.innerHTML = `
    <div class="animate-fade-in-up">
      <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-sm); text-transform: uppercase; letter-spacing: 0.05em;">${stepText}</div>
      <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg);">
        <span style="font-size: var(--text-2xl);" aria-hidden="true">${q.icon}</span>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-semibold);">${Sanitize.escapeHTML(q.question)}</h2>
      </div>
      ${inputHTML}
    </div>
  `;

  // Update progress
  const progress = ((currentStep) / QUESTIONS.length) * 100;
  const progressBar = document.querySelector('#quiz-progress .progress-bar-fill');
  const progressContainer = document.getElementById('quiz-progress');
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressContainer) progressContainer.setAttribute('aria-valuenow', String(Math.round(progress)));

  // Back button visibility
  const backBtn = document.getElementById('quiz-back-btn');
  if (backBtn) backBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

  // Next button text
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) nextBtn.textContent = currentStep === QUESTIONS.length - 1 ? 'Calculate My Footprint 🌱' : 'Next →';

  // Attach input listeners
  if (q.type === 'select') {
    area.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        answers[q.id] = e.target.value;
        // Update active chips
        area.querySelectorAll('.chip').forEach(chip => {
          const inp = chip.querySelector('input');
          chip.classList.toggle('active', inp.checked);
        });
      });
    });
  } else if (q.type === 'range') {
    const rangeInput = document.getElementById('range-input');
    const rangeValue = document.getElementById('range-value');
    if (rangeInput && rangeValue) {
      rangeInput.addEventListener('input', (e) => {
        answers[q.id] = parseFloat(e.target.value);
        rangeValue.textContent = e.target.value;
        rangeInput.setAttribute('aria-valuenow', e.target.value);
      });
    }
  }

  announce(`${stepText}: ${q.question}`);
}

function nextStep() {
  if (currentStep < QUESTIONS.length - 1) {
    currentStep++;
    renderQuestion();
  } else {
    showResults();
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
  }
}

function showResults() {
  const breakdown = calculateTotalFromQuiz(answers);
  const rating = getFootprintRating(breakdown.total);
  const totalTonnes = (breakdown.total / 1000).toFixed(1);
  const globalTonnes = (BASELINES.global_avg / 1000).toFixed(1);

  // Determine category percentages
  const categories = [
    { key: 'transport', label: 'Transport', icon: '🚗', color: 'var(--color-transport)' },
    { key: 'diet', label: 'Diet', icon: '🍽️', color: 'var(--color-diet)' },
    { key: 'energy', label: 'Energy', icon: '⚡', color: 'var(--color-energy)' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️', color: 'var(--color-shopping)' }
  ];

  const catHTML = categories.map(cat => {
    const value = breakdown[cat.key];
    const pct = Math.round((value / breakdown.total) * 100);
    return `
      <div style="display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) 0;">
        <span style="font-size: var(--text-lg);" aria-hidden="true">${cat.icon}</span>
        <span style="flex: 1; font-size: var(--text-sm); font-weight: var(--weight-medium);">${cat.label}</span>
        <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">${(value/1000).toFixed(1)}t</span>
        <div class="progress-bar" style="width: 100px;">
          <div class="progress-bar-fill" style="width: ${pct}%; background: ${cat.color};"></div>
        </div>
        <span style="font-size: var(--text-xs); color: var(--color-text-tertiary); width: 35px; text-align: right;">${pct}%</span>
      </div>
    `;
  }).join('');

  const card = document.getElementById('quiz-card');
  if (!card) return;

  card.innerHTML = `
    <div class="animate-fade-in-scale" style="text-align: center;">
      <div style="font-size: 4rem; margin-bottom: var(--space-md);">🌍</div>
      <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-xs);">Your Carbon Footprint</h1>
      <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl);">Based on your lifestyle choices</p>

      <div style="margin-bottom: var(--space-xl);">
        <div style="font-family: var(--font-display); font-size: var(--text-5xl); font-weight: var(--weight-bold); color: ${rating.color};">
          ${totalTonnes}
        </div>
        <div style="font-size: var(--text-lg); color: var(--color-text-secondary);">tonnes CO₂ per year</div>
        <div class="badge badge-accent" style="margin-top: var(--space-sm); font-size: var(--text-sm);">
          ${rating.label}
        </div>
      </div>

      <div style="text-align: left; padding: var(--space-md); background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); margin-bottom: var(--space-lg);">
        <h4 style="font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-sm);">Category Breakdown</h4>
        ${catHTML}
      </div>

      <div style="display: flex; gap: var(--space-sm); justify-content: center; margin-bottom: var(--space-lg);">
        <div class="comparison-card" style="flex: 1; padding: var(--space-md);">
          <div class="comp-label">Your Footprint</div>
          <div class="comp-value" style="color: ${rating.color};">${totalTonnes}t</div>
        </div>
        <div class="comparison-card" style="flex: 1; padding: var(--space-md);">
          <div class="comp-label">Global Average</div>
          <div class="comp-value">${globalTonnes}t</div>
        </div>
        <div class="comparison-card" style="flex: 1; padding: var(--space-md);">
          <div class="comp-label">Paris Target</div>
          <div class="comp-value" style="color: var(--color-accent);">${(BASELINES.paris_target/1000).toFixed(1)}t</div>
        </div>
      </div>

      <button class="btn btn-primary btn-lg" id="start-tracking-btn" style="width: 100%;">
        Start Tracking My Footprint 🚀
      </button>
    </div>
  `;

  // Save results
  document.getElementById('start-tracking-btn').addEventListener('click', () => {
    setState({
      onboarded: true,
      profile: answers,
      breakdown
    });
    navigateTo('/dashboard');
  });

  announce(`Your estimated carbon footprint is ${totalTonnes} tonnes CO₂ per year. Rating: ${rating.label}`);
}
