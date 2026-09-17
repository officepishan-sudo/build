import { prisma } from "@/lib/prisma";
import type { ChangeStatus } from "@prisma/client";
import type { BudgetSummaryData, ProjectHeaderData, ActivityItem } from "./dashboard-types";

// שכבת נתונים ייעודית לדף הדשבורד (P11) בלבד - אגרגציה חוצת-תחומים לקריאה בלבד.
// שם הקובץ מסתיים ב-".repository.ts" בכוונה: תואם ל-DATA_LAYER של scripts/structure-gate.sh
// ולכלל "prisma-only-in-repository" ב-.dependency-cruiser.cjs, כמו כל repository.ts אחר בקוד.
// אין ולוגיקת הרשאות כאן - זו נעשית לפני הקריאה (ב-dashboard-data.ts) עם requireProjectAccess.

export function getProjectHeader(projectId: string): Promise<ProjectHeaderData | null> {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, type: true, status: true, pausedReason: true, createdAt: true, updatedAt: true },
  });
}

export async function getBudgetSummary(projectId: string): Promise<BudgetSummaryData> {
  const lines = await prisma.budgetLine.findMany({
    where: { projectId },
    select: { plannedAmount: true, committedAmount: true, actualAmount: true, paidAmount: true },
  });
  return lines.reduce(
    (sum, line) => ({
      plannedTotal: sum.plannedTotal + Number(line.plannedAmount),
      committedTotal: sum.committedTotal + Number(line.committedAmount),
      actualTotal: sum.actualTotal + Number(line.actualAmount),
      paidTotal: sum.paidTotal + Number(line.paidAmount),
      lineCount: sum.lineCount + 1,
    }),
    { plannedTotal: 0, committedTotal: 0, actualTotal: 0, paidTotal: 0, lineCount: 0 },
  );
}

export function getUpcomingPhases(projectId: string, take = 5) {
  return prisma.phase.findMany({
    where: { projectId, status: { not: "DONE" } },
    orderBy: [{ startDate: { sort: "asc", nulls: "last" } }, { order: "asc" }],
    take,
  });
}

export function getUpcomingDeliveries(projectId: string, take = 5) {
  return prisma.delivery.findMany({
    where: { projectId, status: { notIn: ["RECEIVED", "CANCELLED"] } },
    orderBy: [{ expectedDate: { sort: "asc", nulls: "last" } }],
    take,
  });
}

export async function getOpenChangeRequests(projectId: string, take = 5) {
  const where = { projectId, status: { notIn: ["DONE", "CANCELLED", "REJECTED"] as ChangeStatus[] } };
  const [count, items] = await Promise.all([
    prisma.changeRequest.count({ where }),
    prisma.changeRequest.findMany({ where, orderBy: { updatedAt: "desc" }, take }),
  ]);
  return { count, items };
}

export async function getOpenIssues(projectId: string, take = 5) {
  const where = { projectId, status: { not: "CLOSED" as const } };
  const [count, items] = await Promise.all([
    prisma.issue.count({ where }),
    prisma.issue.findMany({ where, orderBy: { updatedAt: "desc" }, take }),
  ]);
  return { count, items };
}

export async function getRecentActivity(projectId: string, take = 5): Promise<ActivityItem[]> {
  const [documents, photos, messages] = await Promise.all([
    prisma.document.findMany({ where: { projectId }, orderBy: { uploadedAt: "desc" }, take }),
    prisma.photo.findMany({ where: { projectId }, orderBy: { createdAt: "desc" }, take }),
    prisma.message.findMany({ where: { projectId }, orderBy: { createdAt: "desc" }, take }),
  ]);
  const items: ActivityItem[] = [
    ...documents.map((d) => ({ id: d.id, kind: "document" as const, label: `מסמך: ${d.name}`, at: d.uploadedAt })),
    ...photos.map((p) => ({ id: p.id, kind: "photo" as const, label: p.caption ?? "תמונה חדשה", at: p.createdAt })),
    ...messages.map((m) => ({ id: m.id, kind: "message" as const, label: m.body.slice(0, 60), at: m.createdAt })),
  ];
  return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, take);
}
