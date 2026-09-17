import { z } from "zod";

export const createDefectSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת לליקוי"),
  description: z.string().min(2, "יש לתאר את הליקוי"),
  assigneeProfessionalId: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});

export type CreateDefectInput = z.infer<typeof createDefectSchema>;

export const updateDefectStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS"]),
});

export type UpdateDefectStatusInput = z.infer<typeof updateDefectStatusSchema>;

// "נפתר אינו בהכרח נסגר" - סימון כנפתר מחייב פירוט מה תוקן.
export const resolveDefectSchema = z.object({
  resolutionNotes: z.string().min(3, "יש לפרט מה תוקן לפני סימון כנפתר"),
});

export type ResolveDefectInput = z.infer<typeof resolveDefectSchema>;

// אישור סגירה הוא פעולה נפרדת ומכוונת - מישהו מאשר שהתיקון אכן נבדק.
export const closeDefectSchema = z.object({
  closingNote: z.string().min(3, "יש לפרט מי/מה אישר את הסגירה"),
});

export type CloseDefectInput = z.infer<typeof closeDefectSchema>;
