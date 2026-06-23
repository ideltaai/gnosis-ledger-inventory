import { describe, expect, it } from 'vitest';
import { createSessionToken, verifySessionToken } from './session-token.service';

describe('session tokens', () => {
  it('returns user role and permissions from a valid token', () => {
    const token = createSessionToken({ userId: 'user-1', role: 'Admin', permissions: ['users:create'] });
    expect(verifySessionToken(token)).toMatchObject({ userId: 'user-1', role: 'Admin', permissions: ['users:create'] });
  });
});
