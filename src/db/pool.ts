import pg from 'pg';
import { readEnv } from '../shared/env';

let pool: pg.Pool | undefined;

export type Db = pg.Pool | pg.PoolClient;

export function getPool(): pg.Pool {
  const env = readEnv();
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required for database operations.');

  pool ??= new pg.Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    max: 10,
  });

  return pool;
}

export async function withTransaction<T>(work: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    const result = await work(client);
    await client.query('commit');
    return result;
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}
