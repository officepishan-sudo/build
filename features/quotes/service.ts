import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { listProfessionalsByIds, listSuppliersByIds } from "@/lib/db/directory-lookups";
import { createQuoteSchema } from "./schema";
import { calculateGapVsEstimate, sumEstimateLines } from "./gap-calculation";
import * as repo from "./repository";
import type { Quote } from "@prisma/client";

export async function listQuotes(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const quotes = await repo.listQuotesForProject(projectId);
  return attachRecipientNames(quotes);
}

export async function getQuote(userId: string, projectId: string, quoteId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const quote = await repo.findQuoteById(quoteId, projectId);
  if (!quote) throw new NotFoundError("הצעת מחיר");
  const withNames = await attachRecipientNames([quote]);
  const withName = withNames[0];
  if (!withName) throw new NotFoundError("הצעת מחיר");
  return withName;
}

export async function createQuote(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = createQuoteSchema.parse(input);
  const lines = await repo.listEstimateLines(projectId);
  const estimateTotal = sumEstimateLines(
    lines.map((l) => ({
      totalCost: l.totalCost ? Number(l.totalCost) : null,
      materialCost: l.materialCost ? Number(l.materialCost) : null,
      laborCost: l.laborCost ? Number(l.laborCost) : null,
      transportCost: l.transportCost ? Number(l.transportCost) : null,
    })),
  );
  const gap = calculateGapVsEstimate(data.price, estimateTotal);
  return repo.createQuote(projectId, data, gap);
}

export async function selectQuote(userId: string, projectId: string, quoteId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const quote = await repo.findQuoteById(quoteId, projectId);
  if (!quote) throw new NotFoundError("הצעת מחיר");
  await repo.selectQuote(quoteId, projectId, `בחירת הצעת מחיר על סך ${quote.price.toString()} ₪`);
}

export async function rejectQuote(userId: string, projectId: string, quoteId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const quote = await repo.findQuoteById(quoteId, projectId);
  if (!quote) throw new NotFoundError("הצעת מחיר");
  await repo.rejectQuote(quoteId);
}

async function attachRecipientNames(quotes: Quote[]) {
  const professionalIds = [...new Set(quotes.map((q) => q.professionalId).filter((v): v is string => Boolean(v)))];
  const supplierIds = [...new Set(quotes.map((q) => q.supplierId).filter((v): v is string => Boolean(v)))];
  const [professionals, suppliers] = await Promise.all([
    listProfessionalsByIds(professionalIds),
    listSuppliersByIds(supplierIds),
  ]);
  const profMap = new Map(professionals.map((p) => [p.id, p.name]));
  const supMap = new Map(suppliers.map((s) => [s.id, s.name]));
  return quotes.map((q) => ({
    ...q,
    recipientName: q.professionalId
      ? profMap.get(q.professionalId) ?? "לא ידוע"
      : q.supplierId
        ? supMap.get(q.supplierId) ?? "לא ידוע"
        : "לא צויין",
  }));
}
