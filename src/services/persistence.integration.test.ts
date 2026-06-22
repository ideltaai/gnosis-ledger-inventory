import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getPool } from '../db/pool';
import { runMigrations } from '../db/migrations';
import { upsertBin, upsertCategory, upsertLocation, upsertOrganization } from '../repositories/master-data';
import { createItem } from '../repositories/items';
import { getAvailableQuantity } from '../repositories/inventory';
import { allocateInventory, OverAllocationError } from './allocation';
import { receiveInventory } from './receiving';

const maybeDescribe = process.env.DATABASE_URL ? describe : describe.skip;

maybeDescribe('PostgreSQL inventory persistence', () => {
  let organizationId = '';
  let itemId = '';
  let binId = '';

  beforeAll(async () => {
    await runMigrations();
    const db = getPool();
    organizationId = await upsertOrganization(db, `Test Org ${randomUUID()}`);
    const categoryId = await upsertCategory(db, organizationId, 'Test Stock');
    const locationId = await upsertLocation(db, organizationId, 'Test Warehouse');
    binId = await upsertBin(db, locationId, 'T-01');
    itemId = (await createItem(db, { organizationId, categoryId, sku: randomUUID(), name: 'Test Item' })).id;
    await db.query("insert into stock_statuses (code, label) values ('available', 'Available') on conflict do nothing");
  });

  afterAll(async () => {
    if (process.env.DATABASE_URL) await getPool().end();
  });

  it('persists receiving and allocation in PostgreSQL', async () => {
    await receiveInventory({ organizationId, itemId, binId, quantity: 10, reference: 'test-receipt' });
    expect(await getAvailableQuantity(getPool(), itemId, binId)).toBe(10);

    const allocation = await allocateInventory({ organizationId, itemId, binId, quantity: 4 });
    expect(allocation.availableAfterAllocation).toBe(6);
    expect(await getAvailableQuantity(getPool(), itemId, binId)).toBe(6);
  });

  it('rejects over-allocation using real available quantity', async () => {
    await expect(allocateInventory({ organizationId, itemId, binId, quantity: 1_000 })).rejects.toBeInstanceOf(
      OverAllocationError,
    );
  });
});
