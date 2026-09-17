import { prisma } from "@/lib/prisma";
import type { PhaseInput, TaskInput } from "./schema";

export function listPhasesWithTasks(projectId: string) {
  return prisma.phase.findMany({
    where: { projectId },
    include: { tasks: { orderBy: { createdAt: "asc" } } },
    orderBy: { order: "asc" },
  });
}

export function listProfessionalsForAssignment() {
  return prisma.professional.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" }, take: 200 });
}

export function findPhaseById(id: string) {
  return prisma.phase.findUnique({ where: { id } });
}

export function findTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function nextPhaseOrder(projectId: string): Promise<number> {
  const last = await prisma.phase.findFirst({ where: { projectId }, orderBy: { order: "desc" }, select: { order: true } });
  return (last?.order ?? -1) + 1;
}

export function createPhase(projectId: string, data: PhaseInput, order: number) {
  return prisma.phase.create({
    data: {
      projectId,
      name: data.name,
      order,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      status: data.status,
      dependsOnPhaseId: data.dependsOnPhaseId || null,
    },
  });
}

export function updatePhase(id: string, data: PhaseInput) {
  return prisma.phase.update({
    where: { id },
    data: {
      name: data.name,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      status: data.status,
      dependsOnPhaseId: data.dependsOnPhaseId || null,
    },
  });
}

export function deletePhase(id: string) {
  return prisma.phase.delete({ where: { id } });
}

export function updatePhaseOrders(updates: { id: string; order: number }[]) {
  return prisma.$transaction(updates.map((u) => prisma.phase.update({ where: { id: u.id }, data: { order: u.order } })));
}

export function createTask(projectId: string, phaseId: string, data: TaskInput) {
  return prisma.task.create({
    data: {
      projectId,
      phaseId,
      title: data.title,
      assigneeProfessionalId: data.assigneeProfessionalId || null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      status: data.status,
      notes: data.notes || null,
    },
  });
}

export function updateTask(id: string, data: TaskInput) {
  return prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      assigneeProfessionalId: data.assigneeProfessionalId || null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      status: data.status,
      notes: data.notes || null,
    },
  });
}

export function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}
