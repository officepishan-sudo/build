import { z } from "zod";

export const updateChecklistItemSchema = z.object({
  isChecked: z.coerce.boolean().default(false),
  notes: z.string().optional(),
});

export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>;

// צורת ה-payload הצפויה בתבנית CHECKLIST_ITEM שה-admin (P39) מגדיר - ר' DEC בדוח.
export const checklistTemplatePayloadSchema = z.object({
  projectType: z.string(),
  title: z.string(),
  description: z.string().optional(),
});
