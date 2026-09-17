import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@prisma/client";
import type { CreatePaymentInput } from "./schema";

export function listPaymentsByProject(projectId: string) {
  return prisma.payment.findMany({
    where: { projectId },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      expense: { select: { description: true } },
      order: { select: { number: true } },
    },
  });
}

export function findPaymentShallow(projectId: string, id: string) {
  return prisma.payment.findFirst({ where: { id, projectId } });
}

export function createPayment(projectId: string, data: CreatePaymentInput) {
  return prisma.payment.create({
    data: {
      projectId,
      payeeName: data.payeeName,
      amount: data.amount,
      dueDate: data.dueDate,
      expenseId: data.expenseId,
      orderId: data.orderId,
      quoteId: data.quoteId,
      documentId: data.documentId,
    },
  });
}

export function updatePaymentStatus(id: string, data: { status: PaymentStatus; paidDate: Date | null }) {
  return prisma.payment.update({ where: { id }, data });
}

// Quote אינו מקושר ב-relation מוגדר ב-Payment (רק quoteId חופשי) - חיפוש נפרד.
export function findQuotesByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return prisma.quote.findMany({ where: { id: { in: ids } }, select: { id: true, price: true } });
}
