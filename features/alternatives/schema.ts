import { z } from "zod";

function splitLines(input?: string): string[] {
  if (!input) return [];
  return input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const createAlternativeSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת לחלופה"),
  description: z.string().min(2, "יש להזין תיאור לחלופה"),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  durationDays: z.coerce.number().int().nonnegative().optional(),
  prosText: z.string().optional().transform(splitLines),
  consText: z.string().optional().transform(splitLines),
  maintenanceNotes: z.string().optional(),
  materialsNotes: z.string().optional(),
  imageUrl: optionalUrl,
  reasonShown: z.string().min(2, "יש לציין למה החלופה הזו מוצגת"),
});

export type CreateAlternativeInput = z.infer<typeof createAlternativeSchema>;

export const selectAlternativeSchema = z.object({
  reason: z.string().trim().optional(),
});

export const applyPlaySchema = z.object({
  priceMin: z.coerce.number().nonnegative(),
  priceMax: z.coerce.number().nonnegative(),
  durationDays: z.coerce.number().int().nonnegative().optional(),
  maintenanceNotes: z.string().optional(),
});

export type ApplyPlayInput = z.infer<typeof applyPlaySchema>;
