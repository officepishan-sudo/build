import { prisma } from "@/lib/prisma";
import type { ShareLevel } from "@prisma/client";

export function findProjectWithOwner(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true, owner: { select: { id: true, name: true, email: true } } },
  });
}

export function listSharesByProject(projectId: string) {
  return prisma.projectShare.findMany({
    where: { projectId },
    orderBy: { invitedAt: "asc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export function findShareById(projectId: string, shareId: string) {
  return prisma.projectShare.findFirst({ where: { id: shareId, projectId } });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true } });
}

export function findExistingShare(projectId: string, userId: string) {
  return prisma.projectShare.findUnique({ where: { projectId_userId: { projectId, userId } } });
}

export function createShare(projectId: string, userId: string, level: ShareLevel, domain?: string) {
  return prisma.projectShare.create({
    data: { projectId, userId, level, domain: domain || null },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export function updateShareLevel(shareId: string, level: ShareLevel, domain?: string) {
  return prisma.projectShare.update({
    where: { id: shareId },
    data: { level, domain: domain || null },
  });
}

export function deleteShare(shareId: string) {
  return prisma.projectShare.delete({ where: { id: shareId } });
}
