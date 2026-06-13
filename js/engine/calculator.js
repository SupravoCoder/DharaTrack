/* ============================================
   CALCULATOR — CO₂ Emission Factors & Math
   ============================================
   Sources:
   - EPA Greenhouse Gas Equivalencies Calculator
   - DEFRA 2023 Conversion Factors
   - IPCC AR6 (2021)
   - Our World in Data
   ============================================ */

/**
 * @module calculator
 * Provides emission factors and calculation functions
 * for estimating personal carbon footprints.
 * All values are in kg CO₂e (carbon dioxide equivalent).
 */

/* ---- Emission Factors (kg CO₂e per unit) ---- */

/**
 * Transport emission factors (kg CO₂e per km).
 */
export const TRANSPORT_FACTORS = {
  car_petrol:       0.192,    // Average petrol car
  car_diesel:       0.171,    // Average diesel car
  car_hybrid:       0.110,    // Hybrid vehicle
  car_electric:     0.053,    // Electric vehicle (grid average)
  motorcycle:       0.113,    // Motorcycle
  bus:              0.089,    // Public bus
  train:            0.041,    // National rail
  metro:            0.033,    // Metro / subway
  bicycle:          0.000,    // Zero emissions
  walking:          0.000,    // Zero emissions
  domestic_flight:  0.246,    // Per passenger-km (domestic)
  long_flight:      0.195,    // Per passenger-km (long haul)
  carpool:          0.096,    // Shared car (2 people)
  taxi:             0.210,    // Taxi / ride-share
  ferry:            0.019     // Ferry
};

/**
 * Diet emission factors (kg CO₂e per serving / per day).
 */
export const DIET_FACTORS = {
  // Per meal/serving
  beef:               6.610,   // Per serving (~150g)
  lamb:               5.840,
  pork:               2.400,
  chicken:            1.820,
  fish:               1.340,
  eggs:               0.530,   // Per 2 eggs
  cheese:             1.130,   // Per serving (~50g)
  milk:               0.310,   // Per glass (250ml)
  rice:               0.560,   // Per serving
  pasta:              0.280,
  bread:              0.120,
  vegetables:         0.150,   // Per serving
  fruits:             0.120,
  legumes:            0.160,
  tofu:               0.310,
  coffee:             0.290,   // Per cup
  // Per day (diet type baseline)
  diet_heavy_meat:    7.190,
  diet_medium_meat:   5.630,
  diet_low_meat:      4.670,
  diet_pescatarian:   3.910,
  diet_vegetarian:    3.810,
  diet_vegan:         2.890
};

/**
 * Energy emission factors.
 */
export const ENERGY_FACTORS = {
  electricity_kwh:    0.233,   // kg CO₂e per kWh (US grid average)
  natural_gas_kwh:    0.184,   // kg CO₂e per kWh
  heating_oil_litre:  2.540,   // kg CO₂e per litre
  // Appliance estimates (kg CO₂e per hour of use)
  air_conditioning:   1.050,
  space_heater:       0.700,
  washer:             0.350,   // Per load
  dryer:              1.800,   // Per load
  dishwasher:         0.600,   // Per load
  oven:               0.850,   // Per hour
  tv:                 0.040,   // Per hour
  computer:           0.060,   // Per hour
  led_light:          0.002,   // Per hour per bulb
  shower_8min:        0.560,   // Per 8-minute hot shower
  bath:               1.100    // Per bath
};

/**
 * Shopping / consumption emission factors (kg CO₂e per item/event).
 */
export const SHOPPING_FACTORS = {
  clothing_item:      15.000,  // Average new garment
  fast_fashion:       20.000,  // Fast fashion item
  thrift_clothing:     2.000,  // Second-hand clothing
  electronics_phone:  70.000,  // New smartphone
  electronics_laptop: 300.000, // New laptop
  electronics_tablet: 100.000,
  furniture:          50.000,  // Average furniture piece
  online_order:        0.500,  // Package delivery
  grocery_bag:         0.010,  // Plastic bag
  reusable_bag:        0.002,  // Reuse credit
  book:                2.710,  // Physical book
  streaming_hour:      0.036,  // Video streaming per hour
  online_search:       0.0002  // Per web search
};

/* ---- Average Baselines ---- */

/**
 * Annual per-capita CO₂e baselines (kg/year).
 */
export const BASELINES = {
  global_avg:      4700,     // ~4.7 tonnes
  us_avg:         15200,     // ~15.2 tonnes
  eu_avg:          6800,     // ~6.8 tonnes
  uk_avg:          5500,     // ~5.5 tonnes
  india_avg:       1900,     // ~1.9 tonnes
  china_avg:       7400,     // ~7.4 tonnes
  paris_target:    2300,     // Paris Agreement goal by 2030
  net_zero:        1000      // Aspirational near-zero
};

/* ---- Calculation Functions ---- */

/**
 * Calculate annual transport footprint from quiz answers.
 * @param {Object} answers - Quiz answers
 * @returns {number} Annual kg CO₂e
 */
export function calculateTransport(answers) {
  const { commuteMode, commuteDistance, commuteDays, flights } = answers;
  let total = 0;

  // Daily commute
  const factor = TRANSPORT_FACTORS[commuteMode] || 0;
  const dailyKm = parseFloat(commuteDistance) || 0;
  const daysPerWeek = answers.commuteDays !== undefined ? parseInt(answers.commuteDays) : 5;
  const weeksPerYear = 48; // Accounting for holidays
  total += factor * dailyKm * 2 * daysPerWeek * weeksPerYear; // Round trip

  // Flights
  const flightsPerYear = parseInt(flights) || 0;
  // Assume average flight of 2000km
  total += flightsPerYear * 2000 * TRANSPORT_FACTORS.long_flight;

  return total;
}

/**
 * Calculate annual diet footprint from quiz answers.
 * @param {Object} answers - Quiz answers
 * @returns {number} Annual kg CO₂e
 */
export function calculateDiet(answers) {
  const { dietType } = answers;
  const factorKey = `diet_${dietType}`;
  const dailyFactor = DIET_FACTORS[factorKey] || DIET_FACTORS.diet_medium_meat;
  return dailyFactor * 365;
}

/**
 * Calculate annual energy footprint from quiz answers.
 * @param {Object} answers - Quiz answers
 * @returns {number} Annual kg CO₂e
 */
export function calculateEnergy(answers) {
  const { homeSize, heatingType, renewablePercent } = answers;
  
  // Base electricity usage by home size (kWh/year)
  const electricityUsage = {
    studio:     3000,
    small:      4500,
    medium:     7000,
    large:     10000,
    very_large: 14000
  };

  const baseElectricity = electricityUsage[homeSize] || electricityUsage.medium;
  const renewableMultiplier = 1 - (parseInt(renewablePercent) || 0) / 100;
  
  let total = baseElectricity * ENERGY_FACTORS.electricity_kwh * renewableMultiplier;

  // Heating
  const heatingEstimates = {
    gas:        3000,  // kg CO₂e/year for gas heating
    oil:        4000,
    electric:   baseElectricity * 0.3 * ENERGY_FACTORS.electricity_kwh * renewableMultiplier,
    heat_pump:  500,
    none:       0
  };

  total += heatingEstimates[heatingType] || heatingEstimates.gas;

  return total;
}

/**
 * Calculate annual shopping footprint from quiz answers.
 * @param {Object} answers - Quiz answers
 * @returns {number} Annual kg CO₂e
 */
export function calculateShopping(answers) {
  const { shoppingHabit, onlineOrders } = answers;
  
  const baseByHabit = {
    minimal:   300,   // kg CO₂e/year
    moderate:  800,
    frequent: 1500,
    heavy:    2500
  };

  let total = baseByHabit[shoppingHabit] || baseByHabit.moderate;

  // Online orders
  const ordersPerMonth = parseInt(onlineOrders) || 4;
  total += ordersPerMonth * 12 * SHOPPING_FACTORS.online_order;

  return total;
}

/**
 * Calculate total annual footprint from quiz answers.
 * @param {Object} answers - Complete quiz answers
 * @returns {Object} Breakdown and total
 */
export function calculateTotalFromQuiz(answers) {
  const transport = calculateTransport(answers);
  const diet = calculateDiet(answers);
  const energy = calculateEnergy(answers);
  const shopping = calculateShopping(answers);
  const total = transport + diet + energy + shopping;

  return {
    transport: Math.round(transport),
    diet: Math.round(diet),
    energy: Math.round(energy),
    shopping: Math.round(shopping),
    total: Math.round(total)
  };
}

/**
 * Convert a single activity entry to kg CO₂e.
 * @param {Object} activity - Activity entry
 * @param {string} activity.category - Category (transport, diet, energy, shopping)
 * @param {string} activity.type - Activity type key
 * @param {number} activity.amount - Quantity
 * @param {string} activity.unit - Unit (km, servings, hours, items)
 * @returns {number} kg CO₂e
 */
export function activityToCO2(activity) {
  const { category, type, amount } = activity;
  const qty = parseFloat(amount) || 0;

  const factorMaps = {
    transport: TRANSPORT_FACTORS,
    diet: DIET_FACTORS,
    energy: ENERGY_FACTORS,
    shopping: SHOPPING_FACTORS
  };

  const factors = factorMaps[category];
  if (!factors) return 0;

  const factor = factors[type];
  if (factor === undefined) return 0;

  return Math.round(qty * factor * 1000) / 1000; // 3 decimal precision
}

/**
 * Get the rating for an annual footprint.
 * @param {number} annualKg - Annual kg CO₂e
 * @returns {Object} { rating, color, label, percentile }
 */
export function getFootprintRating(annualKg) {
  if (annualKg <= BASELINES.net_zero) {
    return { rating: 'excellent', color: 'var(--color-success)', label: 'Excellent', percentile: 95 };
  } else if (annualKg <= BASELINES.paris_target) {
    return { rating: 'great', color: 'var(--color-success)', label: 'Great', percentile: 80 };
  } else if (annualKg <= BASELINES.global_avg) {
    return { rating: 'good', color: 'var(--color-accent)', label: 'Good', percentile: 60 };
  } else if (annualKg <= BASELINES.eu_avg) {
    return { rating: 'average', color: 'var(--color-warning)', label: 'Average', percentile: 40 };
  } else if (annualKg <= BASELINES.us_avg) {
    return { rating: 'high', color: 'var(--color-warning)', label: 'Above Average', percentile: 20 };
  } else {
    return { rating: 'very_high', color: 'var(--color-danger)', label: 'High', percentile: 5 };
  }
}

/**
 * Activity definitions for the logger quick-add buttons.
 * Each entry: { key, category, label, icon, type, defaultAmount, unit }
 */
export const QUICK_ACTIVITIES = [
  { key: 'drive_car',       category: 'transport', label: 'Drove Car',       icon: '🚗', type: 'car_petrol',       defaultAmount: 15, unit: 'km' },
  { key: 'took_bus',        category: 'transport', label: 'Took Bus',        icon: '🚌', type: 'bus',              defaultAmount: 10, unit: 'km' },
  { key: 'rode_bike',       category: 'transport', label: 'Rode Bike',       icon: '🚲', type: 'bicycle',          defaultAmount: 5,  unit: 'km' },
  { key: 'took_train',      category: 'transport', label: 'Took Train',      icon: '🚆', type: 'train',            defaultAmount: 30, unit: 'km' },
  { key: 'took_flight',     category: 'transport', label: 'Took Flight',     icon: '✈️', type: 'long_flight',      defaultAmount: 1000, unit: 'km' },
  { key: 'ate_beef',        category: 'diet',      label: 'Ate Beef',        icon: '🥩', type: 'beef',             defaultAmount: 1,  unit: 'servings' },
  { key: 'ate_chicken',     category: 'diet',      label: 'Ate Chicken',     icon: '🍗', type: 'chicken',          defaultAmount: 1,  unit: 'servings' },
  { key: 'ate_vegan',       category: 'diet',      label: 'Ate Vegan Meal',  icon: '🥗', type: 'vegetables',       defaultAmount: 1,  unit: 'servings' },
  { key: 'drank_coffee',    category: 'diet',      label: 'Had Coffee',      icon: '☕', type: 'coffee',            defaultAmount: 1,  unit: 'cups' },
  { key: 'used_ac',         category: 'energy',    label: 'Used AC',         icon: '❄️', type: 'air_conditioning', defaultAmount: 3,  unit: 'hours' },
  { key: 'hot_shower',      category: 'energy',    label: 'Hot Shower',      icon: '🚿', type: 'shower_8min',      defaultAmount: 1,  unit: 'showers' },
  { key: 'did_laundry',     category: 'energy',    label: 'Did Laundry',     icon: '👕', type: 'washer',           defaultAmount: 1,  unit: 'loads' },
  { key: 'used_dryer',      category: 'energy',    label: 'Used Dryer',      icon: '🌀', type: 'dryer',            defaultAmount: 1,  unit: 'loads' },
  { key: 'bought_clothes',  category: 'shopping',  label: 'Bought Clothes',  icon: '🛍️', type: 'clothing_item',   defaultAmount: 1,  unit: 'items' },
  { key: 'online_shopping', category: 'shopping',  label: 'Online Order',    icon: '📦', type: 'online_order',     defaultAmount: 1,  unit: 'orders' },
  { key: 'streamed_video',  category: 'shopping',  label: 'Streamed Video',  icon: '📺', type: 'streaming_hour',   defaultAmount: 2,  unit: 'hours' }
];
