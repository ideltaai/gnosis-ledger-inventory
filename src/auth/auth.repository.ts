import type { Db } from '../db/pool';

export type AuthUser = { id: string; organization_id: string; name: string; email: string; password_hash: string; status: string; role: string; permissions: string[] };

export async function findUserByEmail(db: Db, email: string): Promise<AuthUser | undefined> {
  const result = await db.query<AuthUser>(userQuery('u.email = $1'), [email.toLowerCase()]);
  return result.rows[0];
}

export async function findUserById(db: Db, id: string): Promise<AuthUser | undefined> {
  const result = await db.query<AuthUser>(userQuery('u.id = $1'), [id]);
  return result.rows[0];
}

export async function touchLastLogin(db: Db, id: string) {
  await db.query('update users set last_login_at = now(), updated_at = now() where id = $1', [id]);
}

export async function updatePassword(db: Db, id: string, passwordHash: string) {
  await db.query('update users set password_hash = $2, updated_at = now() where id = $1', [id, passwordHash]);
}

function userQuery(where: string) {
  return `select u.id, u.organization_id, coalesce(u.name, u.display_name) as name, u.email, u.password_hash, u.status,
    r.name as role, coalesce(array_agg(distinct p.code) filter (where p.code is not null), '{}') as permissions
    from users u
    join user_roles ur on ur.user_id = u.id
    join roles r on r.id = ur.role_id
    left join role_permissions rp on rp.role_id = r.id
    left join permissions p on p.id = rp.permission_id
    where ${where}
    group by u.id, r.name`;
}
