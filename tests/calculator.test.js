/* ============================================
   CALCULATOR TESTS
   ============================================ */

import {
  TRANSPORT_FACTORS, DIET_FACTORS, ENERGY_FACTORS, SHOPPING_FACTORS,
  BASELINES, calculateTransport, calculateDiet, calculateEnergy,
  calculateShopping, calculateTotalFromQuiz, activityToCO2, getFootprintRating
} from '../js/engine/calculator.js';

describe('Calculator — Emission Factors', () => {
  it('should have positive transport factors for motorized vehicles', () => {
    expect(TRANSPORT_FACTORS.car_petrol).toBeGreaterThan(0);
    expect(TRANSPORT_FACTORS.bus).toBeGreaterThan(0);
    expect(TRANSPORT_FACTORS.long_flight).toBeGreaterThan(0);
  });

  it('should have zero factors for bicycle and walking', () => {
    expect(TRANSPORT_FACTORS.bicycle).toBe(0);
    expect(TRANSPORT_FACTORS.walking).toBe(0);
  });

  it('should have diet factors ordered by impact', () => {
    expect(DIET_FACTORS.beef).toBeGreaterThan(DIET_FACTORS.chicken);
    expect(DIET_FACTORS.chicken).toBeGreaterThan(DIET_FACTORS.vegetables);
    expect(DIET_FACTORS.diet_heavy_meat).toBeGreaterThan(DIET_FACTORS.diet_vegan);
  });

  it('should have positive energy factors', () => {
    expect(ENERGY_FACTORS.electricity_kwh).toBeGreaterThan(0);
    expect(ENERGY_FACTORS.air_conditioning).toBeGreaterThan(0);
  });

  it('should have reasonable baselines', () => {
    expect(BASELINES.global_avg).toBeGreaterThan(0);
    expect(BASELINES.us_avg).toBeGreaterThan(BASELINES.global_avg);
    expect(BASELINES.paris_target).toBeGreaterThan(BASELINES.net_zero);
  });
});

describe('Calculator — Transport', () => {
  it('should calculate zero for cycling', () => {
    const result = calculateTransport({ commuteMode: 'bicycle', commuteDistance: 10, commuteDays: 5, flights: 0 });
    expect(result).toBe(0);
  });

  it('should increase with distance', () => {
    const short = calculateTransport({ commuteMode: 'car_petrol', commuteDistance: 5, commuteDays: 5, flights: 0 });
    const long = calculateTransport({ commuteMode: 'car_petrol', commuteDistance: 50, commuteDays: 5, flights: 0 });
    expect(long).toBeGreaterThan(short);
  });

  it('should include flights', () => {
    const noFlight = calculateTransport({ commuteMode: 'bicycle', commuteDistance: 0, commuteDays: 0, flights: 0 });
    const withFlight = calculateTransport({ commuteMode: 'bicycle', commuteDistance: 0, commuteDays: 0, flights: 2 });
    expect(withFlight).toBeGreaterThan(noFlight);
  });

  it('should handle missing/zero values gracefully', () => {
    const result = calculateTransport({});
    expect(result).toBe(result); // Should not be NaN
  });
});

describe('Calculator — Diet', () => {
  it('should return annual values', () => {
    const result = calculateDiet({ dietType: 'medium_meat' });
    expect(result).toBeGreaterThan(1000); // Should be > 1 tonne per year
  });

  it('should be lower for vegan than heavy meat', () => {
    const vegan = calculateDiet({ dietType: 'vegan' });
    const heavy = calculateDiet({ dietType: 'heavy_meat' });
    expect(heavy).toBeGreaterThan(vegan);
  });
});

describe('Calculator — Energy', () => {
  it('should decrease with renewable energy', () => {
    const noRenew = calculateEnergy({ homeSize: 'medium', heatingType: 'gas', renewablePercent: 0 });
    const fullRenew = calculateEnergy({ homeSize: 'medium', heatingType: 'gas', renewablePercent: 100 });
    expect(noRenew).toBeGreaterThan(fullRenew);
  });

  it('should increase with larger homes', () => {
    const small = calculateEnergy({ homeSize: 'studio', heatingType: 'gas', renewablePercent: 0 });
    const large = calculateEnergy({ homeSize: 'very_large', heatingType: 'gas', renewablePercent: 0 });
    expect(large).toBeGreaterThan(small);
  });
});

describe('Calculator — Shopping', () => {
  it('should increase with heavier habits', () => {
    const minimal = calculateShopping({ shoppingHabit: 'minimal', onlineOrders: 0 });
    const heavy = calculateShopping({ shoppingHabit: 'heavy', onlineOrders: 20 });
    expect(heavy).toBeGreaterThan(minimal);
  });
});

describe('Calculator — Total from Quiz', () => {
  it('should return all categories and total', () => {
    const result = calculateTotalFromQuiz({
      commuteMode: 'car_petrol', commuteDistance: 15, commuteDays: 5, flights: 2,
      dietType: 'medium_meat', homeSize: 'medium', heatingType: 'gas',
      renewablePercent: 0, shoppingHabit: 'moderate', onlineOrders: 4
    });
    expect(result.transport).toBeGreaterThan(0);
    expect(result.diet).toBeGreaterThan(0);
    expect(result.energy).toBeGreaterThan(0);
    expect(result.shopping).toBeGreaterThan(0);
    expect(result.total).toBe(result.transport + result.diet + result.energy + result.shopping);
  });
});

describe('Calculator — activityToCO2', () => {
  it('should calculate CO2 for a known activity', () => {
    const co2 = activityToCO2({ category: 'transport', type: 'car_petrol', amount: 10 });
    expect(co2).toBeCloseTo(1.92, 1);
  });

  it('should return 0 for unknown category', () => {
    expect(activityToCO2({ category: 'unknown', type: 'test', amount: 1 })).toBe(0);
  });

  it('should return 0 for unknown type', () => {
    expect(activityToCO2({ category: 'transport', type: 'spaceship', amount: 1 })).toBe(0);
  });

  it('should return 0 for zero amount', () => {
    expect(activityToCO2({ category: 'transport', type: 'car_petrol', amount: 0 })).toBe(0);
  });
});

describe('Calculator — Footprint Rating', () => {
  it('should return excellent for very low footprint', () => {
    expect(getFootprintRating(500).rating).toBe('excellent');
  });

  it('should return high for very high footprint', () => {
    expect(getFootprintRating(20000).rating).toBe('very_high');
  });

  it('should include color and label', () => {
    const r = getFootprintRating(5000);
    expect(r.color).toBeTruthy();
    expect(r.label).toBeTruthy();
  });
});
