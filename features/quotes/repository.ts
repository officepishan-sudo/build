import { prisma } from "@/lib/prisma";
import type { CreateQuoteInput } from "./schema";

export function listQuotesForProject(projectId: string) {
  return prisma.quote.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
}

export function findQuoteById(id: string, projectId: string) {
  return prisma.quote.findFirst({ where: { id, projectId } });
}

// שמות/כותרות בלבד לצורך ה-select בטופס הוספת הצעה - לא לוגיקת quote-requests,
// ולכן שאילתה ישירה כאן ולא ייבוא מ-features/quote-requests (feature לא מייבא feature).
export function listQuoteRequestOptions(projectId: string) {
  return prisma.quoteRequest.findMany({
    where: { projectId },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
}

export function listEstimateLines(projectId: string) {
  return prisma.quantityItem.findMany({
    where: { projectId },
    select: { totalCost: true, materialCost: true, laborCost: true, transportCost: true },
  });
}

export function createQuote(projectId: string, data: CreateQuoteInput, gapVsEstimate: number | null) {
  return prisma.quote.create({
    data: {
      projectId,
      quoteRequestId: data.quoteRequestId || null,
      professionalId: data.professionalId || null,
      supplierId: data.supplierId || null,
      price: data.price,
      includesNotes: data.includesNotes,
      durationDays: data.durationDays,
      paymentTerms: data.paymentTerms,
      warrantyText: data.warrantyText,
      notes: data.notes,
      gapVsEstimate,
    },
  });
}

export function selectQuote(id: string, projectId: string, decisionTitle: string) {
  return prisma.$transaction([
    prisma.quote.update({ where: { id }, data: { status: "SELECTED" } }),
    prisma.decision.create({
      data: {
        projectId,
        title: decisionTitle,
        sourceType: "quote",
        sourceId: id,
        status: "DECIDED",
        decidedValue: id,
        decidedAt: new Date(),
      },
    }),
  ]);
}

export function rejectQuote(id: string) {
  return prisma.quote.update({ where: { id }, data: { status: "REJECTED" } });
}
