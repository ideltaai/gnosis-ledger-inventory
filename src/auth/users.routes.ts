import type { IncomingMessage, ServerResponse } from 'node:http';
import { getPool } from '../db/pool';
import { readJson } from '../api/request';
import { sendError, sendJson } from '../api/responses';
import { requireAdmin } from './permission-guard';
import { createUserSchema, resetUserPasswordSchema, updateUserSchema } from './users.schemas';
import { createInternalUser, deactivateUser, listRoles, listUsers, resetUserPassword, updateInternalUser } from './users.service';

export async function handleUsersRoutes(req: IncomingMessage, res: ServerResponse, url: URL): Promise<boolean> {
  if (url.pathname === '/api/roles' && req.method === 'GET') {
    await requireAdmin(req);
    sendJson(res, 200, await listRoles(getPool()));
    return true;
  }
  if (url.pathname === '/api/users' && req.method === 'GET') {
    await requireAdmin(req);
    sendJson(res, 200, await listUsers(getPool()));
    return true;
  }
  if (url.pathname === '/api/users' && req.method === 'POST') {
    await requireAdmin(req);
    const created = await createInternalUser(createUserSchema.parse(await readJson(req)));
    if (!created) {
      sendError(res, 500, 'USER_CREATE_FAILED', 'User could not be created.');
      return true;
    }
    sendJson(res, 201, { ...created });
    return true;
  }
  if (isUserPasswordResetRoute(url) && req.method === 'POST') {
    await requireAdmin(req);
    const body = resetUserPasswordSchema.parse(await readJson(req));
    await resetUserPassword(userId(url), body.newPassword);
    sendJson(res, 200, { ok: true });
    return true;
  }
  if (url.pathname.startsWith('/api/users/') && req.method === 'PATCH') {
    await requireAdmin(req);
    const updated = await updateInternalUser(userId(url), updateUserSchema.parse(await readJson(req)));
    if (!updated) {
      sendError(res, 404, 'USER_NOT_FOUND', 'User not found.');
      return true;
    }
    sendJson(res, 200, { ...updated });
    return true;
  }
  if (url.pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    await requireAdmin(req);
    await deactivateUser(getPool(), userId(url));
    sendJson(res, 200, { ok: true });
    return true;
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
