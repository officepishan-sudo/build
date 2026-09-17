import { z } from "zod";

// סכימת שורת כתב כמויות (P14). מקור אמת יחיד לטופס ההוספה/עריכה ול-service.
export const quantityItemSchema = z.object({
  phaseId: z.string().optional(),
  category: z.string().min(1, "יש לבחור קטגוריה"),
  description: z.string().min(1, "יש להזין תיאור לשורה"),
  quantity: z.coerce.number().positive("הכמות חייבת להיות חיובית"),
  unit: z.string().min(1, "יש להזין יחידת מידה"),
  materialCost: z.coerce.number().nonnegative().optional(),
  laborCost: z.coerce.number().nonnegative().optional(),
  transportCost: z.coerce.number().nonnegative().optional(),
  totalCostOverride: z.coerce.number().nonnegative().optional(),
  source: z.string().optional(),
  needsCheck: z.coerce.boolean().default(false),
});

export type QuantityItemInput = z.infer<typeof quantityItemSchema>;

export const quantityFilterSchema = z.object({
  category: z.string().optional(),
  phaseId: z.string().optional(),
});

export type QuantityFilterInput = z.infer<typeof quantityFilterSchema>;
