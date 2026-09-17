import { z } from "zod";

function csvToIds(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const changeImpactQuerySchema = z.object({
  changeDescription: z.string().trim().min(1, "יש לתאר מה משתנה"),
  affectedRequirementIds: z.string().optional().transform(csvToIds),
  affectedQuoteIds: z.string().optional().transform(csvToIds),
  affectedOrderIds: z.string().optional().transform(csvToIds),
  affectedQuantityItemIds: z.string().optional().transform(csvToIds),
});

export type ChangeImpactQueryInput = z.infer<typeof changeImpactQuerySchema>;

export const approveChangeSchema = z.object({
  reason: z.string().trim().min(3, "יש לציין סיבה לאישור השינוי"),
});
