import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת לבעיה"),
  description: z.string().min(2, "יש לתאר את הבעיה"),
  type: z.string().optional(),
  phaseId: z.string().optional(),
  assigneeProfessionalId: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export const updateIssueStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "WAITING"]),
});

export type UpdateIssueStatusInput = z.infer<typeof updateIssueStatusSchema>;

// "לא להפוך הצעה/הערה לא-מאושרת לפתרון מאושר" - סגירה/פתרון דורשים תמיד
// הערת פתרון מפורשת, לעולם לא רק שינוי סטטוס שקט.
export const resolveIssueSchema = z.object({
  resolutionNote: z.string().min(3, "יש לפרט מה הפתרון לפני סגירת הבעיה"),
});

export type ResolveIssueInput = z.infer<typeof resolveIssueSchema>;
