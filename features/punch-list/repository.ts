import { prisma } from "@/lib/prisma";
import type { DefectStatus } from "@prisma/client";
import type { CreateDefectInput } from "./schema";

const WITH_CONTEXT = {
  assignee: { select: { name: true } },
  _count: { select: { photos: true } },
} as const;

export function listDefectsByProject(projectId: string) {
  return prisma.defect.findMany({ where: { projectId }, orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }], include: WITH_CONTEXT });
}

export function findDefectShallow(projectId: string, id: string) {
  return prisma.defect.findFirst({ where: { id, projectId } });
}

export function findDefectWithContext(projectId: string, id: string) {
  return prisma.defect.findFirst({ where: { id, projectId }, include: WITH_CONTEXT });
}

export function createDefect(projectId: string, data: CreateDefectInput) {
  return prisma.defect.create({
    data: {
      projectId,
      title: data.title,
      description: data.description,
      assigneeProfessionalId: data.assigneeProfessionalId,
      dueDate: data.dueDate,
    },
  });
}

export function updateStatus(id: string, status: DefectStatus) {
  return prisma.defect.update({ where: { id }, data: { status } });
}

export function updateStatusWithNotes(id: string, status: DefectStatus, resolutionNotes: string) {
  return prisma.defect.update({ where: { id }, data: { status, resolutionNotes } });
}
