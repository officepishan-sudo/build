import { z } from "zod";

export const addCartItemSchema = z.object({
  description: z.string().min(2, "יש להזין תיאור לפריט"),
  quantity: z.coerce.number().positive("הכמות חייבת להיות גדולה מאפס"),
  unitPrice: z.coerce.number().nonnegative().optional(),
  supplierId: z.string().optional(),
  phaseId: z.string().optional(),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().positive("הכמות חייבת להיות גדולה מאפס"),
  unitPrice: z.coerce.number().nonnegative().optional(),
  supplierId: z.string().optional(),
  phaseId: z.string().optional(),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

export const splitCartItemSchema = z.object({
  splitQuantity: z.coerce.number().positive("כמות הפיצול חייבת להיות גדולה מאפס"),
});

export type SplitCartItemInput = z.infer<typeof splitCartItemSchema>;
