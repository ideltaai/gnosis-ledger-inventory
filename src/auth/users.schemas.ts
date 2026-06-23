import { z } from 'zod';

export const createUserSchema = z.object({ organizationId: z.string().uuid(), name: z.string().min(1), email: z.string().email(), password: z.string().min(8), role: z.enum(['Admin', 'Standard User', 'Viewer']) });
export const updateUserSchema = z.object({ name: z.string().min(1).optional(), email: z.string().email().optional(), role: z.enum(['Admin', 'Standard User', 'Viewer']).optional(), status: z.enum(['active', 'inactive']).optional() });
export const resetUserPasswordSchema = z.object({ newPassword: z.string().min(8) });
