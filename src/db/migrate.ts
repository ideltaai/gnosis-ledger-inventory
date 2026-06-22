import { getPool } from './pool';
import { runMigrations } from './migrations';

const applied = await runMigrations();
console.log(JSON.stringify({ applied }));
await getPool().end();
