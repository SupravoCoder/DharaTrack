/* ============================================
   TIPS — Curated Eco-Tip Database
   ============================================ */

/**
 * @module tips
 * 100+ curated tips organized by category, impact, and difficulty.
 * Each tip includes estimated annual savings in kg CO₂e.
 */

/**
 * @typedef {Object} Tip
 * @property {string} id - Unique identifier
 * @property {string} category - transport | diet | energy | shopping
 * @property {string} text - The tip text
 * @property {number} savingsKg - Estimated annual savings (kg CO₂e)
 * @property {'low'|'medium'|'high'} impact - Impact level
 * @property {'easy'|'moderate'|'challenging'} difficulty
 * @property {string[]} tags - Searchable tags
 */

/** @type {Tip[]} */
export const TIPS_DATABASE = [
  // ===== TRANSPORT (25 tips) =====
  { id: 't1', category: 'transport', text: 'Work from home one day a week to cut commute emissions by 20%.', savingsKg: 300, impact: 'high', difficulty: 'easy', tags: ['commute', 'remote', 'work'] },
  { id: 't2', category: 'transport', text: 'Switch to cycling for trips under 5 km — it\'s zero-emission and great exercise!', savingsKg: 200, impact: 'medium', difficulty: 'moderate', tags: ['cycling', 'short-trips'] },
  { id: 't3', category: 'transport', text: 'Carpool with a colleague. Splitting the ride halves your transport emissions.', savingsKg: 400, impact: 'high', difficulty: 'moderate', tags: ['carpool', 'commute'] },
  { id: 't4', category: 'transport', text: 'Take the train instead of driving for medium-distance trips. Trains emit up to 80% less CO₂.', savingsKg: 350, impact: 'high', difficulty: 'moderate', tags: ['train', 'public-transport'] },
  { id: 't5', category: 'transport', text: 'Keep your car tyres properly inflated to improve fuel efficiency by up to 3%.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['car', 'maintenance'] },
  { id: 't6', category: 'transport', text: 'Drive at a steady speed and avoid aggressive acceleration to save up to 15% on fuel.', savingsKg: 120, impact: 'medium', difficulty: 'easy', tags: ['driving', 'efficiency'] },
  { id: 't7', category: 'transport', text: 'Consider an electric vehicle for your next car — they produce 50-70% less lifetime emissions.', savingsKg: 1500, impact: 'high', difficulty: 'challenging', tags: ['ev', 'electric'] },
  { id: 't8', category: 'transport', text: 'Use public transport for your daily commute. A bus emits 50% less CO₂ per passenger than a car.', savingsKg: 500, impact: 'high', difficulty: 'moderate', tags: ['bus', 'public-transport'] },
  { id: 't9', category: 'transport', text: 'Walk for trips under 2 km. You\'ll save emissions and improve your health!', savingsKg: 100, impact: 'low', difficulty: 'easy', tags: ['walking', 'short-trips'] },
  { id: 't10', category: 'transport', text: 'Take one fewer flight per year and save roughly 700 kg CO₂. Consider train for nearby destinations.', savingsKg: 700, impact: 'high', difficulty: 'moderate', tags: ['flights', 'vacation'] },
  { id: 't11', category: 'transport', text: 'Choose economy class when flying — first class can have up to 4x the carbon footprint per seat.', savingsKg: 300, impact: 'medium', difficulty: 'easy', tags: ['flights', 'economy'] },
  { id: 't12', category: 'transport', text: 'Combine errands into a single trip instead of making multiple short drives.', savingsKg: 80, impact: 'low', difficulty: 'easy', tags: ['errands', 'planning'] },
  { id: 't13', category: 'transport', text: 'Use a bike-share or scooter-share for last-mile commuting.', savingsKg: 60, impact: 'low', difficulty: 'easy', tags: ['bike-share', 'micro-mobility'] },
  { id: 't14', category: 'transport', text: 'Remove unnecessary weight from your car boot — every 50 kg increases fuel consumption by ~2%.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['car', 'weight'] },
  { id: 't15', category: 'transport', text: 'Use cruise control on motorways for more fuel-efficient driving.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['driving', 'motorway'] },
  { id: 't16', category: 'transport', text: 'Try a hybrid vehicle — they\'re more efficient than petrol cars, especially in city driving.', savingsKg: 800, impact: 'high', difficulty: 'challenging', tags: ['hybrid', 'car'] },
  { id: 't17', category: 'transport', text: 'Replace short car trips with an e-bike for a practical, low-emission alternative.', savingsKg: 250, impact: 'medium', difficulty: 'moderate', tags: ['ebike', 'alternative'] },
  { id: 't18', category: 'transport', text: 'Plan your route to avoid traffic — idling in traffic wastes fuel and increases emissions.', savingsKg: 60, impact: 'low', difficulty: 'easy', tags: ['route', 'traffic'] },
  { id: 't19', category: 'transport', text: 'Use video calls instead of travelling for meetings when possible.', savingsKg: 200, impact: 'medium', difficulty: 'easy', tags: ['remote', 'meetings'] },
  { id: 't20', category: 'transport', text: 'If buying a car, choose a smaller, more fuel-efficient model.', savingsKg: 500, impact: 'high', difficulty: 'moderate', tags: ['car', 'purchase'] },
  { id: 't21', category: 'transport', text: 'For vacations, choose destinations reachable by train instead of by plane.', savingsKg: 600, impact: 'high', difficulty: 'moderate', tags: ['vacation', 'train'] },
  { id: 't22', category: 'transport', text: 'Switch off your engine if you\'re stopped for more than 30 seconds.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['idling', 'fuel'] },
  { id: 't23', category: 'transport', text: 'Service your car regularly to keep the engine running efficiently.', savingsKg: 60, impact: 'low', difficulty: 'easy', tags: ['maintenance', 'service'] },
  { id: 't24', category: 'transport', text: 'Use a car-sharing service instead of owning a second vehicle.', savingsKg: 400, impact: 'high', difficulty: 'moderate', tags: ['car-share', 'ownership'] },
  { id: 't25', category: 'transport', text: 'Offset your unavoidable flight emissions through verified carbon offset programs.', savingsKg: 200, impact: 'medium', difficulty: 'easy', tags: ['offset', 'flights'] },

  // ===== DIET (25 tips) =====
  { id: 'd1', category: 'diet', text: 'Try Meatless Mondays — cutting beef just one day a week saves over 300 kg CO₂ per year.', savingsKg: 340, impact: 'high', difficulty: 'easy', tags: ['meatless', 'beef'] },
  { id: 'd2', category: 'diet', text: 'Replace beef with chicken — chicken has roughly 70% lower emissions per serving.', savingsKg: 500, impact: 'high', difficulty: 'easy', tags: ['chicken', 'beef', 'swap'] },
  { id: 'd3', category: 'diet', text: 'Choose plant-based milk alternatives. Oat milk produces 80% less CO₂ than dairy milk.', savingsKg: 120, impact: 'medium', difficulty: 'easy', tags: ['milk', 'plant-based', 'dairy'] },
  { id: 'd4', category: 'diet', text: 'Eat seasonal, local produce to reduce transport and refrigeration emissions.', savingsKg: 150, impact: 'medium', difficulty: 'easy', tags: ['local', 'seasonal'] },
  { id: 'd5', category: 'diet', text: 'Reduce food waste — the average person wastes 100 kg of food per year, releasing 250 kg CO₂.', savingsKg: 250, impact: 'high', difficulty: 'moderate', tags: ['waste', 'food-waste'] },
  { id: 'd6', category: 'diet', text: 'Try a plant-based diet for a week. Vegan diets produce 50% less emissions than meat-heavy ones.', savingsKg: 700, impact: 'high', difficulty: 'challenging', tags: ['vegan', 'plant-based'] },
  { id: 'd7', category: 'diet', text: 'Cook at home instead of ordering takeaway — restaurant meals have a larger carbon footprint.', savingsKg: 100, impact: 'medium', difficulty: 'moderate', tags: ['cooking', 'takeaway'] },
  { id: 'd8', category: 'diet', text: 'Plan your meals for the week to reduce food waste and unnecessary trips to the store.', savingsKg: 120, impact: 'medium', difficulty: 'easy', tags: ['meal-planning', 'waste'] },
  { id: 'd9', category: 'diet', text: 'Buy imperfect or "ugly" produce — it tastes the same but reduces agricultural waste.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['produce', 'waste'] },
  { id: 'd10', category: 'diet', text: 'Grow your own herbs and vegetables — even a small windowsill garden reduces packaging emissions.', savingsKg: 40, impact: 'low', difficulty: 'moderate', tags: ['gardening', 'homegrown'] },
  { id: 'd11', category: 'diet', text: 'Replace one meat meal per day with legumes. Beans and lentils are protein-rich and low-emission.', savingsKg: 450, impact: 'high', difficulty: 'moderate', tags: ['legumes', 'protein', 'swap'] },
  { id: 'd12', category: 'diet', text: 'Choose tap water over bottled water — bottled water has 300x the carbon footprint.', savingsKg: 20, impact: 'low', difficulty: 'easy', tags: ['water', 'plastic'] },
  { id: 'd13', category: 'diet', text: 'Compost your food scraps to divert organic waste from landfills and reduce methane emissions.', savingsKg: 100, impact: 'medium', difficulty: 'moderate', tags: ['composting', 'waste'] },
  { id: 'd14', category: 'diet', text: 'Reduce dairy cheese consumption — cheese is one of the highest-emission dairy products.', savingsKg: 200, impact: 'medium', difficulty: 'moderate', tags: ['cheese', 'dairy'] },
  { id: 'd15', category: 'diet', text: 'Freeze food before it expires instead of throwing it away.', savingsKg: 80, impact: 'low', difficulty: 'easy', tags: ['freezing', 'waste'] },
  { id: 'd16', category: 'diet', text: 'Bring your own reusable bags and containers when grocery shopping.', savingsKg: 10, impact: 'low', difficulty: 'easy', tags: ['reusable', 'bags'] },
  { id: 'd17', category: 'diet', text: 'Skip the steak and try a bean burger — it\'s tasty and saves about 6 kg CO₂ per meal swap.', savingsKg: 300, impact: 'high', difficulty: 'easy', tags: ['burger', 'swap'] },
  { id: 'd18', category: 'diet', text: 'Choose organic dairy when possible — organic farming often has lower emissions per litre.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['organic', 'dairy'] },
  { id: 'd19', category: 'diet', text: 'Use a "first in, first out" approach in your fridge to minimize food spoilage.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['fridge', 'organization'] },
  { id: 'd20', category: 'diet', text: 'Batch cook on weekends to reduce daily cooking energy and food waste.', savingsKg: 60, impact: 'low', difficulty: 'moderate', tags: ['batch-cooking', 'energy'] },
  { id: 'd21', category: 'diet', text: 'Opt for tofu or tempeh as a protein source — they have 85% lower emissions than beef.', savingsKg: 400, impact: 'high', difficulty: 'moderate', tags: ['tofu', 'protein'] },
  { id: 'd22', category: 'diet', text: 'Buy in bulk to reduce packaging waste and transport emissions.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['bulk', 'packaging'] },
  { id: 'd23', category: 'diet', text: 'Reduce your coffee intake or switch to a more sustainable brand.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['coffee'] },
  { id: 'd24', category: 'diet', text: 'Eat more whole grains — they require less processing and have a lower footprint.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['grains', 'whole-food'] },
  { id: 'd25', category: 'diet', text: 'Try "nose to tail" cooking to use every part of the animal and minimize waste.', savingsKg: 20, impact: 'low', difficulty: 'moderate', tags: ['waste', 'cooking'] },

  // ===== ENERGY (25 tips) =====
  { id: 'e1', category: 'energy', text: 'Switch to a renewable energy provider — this can cut your home electricity emissions by 100%.', savingsKg: 1500, impact: 'high', difficulty: 'easy', tags: ['renewable', 'electricity'] },
  { id: 'e2', category: 'energy', text: 'Install LED bulbs throughout your home — they use 75% less energy than incandescents.', savingsKg: 100, impact: 'medium', difficulty: 'easy', tags: ['led', 'lighting'] },
  { id: 'e3', category: 'energy', text: 'Set your thermostat 1°C lower in winter — each degree saves about 3% on heating bills and emissions.', savingsKg: 150, impact: 'medium', difficulty: 'easy', tags: ['heating', 'thermostat'] },
  { id: 'e4', category: 'energy', text: 'Air-dry your laundry instead of using a dryer to save about 2 kg CO₂ per load.', savingsKg: 180, impact: 'medium', difficulty: 'easy', tags: ['laundry', 'dryer'] },
  { id: 'e5', category: 'energy', text: 'Unplug electronics when not in use — standby power accounts for 5-10% of home energy use.', savingsKg: 100, impact: 'medium', difficulty: 'easy', tags: ['standby', 'phantom-load'] },
  { id: 'e6', category: 'energy', text: 'Install a smart thermostat to optimize heating and cooling schedules automatically.', savingsKg: 200, impact: 'medium', difficulty: 'moderate', tags: ['smart-home', 'thermostat'] },
  { id: 'e7', category: 'energy', text: 'Take 5-minute showers instead of 10-minute ones to cut water heating emissions in half.', savingsKg: 120, impact: 'medium', difficulty: 'easy', tags: ['shower', 'water'] },
  { id: 'e8', category: 'energy', text: 'Wash clothes at 30°C instead of 40°C — it uses 40% less energy and cleans just as well.', savingsKg: 60, impact: 'low', difficulty: 'easy', tags: ['laundry', 'cold-wash'] },
  { id: 'e9', category: 'energy', text: 'Insulate your home properly to reduce heating energy by up to 40%.', savingsKg: 800, impact: 'high', difficulty: 'challenging', tags: ['insulation', 'heating'] },
  { id: 'e10', category: 'energy', text: 'Use a fan instead of air conditioning when possible — fans use 10x less energy.', savingsKg: 200, impact: 'medium', difficulty: 'easy', tags: ['cooling', 'fan', 'ac'] },
  { id: 'e11', category: 'energy', text: 'Install solar panels — they can offset 80-100% of your electricity emissions.', savingsKg: 1200, impact: 'high', difficulty: 'challenging', tags: ['solar', 'renewable'] },
  { id: 'e12', category: 'energy', text: 'Use natural light during the day by opening curtains and blinds.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['lighting', 'natural'] },
  { id: 'e13', category: 'energy', text: 'Close curtains at night to reduce heat loss from windows by up to 15%.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['heating', 'curtains'] },
  { id: 'e14', category: 'energy', text: 'Run your dishwasher only when full to maximize energy efficiency per dish.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['dishwasher', 'efficiency'] },
  { id: 'e15', category: 'energy', text: 'Set your fridge to 3-4°C and freezer to -18°C for optimal efficiency.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['fridge', 'temperature'] },
  { id: 'e16', category: 'energy', text: 'Use a pressure cooker to reduce cooking time and energy by up to 70%.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['cooking', 'efficiency'] },
  { id: 'e17', category: 'energy', text: 'Bleed your radiators regularly to ensure they heat efficiently.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['radiator', 'heating'] },
  { id: 'e18', category: 'energy', text: 'Use draft excluders on doors and windows to reduce heat loss.', savingsKg: 60, impact: 'low', difficulty: 'easy', tags: ['drafts', 'heating'] },
  { id: 'e19', category: 'energy', text: 'Replace old appliances with Energy Star-rated ones for significant efficiency gains.', savingsKg: 200, impact: 'medium', difficulty: 'moderate', tags: ['appliances', 'efficiency'] },
  { id: 'e20', category: 'energy', text: 'Install a low-flow showerhead to reduce hot water usage by 40%.', savingsKg: 80, impact: 'low', difficulty: 'easy', tags: ['shower', 'water'] },
  { id: 'e21', category: 'energy', text: 'Use a microwave instead of an oven for small meals — it uses 80% less energy.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['microwave', 'cooking'] },
  { id: 'e22', category: 'energy', text: 'Switch to a heat pump for heating — they\'re 2-4x more efficient than gas boilers.', savingsKg: 1000, impact: 'high', difficulty: 'challenging', tags: ['heat-pump', 'heating'] },
  { id: 'e23', category: 'energy', text: 'Use power strips with switches to easily cut standby power to multiple devices.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['standby', 'power-strip'] },
  { id: 'e24', category: 'energy', text: 'Double-glaze your windows to reduce heat loss by up to 50%.', savingsKg: 300, impact: 'high', difficulty: 'challenging', tags: ['windows', 'insulation'] },
  { id: 'e25', category: 'energy', text: 'Use a programmable timer for your heating so it\'s only on when you\'re home.', savingsKg: 150, impact: 'medium', difficulty: 'easy', tags: ['timer', 'heating'] },

  // ===== SHOPPING (25 tips) =====
  { id: 's1', category: 'shopping', text: 'Buy second-hand clothing instead of new — it saves roughly 13 kg CO₂ per garment.', savingsKg: 200, impact: 'medium', difficulty: 'easy', tags: ['thrift', 'clothing'] },
  { id: 's2', category: 'shopping', text: 'Repair items instead of replacing them. Extending product life halves its per-year carbon cost.', savingsKg: 150, impact: 'medium', difficulty: 'moderate', tags: ['repair', 'longevity'] },
  { id: 's3', category: 'shopping', text: 'Buy fewer, higher-quality clothes that last longer. Fast fashion has a massive carbon footprint.', savingsKg: 300, impact: 'high', difficulty: 'moderate', tags: ['fast-fashion', 'quality'] },
  { id: 's4', category: 'shopping', text: 'Consolidate online orders to reduce delivery emissions. One shipment beats five.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['online', 'delivery'] },
  { id: 's5', category: 'shopping', text: 'Choose products with minimal packaging or recyclable packaging.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['packaging', 'waste'] },
  { id: 's6', category: 'shopping', text: 'Use a reusable water bottle — it saves about 150 plastic bottles per year.', savingsKg: 15, impact: 'low', difficulty: 'easy', tags: ['reusable', 'plastic'] },
  { id: 's7', category: 'shopping', text: 'Keep your phone for 3-4 years instead of upgrading annually. Each new phone costs ~70 kg CO₂.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['phone', 'electronics'] },
  { id: 's8', category: 'shopping', text: 'Use a library or borrow books instead of buying new ones.', savingsKg: 20, impact: 'low', difficulty: 'easy', tags: ['books', 'library'] },
  { id: 's9', category: 'shopping', text: 'Choose local brands over imported ones to reduce transport emissions.', savingsKg: 60, impact: 'low', difficulty: 'easy', tags: ['local', 'brands'] },
  { id: 's10', category: 'shopping', text: 'Sell or donate items you no longer need instead of throwing them away.', savingsKg: 80, impact: 'low', difficulty: 'easy', tags: ['donate', 'reuse'] },
  { id: 's11', category: 'shopping', text: 'Use rechargeable batteries instead of disposable ones.', savingsKg: 10, impact: 'low', difficulty: 'easy', tags: ['batteries', 'reusable'] },
  { id: 's12', category: 'shopping', text: 'Choose digital subscriptions over physical products (magazines, newspapers, CDs).', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['digital', 'subscriptions'] },
  { id: 's13', category: 'shopping', text: 'Participate in clothing swaps with friends or community groups.', savingsKg: 100, impact: 'medium', difficulty: 'easy', tags: ['clothing-swap', 'community'] },
  { id: 's14', category: 'shopping', text: 'Buy refurbished electronics instead of new — saves up to 80% of manufacturing emissions.', savingsKg: 200, impact: 'medium', difficulty: 'easy', tags: ['refurbished', 'electronics'] },
  { id: 's15', category: 'shopping', text: 'Use a reusable coffee cup to save on disposable cup waste (the average person uses 500/year).', savingsKg: 10, impact: 'low', difficulty: 'easy', tags: ['coffee-cup', 'reusable'] },
  { id: 's16', category: 'shopping', text: 'Choose slow shipping when ordering online — express shipping often means half-empty trucks.', savingsKg: 20, impact: 'low', difficulty: 'easy', tags: ['shipping', 'delivery'] },
  { id: 's17', category: 'shopping', text: 'Rent or borrow tools and equipment you use infrequently instead of buying.', savingsKg: 40, impact: 'low', difficulty: 'easy', tags: ['renting', 'tools'] },
  { id: 's18', category: 'shopping', text: 'Switch to bar soap and shampoo bars to eliminate plastic packaging.', savingsKg: 5, impact: 'low', difficulty: 'easy', tags: ['plastic-free', 'bathroom'] },
  { id: 's19', category: 'shopping', text: 'Support companies with transparent sustainability commitments and practices.', savingsKg: 0, impact: 'low', difficulty: 'easy', tags: ['sustainable', 'brands'] },
  { id: 's20', category: 'shopping', text: 'Avoid impulse buys — the "wait 48 hours" rule prevents unnecessary purchases.', savingsKg: 100, impact: 'medium', difficulty: 'easy', tags: ['impulse', 'mindful'] },
  { id: 's21', category: 'shopping', text: 'Use cloth napkins instead of paper ones to reduce waste.', savingsKg: 5, impact: 'low', difficulty: 'easy', tags: ['cloth', 'waste'] },
  { id: 's22', category: 'shopping', text: 'Choose experiences (events, classes) over material gifts for lower environmental impact.', savingsKg: 50, impact: 'low', difficulty: 'easy', tags: ['gifts', 'experiences'] },
  { id: 's23', category: 'shopping', text: 'Limit streaming quality to standard definition when on mobile — HD uses 7x more energy.', savingsKg: 15, impact: 'low', difficulty: 'easy', tags: ['streaming', 'data'] },
  { id: 's24', category: 'shopping', text: 'Use your own bags for grocery shopping to eliminate single-use plastic bags.', savingsKg: 5, impact: 'low', difficulty: 'easy', tags: ['bags', 'reusable'] },
  { id: 's25', category: 'shopping', text: 'Choose products made from recycled materials when available.', savingsKg: 30, impact: 'low', difficulty: 'easy', tags: ['recycled', 'materials'] }
];

/**
 * Get tips filtered by criteria.
 * @param {Object} [filters]
 * @param {string} [filters.category]
 * @param {string} [filters.impact]
 * @param {string} [filters.difficulty]
 * @param {string[]} [filters.excludeIds] - Tip IDs to exclude (already shown)
 * @param {number} [filters.limit=5]
 * @returns {Tip[]}
 */
export function getTips(filters = {}) {
  let results = [...TIPS_DATABASE];

  if (filters.category) {
    results = results.filter(t => t.category === filters.category);
  }
  if (filters.impact) {
    results = results.filter(t => t.impact === filters.impact);
  }
  if (filters.difficulty) {
    results = results.filter(t => t.difficulty === filters.difficulty);
  }
  if (filters.excludeIds?.length) {
    results = results.filter(t => !filters.excludeIds.includes(t.id));
  }

  // Shuffle for variety
  results.sort(() => Math.random() - 0.5);

  return results.slice(0, filters.limit || 5);
}

/**
 * Get tips relevant to the user's highest-emission category.
 * @param {Object} breakdown - { transport, diet, energy, shopping }
 * @param {string[]} [excludeIds=[]]
 * @returns {Tip[]}
 */
export function getRelevantTips(breakdown, excludeIds = []) {
  // Sort categories by emissions (highest first)
  const sorted = Object.entries(breakdown)
    .filter(([key]) => ['transport', 'diet', 'energy', 'shopping'].includes(key))
    .sort(([,a], [,b]) => b - a);

  const topCategory = sorted[0]?.[0];
  
  // Get 3 from top category, 2 from others
  const topTips = getTips({ category: topCategory, excludeIds, limit: 3 });
  const excludeMore = [...excludeIds, ...topTips.map(t => t.id)];
  const otherTips = getTips({ excludeIds: excludeMore, limit: 2 });

  return [...topTips, ...otherTips];
}

/**
 * Get a random motivational tip.
 * @returns {Tip}
 */
export function getRandomTip() {
  return TIPS_DATABASE[Math.floor(Math.random() * TIPS_DATABASE.length)];
}
