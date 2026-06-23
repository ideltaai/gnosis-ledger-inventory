import type { IncomingMessage } from 'node:http';
import { getPool } from '../db/pool';
import { findUserById, type AuthUser } from './auth.repository';
import { verifySessionToken } from './session-token.service';

export class AuthError extends Error { status = 401; code = 'UNAUTHORIZED'; }
export class PermissionError extends Error { status = 403; code = 'FORBIDDEN'; }

export async function getCurrentUser(req: IncomingMessage): Promise<AuthUser | undefined> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  const payload = token ? verifySessionToken(token) : undefined;
  return payload ? findUserById(getPool(), payload.userId) : undefined;
}

export async function requireAuth(req: IncomingMessage) {
  const user = await getCurrentUser(req);
  if (!user || user.status !== 'active') throw new AuthError('Login required.');
  return user;
}

export async function requirePermission(req: IncomingMessage, permission: string) {
  const user = await requireAuth(req);
  if (!user.permissions.includes(permission)) throw new PermissionError('Permission required.');
  return user;
}

export async function requireAdmin(req: IncomingMessage) {
  const user = await requireAuth(req);
  if (user.role !== 'Admin') throw new PermissionError('Admin role required.');
  return user;
}
