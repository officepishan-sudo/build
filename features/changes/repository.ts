import { prisma } from "@/lib/prisma";
import type { ChangeStatus } from "@prisma/client";
import type { CreateChangeRequestInput, UpdateChangeRequestInput } from "./schema";

export function listChangeRequestsByProject(projectId: string) {
  return prisma.changeRequest.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
}

export function findChangeRequestById(projectId: string, id: string) {
  return prisma.changeRequest.findFirst({ where: { id, projectId } });
}

export function createChangeRequest(projectId: string, data: CreateChangeRequestInput) {
  return prisma.changeRequest.create({
    data: {
      projectId,
      title: data.title,
      reason: data.reason,
      priceImpact: data.priceImpact,
      scheduleImpactDays: data.scheduleImpactDays,
    },
  });
}

export function updateChangeRequestDetails(id: string, data: UpdateChangeRequestInput) {
  return prisma.changeRequest.update({
    where: { id },
    data: {
      title: data.title,
      reason: data.reason,
      priceImpact: data.priceImpact,
      scheduleImpactDays: data.scheduleImpactDays,
    },
  });
}

export function updateStatus(id: string, status: ChangeStatus, decidedAt: Date | null) {
  return prisma.changeRequest.update({ where: { id }, data: { status, decidedAt } });
}

/** רק DRAFT מגיע לכאן (הכלל נאכף ב-service) - "לא מוחקים עבר". */
export function deleteDraft(id: string) {
  return prisma.changeRequest.delete({ where: { id } });
}
