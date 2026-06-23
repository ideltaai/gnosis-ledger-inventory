import { z } from 'zod';

export const organizationQuerySchema = z.object({ organizationId: z.string().uuid() });
export const categoryTypeSchema = z.enum([
  'roll_media', 'rigid_substrates', 'paper', 'apparel', 'inks', 'maintenance_items', 'consumables', 'accessories', 'machines_work_centers',
]);
export const categoryWriteSchema = z.object({ organizationId: z.string().uuid(), name: z.string().min(1), categoryType: categoryTypeSchema });
export const categoryUpdateSchema = z.object({ name: z.string().min(1).optional(), categoryType: categoryTypeSchema.optional(), active: z.boolean().optional() });
export const itemWriteSchema = z.object({ organizationId: z.string().uuid(), categoryId: z.string().uuid().optional(), sku: z.string().min(1), name: z.string().min(1), uom: z.string().optional(), attributes: z.record(z.string(), z.unknown()).optional(), trackingMode: z.enum(['unit-tracked', 'bulk-tracked']) });
export const itemUpdateSchema = z.object({ name: z.string().min(1).optional(), attributes: z.record(z.string(), z.unknown()).optional(), trackingMode: z.enum(['unit-tracked', 'bulk-tracked']).optional(), active: z.boolean().optional() });
export const vendorWriteSchema = z.object({ organizationId: z.string().uuid(), name: z.string().min(1) });
export const vendorUpdateSchema = z.object({ name: z.string().min(1).optional(), active: z.boolean().optional() });
export const pricingSchema = z.object({ itemId: z.string().uuid(), vendorId: z.string().uuid(), unitCost: z.number().nonnegative(), preferred: z.boolean().optional(), vendorSku: z.string().optional(), purchaseUnit: z.string().optional() });
export const locationWriteSchema = z.object({ organizationId: z.string().uuid(), name: z.string().min(1) });
export const binWriteSchema = z.object({ locationId: z.string().uuid(), code: z.string().optional() });
export const barcodeSchema = z.object({ organizationId: z.string().uuid(), barcode: z.string().min(1), priority: z.enum(['internal_unit', 'internal_sku', 'vendor_barcode']), itemId: z.string().uuid().optional(), binId: z.string().uuid().optional() });
export const jobWriteSchema = z.object({ organizationId: z.string().uuid(), jobNumber: z.string().min(1), name: z.string().min(1), clientName: z.string().min(1), dueDate: z.string().optional(), externalReference: z.string().optional() });
export const reasonCodeSchema = z.object({ organizationId: z.string().uuid(), code: z.string().min(1), label: z.string().min(1), category: z.enum(['waste', 'adjustment', 'cycle_count', 'damage', 'scrap', 'quarantine', 'allocation', 'receive']) });
