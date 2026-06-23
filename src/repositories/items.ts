import type { Db } from '../db/pool';

export type ItemRow = { id: string; organization_id: string; sku: string; name: string; uom: string };

export async function createItem(db: Db, input: {
  organizationId: string;
  categoryId?: string;
  sku: string;
  name: string;
  uom?: string;
}): Promise<ItemRow> {
  const result = await db.query<ItemRow>(
    `insert into items (organization_id, category_id, sku, name, uom)
     values ($1, $2, $3, $4, $5)
     on conflict (organization_id, sku) do update set name = excluded.name, uom = excluded.uom
     returning id, organization_id, sku, name, uom`,
    [input.organizationId, input.categoryId ?? null, input.sku, input.name, input.uom ?? 'ea'],
  );
  return result.rows[0];
}

export async function createItemVariant(db: Db, input: {
  itemId: string;
  sku: string;
  name: string;
  attributes?: Record<string, unknown>;
}): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into item_variants (item_id, sku, name, attributes) values ($1, $2, $3, $4)
     on conflict (sku) do update set name = excluded.name, attributes = excluded.attributes returning id`,
    [input.itemId, input.sku, input.name, JSON.stringify(input.attributes ?? {})],
  );
  return result.rows[0].id;
}

export async function upsertItemVendorPrice(db: Db, itemId: string, vendorId: string, price: number): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into item_vendor_pricing (item_id, vendor_id, price) values ($1, $2, $3)
     on conflict (item_id, vendor_id) do update set price = excluded.price returning id`,
    [itemId, vendorId, price],
  );
  return result.rows[0].id;
}
