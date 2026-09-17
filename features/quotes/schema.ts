import { z } from "zod";

export const createQuoteSchema = z
  .object({
    price: z.coerce.number().positive("יש להזין מחיר חיובי"),
    professionalId: z.string().optional(),
    supplierId: z.string().optional(),
    quoteRequestId: z.string().optional(),
    includesNotes: z.string().optional(),
    durationDays: z.coerce.number().int().positive().optional(),
    paymentTerms: z.string().optional(),
    warrantyText: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => Boolean(data.professionalId) || Boolean(data.supplierId), {
    message: "יש לבחור בעל מקצוע או ספק שהגיש את ההצעה",
    path: ["professionalId"],
  });
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
