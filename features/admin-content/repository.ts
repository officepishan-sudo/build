import { prisma } from "@/lib/prisma";
import type { ContentTemplateStatus, ContentTemplateType, Prisma } from "@prisma/client";

export function listTemplates(filter: { type?: ContentTemplateType; status?: ContentTemplateStatus }) {
  return prisma.contentTemplate.findMany({
    where: { type: filter.type, status: filter.status },
    orderBy: [{ type: "asc" }, { key: "asc" }],
  });
}

export function findTemplateById(id: string) {
  return prisma.contentTemplate.findUnique({ where: { id } });
}

export function findTemplateByTypeAndKey(type: ContentTemplateType, key: string) {
  return prisma.contentTemplate.findUnique({ where: { type_key: { type, key } } });
}

export function createTemplate(data: {
  type: ContentTemplateType;
  key: string;
  payload: Prisma.InputJsonValue;
  status: ContentTemplateStatus;
}) {
  return prisma.contentTemplate.create({ data });
}

export function updateTemplate(
  id: string,
  data: { key: string; payload: Prisma.InputJsonValue; status: ContentTemplateStatus },
) {
  return prisma.contentTemplate.update({ where: { id }, data });
}

export function setTemplateStatus(id: string, status: ContentTemplateStatus) {
  return prisma.contentTemplate.update({ where: { id }, data: { status } });
}

export function deleteTemplate(id: string) {
  return prisma.contentTemplate.delete({ where: { id } });
}
