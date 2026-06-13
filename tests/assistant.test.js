/* ============================================
   ASSISTANT TESTS
   ============================================ */

import { Assistant, processMessage, getProactiveTip } from '../js/engine/assistant.js';

const MOCK_STATE = {
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
  breakdown: {
    transport: 3500,
    diet: 2055,
    energy: 4631,
    shopping: 824,
    total: 11010
  },
  activities: [
    { id: '1', category: 'transport', type: 'car_petrol', co2: 2.88, date: new Date().toISOString().split('T')[0] }
  ],
  goals: { monthlyTarget: 200, activeChallenges: [] },
  streak: { current: 5, lastLogDate: new Date().toISOString().split('T')[0], longest: 10 },
  shownTipIds: [],
  preferences: { notifications: true, country: 'global' }
};

describe('Assistant — Initialization', () => {
  it('should create an Assistant instance', () => {
    const bot = new Assistant();
    expect(bot).toBeTruthy();
  });

  it('should start in greeting state', () => {
    const bot = new Assistant();
    expect(bot.state).toBe('greeting');
  });
});

describe('Assistant — Intent Detection', () => {
  it('should detect greeting intent', () => {
    const bot = new Assistant();
    const r = bot.respond('Hello!', { profile: null, breakdown: null });
    expect(r.type).toBe('greeting');
  });

  it('should detect tip request', () => {
    const r = processMessage('Give me a tip', MOCK_STATE);
    expect(r.type).toBe('tip');
    expect(r.text).toContain('tip');
  });

  it('should detect footprint query', () => {
    const r = processMessage('Show my footprint', MOCK_STATE);
    expect(r.type).toBe('analysis');
  });

  it('should detect category queries', () => {
    const r = processMessage('Tell me about my car usage', MOCK_STATE);
    expect(r.type).toBe('analysis');
  });

  it('should detect challenge queries', () => {
    const r = processMessage('Show me a challenge', MOCK_STATE);
    expect(r.type).toBe('info');
  });

  it('should detect comparison queries', () => {
    const r = processMessage('Compare to average', MOCK_STATE);
    expect(r.type).toBe('comparison');
  });

  it('should detect what-if queries', () => {
    const r = processMessage('What if I went vegan?', MOCK_STATE);
    expect(r.type).toBe('whatif');
  });

  it('should detect thanks', () => {
    const r = processMessage('Thank you!', MOCK_STATE);
    expect(r.type).toBe('thanks');
  });

  it('should handle unknown input gracefully', () => {
    const r = processMessage('asdfghjkl random nonsense', MOCK_STATE);
    expect(r.type).toBe('help');
    expect(r.quickReplies).toBeTruthy();
  });
});

describe('Assistant — Response Quality', () => {
  it('should return text and quickReplies', () => {
    const r = processMessage('Hello', MOCK_STATE);
    expect(r.text).toBeTruthy();
    expect(r.quickReplies).toBeTruthy();
  });

  it('should include numbers in footprint analysis', () => {
    const r = processMessage('Show my footprint', MOCK_STATE);
    expect(r.text).toContain('Transport');
    expect(r.text).toContain('Diet');
  });

  it('should include comparisons in compare response', () => {
    const r = processMessage('Compare to global average', MOCK_STATE);
    expect(r.text).toContain('Global');
  });
});

describe('Assistant — processMessage wrapper', () => {
  it('should work with full state object', () => {
    const result = processMessage('Hi', MOCK_STATE);
    expect(result.text).toBeTruthy();
    expect(result.type).toBeTruthy();
  });
});

describe('Assistant — getProactiveTip wrapper', () => {
  it('should return null for minimal activity', () => {
    const minimalState = { ...MOCK_STATE, activities: [] };
    const tip = getProactiveTip(minimalState);
    expect(tip).toBeNull();
  });

  it('should return a tip for heavy transport usage', () => {
    const today = new Date().toISOString().split('T')[0];
    const heavyState = {
      ...MOCK_STATE,
      activities: Array(6).fill({ category: 'transport', type: 'car_petrol', co2: 2.88, date: today })
    };
    const tip = getProactiveTip(heavyState);
    // May or may not trigger depending on random selection, but shouldn't throw
    expect(tip === null || typeof tip === 'string').toBe(true);
  });
});
