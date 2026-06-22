import { z } from 'zod';
import { withTransaction } from '../db/pool';
import { getAvailableQuantity } from '../repositories/inventory';
import { createAllocation, writeAuditLog } from '../repositories/operations';

export const allocateInputSchema = z.object({
  organizationId: z.string().uuid(),
  itemId: z.string().uuid(),
  binId: z.string().uuid().optional(),
  quantity: z.number().positive(),
});

export class OverAllocationError extends Error {
  constructor(public readonly available: number) {
    super('Requested quantity exceeds available inventory.');
  }
}

export type AllocateInput = z.infer<typeof allocateInputSchema>;

export async function allocateInventory(input: AllocateInput) {
  return withTransaction(async (db) => {
    const available = await getAvailableQuantity(db, input.itemId, input.binId);
    if (available < input.quantity) throw new OverAllocationError(available);

    const allocationId = await createAllocation(db, input);
    const auditId = await writeAuditLog(db, {
      organizationId: input.organizationId,
      action: 'inventory.allocated',
      entityType: 'allocation',
      entityId: allocationId,
      metadata: { itemId: input.itemId, binId: input.binId, quantity: input.quantity, available },
    });

    return { allocationId, auditId, availableAfterAllocation: available - input.quantity };
  });
}
