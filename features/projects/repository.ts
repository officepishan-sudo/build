import { prisma } from "@/lib/prisma";
import type { CreateProjectInput } from "./schema";

export function listProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: { OR: [{ ownerId: userId }, { shares: { some: { userId } } }] },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { decisions: { where: { status: "OPEN" } } } },
      budgetLines: true,
    },
  });
}

export function findProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export function createProject(ownerId: string, data: CreateProjectInput) {
  return prisma.project.create({
    data: {
      ownerId,
      name: data.name,
      type: data.type,
      track: data.track,
      scopeDescription: data.scopeDescription,
      startDateKnown: data.startDateKnown,
      startDate: data.startDate,
      isExistingProject: data.isExistingProject,
      status: data.isExistingProject ? "IN_PROGRESS" : "NEW",
    },
  });
}

export function pauseProject(id: string, reason?: string) {
  return prisma.project.update({
    where: { id },
    data: { status: "PAUSED", pausedReason: reason },
  });
}

export function resumeProject(id: string) {
  return prisma.project.update({
    where: { id },
    data: { status: "IN_PROGRESS", pausedReason: null },
  });
}

export function getProjectExistingStateSummary(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      _count: {
        select: {
          requirements: true,
          quantityItems: true,
          quotes: true,
          orders: true,
          documents: true,
          phases: true,
        },
      },
    },
  });
}
