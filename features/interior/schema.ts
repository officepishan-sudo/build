import { z } from "zod";

export const roomSchema = z.object({
  name: z.string().min(1, "יש להזין שם לחדר"),
  notes: z.string().optional(),
});

export type RoomInput = z.infer<typeof roomSchema>;

export const interiorItemSchema = z.object({
  category: z.string().min(1, "יש לבחור קטגוריה"),
  decisionText: z.string().optional(),
  quantity: z.coerce.number().positive("הכמות חייבת להיות חיובית").optional(),
  productId: z.string().optional(),
});

export type InteriorItemInput = z.infer<typeof interiorItemSchema>;
