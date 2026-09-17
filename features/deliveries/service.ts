import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { createDeliverySchema, deliveryStatusSchema } from "./schema";
import { ALLOWED_DELIVERY_TRANSITIONS } from "./constants";
import { isDeliveryLate } from "./delivery-lateness";
import * as repo from "./repository";

export async function listDeliveriesForProject(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const deliveries = await repo.listDeliveries(projectId);
  return deliveries.map((d) => ({ ...d, isLate: isDeliveryLate(d) }));
}

export async function createDeliveryFromOrder(userId: string, projectId: string, orderId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const order = await repo.findOrderForDeliveryDefaults(orderId);
  if (!order || order.projectId !== projectId) {
    throw new NotFoundError("הזמנה");
  }
  const data = createDeliverySchema.parse(input);
  return repo.createDeliveryFromOrder(projectId, order, data);
}

export async function updateDeliveryStatus(userId: string, projectId: string, deliveryId: string, status: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const delivery = await repo.findDelivery(deliveryId);
  if (!delivery || delivery.projectId !== projectId) {
    throw new NotFoundError("אספקה");
  }
  const target = deliveryStatusSchema.parse(status);
  if (!ALLOWED_DELIVERY_TRANSITIONS[delivery.status].includes(target)) {
    throw new ValidationError(`אי אפשר לעבור מסטטוס "${delivery.status}" ל-"${target}" ישירות`);
  }
  return repo.updateDeliveryStatus(deliveryId, target);
}
