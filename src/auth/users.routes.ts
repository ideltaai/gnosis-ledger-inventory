import type { IncomingMessage, ServerResponse } from 'node:http';
import { getPool } from '../db/pool';
import { readJson } from '../api/request';
import { sendError, sendJson } from '../api/responses';
import { requireAdmin } from './permission-guard';
import { createUserSchema, resetUserPasswordSchema, updateUserSchema } from './users.schemas';
import { createInternalUser, deactivateUser, listRoles, listUsers, resetUserPassword, updateInternalUser } from './users.service';

export async function handleUsersRoutes(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (url.pathname === '/api/roles' && req.method === 'GET') {
    await requireAdmin(req);
    return sendJson(res, 200, await listRoles(getPool()));
  }
  if (url.pathname === '/api/users' && req.method === 'GET') {
    await requireAdmin(req);
    return sendJson(res, 200, await listUsers(getPool()));
  }
  if (url.pathname === '/api/users' && req.method === 'POST') {
    await requireAdmin(req);
    const created = await createInternalUser(createUserSchema.parse(await readJson(req)));
    return created ? sendJson(res, 201, created) : sendError(res, 500, 'USER_CREATE_FAILED', 'User could not be created.');
  }
  if (isUserPasswordResetRoute(url) && req.method === 'POST') {
    await requireAdmin(req);
    const body = resetUserPasswordSchema.parse(await readJson(req));
    await resetUserPassword(userId(url), body.newPassword);
    return sendJson(res, 200, { ok: true });
  }
  if (url.pathname.startsWith('/api/users/') && req.method === 'PATCH') {
    await requireAdmin(req);
    const updated = await updateInternalUser(userId(url), updateUserSchema.parse(await readJson(req)));
    return updated ? sendJson(res, 200, updated) : sendError(res, 404, 'USER_NOT_FOUND', 'User not found.');
  }
  if (url.pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    await requireAdmin(req);
    await deactivateUser(getPool(), userId(url));
    return sendJson(res, 200, { ok: true });
  }
  return false;
}

function isUserPasswordResetRoute(url: URL) {
  const parts = url.pathname.split('/');
  return parts[1] === 'api' && parts[2] === 'users' && Boolean(parts[3]) && parts[4] === 'reset-password';
}

function userId(url: URL) {
  return url.pathname.split('/')[3] ?? '';
}
