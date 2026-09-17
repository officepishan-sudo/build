import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus, QuoteStatus } from "@prisma/client";

// חישוב השפעת שינוי (סעיף 8.1) - לוגיקה חוצת-פיצ'רים, קריאה בלבד.
// חי ב-lib כי כמה מסכים/פיצ'רים עתידיים (חלופות, בקשות שינוי) צריכים אותו,
// ו-lib מותר לו לגעת ב-Prisma ישירות לקריאה בלבד (לא CRUD של פיצ'ר).

export type ChangeImpactInput = {
  projectId: string;
  changeDescription: string;
  affectedRequirementIds?: string[];
  affectedQuoteIds?: string[];
  affectedOrderIds?: string[];
  affectedQuantityItemIds?: string[];
};

export type AffectedRequirementSummary = {
  id: string;
  label: string;
  value: string | null;
  status: string;
};

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

export type TaskAlreadyDoneSummary = {
  id: string;
  title: string;
  phaseId: string | null;
  endDate: string | null;
};

export type ChangeImpactResult = {
  projectId: string;
  changeDescription: string;
  affectedRequirements: AffectedRequirementSummary[];
  affectedQuantityItems: AffectedQuantityItemSummary[];
  quotesNoLongerValid: QuoteNoLongerValidSummary[];
  ordersWithCommitments: OrderCommitmentSummary[];
  paymentsAlreadyMade: PaymentAlreadyMadeSummary[];
  tasksAlreadyDone: TaskAlreadyDoneSummary[];
  needsReviewCount: number;
  // יש עובדה בשטח שכבר קרתה (הזמנה שסופקה/בביצוע, תשלום, משימה שהושלמה) -
  // לא ניתן "לבטל" אותה, רק לתעד ולתאם.
  hasIrreversibleFacts: boolean;
};

const OPEN_QUOTE_STATUSES: QuoteStatus[] = ["RECEIVED", "REVIEW", "SELECTED"];
const COMMITTED_ORDER_STATUSES = new Set<OrderStatus>(["DELIVERED", "PARTIALLY_DELIVERED", "IN_PROGRESS"]);
const PAID_STATUSES: PaymentStatus[] = ["PAID", "PARTIAL"];

async function loadAffectedRequirements(projectId: string, ids: string[]): Promise<AffectedRequirementSummary[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.requirement.findMany({ where: { projectId, id: { in: ids } } });
  return rows.map((r) => ({ id: r.id, label: r.label, value: r.value, status: r.status }));
}

async function loadAffectedQuantityItems(projectId: string, ids: string[]): Promise<AffectedQuantityItemSummary[]> {
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

async function loadQuotesNoLongerValid(projectId: string, ids: string[]): Promise<QuoteNoLongerValidSummary[]> {
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

async function loadOrdersWithCommitments(projectId: string, ids: string[]): Promise<OrderCommitmentSummary[]> {
  if (ids.length === 0) return [];
  const orders = await prisma.order.findMany({ where: { projectId, id: { in: ids } } });
  return orders.map((o) => {
    const alreadyHappened = COMMITTED_ORDER_STATUSES.has(o.status);
    const clarificationNeeded = alreadyHappened
      ? "ההזמנה כבר בביצוע או סופקה בחלקה - לא ניתן לבטל בשקט, יש לתאם מול הספק/בעל המקצוע"
      : o.status === "CANCELLED"
        ? null
        : "ההזמנה טרם סופקה בפועל - אפשר לבחון שינוי או ביטול מול הצד השני";
    return {
      id: o.id,
      number: o.number,
      status: o.status,
      totalAmount: o.totalAmount.toString(),
      alreadyHappened,
      clarificationNeeded,
    };
  });
}

async function loadPaymentsAlreadyMade(
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

async function loadTasksAlreadyDone(projectId: string, quantityItemIds: string[]): Promise<TaskAlreadyDoneSummary[]> {
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

function computeNeedsReviewCount(
  requirements: AffectedRequirementSummary[],
  quotes: QuoteNoLongerValidSummary[],
  orders: OrderCommitmentSummary[],
): number {
  const needsCheckRequirements = requirements.filter((r) => r.status === "NEEDS_CHECK").length;
  const ordersNeedingDecision = orders.filter((o) => !o.alreadyHappened).length;
  return quotes.length + ordersNeedingDecision + needsCheckRequirements;
}

/**
 * מציג "מה זה נוגע בו" לפי מה שכבר קיים בפרויקט (הצעות/הזמנות/תשלומים/ביצוע) -
 * לפני הצעות, אחרי הצעות, אחרי הזמנה, אחרי תשלום, אחרי ביצוע (סעיף 8.1).
 * קריאה בלבד - אף כתיבה לא קורית כאן; האישור בפועל הוא ב-features/change-impact.
 */
export async function computeChangeImpact(input: ChangeImpactInput): Promise<ChangeImpactResult> {
  const affectedRequirementIds = input.affectedRequirementIds ?? [];
  const affectedQuoteIds = input.affectedQuoteIds ?? [];
  const affectedOrderIds = input.affectedOrderIds ?? [];
  const affectedQuantityItemIds = input.affectedQuantityItemIds ?? [];

  const [affectedRequirements, affectedQuantityItems, quotesNoLongerValid, ordersWithCommitments, tasksAlreadyDone] =
    await Promise.all([
      loadAffectedRequirements(input.projectId, affectedRequirementIds),
      loadAffectedQuantityItems(input.projectId, affectedQuantityItemIds),
      loadQuotesNoLongerValid(input.projectId, affectedQuoteIds),
      loadOrdersWithCommitments(input.projectId, affectedOrderIds),
      loadTasksAlreadyDone(input.projectId, affectedQuantityItemIds),
    ]);

  const paymentsAlreadyMade = await loadPaymentsAlreadyMade(input.projectId, affectedOrderIds, affectedQuoteIds);

  const hasIrreversibleFacts =
    ordersWithCommitments.some((o) => o.alreadyHappened) || paymentsAlreadyMade.length > 0 || tasksAlreadyDone.length > 0;

  return {
    projectId: input.projectId,
    changeDescription: input.changeDescription,
    affectedRequirements,
    affectedQuantityItems,
    quotesNoLongerValid,
    ordersWithCommitments,
    paymentsAlreadyMade,
    tasksAlreadyDone,
    needsReviewCount: computeNeedsReviewCount(affectedRequirements, quotesNoLongerValid, ordersWithCommitments),
    hasIrreversibleFacts,
  };
}
