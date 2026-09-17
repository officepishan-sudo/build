import { prisma } from "@/lib/prisma";
import type { QuantityItemInput } from "./schema";

type ListFilters = { category?: string; phaseId?: string };

export function listQuantityItems(projectId: string, filters: ListFilters) {
  return prisma.quantityItem.findMany({
    where: {
      projectId,
      category: filters.category || undefined,
      phaseId: filters.phaseId || undefined,
    },
    include: { phase: { select: { id: true, name: true } } },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
  });
}

export function listDistinctCategories(projectId: string) {
  return prisma.quantityItem.findMany({
    where: { projectId },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
}

export function listPhasesForProject(projectId: string) {
  return prisma.phase.findMany({
    where: { projectId },
    select: { id: true, name: true },
    orderBy: { order: "asc" },
  });
}

export function findQuantityItemById(id: string) {
  return prisma.quantityItem.findUnique({ where: { id } });
}

export function createQuantityItem(projectId: string, data: QuantityItemInput, totalCost: number | null) {
  return prisma.quantityItem.create({
    data: {
      projectId,
      phaseId: data.phaseId || null,
      category: data.category,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      materialCost: data.materialCost ?? null,
      laborCost: data.laborCost ?? null,
      transportCost: data.transportCost ?? null,
      totalCost,
      source: data.source || null,
      needsCheck: data.needsCheck,
    },
  });
}

export function updateQuantityItem(id: string, data: QuantityItemInput, totalCost: number | null) {
  return prisma.quantityItem.update({
    where: { id },
    data: {
      phaseId: data.phaseId || null,
      category: data.category,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      materialCost: data.materialCost ?? null,
      laborCost: data.laborCost ?? null,
      transportCost: data.transportCost ?? null,
      totalCost,
      source: data.source || null,
      needsCheck: data.needsCheck,
    },
  });
}

export function deleteQuantityItem(id: string) {
  return prisma.quantityItem.delete({ where: { id } });
}
