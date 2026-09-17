import { z } from "zod";

export const createBudgetLineSchema = z.object({
  category: z.string().min(2, "יש להזין שם קטגוריה"),
  plannedAmount: z.coerce.number().min(0, "הסכום המתוכנן חייב להיות 0 ומעלה"),
  // DEC (ראו דוח סוכן): Order אינו מקושר ל-BudgetLine בסכימה, אז אין דרך לחשב
  // התחייבויות אוטומטית מהזמנות אמיתיות. השדה כאן ניתן להזנה ידנית ומתויג ברור כך ב-UI.
  committedAmount: z.coerce.number().min(0).default(0),
});

export type CreateBudgetLineInput = z.infer<typeof createBudgetLineSchema>;

export const updateBudgetLineSchema = z.object({
  category: z.string().min(2, "יש להזין שם קטגוריה"),
  plannedAmount: z.coerce.number().min(0, "הסכום המתוכנן חייב להיות 0 ומעלה"),
  committedAmount: z.coerce.number().min(0).default(0),
});

export type UpdateBudgetLineInput = z.infer<typeof updateBudgetLineSchema>;

export const setVarianceReasonSchema = z.object({
  varianceReason: z.string().min(3, "יש לפרט את סיבת הפער"),
});

export type SetVarianceReasonInput = z.infer<typeof setVarianceReasonSchema>;

export const logExpenseSchema = z.object({
  description: z.string().min(2, "יש לתאר את ההוצאה"),
  amount: z.coerce.number().positive("הסכום חייב להיות גדול מ-0"),
  date: z.coerce.date().optional(),
  orderId: z.string().optional(),
});

export type LogExpenseInput = z.infer<typeof logExpenseSchema>;
