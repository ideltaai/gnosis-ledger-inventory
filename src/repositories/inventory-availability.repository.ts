import type { Db } from '../db/pool';

export type InventoryAvailabilityRow = {
  item_id: string;
  bin_id: string | null;
  on_hand: string;
  allocated: string;
  available: string;
};

export async function selectInventoryAvailability(db: Db, input: { itemId: string; binId?: string }) {
  const result = await db.query<InventoryAvailabilityRow>(
    `select $1::uuid as item_id, $2::uuid as bin_id,
      coalesce((select sum(quantity) from inventory_units
        where item_id = $1 and status = 'available' and ($2::uuid is null or bin_id = $2)), 0) as on_hand,
      coalesce((select sum(quantity) from allocations
        where item_id = $1 and status = 'open' and ($2::uuid is null or bin_id = $2)), 0) as allocated`,
    [input.itemId, input.binId ?? null],
  );
  const row = result.rows[0];
  const available = Number(row.on_hand) - Number(row.allocated);
  return { ...row, available: String(available) };
}
