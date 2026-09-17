import { z } from "zod";

// fileUrl אופציונלי בכוונה: DEC - "קובץ חסר" נשאר ריק ומפורש, לעולם לא מומצא.
export const createDocumentSchema = z.object({
  category: z.string().min(1, "יש לבחור קטגוריה"),
  name: z.string().min(1, "יש להזין שם למסמך"),
  fileUrl: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  relatedType: z.string().trim().optional(),
  relatedId: z.string().trim().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = createDocumentSchema;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
