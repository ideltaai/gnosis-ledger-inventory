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
import { permissionKeys, rolePermissions } from '../../auth/permissions';
import { hashPassword } from '../../auth/password-hashing.service';

const categories = ['Roll Media', 'Rigid Substrates', 'Paper', 'Apparel', 'Inks', 'Maintenance', 'Consumables'];
const vendors = ['Grimco', 'Fellers', 'S-One', 'SanMar'];
const reasonCodes = [
  ['receive_po', 'Receive purchase order', 'receive'],
  ['cycle_count', 'Cycle count adjustment', 'adjustment'],
  ['job_allocation', 'Allocate to job', 'allocation'],
  ['damage', 'Damaged inventory', 'waste'],
];
const permissions = permissionKeys.map((key) => [key, `Allows ${key}`]);

export async function runSeeds() {
  return withTransaction(async (db) => {
    const organizationId = await upsertOrganization(db, 'NuePrint');
    const permissionIds = new Map<string, string>();
    for (const [code, description] of permissions) permissionIds.set(code, await upsertPermission(db, code, description));

    const roleIds = new Map<string, string>();
    for (const role of Object.keys(rolePermissions)) roleIds.set(role, await upsertRole(db, organizationId, role));
    for (const [role, keys] of Object.entries(rolePermissions)) {
      for (const key of keys) await grantPermission(db, roleIds.get(role)!, permissionIds.get(key)!);
    }
    await seedAdminUser(db, organizationId, roleIds.get('Admin')!);

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


async function seedAdminUser(db: Db, organizationId: string, roleId: string) {
  const email = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@nueprint.local';
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const user = await db.query<{ id: string }>(
    `insert into users (organization_id, name, display_name, email, password_hash, status)
     values ($1, 'NuePrint Admin', 'NuePrint Admin', $2, $3, 'active')
     on conflict (email) do update set password_hash = excluded.password_hash, status = 'active' returning id`,
    [organizationId, email, await hashPassword(password)],
  );
  await db.query('delete from user_roles where user_id = $1', [user.rows[0].id]);
  await db.query('insert into user_roles (user_id, role_id) values ($1, $2)', [user.rows[0].id, roleId]);
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
