import { z } from 'zod';
import { withTransaction } from '../db/pool';
import { addLedgerEntry } from '../repositories/inventory';
import { createAllocation, writeAuditLog } from '../repositories/operations';
import { calculateInventoryAvailability } from './inventory-availability.service';

export const allocateInputSchema = z.object({
  organizationId: z.string().uuid(),
  itemId: z.string().uuid(),
  binId: z.string().uuid().optional(),
  quantity: z.number().positive(),
  reference: z.string().optional(),
});

export class OverAllocationError extends Error {
  constructor(public readonly available: number) {
    super('Requested quantity exceeds available inventory.');
  }
}

export type AllocateInput = z.infer<typeof allocateInputSchema>;

export async function allocateInventory(input: AllocateInput) {
  return withTransaction(async (db) => {
    const availability = await calculateInventoryAvailability(db, input);
    if (availability.available < input.quantity) throw new OverAllocationError(availability.available);

    const allocationId = await createAllocation(db, input);
    const ledgerId = await addLedgerEntry(db, { ...input, txType: 'allocate', quantity: -input.quantity });
    const auditId = await writeAuditLog(db, {
      organizationId: input.organizationId,
      action: 'inventory.allocated',
      entityType: 'allocation',
      entityId: allocationId,
      metadata: { itemId: input.itemId, binId: input.binId, ledgerId, quantity: input.quantity, availability },
    });

    return { allocationId, ledgerId, auditId, availableAfterAllocation: availability.available - input.quantity };
  });
}
