import { z } from 'zod';

export const availabilityQuerySchema = z.object({
  itemId: z.string().uuid(),
  binId: z.string().uuid().optional(),
});
