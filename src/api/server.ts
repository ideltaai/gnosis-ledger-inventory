import { createServer } from 'node:http';
import { z } from 'zod';
import { healthCheck } from './db';
import { sendError, sendJson } from './responses';
import { readEnv } from '../shared/env';
import { allocateInputSchema, allocateInventory, OverAllocationError } from '../services/allocation';
import { receiveInputSchema, receiveInventory } from '../services/receiving';

async function readJson(req: AsyncIterable<Uint8Array>): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export function createApiServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      if (req.method === 'OPTIONS') return sendJson(res, 204, {});
      if (req.method === 'GET' && url.pathname === '/api/health') {
        return sendJson(res, 200, { ok: true, checks: await healthCheck() });
      }
      if (req.method === 'POST' && url.pathname === '/api/receiving') {
        const result = await receiveInventory(receiveInputSchema.parse(await readJson(req)));
        return sendJson(res, 201, result);
      }
      if (req.method === 'POST' && url.pathname === '/api/allocations') {
        const result = await allocateInventory(allocateInputSchema.parse(await readJson(req)));
        return sendJson(res, 201, result);
      }
      return sendError(res, 404, 'NOT_FOUND', 'Route not found.');
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendJson(res, 400, {
          error: { code: 'BAD_REQUEST', message: 'Invalid request.', details: error.issues },
        });
      }
      if (error instanceof OverAllocationError) {
        return sendJson(res, 409, {
          error: { code: 'OVER_ALLOCATED', message: error.message, available: error.available },
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
