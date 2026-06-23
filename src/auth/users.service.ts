import { getPool, withTransaction } from '../db/pool';
import { updatePassword } from './auth.repository';
import { hashPassword } from './password-hashing.service';
import { createUser, deactivateUser, listRoles, listUsers, updateUser } from './users.repository';

export async function createInternalUser(input: { organizationId: string; name: string; email: string; password: string; role: string }) {
  return withTransaction(async (db) => createUser(db, { ...input, passwordHash: await hashPassword(input.password) }));
}

export async function updateInternalUser(id: string, input: { name?: string; email?: string; role?: string; status?: string }) {
  return withTransaction(async (db) => updateUser(db, id, input));
}

export async function resetUserPassword(userId: string, newPassword: string) {
  await updatePassword(getPool(), userId, await hashPassword(newPassword));
}

export { deactivateUser, listRoles, listUsers };
