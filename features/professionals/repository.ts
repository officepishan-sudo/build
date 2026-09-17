import { prisma } from "@/lib/prisma";
import type { CreateProfessionalInput } from "./schema";

export function listProfessionals(filter: { field?: string; area?: string }) {
  return prisma.professional.findMany({
    where: {
      fields: filter.field ? { has: filter.field } : undefined,
      area: filter.area ? { contains: filter.area, mode: "insensitive" } : undefined,
    },
    orderBy: { name: "asc" },
  });
}

export function findProfessionalById(id: string) {
  return prisma.professional.findUnique({
    where: { id },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
      _count: { select: { quotes: true, tasks: true } },
    },
  });
}

export function createProfessional(data: CreateProfessionalInput) {
  return prisma.professional.create({ data });
}
