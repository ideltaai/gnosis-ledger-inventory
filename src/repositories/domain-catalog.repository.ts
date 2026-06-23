import type { Db } from '../db/pool';

export async function listCategories(db: Db, organizationId: string) {
  return (await db.query('select * from categories where organization_id = $1 order by name', [organizationId])).rows;
}

export async function createCategory(db: Db, input: { organizationId: string; name: string; categoryType: string }) {
  const result = await db.query(
    `insert into categories (organization_id, name, category_type) values ($1, $2, $3) returning *`,
    [input.organizationId, input.name, input.categoryType],
  );
  return result.rows[0];
}

export async function updateCategory(db: Db, input: { id: string; name?: string; categoryType?: string; active?: boolean }) {
  const result = await db.query(
    `update categories set name = coalesce($2, name), category_type = coalesce($3, category_type), active = coalesce($4, active)
     where id = $1 returning *`,
    [input.id, input.name ?? null, input.categoryType ?? null, input.active ?? null],
  );
  return result.rows[0];
}

export async function listVendors(db: Db, organizationId: string) {
  return (await db.query('select * from vendors where organization_id = $1 order by name', [organizationId])).rows;
}

export async function createVendor(db: Db, input: { organizationId: string; name: string }) {
  const result = await db.query('insert into vendors (organization_id, name) values ($1, $2) returning *', [
    input.organizationId,
    input.name,
  ]);
  return result.rows[0];
}

export async function updateVendor(db: Db, input: { id: string; name?: string; active?: boolean }) {
  const result = await db.query('update vendors set name = coalesce($2, name), active = coalesce($3, active) where id = $1 returning *', [
    input.id,
    input.name ?? null,
    input.active ?? null,
  ]);
  return result.rows[0];
}
