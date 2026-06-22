import { describe, expect, it } from 'vitest';
import { categoryWriteSchema, itemWriteSchema } from './domain.schemas';

describe('domain schemas', () => {
  it('accepts print-shop category types', () => {
    expect(categoryWriteSchema.parse({
      organizationId: '00000000-0000-4000-8000-000000000001',
      name: 'Roll Media',
      categoryType: 'roll_media',
    }).categoryType).toBe('roll_media');
  });

  it('requires supported item tracking modes', () => {
    expect(itemWriteSchema.safeParse({
      organizationId: '00000000-0000-4000-8000-000000000001',
      sku: 'RM-001',
      name: 'Roll Media',
      trackingMode: 'serial-tracked',
    }).success).toBe(false);
  });
});
