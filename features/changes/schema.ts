import { z } from "zod";

export const createChangeRequestSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת לשינוי"),
  reason: z.string().min(2, "יש לפרט מה הסיבה לשינוי"),
  priceImpact: z.coerce.number().optional(),
  scheduleImpactDays: z.coerce.number().int().optional(),
});

export type CreateChangeRequestInput = z.infer<typeof createChangeRequestSchema>;

export const updateChangeRequestSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת לשינוי"),
  reason: z.string().min(2, "יש לפרט מה הסיבה לשינוי"),
  priceImpact: z.coerce.number().optional(),
  scheduleImpactDays: z.coerce.number().int().optional(),
});

export type UpdateChangeRequestInput = z.infer<typeof updateChangeRequestSchema>;
