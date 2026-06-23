import type { Db } from '../db/pool';
import { findUserById } from './auth.repository';

export async function listUsers(db: Db) {
  return (await db.query(`select u.id, u.organization_id, u.name, u.email, u.status, r.name as role
    from users u left join user_roles ur on ur.user_id = u.id left join roles r on r.id = ur.role_id order by u.email`)).rows;
}

export async function createUser(db: Db, input: { organizationId: string; name: string; email: string; passwordHash: string; role: string }) {
  const user = await db.query<{ id: string }>(
    `insert into users (organization_id, name, display_name, email, password_hash, status)
     values ($1, $2, $2, $3, $4, 'active') returning id`,
    [input.organizationId, input.name, input.email.toLowerCase(), input.passwordHash],
  );
  await assignRole(db, user.rows[0].id, input.organizationId, input.role);
  return findUserById(db, user.rows[0].id);
}

export async function updateUser(db: Db, id: string, input: { name?: string; email?: string; role?: string; status?: string }) {
  const current = await findUserById(db, id);
  await db.query(
    `update users set name = coalesce($2, name), display_name = coalesce($2, display_name), email = coalesce($3, email), status = coalesce($4, status), updated_at = now() where id = $1`,
    [id, input.name ?? null, input.email?.toLowerCase() ?? null, input.status ?? null],
  );
  if (input.role && current) await assignRole(db, id, current.organization_id, input.role);
  return findUserById(db, id);
}

export async function deactivateUser(db: Db, id: string) {
  await db.query("update users set status = 'inactive', updated_at = now() where id = $1", [id]);
}

export async function listRoles(db: Db) {
  return (await db.query('select id, name from roles order by name')).rows;
}

async function assignRole(db: Db, userId: string, organizationId: string, role: string) {
  const roleResult = await db.query<{ id: string }>('select id from roles where organization_id = $1 and name = $2', [organizationId, role]);
  await db.query('delete from user_roles where user_id = $1', [userId]);
  await db.query('insert into user_roles (user_id, role_id) values ($1, $2)', [userId, roleResult.rows[0].id]);
}
