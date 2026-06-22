import { describe, expect, it } from 'vitest';
import { readEnv } from './env';

describe('readEnv', () => {
  it('defaults local development values', () => {
    expect(readEnv({})).toMatchObject({ API_PORT: 4317, NODE_ENV: 'development' });
  });

  it('accepts a PostgreSQL connection URL', () => {
    expect(readEnv({ DATABASE_URL: 'postgres://user:pass@localhost:5432/app' }).DATABASE_URL).toBe(
      'postgres://user:pass@localhost:5432/app',
    );
  });
});
