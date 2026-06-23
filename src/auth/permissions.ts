export const permissionKeys = [
  'users:view', 'users:create', 'users:edit', 'users:delete', 'users:reset_password',
  'inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete', 'inventory:receive', 'inventory:allocate', 'inventory:consume', 'inventory:transfer',
  'picklists:view', 'picklists:create', 'picklists:edit', 'picklists:delete', 'picklists:pick',
  'jobs:view', 'jobs:create', 'jobs:edit', 'jobs:delete',
  'locations:view', 'locations:create', 'locations:edit', 'locations:delete',
  'vendors:view', 'vendors:create', 'vendors:edit', 'vendors:delete',
  'reports:view', 'settings:manage',
] as const;

export type PermissionKey = (typeof permissionKeys)[number];

export const rolePermissions: Record<string, PermissionKey[]> = {
  Admin: [...permissionKeys],
  'Standard User': permissionKeys.filter((key) => !key.includes(':delete') && !key.startsWith('users:') && key !== 'settings:manage'),
  Viewer: ['inventory:view', 'jobs:view', 'locations:view', 'reports:view', 'picklists:view', 'picklists:create', 'picklists:edit', 'picklists:pick'],
};
