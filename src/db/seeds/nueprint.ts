import { getPool, withTransaction } from '../pool';
import { upsertBin, upsertCategory, upsertLocation, upsertOrganization, upsertRole } from '../../repositories/master-data';

const categories = ['Paper', 'Ink', 'Toner', 'Bindery', 'Packaging'];
const reasonCodes = [
  ['receive_po', 'Receive purchase order', 'receive'],
  ['cycle_count', 'Cycle count adjustment', 'adjustment'],
  ['job_allocation', 'Allocate to job', 'allocation'],
  ['damage', 'Damaged inventory', 'waste'],
];

export async function runSeeds() {
  return withTransaction(async (db) => {
    const organizationId = await upsertOrganization(db, 'NuePrint');
    await upsertRole(db, organizationId, 'admin', ['*']);
    await upsertRole(db, organizationId, 'operations', ['inventory:read', 'inventory:write']);
    await upsertRole(db, organizationId, 'viewer', ['inventory:read']);

    for (const status of ['available', 'hold', 'allocated']) {
      await db.query('insert into stock_statuses (code, label) values ($1, $2) on conflict (code) do nothing', [
        status,
        status.replace('_', ' '),
      ]);
    }

    for (const category of categories) await upsertCategory(db, organizationId, category);
    for (const [code, label, category] of reasonCodes) {
      await db.query(
        `insert into reason_codes (organization_id, code, label, category) values ($1, $2, $3, $4)
         on conflict (organization_id, code) do update set label = excluded.label, category = excluded.category`,
        [organizationId, code, label, category],
      );
    }

    const warehouseId = await upsertLocation(db, organizationId, 'Main Warehouse');
    await upsertBin(db, warehouseId, 'A-01');
    await upsertBin(db, warehouseId, 'A-02');
    await upsertBin(db, warehouseId, 'RECEIVING');
    return { organizationId };
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runSeeds();
  await getPool().end();
}
