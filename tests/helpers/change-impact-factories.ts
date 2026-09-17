import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus, QuoteStatus, TaskStatus } from "@prisma/client";

// פאבריקות ייעודיות לבדיקות lib/change-impact.ts ו-features/{alternatives,change-impact}.
// בקובץ נפרד מ-tests/helpers/factories.ts כדי לא לגעת בקובץ המשותף לכל הסוכנים.

export function createTestRequirement(
  projectId: string,
  overrides: { label?: string; status?: "KNOWN" | "NEEDS_CHECK"; value?: string } = {},
) {
  return prisma.requirement.create({
    data: {
      projectId,
      key: `req-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: overrides.label ?? "דרישה לבדיקה",
      value: overrides.value ?? null,
      status: overrides.status ?? "KNOWN",
    },
  });
}

export function createTestQuantityItem(projectId: string, overrides: { phaseId?: string } = {}) {
  return prisma.quantityItem.create({
    data: {
      projectId,
      phaseId: overrides.phaseId,
      category: "כללי",
      description: "סעיף כמויות לבדיקה",
      quantity: 1,
      unit: 'יח',
    },
  });
}

export function createTestPhase(projectId: string) {
  return prisma.phase.create({ data: { projectId, name: "שלב לבדיקה" } });
}

export function createTestTask(projectId: string, phaseId: string, status: TaskStatus = "DONE") {
  return prisma.task.create({ data: { projectId, phaseId, title: "משימה לבדיקה", status } });
}

export function createTestQuote(projectId: string, status: QuoteStatus = "RECEIVED") {
  return prisma.quote.create({ data: { projectId, price: 1000, status } });
}

export function createTestOrder(projectId: string, status: OrderStatus = "SENT") {
  return prisma.order.create({
    data: { projectId, number: `ORD-${Date.now()}-${Math.random().toString(36).slice(2)}`, totalAmount: 5000, status },
  });
}

export function createTestPayment(
  projectId: string,
  overrides: { orderId?: string; quoteId?: string; status?: PaymentStatus } = {},
) {
  return prisma.payment.create({
    data: {
      projectId,
      payeeName: "ספק לבדיקה",
      orderId: overrides.orderId,
      quoteId: overrides.quoteId,
      amount: 500,
      status: overrides.status ?? "PAID",
    },
  });
}
