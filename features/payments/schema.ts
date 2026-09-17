import { z } from "zod";

export const createPaymentSchema = z.object({
  payeeName: z.string().min(2, "יש להזין למי משולם"),
  amount: z.coerce.number().positive("הסכום חייב להיות גדול מ-0"),
  dueDate: z.coerce.date().optional(),
  expenseId: z.string().optional(),
  orderId: z.string().optional(),
  quoteId: z.string().optional(),
  documentId: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const markPaidSchema = z.object({
  paidDate: z.coerce.date().optional(),
});

export type MarkPaidInput = z.infer<typeof markPaidSchema>;

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PARTIAL", "OVERDUE", "CANCELLED"]),
  paidDate: z.coerce.date().optional(),
});

export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
