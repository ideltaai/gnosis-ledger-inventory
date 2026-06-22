import { z } from 'zod';
import { withTransaction } from '../db/pool';
import { addLedgerEntry } from '../repositories/inventory';
import { writeAuditLog } from '../repositories/operations';

export const rollMeasurementSchema = z.object({
  organizationId: z.string().uuid(),
  inventoryUnitId: z.string().uuid(),
  itemId: z.string().uuid(),
  binId: z.string().uuid(),
  manualRemainingLength: z.number().positive().optional(),
  outerDiameter: z.number().positive().optional(),
  coreDiameter: z.number().nonnegative().default(0),
  buildThickness: z.number().positive().optional(),
});

export function calculateRemainingLength(input: z.infer<typeof rollMeasurementSchema>) {
  if (input.manualRemainingLength) return { method: 'manual', remainingLength: input.manualRemainingLength };
  if (!input.outerDiameter || !input.buildThickness) throw new Error('Diameter and build thickness are required.');
  const area = Math.PI * (input.outerDiameter ** 2 - input.coreDiameter ** 2) / 4;
  return { method: 'diameter', remainingLength: Number((area / input.buildThickness).toFixed(4)) };
}

export async function saveRollMeasurement(input: z.infer<typeof rollMeasurementSchema>) {
  return withTransaction(async (db) => {
    const measurement = calculateRemainingLength(input);
    const result = await db.query<{ id: string }>(
      `insert into roll_measurements (organization_id, inventory_unit_id, remaining_length, method, metadata)
       values ($1, $2, $3, $4, $5) returning id`,
      [input.organizationId, input.inventoryUnitId, measurement.remainingLength, measurement.method, JSON.stringify(input)],
    );
    const ledgerId = await addLedgerEntry(db, {
      organizationId: input.organizationId,
      itemId: input.itemId,
      binId: input.binId,
      txType: 'roll_measurement',
      quantity: measurement.remainingLength,
    });
    const auditId = await writeAuditLog(db, {
      organizationId: input.organizationId,
      action: 'roll.measured',
      entityType: 'roll_measurement',
      entityId: result.rows[0].id,
      metadata: { ...measurement, ledgerId },
    });
    return { measurementId: result.rows[0].id, ledgerId, auditId, ...measurement };
  });
}
