import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus, QuoteStatus } from "@prisma/client";

// שאילתות קריאה בלבד עבור lib/change-impact.ts - חיות ב-lib/db (כמו lib/db/project-access.ts)
// כי אלה שאילתות חוצות-פיצ'רים ולא CRUD של פיצ'ר ספציפי; זה המקום המותר ל-Prisma מחוץ ל-repository.ts.

export type AffectedRequirementSummary = { id: string; label: string; value: string | null; status: string };

export type AffectedQuantityItemSummary = {
  id: string;
  category: string;
  description: string;
  quantity: string;
  unit: string;
  totalCost: string | null;
};

export type QuoteNoLongerValidSummary = {
  id: string;
  professionalOrSupplierName: string;
  price: string;
  status: string;
  reason: string;
};

export type OrderCommitmentSummary = {
  id: string;
  number: string;
  status: string;
  totalAmount: string;
  alreadyHappened: boolean;
  clarificationNeeded: string | null;
};

export type PaymentAlreadyMadeSummary = {
  id: string;
  payeeName: string;
  amount: string;
  status: string;
  paidDate: string | null;
  orderId: string | null;
};

export type TaskAlreadyDoneSummary = { id: string; title: string; phaseId: string | null; endDate: string | null };

const OPEN_QUOTE_STATUSES: QuoteStatus[] = ["RECEIVED", "REVIEW", "SELECTED"];
const COMMITTED_ORDER_STATUSES = new Set<OrderStatus>(["DELIVERED", "PARTIALLY_DELIVERED", "IN_PROGRESS"]);
const PAID_STATUSES: PaymentStatus[] = ["PAID", "PARTIAL"];

export async function loadAffectedRequirements(projectId: string, ids: string[]): Promise<AffectedRequirementSummary[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.requirement.findMany({ where: { projectId, id: { in: ids } } });
  return rows.map((r) => ({ id: r.id, label: r.label, value: r.value, status: r.status }));
}

export async function loadAffectedQuantityItems(projectId: string, ids: string[]): Promise<AffectedQuantityItemSummary[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.quantityItem.findMany({ where: { projectId, id: { in: ids } } });
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    description: r.description,
    quantity: r.quantity.toString(),
    unit: r.unit,
    totalCost: r.totalCost ? r.totalCost.toString() : null,
  }));
}

export async function loadQuotesNoLongerValid(projectId: string, ids: string[]): Promise<QuoteNoLongerValidSummary[]> {
  if (ids.length === 0) return [];
  const quotes = await prisma.quote.findMany({
    where: { projectId, id: { in: ids }, status: { in: OPEN_QUOTE_STATUSES } },
    include: { professional: true, supplier: true },
  });
  return quotes.map((q) => ({
    id: q.id,
    professionalOrSupplierName: q.professional?.name ?? q.supplier?.name ?? "לא ידוע",
    price: q.price.toString(),
    status: q.status,
    reason: "השינוי נוגע בסעיף שההצעה הזו מכסה - נדרשת הצעה מחודשת",
  }));
}

function describeOrderClarification(status: OrderCommitmentSummary["status"], alreadyHappened: boolean): string | null {
  if (alreadyHappened) {
    return "ההזמנה כבר בביצוע או סופקה בחלקה - לא ניתן לבטל בשקט, יש לתאם מול הספק/בעל המקצוע";
  }
  if (status === "CANCELLED") return null;
  return "ההזמנה טרם סופקה בפועל - אפשר לבחון שינוי או ביטול מול הצד השני";
}

export async function loadOrdersWithCommitments(projectId: string, ids: string[]): Promise<OrderCommitmentSummary[]> {
  if (ids.length === 0) return [];
  const orders = await prisma.order.findMany({ where: { projectId, id: { in: ids } } });
  return orders.map((o) => {
    const alreadyHappened = COMMITTED_ORDER_STATUSES.has(o.status);
    return {
      id: o.id,
      number: o.number,
      status: o.status,
      totalAmount: o.totalAmount.toString(),
      alreadyHappened,
      clarificationNeeded: describeOrderClarification(o.status, alreadyHappened),
    };
  });
}

export async function loadPaymentsAlreadyMade(
  projectId: string,
  orderIds: string[],
  quoteIds: string[],
): Promise<PaymentAlreadyMadeSummary[]> {
  if (orderIds.length === 0 && quoteIds.length === 0) return [];
  const payments = await prisma.payment.findMany({
    where: {
      projectId,
      status: { in: PAID_STATUSES },
      OR: [
        ...(orderIds.length ? [{ orderId: { in: orderIds } }] : []),
        ...(quoteIds.length ? [{ quoteId: { in: quoteIds } }] : []),
      ],
    },
  });
  return payments.map((p) => ({
    id: p.id,
    payeeName: p.payeeName,
    amount: p.amount.toString(),
    status: p.status,
    paidDate: p.paidDate ? p.paidDate.toISOString() : null,
    orderId: p.orderId,
  }));
}

export async function loadTasksAlreadyDone(projectId: string, quantityItemIds: string[]): Promise<TaskAlreadyDoneSummary[]> {
  if (quantityItemIds.length === 0) return [];
  const items = await prisma.quantityItem.findMany({
    where: { projectId, id: { in: quantityItemIds } },
    select: { phaseId: true },
  });
  const phaseIds = [...new Set(items.map((i) => i.phaseId).filter((id): id is string => Boolean(id)))];
  if (phaseIds.length === 0) return [];
  const tasks = await prisma.task.findMany({ where: { projectId, phaseId: { in: phaseIds }, status: "DONE" } });
  return tasks.map((t) => ({ id: t.id, title: t.title, phaseId: t.phaseId, endDate: t.endDate ? t.endDate.toISOString() : null }));
}
