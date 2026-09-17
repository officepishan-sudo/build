import { z } from "zod";

export const createDecisionSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת להחלטה"),
  description: z.string().optional(),
  deadline: z.coerce.date().optional(),
  dependsOn: z.string().optional(),
});

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;

// Edge case: "לא יודע" אינו סוגר החלטה - סימון "הוחלט" מחייב ערך מפורש לא ריק.
export const markDecidedSchema = z.object({
  decidedValue: z.string().min(1, "יש להזין מה הוחלט לפני סימון ההחלטה כהוחלטה"),
});

export type MarkDecidedInput = z.infer<typeof markDecidedSchema>;
