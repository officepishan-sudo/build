import { prisma } from "@/lib/prisma";
import type { CreateAlternativeInput } from "./schema";

export function listAlternativesForProject(projectId: string) {
  return prisma.alternative.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } });
}

export function findAlternativeById(id: string) {
  return prisma.alternative.findUnique({ where: { id } });
}

export function createAlternative(projectId: string, data: CreateAlternativeInput, requirementsSnapshot: unknown) {
  return prisma.alternative.create({
    data: {
      projectId,
      title: data.title,
      description: data.description,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      durationDays: data.durationDays,
      pros: data.prosText,
      cons: data.consText,
      maintenanceNotes: data.maintenanceNotes,
      materialsNotes: data.materialsNotes,
      imageUrl: data.imageUrl,
      reasonShown: data.reasonShown,
      requirementsSnapshot: requirementsSnapshot as never,
    },
  });
}

export function listRequirementsForProject(projectId: string) {
  return prisma.requirement.findMany({ where: { projectId } });
}

export function listQuoteAndOrderIdsForProject(projectId: string) {
  return Promise.all([
    prisma.quote.findMany({ where: { projectId }, select: { id: true } }),
    prisma.order.findMany({ where: { projectId }, select: { id: true } }),
  ]);
}

/**
 * מסמן חלופה אחת כנבחרת ומבטל בחירה קודמת (אם הייתה) - בטרנזקציה אחת, כדי שלא
 * יהיה רגע עם שתי חלופות "נבחרות" בו-זמנית. יוצר גם Decision לצורך היסטוריה.
 */
export async function selectAlternative(projectId: string, alternativeId: string, title: string) {
  return prisma.$transaction(async (tx) => {
    await tx.alternative.updateMany({ where: { projectId, isSelected: true }, data: { isSelected: false } });
    const updated = await tx.alternative.update({ where: { id: alternativeId }, data: { isSelected: true } });
    await tx.decision.create({
      data: {
        projectId,
        title: `נבחרה חלופה: ${title}`,
        status: "DECIDED",
        decidedValue: alternativeId,
        decidedAt: new Date(),
        sourceType: "alternative",
        sourceId: alternativeId,
      },
    });
    return updated;
  });
}

export function applyPlayChanges(
  alternativeId: string,
  data: { priceMin: number; priceMax: number; durationDays?: number; maintenanceNotes?: string },
) {
  return prisma.alternative.update({
    where: { id: alternativeId },
    data: {
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      durationDays: data.durationDays,
      maintenanceNotes: data.maintenanceNotes,
    },
  });
}

export function recordVersionSnapshot(
  projectId: string,
  createdByUserId: string,
  entityType: string,
  entityId: string,
  dataBefore: unknown,
  dataAfter: unknown,
  reason: string,
) {
  return prisma.versionSnapshot.create({
    data: {
      projectId,
      entityType,
      entityId,
      dataBefore: dataBefore as never,
      dataAfter: dataAfter as never,
      reason,
      createdByUserId,
    },
  });
}
