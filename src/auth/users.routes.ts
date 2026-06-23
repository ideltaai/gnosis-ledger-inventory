import type { IncomingMessage, ServerResponse } from 'node:http';
import { getPool } from '../db/pool';
import { readJson } from '../api/request';
import { sendJson } from '../api/responses';
import { requireAdmin } from './permission-guard';
import { createUserSchema, updateUserSchema } from './users.schemas';
import { createInternalUser, deactivateUser, listRoles, listUsers, updateInternalUser } from './users.service';

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
    return sendJson(res, 201, await createInternalUser(createUserSchema.parse(await readJson(req))));
  }
  if (url.pathname.startsWith('/api/users/') && req.method === 'PATCH') {
    await requireAdmin(req);
    return sendJson(res, 200, await updateInternalUser(id(url), updateUserSchema.parse(await readJson(req))));
  }
  if (url.pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    await requireAdmin(req);
    await deactivateUser(getPool(), id(url));
    return sendJson(res, 200, { ok: true });
  }
  return false;
}

function id(url: URL) { return url.pathname.split('/').at(-1) ?? ''; }
