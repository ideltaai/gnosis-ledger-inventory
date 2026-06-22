import type { Db } from '../db/pool';

export async function upsertOrganization(db: Db, name: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    'insert into organizations (name) values ($1) on conflict (name) do update set name = excluded.name returning id',
    [name],
  );
  return result.rows[0].id;
}

export async function upsertPermission(db: Db, code: string, description: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into permissions (code, description) values ($1, $2)
     on conflict (code) do update set description = excluded.description returning id`,
    [code, description],
  );
  return result.rows[0].id;
}

export async function upsertRole(db: Db, organizationId: string, name: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into roles (organization_id, name) values ($1, $2)
     on conflict (organization_id, name) do update set name = excluded.name returning id`,
    [organizationId, name],
  );
  return result.rows[0].id;
}

export async function grantPermission(db: Db, roleId: string, permissionId: string): Promise<void> {
  await db.query('insert into role_permissions (role_id, permission_id) values ($1, $2) on conflict do nothing', [
    roleId,
    permissionId,
  ]);
}

export async function upsertCategory(db: Db, organizationId: string, name: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into categories (organization_id, name) values ($1, $2)
     on conflict (organization_id, name) do update set name = excluded.name returning id`,
    [organizationId, name],
  );
  return result.rows[0].id;
}

export async function upsertVendor(db: Db, organizationId: string, name: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into vendors (organization_id, name) values ($1, $2)
     on conflict (organization_id, name) do update set name = excluded.name returning id`,
    [organizationId, name],
  );
  return result.rows[0].id;
}

export async function upsertLocation(db: Db, organizationId: string, name: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into locations (organization_id, name) values ($1, $2)
     on conflict (organization_id, name) do update set name = excluded.name returning id`,
    [organizationId, name],
  );
  return result.rows[0].id;
}

export async function upsertBin(db: Db, locationId: string, code: string): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into bins (location_id, code) values ($1, $2)
     on conflict (location_id, code) do update set code = excluded.code returning id`,
    [locationId, code],
  );
  return result.rows[0].id;
}
