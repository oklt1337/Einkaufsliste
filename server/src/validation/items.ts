import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().trim().min(1),
});

export const updateItemSchema = z
  .object({
    bought: z.boolean().optional(),
    quantity: z.number().int().min(0).optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => data.bought !== undefined || data.quantity !== undefined || data.order !== undefined,
    {
      message: 'At least one field must be provided',
    },
  );
