import { describe, expect, it } from 'vitest';
import { calculateRollLength } from './roll-calculator';

describe('calculateRollLength', () => {
  it('calculates roll length without persistence side effects', () => {
    expect(calculateRollLength({ outerDiameter: 10, coreDiameter: 2, thickness: 0.5, width: 12 })).toBe(150.7964);
  });
});
