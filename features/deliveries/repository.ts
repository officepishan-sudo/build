import { prisma } from "@/lib/prisma";
import type { DeliveryStatus } from "@prisma/client";
import type { CreateDeliveryInput } from "./schema";

export function listDeliveries(projectId: string) {
  return prisma.delivery.findMany({
    where: { projectId },
    include: { order: true, phase: true, supplier: true },
    orderBy: [{ expectedDate: "asc" }, { createdAt: "desc" }],
  });
}

export function findOrderForDeliveryDefaults(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, projectId: true, supplierId: true, phaseId: true, number: true, items: true },
  });
}

export function createDeliveryFromOrder(
  projectId: string,
  order: { id: string; supplierId: string | null; phaseId: string | null; items: { description: string }[] },
  data: CreateDeliveryInput,
) {
  return prisma.delivery.create({
    data: {
      projectId,
      orderId: order.id,
      supplierId: order.supplierId,
      phaseId: order.phaseId,
      expectedDate: data.expectedDate,
      notes: data.notes,
      itemsSummary: order.items.map((i) => i.description).join(", "),
      status: "SCHEDULED",
    },
  });
}

export function findDelivery(id: string) {
  return prisma.delivery.findUnique({ where: { id } });
}

export function updateDeliveryStatus(id: string, status: DeliveryStatus) {
  return prisma.delivery.update({
    where: { id },
    data: { status, receivedDate: status === "RECEIVED" ? new Date() : undefined },
  });
}
