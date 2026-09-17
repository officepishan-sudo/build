import { prisma } from "@/lib/prisma";

// שאילתות גישה משותפות ל-RBAC - לא פיצ'ר בודד, ולכן חי ב-lib/db ולא ב-repository של פיצ'ר.

export function findProjectOwnership(projectId: string) {
  return prisma.project.findUnique({ where: { id: projectId }, select: { id: true, ownerId: true } });
}

export function findProjectShare(projectId: string, userId: string) {
  return prisma.projectShare.findUnique({ where: { projectId_userId: { projectId, userId } } });
}

export function findOwnedAndSharedProjectIds(userId: string) {
  return Promise.all([
    prisma.project.findMany({ where: { ownerId: userId }, select: { id: true } }),
    prisma.projectShare.findMany({ where: { userId }, select: { projectId: true } }),
  ]);
}
