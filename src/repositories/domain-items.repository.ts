import type { Db } from '../db/pool';

export async function listItems(db: Db, input: { organizationId: string; search?: string }) {
  const result = await db.query(
    `select * from items where organization_id = $1 and ($2::text is null or sku ilike $2 or name ilike $2) order by sku`,
    [input.organizationId, input.search ? `%${input.search}%` : null],
  );
  return result.rows;
}

export async function getItemDetail(db: Db, id: string) {
  const result = await db.query('select * from items where id = $1', [id]);
  return result.rows[0];
}

export async function createDomainItem(db: Db, input: {
  organizationId: string;
  categoryId?: string;
  sku: string;
  name: string;
  uom?: string;
  attributes?: Record<string, unknown>;
  trackingMode: string;
}) {
  const result = await db.query(
    `insert into items (organization_id, category_id, sku, name, uom, attributes, tracking_mode)
     values ($1, $2, $3, $4, $5, $6, $7) returning *`,
    [input.organizationId, input.categoryId ?? null, input.sku, input.name, input.uom ?? 'ea', JSON.stringify(input.attributes ?? {}), input.trackingMode],
  );
  return result.rows[0];
}

export async function updateDomainItem(db: Db, input: { id: string; name?: string; attributes?: Record<string, unknown>; trackingMode?: string; active?: boolean }) {
  const result = await db.query(
    `update items set name = coalesce($2, name), attributes = coalesce($3, attributes),
      tracking_mode = coalesce($4, tracking_mode), active = coalesce($5, active) where id = $1 returning *`,
    [input.id, input.name ?? null, input.attributes ? JSON.stringify(input.attributes) : null, input.trackingMode ?? null, input.active ?? null],
  );
  return result.rows[0];
}

export async function upsertDomainItemVendorPrice(db: Db, input: { itemId: string; vendorId: string; unitCost: number; preferred?: boolean; vendorSku?: string; purchaseUnit?: string }) {
  const result = await db.query(
    `insert into item_vendor_pricing (item_id, vendor_id, price, preferred, vendor_sku, purchase_unit)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (item_id, vendor_id) do update set price = excluded.price, preferred = excluded.preferred,
       vendor_sku = excluded.vendor_sku, purchase_unit = excluded.purchase_unit returning *`,
    [input.itemId, input.vendorId, input.unitCost, input.preferred ?? false, input.vendorSku ?? null, input.purchaseUnit ?? 'each'],
  );
  return result.rows[0];
}
