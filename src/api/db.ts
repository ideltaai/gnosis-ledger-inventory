import pg from 'pg';
import { readEnv } from '../shared/env';

let pool: pg.Pool | undefined;

export function getPool(): pg.Pool | undefined {
  const env = readEnv();
  if (!env.DATABASE_URL) return undefined;

  pool ??= new pg.Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    max: 10,
  });

  return pool;
}

export async function healthCheck(): Promise<{ database: 'not_configured' | 'ok' }> {
  const client = getPool();
  if (!client) return { database: 'not_configured' };

  await client.query('select 1');
  return { database: 'ok' };
}
