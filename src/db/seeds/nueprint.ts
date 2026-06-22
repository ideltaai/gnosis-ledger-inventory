import { getPool, withTransaction, type Db } from '../pool';
import {
  grantPermission,
  upsertBin,
  upsertCategory,
  upsertLocation,
  upsertOrganization,
  upsertPermission,
  upsertRole,
  upsertVendor,
} from '../../repositories/master-data';
import { createItem, createItemVariant, upsertItemVendorPrice } from '../../repositories/items';

const categories = ['Roll Media', 'Rigid Substrates', 'Paper', 'Apparel', 'Inks', 'Maintenance', 'Consumables'];
const vendors = ['Grimco', 'Fellers', 'S-One', 'SanMar'];
const reasonCodes = [
  ['receive_po', 'Receive purchase order', 'receive'],
  ['cycle_count', 'Cycle count adjustment', 'adjustment'],
  ['job_allocation', 'Allocate to job', 'allocation'],
  ['damage', 'Damaged inventory', 'waste'],
];
const permissions = [
  ['inventory:read', 'Read inventory records'],
  ['inventory:write', 'Change inventory records'],
  ['admin:manage', 'Manage administrative settings'],
];

export async function runSeeds() {
  return withTransaction(async (db) => {
    const organizationId = await upsertOrganization(db, 'NuePrint');
    const permissionIds = new Map<string, string>();
    for (const [code, description] of permissions) permissionIds.set(code, await upsertPermission(db, code, description));

    const adminId = await upsertRole(db, organizationId, 'admin');
    const operationsId = await upsertRole(db, organizationId, 'operations');
    const viewerId = await upsertRole(db, organizationId, 'viewer');
    for (const id of permissionIds.values()) await grantPermission(db, adminId, id);
    await grantPermission(db, operationsId, permissionIds.get('inventory:read')!);
    await grantPermission(db, operationsId, permissionIds.get('inventory:write')!);
    await grantPermission(db, viewerId, permissionIds.get('inventory:read')!);

    for (const status of ['available', 'hold', 'allocated']) {
      await db.query('insert into stock_statuses (code, label) values ($1, $2) on conflict (code) do nothing', [
        status,
        status.replace('_', ' '),
      ]);
    }

    const categoryIds = new Map<string, string>();
    for (const category of categories) categoryIds.set(category, await upsertCategory(db, organizationId, category));
    const vendorIds = new Map<string, string>();
    for (const vendor of vendors) vendorIds.set(vendor, await upsertVendor(db, organizationId, vendor));

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

    await seedItems(db, organizationId, categoryIds, vendorIds);
    return { organizationId };
  });
}

async function seedItems(db: Db, organizationId: string, categoriesByName: Map<string, string>, vendorsByName: Map<string, string>) {
  const samples = [
    ['RM-54-MATTE', '54in Matte Vinyl Roll', 'Roll Media', 'Grimco', 185],
    ['RS-4X8-ACM', '4x8 ACM Panel', 'Rigid Substrates', 'Fellers', 62],
    ['PAPER-12PT-C2S', '12pt C2S Cover Paper', 'Paper', 'S-One', 48],
    ['APP-TEE-BLK', 'Black Cotton T-Shirt', 'Apparel', 'SanMar', 6.5],
    ['INK-CMYK-C', 'Cyan Printer Ink', 'Inks', 'Grimco', 94],
    ['MAINT-WIPES', 'Lint-Free Maintenance Wipes', 'Maintenance', 'Fellers', 18],
    ['CON-TAPE-APP', 'Application Tape', 'Consumables', 'Grimco', 32],
  ] as const;

  for (const [sku, name, category, vendor, price] of samples) {
    const item = await createItem(db, { organizationId, categoryId: categoriesByName.get(category), sku, name });
    await createItemVariant(db, { itemId: item.id, sku: `${sku}-STD`, name: `${name} Standard` });
    await upsertItemVendorPrice(db, item.id, vendorsByName.get(vendor)!, price);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runSeeds();
  await getPool().end();
}
