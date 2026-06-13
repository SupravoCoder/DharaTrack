/* ============================================
   STORE TESTS
   ============================================ */

import { getState, setState, resetState, addActivity, deleteActivity, getActivities, getTotalCO2, getDailyTotals, setMonthlyTarget, joinChallenge, leaveChallenge, subscribe } from '../js/store.js';

// Clear state before tests
localStorage.removeItem('carbonfootprint_v1');

describe('Store — State Management', () => {
  it('should return default state initially', () => {
    resetState();
    const state = getState();
    expect(state.onboarded).toBe(false);
    expect(state.activities).toHaveLength(0);
  });

  it('should update state with partial object', () => {
    resetState();
    setState({ onboarded: true });
    expect(getState().onboarded).toBe(true);
  });

  it('should update state with updater function', () => {
    resetState();
    setState(state => {
      state.onboarded = true;
      return state;
    });
    expect(getState().onboarded).toBe(true);
  });

  it('should set _lastUpdated on setState', () => {
    resetState();
    setState({ onboarded: true });
    expect(getState()._lastUpdated).toBeTruthy();
  });

  it('should persist to localStorage', () => {
    resetState();
    setState({ onboarded: true });
    const raw = localStorage.getItem('carbonfootprint_v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.onboarded).toBe(true);
  });

  it('should reset state', () => {
    setState({ onboarded: true });
    resetState();
    expect(getState().onboarded).toBe(false);
  });
});

describe('Store — Subscribers', () => {
  it('should notify subscribers on setState', () => {
    resetState();
    let notified = false;
    const unsub = subscribe(() => { notified = true; });
    setState({ onboarded: true });
    expect(notified).toBe(true);
    unsub();
  });

  it('should unsubscribe correctly', () => {
    resetState();
    let count = 0;
    const unsub = subscribe(() => { count++; });
    setState({ onboarded: true });
    unsub();
    setState({ onboarded: false });
    expect(count).toBe(1);
  });
});

describe('Store — Activities CRUD', () => {
  it('should add an activity', () => {
    resetState();
    addActivity({
      category: 'transport',
      type: 'car_petrol',
      label: 'Drove Car',
      amount: 15,
      unit: 'km',
      co2: 2.88,
      date: '2024-06-15'
    });
    const activities = getState().activities;
    expect(activities).toHaveLength(1);
    expect(activities[0].category).toBe('transport');
    expect(activities[0].co2).toBe(2.88);
  });

  it('should prepend new activities', () => {
    resetState();
    addActivity({ category: 'transport', type: 'bus', label: 'Bus', amount: 10, unit: 'km', co2: 0.89, date: '2024-06-15' });
    addActivity({ category: 'diet', type: 'beef', label: 'Beef', amount: 1, unit: 'servings', co2: 6.61, date: '2024-06-15' });
    const activities = getState().activities;
    expect(activities[0].category).toBe('diet');
  });

  it('should delete an activity by ID', () => {
    resetState();
    addActivity({ category: 'transport', type: 'bus', label: 'Bus', amount: 10, unit: 'km', co2: 0.89, date: '2024-06-15' });
    const id = getState().activities[0].id;
    deleteActivity(id);
    expect(getState().activities).toHaveLength(0);
  });
});

describe('Store — Queries', () => {
  it('should filter activities by category', () => {
    resetState();
    addActivity({ category: 'transport', type: 'bus', label: 'Bus', amount: 10, unit: 'km', co2: 0.89, date: '2024-06-15' });
    addActivity({ category: 'diet', type: 'beef', label: 'Beef', amount: 1, unit: 'servings', co2: 6.61, date: '2024-06-15' });
    const transport = getActivities({ category: 'transport' });
    expect(transport).toHaveLength(1);
  });

  it('should filter by date range', () => {
    resetState();
    addActivity({ category: 'transport', type: 'bus', label: 'Bus', amount: 10, unit: 'km', co2: 0.89, date: '2024-06-10' });
    addActivity({ category: 'diet', type: 'beef', label: 'Beef', amount: 1, unit: 'servings', co2: 6.61, date: '2024-06-20' });
    const results = getActivities({ startDate: '2024-06-15', endDate: '2024-06-25' });
    expect(results).toHaveLength(1);
  });

  it('should compute total CO2 for date range', () => {
    resetState();
    addActivity({ category: 'transport', type: 'bus', label: 'Bus', amount: 10, unit: 'km', co2: 1.0, date: '2024-06-15' });
    addActivity({ category: 'diet', type: 'beef', label: 'Beef', amount: 1, unit: 'servings', co2: 2.0, date: '2024-06-15' });
    const total = getTotalCO2('2024-06-15', '2024-06-15');
    expect(total).toBeCloseTo(3.0, 1);
  });

  it('should return daily totals', () => {
    resetState();
    addActivity({ category: 'transport', type: 'bus', label: 'Bus', amount: 10, unit: 'km', co2: 1.0, date: '2024-06-15' });
    const daily = getDailyTotals('2024-06-14', '2024-06-16');
    expect(daily).toHaveLength(3);
  });
});

describe('Store — Goals', () => {
  it('should set monthly target', () => {
    resetState();
    setMonthlyTarget(200);
    expect(getState().goals.monthlyTarget).toBe(200);
  });

  it('should join a challenge', () => {
    resetState();
    joinChallenge('meatless_mondays');
    const challenges = getState().goals.activeChallenges;
    expect(challenges).toHaveLength(1);
    expect(challenges[0].challengeId).toBe('meatless_mondays');
  });

  it('should not duplicate challenge joins', () => {
    resetState();
    joinChallenge('meatless_mondays');
    joinChallenge('meatless_mondays');
    expect(getState().goals.activeChallenges).toHaveLength(1);
  });

  it('should leave a challenge', () => {
    resetState();
    joinChallenge('meatless_mondays');
    leaveChallenge('meatless_mondays');
    expect(getState().goals.activeChallenges).toHaveLength(0);
  });
});

// Clean up
resetState();
