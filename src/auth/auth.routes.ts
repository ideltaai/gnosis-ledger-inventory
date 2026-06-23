import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';
import { readJson } from '../api/request';
import { sendJson } from '../api/responses';
import { changePasswordSchema, loginSchema, resetPasswordSchema } from './auth.schemas';
import { changePassword, login, serializeUser } from './auth.service';
import { requireAdmin, requireAuth } from './permission-guard';
import { resetUserPassword } from './users.service';

export async function handleAuthRoutes(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = loginSchema.parse(await readJson(req));
    return sendJson(res, 200, await login(body.email, body.password));
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') return sendJson(res, 200, { ok: true });
  if (req.method === 'GET' && url.pathname === '/api/auth/me') return sendJson(res, 200, { user: serializeUser(await requireAuth(req)) });
  if (req.method === 'POST' && url.pathname === '/api/auth/change-password') {
    const body = changePasswordSchema.parse(await readJson(req));
    await changePassword(await requireAuth(req), body.currentPassword, body.newPassword);
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/reset-password') {
    await requireAdmin(req);
    const body = resetPasswordSchema.parse(await readJson(req));
    await resetUserPassword(body.userId, body.newPassword);
    return sendJson(res, 200, { ok: true });
  }
  return false;
}

export function isAuthValidation(error: unknown) { return error instanceof z.ZodError; }
