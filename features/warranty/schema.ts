import { z } from "zod";

export const warrantySchema = z.object({
  itemDescription: z.string().min(1, "יש להזין תיאור לפריט"),
  supplierId: z.string().optional(),
  professionalId: z.string().optional(),
  startDate: z.coerce.date({ errorMap: () => ({ message: "יש להזין תאריך התחלה תקין" }) }),
  durationMonths: z.coerce.number().int().positive("משך האחריות חייב להיות מספר חודשים חיובי"),
});

export type WarrantyInput = z.infer<typeof warrantySchema>;

export const maintenanceItemSchema = z.object({
  title: z.string().min(1, "יש להזין כותרת לתחזוקה"),
  frequency: z.string().optional(),
  nextDueDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  warrantyId: z.string().optional(),
});

export type MaintenanceItemInput = z.infer<typeof maintenanceItemSchema>;
