import { z } from 'zod';

export const updateListTitleSchema = z.object({
  title: z.string().trim().min(1),
});
