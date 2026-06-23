import { getPool } from '../db/pool';
import { findUserByEmail, updatePassword, touchLastLogin, type AuthUser } from './auth.repository';
import { hashPassword, verifyPassword } from './password-hashing.service';
import { AuthError } from './permission-guard';
import { createSessionToken } from './session-token.service';

export function serializeUser(user: AuthUser) {
  return { id: user.id, organizationId: user.organization_id, name: user.name, email: user.email, role: user.role, permissions: user.permissions };
}

export async function login(email: string, password: string) {
  const db = getPool();
  const user = await findUserByEmail(db, email);
  if (!user || user.status !== 'active' || !user.password_hash) throw new AuthError('Invalid email or password.');
  if (!(await verifyPassword(password, user.password_hash))) throw new AuthError('Invalid email or password.');
  await touchLastLogin(db, user.id);
  return { user: serializeUser(user), token: createSessionToken({ userId: user.id, role: user.role, permissions: user.permissions }) };
}

export async function changePassword(user: AuthUser, currentPassword: string, newPassword: string) {
  if (!(await verifyPassword(currentPassword, user.password_hash))) throw new Error('Current password is incorrect.');
  await updatePassword(getPool(), user.id, await hashPassword(newPassword));
}
