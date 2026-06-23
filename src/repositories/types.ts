import type { Db } from '../db/pool';

export type RepositoryContext = { db: Db };
export type IdRow = { id: string };
