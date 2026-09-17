import { z } from "zod";

export const createDeliverySchema = z.object({
  expectedDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;

export const deliveryStatusSchema = z.enum(["PENDING", "SCHEDULED", "IN_TRANSIT", "RECEIVED", "PARTIAL", "LATE", "CANCELLED"]);
