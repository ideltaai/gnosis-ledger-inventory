import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password-hashing.service';

describe('password hashing', () => {
  it('verifies matching passwords and rejects bad passwords', async () => {
    const hash = await hashPassword('ChangeMe123!');
    expect(hash).not.toContain('ChangeMe123!');
    expect(await verifyPassword('ChangeMe123!', hash)).toBe(true);
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });
});
