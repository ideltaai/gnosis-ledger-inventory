import type { Db } from '../db/pool';

export async function getAvailableQuantity(db: Db, itemId: string, binId?: string): Promise<number> {
  const result = await db.query<{ available: string }>(
    `select coalesce(sum(quantity), 0) -
      coalesce((select sum(quantity) from allocations where item_id = $1 and status = 'open' and ($2::uuid is null or bin_id = $2)), 0) as available
     from inventory_units where item_id = $1 and status = 'available' and ($2::uuid is null or bin_id = $2)`,
    [itemId, binId ?? null],
  );
  return Number(result.rows[0].available);
}

export async function addInventoryUnit(db: Db, input: {
  organizationId: string;
  itemId: string;
  binId: string;
  quantity: number;
  status?: string;
}): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into inventory_units (organization_id, item_id, bin_id, quantity, status)
     values ($1, $2, $3, $4, $5) returning id`,
    [input.organizationId, input.itemId, input.binId, input.quantity, input.status ?? 'available'],
  );
  return result.rows[0].id;
}

export async function addLedgerEntry(db: Db, input: {
  organizationId: string;
  itemId: string;
  binId?: string;
  txType: string;
  quantity: number;
  reference?: string;
}): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into inventory_ledger (organization_id, item_id, bin_id, tx_type, quantity, reference)
     values ($1, $2, $3, $4, $5, $6) returning id`,
    [input.organizationId, input.itemId, input.binId ?? null, input.txType, input.quantity, input.reference ?? null],
  );
  return result.rows[0].id;
}
