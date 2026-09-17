import { prisma } from "@/lib/prisma";
import type { QuoteRequestStatus } from "@prisma/client";

type RecipientInput = { professionalId?: string; supplierId?: string };

export function listQuoteRequestsForProject(projectId: string) {
  return prisma.quoteRequest.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { recipients: true, quotes: true } } },
  });
}

export function findQuoteRequestById(id: string, projectId: string) {
  return prisma.quoteRequest.findFirst({
    where: { id, projectId },
    include: { recipients: true, _count: { select: { quotes: true } } },
  });
}

export function createQuoteRequest(
  projectId: string,
  data: { title: string; scopeText: string; deadline?: Date },
  status: QuoteRequestStatus,
  recipients: RecipientInput[],
) {
  return prisma.quoteRequest.create({
    data: {
      projectId,
      title: data.title,
      scopeText: data.scopeText,
      deadline: data.deadline,
      status,
      sentAt: status === "SENT" ? new Date() : null,
      recipients: { create: recipients },
    },
  });
}

export function sendQuoteRequest(id: string) {
  return prisma.quoteRequest.update({ where: { id }, data: { status: "SENT", sentAt: new Date() } });
}

export function cancelQuoteRequest(id: string) {
  return prisma.quoteRequest.update({ where: { id }, data: { status: "CANCELLED" } });
}
