import { z } from "zod";

export const supplierFilterSchema = z.object({
  category: z.string().optional(),
});
export type SupplierFilterInput = z.infer<typeof supplierFilterSchema>;

export const supplierFormSchema = z.object({
  name: z.string().min(2, "יש להזין שם ספק"),
  categories: z.array(z.string()).min(1, "יש לבחור קטגוריה אחת לפחות"),
  area: z.string().optional(),
  terms: z.string().optional(),
  warrantyPolicy: z.string().optional(),
});
export type SupplierFormInput = z.infer<typeof supplierFormSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "יש להזין שם מוצר"),
  category: z.string().min(1, "יש להזין קטגוריה"),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  unit: z.string().min(1, "יש להזין יחידת מידה"),
  deliveryLeadDays: z.coerce.number().int().nonnegative().optional(),
  availability: z.string().optional(),
  warrantyMonths: z.coerce.number().int().nonnegative().optional(),
});
export type ProductInput = z.infer<typeof productSchema>;
