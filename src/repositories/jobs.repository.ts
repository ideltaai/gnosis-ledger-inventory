import type { Db } from '../db/pool';

export async function listJobs(db: Db, organizationId: string) {
  return (await db.query('select * from jobs where organization_id = $1 order by due_date nulls last, job_number', [organizationId])).rows;
}

export async function getJob(db: Db, id: string) {
  const result = await db.query('select * from jobs where id = $1', [id]);
  return result.rows[0];
}

export async function createJob(db: Db, input: {
  organizationId: string;
  jobNumber: string;
  name: string;
  clientName: string;
  dueDate?: string;
  externalReference?: string;
}) {
  const result = await db.query(
    `insert into jobs (organization_id, job_number, name, client_name, due_date, source, external_reference)
     values ($1, $2, $3, $4, $5, 'local', $6) returning *`,
    [input.organizationId, input.jobNumber, input.name, input.clientName, input.dueDate ?? null, input.externalReference ?? null],
  );
  return result.rows[0];
}
