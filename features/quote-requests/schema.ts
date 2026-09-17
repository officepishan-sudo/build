import { z } from "zod";

export const quoteRequestFormSchema = z.object({
  title: z.string().min(2, "יש להזין כותרת לבקשה"),
  scopeText: z.string().optional().default(""),
  deadline: z.coerce.date().optional(),
  recipientProfessionalIds: z.array(z.string()).default([]),
  recipientSupplierIds: z.array(z.string()).default([]),
});
export type QuoteRequestFormInput = z.infer<typeof quoteRequestFormSchema>;
