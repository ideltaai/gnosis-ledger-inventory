import type { Db } from '../db/pool';

export async function listOrganizations(db: Db) {
  return (await db.query('select id, name from organizations order by name')).rows;
}

export async function listUsers(db: Db, organizationId: string) {
  return (await db.query('select id, email, display_name from users where organization_id = $1', [organizationId])).rows;
}

export async function listRoles(db: Db, organizationId: string) {
  return (await db.query('select id, name from roles where organization_id = $1', [organizationId])).rows;
}

export async function listPermissions(db: Db) {
  return (await db.query('select id, code, description from permissions order by code')).rows;
}

export async function listReasonCodes(db: Db, organizationId: string) {
  return (await db.query('select id, code, label, category from reason_codes where organization_id = $1', [organizationId])).rows;
}

export async function listJobs(db: Db, organizationId: string) {
  return (await db.query('select id, job_number, name from jobs where organization_id = $1', [organizationId])).rows;
}
