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

export async function getItem(db: Db, id: string): Promise<ItemRow | undefined> {
  const result = await db.query<ItemRow>(
    'select id, organization_id, sku, name, uom from items where id = $1',
    [id],
  );
  return result.rows[0];
}
