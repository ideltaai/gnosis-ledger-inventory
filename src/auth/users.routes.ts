import type { IncomingMessage, ServerResponse } from 'node:http';
import { readJson } from '../api/request';
import { sendJson } from '../api/responses';
import { getPool } from '../db/pool';
import { resetPasswordSchema } from './auth.schemas';
import { requireAdmin } from './permission-guard';
import { createUserSchema, updateUserSchema } from './users.schemas';
import {
  createInternalUser,
  deactivateUser,
  listRoles,
  listUsers,
  resetUserPassword,
  updateInternalUser,
} from './users.service';

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
    const user = await createInternalUser(createUserSchema.parse(await readJson(req)));
    if (!user) {
      sendJson(res, 400, { error: { code: 'USER_CREATE_FAILED', message: 'User could not be created.' } });
      return true;
    }
    sendJson(res, 201, user);
    return true;
  }

  const userId = routeUserId(url);
  if (userId && url.pathname === `/api/users/${userId}` && req.method === 'PATCH') {
    await requireAdmin(req);
    const user = await updateInternalUser(userId, updateUserSchema.parse(await readJson(req)));
    if (!user) {
      sendJson(res, 404, { error: { code: 'USER_NOT_FOUND', message: 'User not found.' } });
      return true;
    }
    sendJson(res, 200, user);
    return true;
  }

  if (userId && url.pathname === `/api/users/${userId}` && req.method === 'DELETE') {
    await requireAdmin(req);
    await deactivateUser(getPool(), userId);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (userId && url.pathname === `/api/users/${userId}/reset-password` && req.method === 'POST') {
    await requireAdmin(req);
    const body = resetPasswordSchema.omit({ userId: true }).parse(await readJson(req));
    await resetUserPassword(userId, body.newPassword);
    sendJson(res, 200, { ok: true });
    return true;
  }

  return false;
}

function routeUserId(url: URL): string | undefined {
  return url.pathname.split('/').at(3);
}
