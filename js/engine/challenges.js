/* ============================================
   CHALLENGES — 30-Day Challenge Definitions
   ============================================ */

/**
 * @module challenges
 * Pre-built 30-day challenges with daily tasks.
 */

/**
 * @typedef {Object} Challenge
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {string} category
 * @property {number} totalDays
 * @property {number} estimatedSavings - Estimated total kg CO₂ saved
 * @property {'easy'|'moderate'|'challenging'} difficulty
 * @property {Array<{day: number, task: string, savingsKg: number}>} tasks
 */

/** @type {Challenge[]} */
export const CHALLENGES = [
  {
    id: 'meatless-mondays',
    title: 'Meatless Mondays',
    description: 'Go meat-free every Monday for a month. Discover delicious plant-based meals!',
    icon: '🥬',
    category: 'diet',
    totalDays: 30,
    estimatedSavings: 28,
    difficulty: 'easy',
    tasks: [
      { day: 1, task: 'Start with a veggie stir-fry for dinner', savingsKg: 6.6 },
      { day: 2, task: 'Try a new bean or lentil recipe', savingsKg: 0 },
      { day: 3, task: 'Have a meatless lunch today too', savingsKg: 3 },
      { day: 4, task: 'Explore a plant-based protein (tofu, tempeh)', savingsKg: 0 },
      { day: 5, task: 'Cook a big batch of veggie soup', savingsKg: 6.6 },
      { day: 6, task: 'Try a meatless breakfast (oatmeal, smoothie)', savingsKg: 0 },
      { day: 7, task: 'Share a plant-based meal with a friend', savingsKg: 6.6 },
      { day: 8, task: 'Go fully meat-free today', savingsKg: 6.6 },
      { day: 9, task: 'Discover a new vegetable you haven\'t tried', savingsKg: 0 },
      { day: 10, task: 'Make a hearty salad for lunch', savingsKg: 3 },
      { day: 11, task: 'Try plant-based milk in your coffee', savingsKg: 0.3 },
      { day: 12, task: 'Go meatless for all meals today', savingsKg: 6.6 },
      { day: 13, task: 'Learn one new vegetarian recipe', savingsKg: 0 },
      { day: 14, task: 'Replace cheese with a plant-based alternative', savingsKg: 1 },
      { day: 15, task: 'Half-way there! Go fully plant-based today', savingsKg: 6.6 },
      { day: 16, task: 'Make a veggie curry from scratch', savingsKg: 6.6 },
      { day: 17, task: 'Try a new grain (quinoa, farro, millet)', savingsKg: 0 },
      { day: 18, task: 'Go meatless Monday + Tuesday this week', savingsKg: 6.6 },
      { day: 19, task: 'Make a big pot of chili with beans instead of beef', savingsKg: 6.6 },
      { day: 20, task: 'Experiment with mushrooms as a meat substitute', savingsKg: 3 },
      { day: 21, task: 'Three weeks done! Cook a celebration veggie meal', savingsKg: 6.6 },
      { day: 22, task: 'Try a plant-based burger at a restaurant', savingsKg: 6.6 },
      { day: 23, task: 'Pack a meatless lunch for work/school', savingsKg: 3 },
      { day: 24, task: 'Make a veggie pasta with seasonal vegetables', savingsKg: 3 },
      { day: 25, task: 'Go fully vegan for a day', savingsKg: 6.6 },
      { day: 26, task: 'Make your own hummus or bean dip', savingsKg: 0 },
      { day: 27, task: 'Compile your favourite meatless recipes', savingsKg: 0 },
      { day: 28, task: 'Cook a plant-based feast for your household', savingsKg: 6.6 },
      { day: 29, task: 'Go meatless for the whole weekend', savingsKg: 6.6 },
      { day: 30, task: 'You did it! Commit to keeping Meatless Mondays going', savingsKg: 6.6 }
    ]
  },
  {
    id: 'bike-week',
    title: 'Pedal Power Month',
    description: 'Replace car trips with cycling whenever possible for 30 days.',
    icon: '🚲',
    category: 'transport',
    totalDays: 30,
    estimatedSavings: 50,
    difficulty: 'moderate',
    tasks: [
      { day: 1, task: 'Cycle to work or the nearest shop', savingsKg: 2 },
      { day: 2, task: 'Plan your cycling routes for the week', savingsKg: 0 },
      { day: 3, task: 'Cycle for errands instead of driving', savingsKg: 1.5 },
      { day: 4, task: 'Try a new cycling route you haven\'t taken', savingsKg: 2 },
      { day: 5, task: 'Cycle to meet a friend instead of driving', savingsKg: 2 },
      { day: 6, task: 'Check your bike: tyres, brakes, lights', savingsKg: 0 },
      { day: 7, task: 'Take a longer recreational ride today', savingsKg: 2 },
      { day: 8, task: 'Cycle your commute (or part of it)', savingsKg: 2 },
      { day: 9, task: 'Run a small errand by bike', savingsKg: 1 },
      { day: 10, task: 'Cycle to the grocery store with a backpack', savingsKg: 1.5 },
      { day: 11, task: 'Cycle in any weather (with proper gear)', savingsKg: 2 },
      { day: 12, task: 'Try cycling and public transit combined', savingsKg: 2 },
      { day: 13, task: 'Go car-free for the entire day', savingsKg: 3 },
      { day: 14, task: 'Two weeks! Celebrate with a scenic ride', savingsKg: 2 },
      { day: 15, task: 'Invite someone to cycle with you', savingsKg: 2 },
      { day: 16, task: 'Cycle to all activities today', savingsKg: 3 },
      { day: 17, task: 'Track your cycling distance this week', savingsKg: 2 },
      { day: 18, task: 'Replace a planned car trip with cycling', savingsKg: 2 },
      { day: 19, task: 'Cycle during your lunch break', savingsKg: 1 },
      { day: 20, task: 'Try cycling for your evening plans', savingsKg: 2 },
      { day: 21, task: 'Three weeks! Go fully car-free today', savingsKg: 3 },
      { day: 22, task: 'Cycle a route you always drive', savingsKg: 2 },
      { day: 23, task: 'Clean and maintain your bike', savingsKg: 0 },
      { day: 24, task: 'Help someone else plan a cycling commute', savingsKg: 0 },
      { day: 25, task: 'Cycle to the furthest destination you\'ve tried', savingsKg: 3 },
      { day: 26, task: 'Go car-free for 48 hours', savingsKg: 4 },
      { day: 27, task: 'Cycle and explore a new neighbourhood', savingsKg: 2 },
      { day: 28, task: 'Calculate total km you\'ve cycled this month', savingsKg: 2 },
      { day: 29, task: 'Do a "century" or personal distance challenge', savingsKg: 3 },
      { day: 30, task: 'Congratulations! Keep the pedal power going!', savingsKg: 2 }
    ]
  },
  {
    id: 'unplug-challenge',
    title: 'Unplug & Save',
    description: 'Reduce phantom energy use by unplugging devices and cutting unnecessary power.',
    icon: '🔌',
    category: 'energy',
    totalDays: 30,
    estimatedSavings: 30,
    difficulty: 'easy',
    tasks: [
      { day: 1, task: 'Identify all devices on standby in your home', savingsKg: 0 },
      { day: 2, task: 'Unplug your phone charger when not charging', savingsKg: 0.1 },
      { day: 3, task: 'Switch off your TV at the wall, not just standby', savingsKg: 0.3 },
      { day: 4, task: 'Unplug your computer/laptop at night', savingsKg: 0.3 },
      { day: 5, task: 'Set up a power strip for your entertainment center', savingsKg: 0.5 },
      { day: 6, task: 'Turn off lights when leaving a room', savingsKg: 0.2 },
      { day: 7, task: 'Use natural light until sunset today', savingsKg: 0.3 },
      { day: 8, task: 'Check your home\'s vampire power with an energy monitor', savingsKg: 0 },
      { day: 9, task: 'Unplug kitchen appliances when not in use', savingsKg: 0.2 },
      { day: 10, task: 'Switch to LED bulbs in your most-used rooms', savingsKg: 0.5 },
      { day: 11, task: 'Use a timer for outdoor lights', savingsKg: 0.3 },
      { day: 12, task: 'Take a shorter shower today (under 5 min)', savingsKg: 0.5 },
      { day: 13, task: 'Air-dry your laundry instead of using the dryer', savingsKg: 1.8 },
      { day: 14, task: 'Two weeks! Run a full audit of plugged-in devices', savingsKg: 0 },
      { day: 15, task: 'Lower your water heater temperature by 5°C', savingsKg: 0.5 },
      { day: 16, task: 'Use the microwave instead of the oven for reheating', savingsKg: 0.3 },
      { day: 17, task: 'Close curtains at dusk to retain heat', savingsKg: 0.3 },
      { day: 18, task: 'Only boil the amount of water you need', savingsKg: 0.1 },
      { day: 19, task: 'Enable power-saving mode on your computer', savingsKg: 0.2 },
      { day: 20, task: 'Defrost your freezer if it has ice buildup', savingsKg: 0.3 },
      { day: 21, task: 'Three weeks! Calculate your energy savings so far', savingsKg: 0 },
      { day: 22, task: 'Switch off the heating/AC when you leave home', savingsKg: 1 },
      { day: 23, task: 'Use cold water for washing clothes', savingsKg: 0.5 },
      { day: 24, task: 'Run the dishwasher only when completely full', savingsKg: 0.3 },
      { day: 25, task: 'Open windows for ventilation instead of running AC', savingsKg: 1 },
      { day: 26, task: 'Use a blanket instead of turning up the heat', savingsKg: 0.5 },
      { day: 27, task: 'Check all rooms for unnecessary plugged-in devices', savingsKg: 0.2 },
      { day: 28, task: 'Set up smart plugs for automated off-schedules', savingsKg: 0.5 },
      { day: 29, task: 'Teach a family member about phantom power', savingsKg: 0 },
      { day: 30, task: 'You\'re an energy saver! Make unplugging a habit.', savingsKg: 0.5 }
    ]
  },
  {
    id: 'conscious-consumer',
    title: 'Conscious Consumer',
    description: 'Rethink your shopping habits for 30 days. Buy less, choose better.',
    icon: '🛒',
    category: 'shopping',
    totalDays: 30,
    estimatedSavings: 40,
    difficulty: 'moderate',
    tasks: [
      { day: 1, task: 'Make a list before shopping — only buy what\'s on it', savingsKg: 1 },
      { day: 2, task: 'Use a reusable bag for all shopping today', savingsKg: 0.01 },
      { day: 3, task: 'Repair something broken instead of replacing it', savingsKg: 2 },
      { day: 4, task: 'Donate or sell one item you no longer need', savingsKg: 1 },
      { day: 5, task: 'Avoid buying anything new today', savingsKg: 2 },
      { day: 6, task: 'Research a brand\'s sustainability practices', savingsKg: 0 },
      { day: 7, task: 'Visit a thrift store or charity shop', savingsKg: 2 },
      { day: 8, task: 'Choose a product with minimal packaging', savingsKg: 0.5 },
      { day: 9, task: 'Use a reusable water bottle all day', savingsKg: 0.1 },
      { day: 10, task: 'Borrow something instead of buying it', savingsKg: 2 },
      { day: 11, task: 'Try a no-spend day', savingsKg: 3 },
      { day: 12, task: 'Choose slow shipping over express for online orders', savingsKg: 0.3 },
      { day: 13, task: 'Bring your own cup to a coffee shop', savingsKg: 0.05 },
      { day: 14, task: 'Two weeks! Reflect on what you really need vs want', savingsKg: 0 },
      { day: 15, task: 'Buy one thing second-hand instead of new', savingsKg: 3 },
      { day: 16, task: 'Choose digital over physical (book, magazine, music)', savingsKg: 1 },
      { day: 17, task: 'Upcycle an old item into something useful', savingsKg: 1 },
      { day: 18, task: 'Support a local artisan or maker', savingsKg: 0.5 },
      { day: 19, task: 'Avoid single-use plastics today', savingsKg: 0.2 },
      { day: 20, task: 'Try a "one in, one out" rule for new purchases', savingsKg: 2 },
      { day: 21, task: 'Three weeks! Host a clothing swap with friends', savingsKg: 3 },
      { day: 22, task: 'Batch your online orders to reduce deliveries', savingsKg: 0.5 },
      { day: 23, task: 'Buy local produce at a farmers\' market', savingsKg: 1 },
      { day: 24, task: 'Make a gift by hand instead of buying one', savingsKg: 2 },
      { day: 25, task: 'Go the entire day without any packaging waste', savingsKg: 1 },
      { day: 26, task: 'Calculate how much you\'ve saved by not buying', savingsKg: 0 },
      { day: 27, task: 'Choose an experience over a material purchase', savingsKg: 2 },
      { day: 28, task: 'Research circular economy options in your area', savingsKg: 0 },
      { day: 29, task: 'Consolidate and simplify your subscriptions', savingsKg: 0.5 },
      { day: 30, task: 'Congratulations! You\'re a conscious consumer now!', savingsKg: 2 }
    ]
  }
];

/**
 * Get a challenge by ID.
 * @param {string} id
 * @returns {Challenge|undefined}
 */
export function getChallengeById(id) {
  return CHALLENGES.find(c => c.id === id);
}

/**
 * Calculate challenge progress.
 * @param {string} challengeId
 * @param {number[]} completedDays - Array of completed day numbers
 * @returns {Object} { percentage, completedCount, totalDays, savedKg }
 */
export function getChallengeProgress(challengeId, completedDays = []) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return { percentage: 0, completedCount: 0, totalDays: 0, savedKg: 0 };

  const completedCount = completedDays.length;
  const percentage = Math.round((completedCount / challenge.totalDays) * 100);
  const savedKg = challenge.tasks
    .filter(t => completedDays.includes(t.day))
    .reduce((sum, t) => sum + t.savingsKg, 0);

  return { percentage, completedCount, totalDays: challenge.totalDays, savedKg: Math.round(savedKg * 10) / 10 };
}
