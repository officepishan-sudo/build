import { prisma } from "@/lib/prisma";
import type { OrderStatus, Prisma } from "@prisma/client";
import type { OrderGroup } from "./order-calc";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export function findCartItemsByIds(projectId: string, ids: string[]) {
  return prisma.cartItem.findMany({ where: { projectId, id: { in: ids } } });
}

export function listOrders(projectId: string) {
  return prisma.order.findMany({
    where: { projectId },
    include: { supplier: true, items: true, deliveries: { select: { id: true } } },
    orderBy: { orderDate: "desc" },
  });
}

export function findOrderWithItems(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { supplier: true, professional: true, items: true, deliveries: true },
  });
}

/** יוצר הזמנה + שורות לכל קבוצת ספק, ומרוקן מהעגלה את השורות שנצרכו - עסקה אחת. */
export async function createOrdersAndClearCart(
  projectId: string,
  groups: { group: OrderGroup; number: string }[],
): Promise<OrderWithItems[]> {
  const allConsumedIds = groups.flatMap((g) => g.group.sourceCartItemIds);
  const results = await prisma.$transaction([
    ...groups.map(({ group, number }) =>
      prisma.order.create({
        data: {
          projectId,
          number,
          supplierId: group.supplierId,
          phaseId: group.phaseId,
          totalAmount: group.totalAmount,
          status: "DRAFT",
          items: { create: group.lines },
        },
        include: { items: true },
      }),
    ),
    prisma.cartItem.deleteMany({ where: { projectId, id: { in: allConsumedIds } } }),
  ]);
  return results.slice(0, groups.length) as OrderWithItems[];
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({ where: { id: orderId }, data: { status } });
}

export function deleteOrder(orderId: string) {
  return prisma.order.delete({ where: { id: orderId } });
}

// Order.phaseId הוא שדה טקסט חופשי בסכימה (בלי @relation, בשונה מ-Delivery.phaseId) -
// אין include אוטומטי, לכן שולפים שם שלב בנפרד.
export function listPhaseNamesById(projectId: string) {
  return prisma.phase.findMany({ where: { projectId }, select: { id: true, name: true } });
}
