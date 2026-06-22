import { z } from 'zod';
import { withTransaction } from '../db/pool';
import { addInventoryUnit, addLedgerEntry } from '../repositories/inventory';
import { writeAuditLog } from '../repositories/operations';

export const receiveInputSchema = z.object({
  organizationId: z.string().uuid(),
  itemId: z.string().uuid(),
  binId: z.string().uuid(),
  quantity: z.number().positive(),
  reference: z.string().optional(),
});

export type ReceiveInput = z.infer<typeof receiveInputSchema>;

export async function receiveInventory(input: ReceiveInput) {
  return withTransaction(async (db) => {
    const unitId = await addInventoryUnit(db, input);
    const ledgerId = await addLedgerEntry(db, {
      ...input,
      txType: 'receive',
    });
    const auditId = await writeAuditLog(db, {
      organizationId: input.organizationId,
      action: 'inventory.received',
      entityType: 'inventory_unit',
      entityId: unitId,
      metadata: { itemId: input.itemId, binId: input.binId, ledgerId, quantity: input.quantity },
    });

    return { unitId, ledgerId, auditId };
  });
}
