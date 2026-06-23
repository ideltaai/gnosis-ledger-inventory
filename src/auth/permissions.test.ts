import { describe, expect, it } from 'vitest';
import { rolePermissions } from './permissions';

describe('role permissions', () => {
  it('gives Admin user and delete management', () => {
    expect(rolePermissions.Admin).toContain('users:delete');
    expect(rolePermissions.Admin).toContain('inventory:delete');
  });

  it('prevents Standard User from deleting and managing users', () => {
    expect(rolePermissions['Standard User']).not.toContain('inventory:delete');
    expect(rolePermissions['Standard User']).not.toContain('users:create');
  });

  it('allows Viewer read and pick workflows but not inventory edits', () => {
    expect(rolePermissions.Viewer).toContain('inventory:view');
    expect(rolePermissions.Viewer).toContain('picklists:pick');
    expect(rolePermissions.Viewer).not.toContain('inventory:edit');
  });
});
