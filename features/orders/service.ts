import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { changeOrderStatusSchema, createOrdersFromCartSchema } from "./schema";
import { ALLOWED_ORDER_TRANSITIONS } from "./constants";
import { findInvalidCartLines, generateOrderNumber, groupCartLinesIntoOrders, type CartLineForOrder } from "./order-calc";
import * as repo from "./repository";

export async function listOrdersForProject(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [orders, phases] = await Promise.all([repo.listOrders(projectId), repo.listPhaseNamesById(projectId)]);
  const phaseNameById = new Map(phases.map((p) => [p.id, p.name]));
  return orders.map((order) => ({ ...order, phaseName: order.phaseId ? (phaseNameById.get(order.phaseId) ?? null) : null }));
}

export async function getOrderDetail(userId: string, projectId: string, orderId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const order = await repo.findOrderWithItems(orderId);
  if (!order || order.projectId !== projectId) {
    throw new NotFoundError("הזמנה");
  }
  if (!order.phaseId) return { ...order, phaseName: null as string | null };
  const phases = await repo.listPhaseNamesById(projectId);
  const phaseName = phases.find((p) => p.id === order.phaseId)?.name ?? null;
  return { ...order, phaseName };
}

export async function createOrdersFromCart(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const { cartItemIds } = createOrdersFromCartSchema.parse(input);

  const cartItems = await repo.findCartItemsByIds(projectId, cartItemIds);
  if (cartItems.length !== cartItemIds.length) {
    throw new NotFoundError("אחד או יותר מהפריטים המסומנים בעגלה");
  }

  const lines: CartLineForOrder[] = cartItems.map((item) => ({
    id: item.id,
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
    supplierId: item.supplierId,
    phaseId: item.phaseId,
  }));

  const invalid = findInvalidCartLines(lines);
  if (invalid.length > 0) {
    throw new ValidationError(
      `אי אפשר ליצור הזמנה: לפריטים "${invalid.map((l) => l.description).join(', ')}" חסר ספק ו/או כמות תקינה`,
    );
  }

  const groups = groupCartLinesIntoOrders(lines);
  const numbered = groups.map((group, index) => ({ group, number: generateOrderNumber(new Date(), index) }));
  return repo.createOrdersAndClearCart(projectId, numbered);
}

export async function changeOrderStatus(userId: string, projectId: string, orderId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const order = await getOrderDetail(userId, projectId, orderId);
  const { status } = changeOrderStatusSchema.parse(input);

  const allowed = ALLOWED_ORDER_TRANSITIONS[order.status];
  if (!allowed.includes(status)) {
    throw new ValidationError(`אי אפשר לעבור מסטטוס "${order.status}" ל-"${status}" ישירות`);
  }
  return repo.updateOrderStatus(orderId, status);
}

export async function deleteOrder(userId: string, projectId: string, orderId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const order = await getOrderDetail(userId, projectId, orderId);
  if (order.status !== "DRAFT") {
    throw new ValidationError("אי אפשר למחוק הזמנה שאינה טיוטה - אפשר לבטל אותה במקום");
  }
  return repo.deleteOrder(orderId);
}
