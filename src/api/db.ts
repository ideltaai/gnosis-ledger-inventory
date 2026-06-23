import { getPool } from '../db/pool';

export type DatabaseHealth = 'not_configured' | 'connected' | 'error';

export async function healthCheck(): Promise<{ api: 'ok'; database: DatabaseHealth }> {
  if (!process.env.DATABASE_URL) return { api: 'ok', database: 'not_configured' };
  try {
    await getPool().query('select 1');
    return { api: 'ok', database: 'connected' };
  } catch {
    return { api: 'ok', database: 'error' };
  }
}
