import type { Db } from '../db/pool';

export async function listReasonCodes(db: Db, organizationId: string) {
  return (await db.query('select * from reason_codes where organization_id = $1 order by category, code', [organizationId])).rows;
}

export async function upsertReasonCode(db: Db, input: { organizationId: string; code: string; label: string; category: string }) {
  const result = await db.query(
    `insert into reason_codes (organization_id, code, label, category) values ($1, $2, $3, $4)
     on conflict (organization_id, code) do update set label = excluded.label, category = excluded.category returning *`,
    [input.organizationId, input.code, input.label, input.category],
  );
  return result.rows[0];
}
