import type { Db } from '../db/pool';

export async function createBarcodeMapping(db: Db, input: {
  organizationId: string;
  barcode: string;
  priority: string;
  itemId?: string;
  binId?: string;
}) {
  const result = await db.query(
    `insert into barcode_mappings (organization_id, barcode, priority, item_id, bin_id)
     values ($1, $2, $3, $4, $5)
     on conflict (barcode) do update set priority = excluded.priority, item_id = excluded.item_id, bin_id = excluded.bin_id returning *`,
    [input.organizationId, input.barcode, input.priority, input.itemId ?? null, input.binId ?? null],
  );
  return result.rows[0];
}

export async function lookupBarcode(db: Db, barcode: string) {
  const result = await db.query('select * from barcode_mappings where barcode = $1 and active = true', [barcode]);
  return result.rows[0] ?? { barcode, known: false, mappingRequired: true };
}
