/* ============================================
   STORE — State Management (localStorage)
   ============================================ */

/**
 * @module store
 * Reactive state management backed by localStorage.
 * Provides CRUD operations, schema versioning,
 * data validation, and subscription support.
 */

import { Sanitize } from './utils/sanitize.js';
import { today } from './utils/format.js';

const STORAGE_KEY = 'carbonfootprint_v1';
const SCHEMA_VERSION = 1;

/** Maximum number of activity entries stored to prevent localStorage bloat. */
const MAX_ACTIVITIES = 1000;

/* ---- Default State ---- */

const DEFAULT_STATE = {
   _version: SCHEMA_VERSION,
   _lastUpdated: null,

   // Onboarding
   onboarded: false,
   
   // User profile (from quiz)
   profile: {
     commuteMode: 'car_petrol',
     commuteDistance: 15,
     commuteDays: 5,
     flights: 2,
     dietType: 'medium_meat',
     homeSize: 'medium',
     heatingType: 'gas',
     renewablePercent: 0,
     shoppingHabit: 'moderate',
     onlineOrders: 4
   },

   // Footprint breakdown (calculated from quiz)
   breakdown: {
     transport: 0,
     diet: 0,
     energy: 0,
     shopping: 0,
     total: 0
   },

   // Activity log (array of entries)
   activities: [],

   // Goals
   goals: {
     monthlyTarget: null,      // kg CO₂ target per month
     activeChallenges: [],     // { challengeId, startDate, completedDays: [] }
   },

   // Streak tracking
   streak: {
     current: 0,
     lastLogDate: null,
     longest: 0
   },

   // Shown tip IDs (to avoid repeats)
   shownTipIds: [],

   // User preferences
   preferences: {
     notifications: true,
     country: 'global'
   }
};

/* ---- State Management ---- */

/** @type {Set<Function>} */
const subscribers = new Set();

/** @type {Object} */
let cachedState = null;

/**
 * Get the current state (from cache or localStorage).
 * @returns {Object} Current state
 */
export function getState() {
   if (cachedState) return cachedState;

   try {
     const raw = localStorage.getItem(STORAGE_KEY);
     if (!raw) {
       cachedState = structuredClone(DEFAULT_STATE);
       return cachedState;
     }

     const parsed = JSON.parse(raw);
     
     // Schema migration
     if (!parsed._version || parsed._version < SCHEMA_VERSION) {
       cachedState = migrateState(parsed);
       persistState(cachedState);
       return cachedState;
     }

     // Merge with defaults to fill any missing fields
     cachedState = deepMerge(structuredClone(DEFAULT_STATE), parsed);
     return cachedState;
   } catch (e) {
     console.error('[Store] Failed to read state:', e);
     cachedState = structuredClone(DEFAULT_STATE);
     return cachedState;
   }
}

/**
 * Update state with partial changes.
 * @param {Object|Function} updates - Partial state object or updater function
 */
export function setState(updates) {
   const current = getState();
   
   let newState;
   if (typeof updates === 'function') {
     newState = updates(structuredClone(current));
   } else {
     newState = deepMerge(current, updates);
   }

   newState._lastUpdated = new Date().toISOString();
   cachedState = newState;
   persistState(newState);
   notifySubscribers(newState);
}

/**
 * Subscribe to state changes.
 * @param {Function} callback - Called with new state
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
   subscribers.add(callback);
   return () => subscribers.delete(callback);
}

/**
 * Reset the entire state to defaults.
 */
export function resetState() {
   cachedState = structuredClone(DEFAULT_STATE);
   persistState(cachedState);
   notifySubscribers(cachedState);
}

/* ---- Activity CRUD ---- */

/**
 * Add an activity entry.
 * @param {Object} activity
 * @param {string} activity.category
 * @param {string} activity.type
 * @param {string} activity.label
 * @param {number} activity.amount
 * @param {string} activity.unit
 * @param {number} activity.co2 - kg CO₂e
 * @param {string} [activity.date]
 * @param {string} [activity.description]
 */
export function addActivity(activity) {
   setState(state => {
     const entry = {
       id: generateId(),
       category: Sanitize.enum(activity.category, ['transport', 'diet', 'energy', 'shopping'], 'transport'),
       type: Sanitize.string(activity.type, { maxLength: 50 }),
       label: Sanitize.string(activity.label, { maxLength: 100 }),
       amount: Sanitize.number(activity.amount, { min: 0, max: 100000 }),
       unit: Sanitize.string(activity.unit, { maxLength: 20 }),
       co2: Sanitize.number(activity.co2, { min: 0, max: 100000 }),
       date: Sanitize.date(activity.date),
       description: Sanitize.string(activity.description || '', { maxLength: 200 }),
       createdAt: new Date().toISOString()
     };

     state.activities.unshift(entry);

    // Keep only last MAX_ACTIVITIES entries to prevent localStorage bloat
    if (state.activities.length > MAX_ACTIVITIES) {
      state.activities = state.activities.slice(0, MAX_ACTIVITIES);
    }

     // Update streak
     updateStreak(state);

     return state;
   });
}

/**
 * Delete an activity by ID.
 * @param {string} id
 */
export function deleteActivity(id) {
   setState(state => {
     state.activities = state.activities.filter(a => a.id !== id);
     return state;
   });
}

/**
 * Update an activity by ID.
 * @param {string} id
 * @param {Object} updates
 */
export function updateActivity(id, updates) {
   setState(state => {
     const idx = state.activities.findIndex(a => a.id === id);
     if (idx !== -1) {
       state.activities[idx] = { ...state.activities[idx], ...updates };
     }
     return state;
   });
}

/* ---- Goal Management ---- */

/**
 * Set monthly CO₂ target.
 * @param {number} targetKg
 */
export function setMonthlyTarget(targetKg) {
   setState(state => {
     state.goals.monthlyTarget = Sanitize.number(targetKg, { min: 0, max: 100000 });
     return state;
   });
}

/**
 * Join a challenge.
 * @param {string} challengeId
 */
export function joinChallenge(challengeId) {
   setState(state => {
     // Don't duplicate
     if (state.goals.activeChallenges.some(c => c.challengeId === challengeId)) return state;
     
     state.goals.activeChallenges.push({
       challengeId,
       startDate: today(),
       completedDays: []
     });
     return state;
   });
}

/**
 * Complete a challenge day.
 * @param {string} challengeId
 * @param {number} dayNum
 */
export function completeChallengeDay(challengeId, dayNum) {
   setState(state => {
     const challenge = state.goals.activeChallenges.find(c => c.challengeId === challengeId);
     if (challenge && !challenge.completedDays.includes(dayNum)) {
       challenge.completedDays.push(dayNum);
     }
     return state;
   });
}

/**
 * Leave a challenge.
 * @param {string} challengeId
 */
export function leaveChallenge(challengeId) {
   setState(state => {
     state.goals.activeChallenges = state.goals.activeChallenges.filter(c => c.challengeId !== challengeId);
     return state;
   });
}

/* ---- Queries ---- */

/**
 * Get activities filtered by date range and/or category.
 * @param {Object} [filters]
 * @param {string} [filters.startDate]
 * @param {string} [filters.endDate]
 * @param {string} [filters.category]
 * @returns {Array}
 */
export function getActivities(filters = {}) {
   const state = getState();
   let results = [...state.activities];

   if (filters.startDate) {
     results = results.filter(a => a.date >= filters.startDate);
   }
   if (filters.endDate) {
     results = results.filter(a => a.date <= filters.endDate);
   }
   if (filters.category) {
     results = results.filter(a => a.category === filters.category);
   }

   return results;
}

/**
 * Get total CO₂ for a date range, optionally by category.
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} [category]
 * @returns {number} Total kg CO₂
 */
export function getTotalCO2(startDate, endDate, category) {
   const activities = getActivities({ startDate, endDate, category });
   return activities.reduce((sum, a) => sum + (a.co2 || 0), 0);
}

/**
 * Get daily CO₂ totals for a date range.
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Object[]} Array of { date, total, transport, diet, energy, shopping }
 */
export function getDailyTotals(startDate, endDate) {
   const activities = getActivities({ startDate, endDate });
   const dailyMap = {};

   // Initialize all dates
   const current = new Date(startDate);
   const end = new Date(endDate);
   while (current <= end) {
     const dateStr = current.toISOString().split('T')[0];
     dailyMap[dateStr] = { date: dateStr, total: 0, transport: 0, diet: 0, energy: 0, shopping: 0 };
     current.setDate(current.getDate() + 1);
   }

   // Aggregate
   for (const a of activities) {
     if (dailyMap[a.date]) {
       dailyMap[a.date].total += a.co2 || 0;
       if (dailyMap[a.date][a.category] !== undefined) {
         dailyMap[a.date][a.category] += a.co2 || 0;
       }
     }
   }

   return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
}

/* ---- Internal Helpers ---- */

/**
 * Persist state to localStorage and optionally sync to Firebase.
 * @param {Object} state - State object to persist
 */
function persistState(state) {
   try {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
     // Trigger Google Services (Firebase) sync asynchronously if enabled
     if (state.preferences?.cloudSync) {
       syncToFirebase(state).catch(e => console.error('[Store] Firebase sync error:', e));
     }
   } catch (e) {
     console.error('[Store] Failed to persist state:', e);
   }
}

async function syncToFirebase(state) {
   try {
     // Dynamically import Firebase to keep initial load fast
     const { initializeApp } = await import('firebase/app');
     const { getFirestore, doc, setDoc } = await import('firebase/firestore');
     
     // Firebase Config — load from environment or user-provided config
     // NEVER hardcode secrets in source code
     const firebaseConfig = getFirebaseConfig();
     
     if (!firebaseConfig) {
       console.warn('[Firebase] No Firebase config found. Cloud sync disabled.');
       return;
     }
     
     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
     
     // Sync full state to Firestore under a local user placeholder
     const userId = "local-user-fallback";
     await setDoc(doc(db, "users", userId), state);
     console.log("[Firebase] State synced successfully to cloud.");
   } catch (err) {
     throw new Error('Firebase initialization or sync failed: ' + err.message);
   }
}

/**
 * Get Firebase config from environment or user settings
 * @returns {Object|null} Firebase config object or null if not available
 */
function getFirebaseConfig() {
   // Check for config in window.FIREBASE_CONFIG (set by embedding HTML)
   if (typeof window !== 'undefined' && window.FIREBASE_CONFIG) {
     return window.FIREBASE_CONFIG;
   }
   
   // Check for config in sessionStorage (user-provided via settings UI)
   try {
     const stored = sessionStorage.getItem('firebase_config');
     if (stored) {
       return JSON.parse(stored);
     }
   } catch (e) {
     console.error('[Firebase] Failed to parse stored config:', e);
   }
   
   return null;
}

/**
 * Notify all subscribers of a state change.
 * Errors in individual subscribers are caught and logged.
 * @param {Object} state - New state to broadcast
 */
function notifySubscribers(state) {
   for (const cb of subscribers) {
     try {
       cb(state);
     } catch (e) {
       console.error('[Store] Subscriber error:', e);
     }
   }
}

/**
 * Update the logging streak based on today's date.
 * Increments streak if user logged yesterday, resets if gap detected.
 * @param {Object} state - Mutable state object
 */
function updateStreak(state) {
   const todayStr = today();
   
   if (state.streak.lastLogDate === todayStr) {
     // Already logged today, no change
     return;
   }

   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   const yesterdayStr = yesterday.toISOString().split('T')[0];

   if (state.streak.lastLogDate === yesterdayStr) {
     // Consecutive day
     state.streak.current += 1;
   } else if (state.streak.lastLogDate !== todayStr) {
     // Streak broken
     state.streak.current = 1;
   }

   state.streak.lastLogDate = todayStr;
   state.streak.longest = Math.max(state.streak.longest, state.streak.current);
}

/**
 * Migrate state from an older schema version to the current one.
 * @param {Object} oldState - State with outdated schema
 * @returns {Object} Migrated state at current schema version
 */
function migrateState(oldState) {
   // For now, just merge with defaults
   const migrated = deepMerge(structuredClone(DEFAULT_STATE), oldState);
   migrated._version = SCHEMA_VERSION;
   return migrated;
}

/**
 * Deep merge two objects, recursively merging nested objects.
 * Arrays and null values in source overwrite target values.
 * @param {Object} target - Base object
 * @param {Object} source - Object with overrides
 * @returns {Object} Merged result (new object)
 */
function deepMerge(target, source) {
   const result = { ...target };
   for (const key of Object.keys(source)) {
     if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key]) && typeof target[key] === 'object' && !Array.isArray(target[key])) {
       result[key] = deepMerge(target[key], source[key]);
     } else {
       result[key] = source[key];
     }
   }
   return result;
}

/**
 * Generate a unique ID using timestamp + random suffix.
 * @returns {string} Unique identifier (e.g. "lxyz1234ab")
 */
function generateId() {
   return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
