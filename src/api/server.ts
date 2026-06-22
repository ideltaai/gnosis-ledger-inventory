import { createServer } from 'node:http';
import { z } from 'zod';
import { healthCheck } from './db';
import { sendError, sendJson } from './responses';
import { readEnv } from '../shared/env';

const itemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
});

export function createApiServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');

      if (req.method === 'OPTIONS') return sendJson(res, 204, {});
      if (req.method === 'GET' && url.pathname === '/api/health') {
        return sendJson(res, 200, { ok: true, checks: await healthCheck() });
      }
      if (req.method === 'POST' && url.pathname === '/api/items/validate') {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        return sendJson(res, 200, { item: itemSchema.parse(payload) });
      }

      return sendError(res, 404, 'NOT_FOUND', 'Route not found.');
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendJson(res, 400, {
          error: { code: 'BAD_REQUEST', message: 'Invalid request.', details: error.issues },
        });
      }
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Unexpected server error.');
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const env = readEnv();
  createApiServer().listen(env.API_PORT, () => {
    console.log(JSON.stringify({ message: 'api_started', port: env.API_PORT }));
  });
}
