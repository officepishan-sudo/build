import { prisma } from "@/lib/prisma";
import type { IssueStatus } from "@prisma/client";
import type { CreateIssueInput } from "./schema";

const WITH_CONTEXT = {
  phase: { select: { name: true } },
  assignee: { select: { name: true } },
  _count: { select: { photos: true } },
} as const;

export function listIssuesByProject(projectId: string) {
  return prisma.issue.findMany({ where: { projectId }, orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }], include: WITH_CONTEXT });
}

export function findIssueShallow(projectId: string, id: string) {
  return prisma.issue.findFirst({ where: { id, projectId } });
}

export function findIssueWithContext(projectId: string, id: string) {
  return prisma.issue.findFirst({ where: { id, projectId }, include: WITH_CONTEXT });
}

export function createIssue(projectId: string, data: CreateIssueInput) {
  return prisma.issue.create({
    data: {
      projectId,
      title: data.title,
      description: data.description,
      type: data.type,
      phaseId: data.phaseId,
      assigneeProfessionalId: data.assigneeProfessionalId,
      dueDate: data.dueDate,
    },
  });
}

export function updateStatus(id: string, status: IssueStatus) {
  return prisma.issue.update({ where: { id }, data: { status } });
}

export function resolveWithNote(id: string, status: IssueStatus, impact: string) {
  return prisma.issue.update({ where: { id }, data: { status, impact } });
}
