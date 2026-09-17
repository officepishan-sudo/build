import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { isPaymentOverdue, resolveSubjectLabel } from "./calc";
import { createPaymentSchema, markPaidSchema, updatePaymentStatusSchema } from "./schema";
import * as repo from "./repository";

type PaymentRow = Awaited<ReturnType<typeof repo.listPaymentsByProject>>[number];

export type PaymentSummary = {
  id: string;
  payeeName: string;
  subjectLabel: string;
  amount: number;
  dueDate: Date | null;
  paidDate: Date | null;
  status: string;
  documentId: string | null;
  isOverdue: boolean;
};

function toSummary(row: PaymentRow, quotePrice: number | undefined): PaymentSummary {
  const subjectLabel = resolveSubjectLabel([
    row.expense?.description,
    row.order ? `הזמנה מס' ${row.order.number}` : null,
    quotePrice !== undefined ? `הצעת מחיר בסך ${quotePrice}` : null,
  ]);
  return {
    id: row.id,
    payeeName: row.payeeName,
    subjectLabel,
    amount: Number(row.amount),
    dueDate: row.dueDate,
    paidDate: row.paidDate,
    status: row.status,
    documentId: row.documentId,
    isOverdue: isPaymentOverdue(row),
  };
}

export async function listPayments(userId: string, projectId: string): Promise<PaymentSummary[]> {
  await requireProjectAccess(projectId, userId, "VIEW");
  const rows = await repo.listPaymentsByProject(projectId);
  const quoteIds = [...new Set(rows.map((r) => r.quoteId).filter((id): id is string => Boolean(id)))];
  const quotes = await repo.findQuotesByIds(quoteIds);
  const quoteById = new Map(quotes.map((q) => [q.id, Number(q.price)]));
  return rows.map((row) => toSummary(row, row.quoteId ? quoteById.get(row.quoteId) : undefined));
}

export async function createPayment(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = createPaymentSchema.parse(input);
  return repo.createPayment(projectId, data);
}

// "סימון כשולם" - פעולה מפורשת ונפרדת מרישום הוצאה (ספק P25 Edge Case).
export async function markPaymentPaid(userId: string, projectId: string, paymentId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requirePayment(projectId, paymentId);
  const data = markPaidSchema.parse(input);
  return repo.updatePaymentStatus(paymentId, { status: "PAID", paidDate: data.paidDate ?? new Date() });
}

export async function updatePaymentStatus(userId: string, projectId: string, paymentId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requirePayment(projectId, paymentId);
  const data = updatePaymentStatusSchema.parse(input);
  if (data.status === "PAID" && !data.paidDate) {
    throw new ValidationError("סימון כ'שולם' דורש תאריך תשלום");
  }
  return repo.updatePaymentStatus(paymentId, {
    status: data.status,
    paidDate: data.status === "PAID" ? (data.paidDate ?? new Date()) : (data.paidDate ?? null),
  });
}

async function requirePayment(projectId: string, paymentId: string) {
  const payment = await repo.findPaymentShallow(projectId, paymentId);
  if (!payment) throw new NotFoundError("תשלום");
  return payment;
}
