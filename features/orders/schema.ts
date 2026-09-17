import { z } from "zod";

export const createOrdersFromCartSchema = z.object({
  cartItemIds: z.array(z.string()).min(1, "יש לסמן לפחות פריט אחד בעגלה כדי ליצור הזמנה"),
});

export type CreateOrdersFromCartInput = z.infer<typeof createOrdersFromCartSchema>;

export const orderStatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "CONFIRMED",
  "IN_PROGRESS",
  "PARTIALLY_DELIVERED",
  "DELIVERED",
  "CANCELLED",
]);

export const changeOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
