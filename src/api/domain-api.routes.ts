import type { IncomingMessage, ServerResponse } from 'node:http';
import { getPool, withTransaction, type Db } from '../db/pool';
import { createBarcodeMapping, lookupBarcode } from '../repositories/barcode-mapping.repository';
import { createCategory, createVendor, listCategories, listVendors, updateCategory, updateVendor } from '../repositories/domain-catalog.repository';
import { createDomainItem, getItemDetail, listItems, updateDomainItem, upsertDomainItemVendorPrice } from '../repositories/domain-items.repository';
import { createBin, createLocation, findBinByCode, generateBinCode, listBinsForLocation, listLocations } from '../repositories/domain-locations.repository';
import { createJob, getJob, listJobs } from '../repositories/jobs.repository';
import { upsertReasonCode, listReasonCodes } from '../repositories/reason-codes.repository';
import { writeAuditLog } from '../repositories/operations';
import { sendJson } from './responses';
import { readJson } from './request';
import {
  barcodeSchema,
  binWriteSchema,
  categoryUpdateSchema,
  categoryWriteSchema,
  itemUpdateSchema,
  itemWriteSchema,
  jobWriteSchema,
  locationWriteSchema,
  organizationQuerySchema,
  pricingSchema,
  reasonCodeSchema,
  vendorUpdateSchema,
  vendorWriteSchema,
} from '../services/domain.schemas';
import { rollMeasurementSchema, saveRollMeasurement } from '../services/roll-measurement.service';

export async function handleDomainApi(req: IncomingMessage, res: ServerResponse, url: URL) {
  const db = getPool();
  if (req.method === 'GET' && url.pathname === '/api/categories') return sendJson(res, 200, await listCategories(db, org(url)));
  if (req.method === 'POST' && url.pathname === '/api/categories') return sendJson(res, 201, await audited('category.created', 'category', async (tx) => createCategory(tx, categoryWriteSchema.parse(await readJson(req)))));
  if (req.method === 'PATCH' && url.pathname.startsWith('/api/categories/')) return sendJson(res, 200, await audited('category.updated', 'category', async (tx) => updateCategory(tx, { id: id(url), ...categoryUpdateSchema.parse(await readJson(req)) })));
  if (req.method === 'DELETE' && url.pathname.startsWith('/api/categories/')) return sendJson(res, 200, await audited('category.deactivated', 'category', async (tx) => updateCategory(tx, { id: id(url), active: false })));

  if (req.method === 'GET' && url.pathname === '/api/items') return sendJson(res, 200, await listItems(db, { organizationId: org(url), search: url.searchParams.get('search') ?? undefined }));
  if (req.method === 'GET' && url.pathname.startsWith('/api/items/')) return sendJson(res, 200, await getItemDetail(db, id(url)));
  if (req.method === 'POST' && url.pathname === '/api/items') return sendJson(res, 201, await audited('item.created', 'item', async (tx) => createDomainItem(tx, itemWriteSchema.parse(await readJson(req)))));
  if (req.method === 'PATCH' && url.pathname.startsWith('/api/items/')) return sendJson(res, 200, await audited('item.updated', 'item', async (tx) => updateDomainItem(tx, { id: id(url), ...itemUpdateSchema.parse(await readJson(req)) })));
  if (req.method === 'POST' && url.pathname === '/api/item-vendor-pricing') return sendJson(res, 201, await audited('pricing.upserted', 'item_vendor_pricing', async (tx) => upsertDomainItemVendorPrice(tx, pricingSchema.parse(await readJson(req)))));

  if (req.method === 'GET' && url.pathname === '/api/vendors') return sendJson(res, 200, await listVendors(db, org(url)));
  if (req.method === 'POST' && url.pathname === '/api/vendors') return sendJson(res, 201, await audited('vendor.created', 'vendor', async (tx) => createVendor(tx, vendorWriteSchema.parse(await readJson(req)))));
  if (req.method === 'PATCH' && url.pathname.startsWith('/api/vendors/')) return sendJson(res, 200, await audited('vendor.updated', 'vendor', async (tx) => updateVendor(tx, { id: id(url), ...vendorUpdateSchema.parse(await readJson(req)) })));

  if (req.method === 'GET' && url.pathname === '/api/locations') return sendJson(res, 200, await listLocations(db, org(url)));
  if (req.method === 'POST' && url.pathname === '/api/locations') return sendJson(res, 201, await audited('location.created', 'location', async (tx) => createLocation(tx, locationWriteSchema.parse(await readJson(req)))));
  if (req.method === 'GET' && url.pathname === '/api/bins') return sendJson(res, 200, await listBinsForLocation(db, required(url, 'locationId')));
  if (req.method === 'POST' && url.pathname === '/api/bins') return sendJson(res, 201, await audited('bin.created', 'bin', async (tx) => createBin(tx, binWriteSchema.parse(await readJson(req)))));
  if (req.method === 'GET' && url.pathname === '/api/bins/generate-code') return sendJson(res, 200, { code: await generateBinCode(db, required(url, 'locationId')) });
  if (req.method === 'GET' && url.pathname === '/api/bins/lookup') return sendJson(res, 200, await findBinByCode(db, required(url, 'code')));

  if (req.method === 'POST' && url.pathname === '/api/barcodes') return sendJson(res, 201, await audited('barcode.mapped', 'barcode_mapping', async (tx) => createBarcodeMapping(tx, barcodeSchema.parse(await readJson(req)))));
  if (req.method === 'GET' && url.pathname === '/api/barcodes/lookup') return sendJson(res, 200, await lookupBarcode(db, required(url, 'barcode')));

  if (req.method === 'GET' && url.pathname === '/api/jobs') return sendJson(res, 200, await listJobs(db, org(url)));
  if (req.method === 'GET' && url.pathname.startsWith('/api/jobs/')) return sendJson(res, 200, await getJob(db, id(url)));
  if (req.method === 'POST' && url.pathname === '/api/jobs') return sendJson(res, 201, await audited('job.created', 'job', async (tx) => createJob(tx, jobWriteSchema.parse(await readJson(req)))));

  if (req.method === 'GET' && url.pathname === '/api/reason-codes') return sendJson(res, 200, await listReasonCodes(db, org(url)));
  if (req.method === 'POST' && url.pathname === '/api/reason-codes') return sendJson(res, 201, await audited('reason_code.upserted', 'reason_code', async (tx) => upsertReasonCode(tx, reasonCodeSchema.parse(await readJson(req)))));
  if (req.method === 'POST' && url.pathname === '/api/roll-measurements') return sendJson(res, 201, await saveRollMeasurement(rollMeasurementSchema.parse(await readJson(req))));

  return false;
}

async function audited(action: string, entityType: string, write: (db: Db) => Promise<Record<string, unknown>>) {
  return withTransaction(async (db) => {
    const row = await write(db);
    const organizationId = row.organization_id ? String(row.organization_id) : undefined;
    if (!organizationId) {
      throw new Error(`Cannot write audit log for ${entityType} without organization_id`);
    }
    await writeAuditLog(db, { organizationId, action, entityType, entityId: String(row.id), metadata: row });
    return row;
  });
}

function org(url: URL) {
  return organizationQuerySchema.parse(Object.fromEntries(url.searchParams)).organizationId;
}

function id(url: URL) {
  return url.pathname.split('/').at(-1) ?? '';
}

function required(url: URL, key: string) {
  const value = url.searchParams.get(key);
  if (!value) throw new Error(`${key} is required.`);
  return value;
}
