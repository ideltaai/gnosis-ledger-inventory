import type { Db } from '../db/pool';

export async function listCategories(db: Db, organizationId: string) {
  return (await db.query('select id, name from categories where organization_id = $1 order by name', [organizationId])).rows;
}

export async function listVendors(db: Db, organizationId: string) {
  return (await db.query('select id, name from vendors where organization_id = $1 order by name', [organizationId])).rows;
}

export async function listItemVendorPricing(db: Db, itemId: string) {
  return (await db.query('select id, vendor_id, price, currency from item_vendor_pricing where item_id = $1', [itemId])).rows;
}

export async function listLocations(db: Db, organizationId: string) {
  return (await db.query('select id, name from locations where organization_id = $1 order by name', [organizationId])).rows;
}

export async function listBins(db: Db, locationId: string) {
  return (await db.query('select id, code from bins where location_id = $1 order by code', [locationId])).rows;
}

export async function listBarcodeMappings(db: Db, organizationId: string) {
  return (await db.query('select id, barcode, item_id, bin_id from barcode_mappings where organization_id = $1', [organizationId])).rows;
}
