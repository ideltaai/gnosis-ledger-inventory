import type { Db } from '../db/pool';

export async function listLocations(db: Db, organizationId: string) {
  return (await db.query('select * from locations where organization_id = $1 order by name', [organizationId])).rows;
}

export async function createLocation(db: Db, input: { organizationId: string; name: string }) {
  const result = await db.query('insert into locations (organization_id, name) values ($1, $2) returning *', [
    input.organizationId,
    input.name,
  ]);
  return result.rows[0];
}

export async function listBinsForLocation(db: Db, locationId: string) {
  return (await db.query('select * from bins where location_id = $1 order by code', [locationId])).rows;
}

export async function createBin(db: Db, input: { locationId: string; code?: string }) {
  const code = input.code ?? (await generateBinCode(db, input.locationId));
  const result = await db.query('insert into bins (location_id, code) values ($1, $2) returning *', [input.locationId, code]);
  return result.rows[0];
}

export async function generateBinCode(db: Db, locationId: string) {
  const result = await db.query<{ next_number: string }>('select count(*) + 1 as next_number from bins where location_id = $1', [locationId]);
  return `BIN-${String(result.rows[0].next_number).padStart(3, '0')}`;
}

export async function findBinByCode(db: Db, code: string) {
  const result = await db.query('select * from bins where code = $1', [code]);
  return result.rows[0];
}
