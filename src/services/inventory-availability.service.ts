import type { Db } from '../db/pool';
import { selectInventoryAvailability } from '../repositories/inventory-availability.repository';

export async function calculateInventoryAvailability(db: Db, input: { itemId: string; binId?: string }) {
  const row = await selectInventoryAvailability(db, input);
  return {
    itemId: row.item_id,
    binId: row.bin_id,
    onHand: Number(row.on_hand),
    allocated: Number(row.allocated),
    available: Number(row.available),
  };
}
