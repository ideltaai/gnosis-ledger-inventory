import type { Db } from '../db/pool';

export async function createAllocation(db: Db, input: {
  organizationId: string;
  itemId: string;
  binId?: string;
  quantity: number;
}): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into allocations (organization_id, item_id, bin_id, quantity)
     values ($1, $2, $3, $4) returning id`,
    [input.organizationId, input.itemId, input.binId ?? null, input.quantity],
  );
  return result.rows[0].id;
}

export async function writeAuditLog(db: Db, input: {
  organizationId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into audit_logs (organization_id, action, entity_type, entity_id, metadata)
     values ($1, $2, $3, $4, $5) returning id`,
    [
      input.organizationId,
      input.action,
      input.entityType,
      input.entityId ?? null,
      JSON.stringify(input.metadata ?? {}),
    ],
  );
  return result.rows[0].id;
}

export async function saveRollMeasurement(db: Db, input: {
  organizationId: string;
  itemId: string;
  binId: string;
  length: number;
  reference?: string;
}): Promise<string> {
  const result = await db.query<{ id: string }>(
    `insert into inventory_ledger (organization_id, item_id, bin_id, tx_type, quantity, reference)
     values ($1, $2, $3, 'roll_measurement', $4, $5) returning id`,
    [input.organizationId, input.itemId, input.binId, input.length, input.reference ?? null],
  );
  return result.rows[0].id;
}
