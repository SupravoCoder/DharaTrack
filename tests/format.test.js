import { formatCO2, formatNumber, formatCurrency, relativeTime, today } from '../js/utils/format.js';

export const formatTests = {
  name: 'Format Utility Tests',
  tests: [
    {
      name: 'formatCO2 should format correctly',
      fn: () => {
        const t1 = formatCO2(500); // 500 kg
        const t2 = formatCO2(1500); // 1.5 t
        
        if (!t1.includes('500') || !t1.includes('kg')) throw new Error('Failed to format kg');
        if (!t2.includes('1.5') || !t2.includes('t')) throw new Error('Failed to format tonnes');
      }
    },
    {
      name: 'formatNumber should add commas',
      fn: () => {
        const num = formatNumber(1000000);
        if (num !== '1,000,000') throw new Error(`Expected 1,000,000, got ${num}`);
      }
    },
    {
      name: 'relativeTime should return string',
      fn: () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - 5);
        const rel = relativeTime(d.toISOString());
        if (!rel.includes('ago')) throw new Error('Failed to format relative time');
      }
    }
  ]
};
