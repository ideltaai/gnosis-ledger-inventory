import { describe, expect, it } from 'vitest';
import { calculateRemainingLength, rollMeasurementSchema } from './roll-measurement.service';

describe('calculateRemainingLength', () => {
  const base = {
    organizationId: '00000000-0000-4000-8000-000000000001',
    inventoryUnitId: '00000000-0000-4000-8000-000000000002',
    itemId: '00000000-0000-4000-8000-000000000003',
    binId: '00000000-0000-4000-8000-000000000004',
  };

  it('prefers manual remaining length', () => {
    const input = rollMeasurementSchema.parse({ ...base, manualRemainingLength: 42 });
    expect(calculateRemainingLength(input)).toEqual({ method: 'manual', remainingLength: 42 });
  });

  it('calculates length from diameter and build thickness', () => {
    const input = rollMeasurementSchema.parse({ ...base, outerDiameter: 10, coreDiameter: 2, buildThickness: 0.5 });
    expect(calculateRemainingLength(input)).toEqual({ method: 'diameter', remainingLength: 150.7964 });
  });
});
