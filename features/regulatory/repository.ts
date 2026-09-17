import { prisma } from "@/lib/prisma";
import type { UpdateChecklistItemInput } from "./schema";

export function listChecklistItems(projectId: string) {
  return prisma.regulatoryChecklistItem.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } });
}

export function findChecklistItemById(projectId: string, itemId: string) {
  return prisma.regulatoryChecklistItem.findFirst({ where: { id: itemId, projectId } });
}

export function updateChecklistItem(itemId: string, data: UpdateChecklistItemInput) {
  return prisma.regulatoryChecklistItem.update({ where: { id: itemId }, data });
}

export function createChecklistItemsFromTemplates(
  projectId: string,
  templates: { title: string; description?: string }[],
) {
  return prisma.regulatoryChecklistItem.createMany({
    data: templates.map((t) => ({ projectId, title: t.title, description: t.description })),
  });
}

export function findProjectType(projectId: string) {
  return prisma.project.findUnique({ where: { id: projectId }, select: { type: true } });
}

// תבניות שה-admin (P39) פרסם - שולפים רק PUBLISHED (DEC: תוכן שלא פורסם לא זולג לפרויקטים).
export function listPublishedChecklistTemplates() {
  return prisma.contentTemplate.findMany({ where: { type: "CHECKLIST_ITEM", status: "PUBLISHED" } });
}
