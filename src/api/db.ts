import { getPool } from '../db/pool';

export async function healthCheck(): Promise<{ database: 'not_configured' | 'ok' }> {
  if (!process.env.DATABASE_URL) return { database: 'not_configured' };
  await getPool().query('select 1');
  return { database: 'ok' };
}
