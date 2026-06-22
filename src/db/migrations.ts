import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { getPool } from './pool';

const migrationsDir = new URL('./migrations', import.meta.url);

export async function runMigrations(): Promise<string[]> {
  const pool = getPool();
  await pool.query('create table if not exists schema_migrations (name text primary key, run_at timestamptz not null default now())');
  const files = (await readdir(migrationsDir)).filter((name) => name.endsWith('.sql')).sort();
  const applied: string[] = [];

  for (const file of files) {
    const exists = await pool.query('select 1 from schema_migrations where name = $1', [file]);
    if (exists.rowCount) continue;

    const sql = await readFile(join(migrationsDir.pathname, file), 'utf8');
    await pool.query('begin');
    try {
      await pool.query(sql);
      await pool.query('insert into schema_migrations (name) values ($1)', [file]);
      await pool.query('commit');
      applied.push(file);
    } catch (error) {
      await pool.query('rollback');
      throw error;
    }
  }

  return applied;
}
